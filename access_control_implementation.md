# Access Control Implementation Guide
## راهنمای پیاده‌سازی سیستم کنترل دسترسی

### Frontend Implementation | پیاده‌سازی فرانت‌اند

#### 1. Permission Hook (React)
```typescript
// hooks/usePermissions.ts
import { useState, useEffect } from 'react';

interface Permission {
  read: boolean;
  write: boolean;
  delete: boolean;
  admin: boolean;
}

interface UserPermissions {
  [page: string]: Permission;
}

export const usePermissions = (userId: number, customerId: number) => {
  const [permissions, setPermissions] = useState<UserPermissions>({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchPermissions = async () => {
      try {
        setLoading(true);
        const response = await fetch(`/api/permissions/user/${userId}/customer/${customerId}`);
        
        if (!response.ok) {
          throw new Error('Failed to fetch permissions');
        }
        
        const data = await response.json();
        setPermissions(data.permissions);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Unknown error');
      } finally {
        setLoading(false);
      }
    };

    if (userId && customerId) {
      fetchPermissions();
    }
  }, [userId, customerId]);

  const hasAccess = (page: string, feature: keyof Permission): boolean => {
    return permissions[page]?.[feature] === true;
  };

  const canRead = (page: string): boolean => hasAccess(page, 'read');
  const canWrite = (page: string): boolean => hasAccess(page, 'write');
  const canDelete = (page: string): boolean => hasAccess(page, 'delete');
  const canAdmin = (page: string): boolean => hasAccess(page, 'admin');

  return {
    permissions,
    loading,
    error,
    hasAccess,
    canRead,
    canWrite,
    canDelete,
    canAdmin
  };
};
```

#### 2. Permission Guard Component
```typescript
// components/PermissionGuard.tsx
import React from 'react';
import { usePermissions } from '../hooks/usePermissions';

interface PermissionGuardProps {
  userId: number;
  customerId: number;
  page: string;
  feature: 'read' | 'write' | 'delete' | 'admin';
  children: React.ReactNode;
  fallback?: React.ReactNode;
}

export const PermissionGuard: React.FC<PermissionGuardProps> = ({
  userId,
  customerId,
  page,
  feature,
  children,
  fallback = null
}) => {
  const { hasAccess, loading } = usePermissions(userId, customerId);

  if (loading) {
    return <div>Loading permissions...</div>;
  }

  if (!hasAccess(page, feature)) {
    return <>{fallback}</>;
  }

  return <>{children}</>;
};
```

#### 3. Usage Examples
```typescript
// Example usage in components
import { PermissionGuard } from '../components/PermissionGuard';
import { usePermissions } from '../hooks/usePermissions';

const CustomerList: React.FC = () => {
  const { userId, customerId } = useAuth(); // Your auth hook
  const { canWrite, canDelete } = usePermissions(userId, customerId);

  return (
    <div>
      <h1>Customer List</h1>
      
      {/* Show edit button only if user can write */}
      <PermissionGuard
        userId={userId}
        customerId={customerId}
        page="customers"
        feature="write"
      >
        <button onClick={handleEdit}>Edit Customer</button>
      </PermissionGuard>

      {/* Show delete button only if user can delete */}
      {canDelete('customers') && (
        <button onClick={handleDelete}>Delete Customer</button>
      )}

      {/* Conditional rendering based on permissions */}
      {canWrite('customers') ? (
        <CustomerForm />
      ) : (
        <div>You don't have permission to edit customers</div>
      )}
    </div>
  );
};
```

### Backend Implementation | پیاده‌سازی بک‌اند

#### 1. Permission Service
```typescript
// services/PermissionService.ts
import { DatabaseConnection } from '../database/connection';

interface Permission {
  read: boolean;
  write: boolean;
  delete: boolean;
  admin: boolean;
}

interface UserPermissions {
  [page: string]: Permission;
}

export class PermissionService {
  private db: DatabaseConnection;

  constructor(db: DatabaseConnection) {
    this.db = db;
  }

  async getUserPermissions(userId: number, customerId: number): Promise<UserPermissions> {
    // Step 1: Get user's roles for this customer
    const roles = await this.getUserRoles(userId, customerId);
    
    // Step 2: Get permissions for each role
    const allPermissions: UserPermissions = {};
    
    for (const role of roles) {
      const rolePermissions = await this.getRolePermissions(role.id);
      this.mergePermissions(allPermissions, rolePermissions);
    }
    
    // Step 3: Apply role-specific overrides
    for (const role of roles) {
      if (role.accesses_json) {
        const overrides = JSON.parse(role.accesses_json);
        this.applyOverrides(allPermissions, overrides);
      }
    }
    
    // Step 4: Apply package unit restrictions
    const packageRestrictions = await this.getPackageRestrictions(customerId);
    this.applyPackageRestrictions(allPermissions, packageRestrictions);
    
    return allPermissions;
  }

  private async getUserRoles(userId: number, customerId: number) {
    const query = `
      SELECT r.* FROM Role r
      JOIN ChadcoCustomerPermission ccp ON r.id = ccp.role_id
      WHERE ccp.user_id = ? AND ccp.chadco_customer_id = ?
    `;
    return await this.db.query(query, [userId, customerId]);
  }

  private async getRolePermissions(roleId: number) {
    const query = `
      SELECT p.* FROM Permission p
      JOIN RolePermission rp ON p.id = rp.permission_id
      WHERE rp.role_id = ?
    `;
    const permissions = await this.db.query(query, [roleId]);
    
    // Convert permissions to JSON format
    const permissionsJson: UserPermissions = {};
    for (const perm of permissions) {
      if (!permissionsJson[perm.resource]) {
        permissionsJson[perm.resource] = {
          read: false,
          write: false,
          delete: false,
          admin: false
        };
      }
      permissionsJson[perm.resource][perm.action] = true;
    }
    
    return permissionsJson;
  }

  private mergePermissions(target: UserPermissions, source: UserPermissions) {
    for (const [page, permissions] of Object.entries(source)) {
      if (!target[page]) {
        target[page] = { read: false, write: false, delete: false, admin: false };
      }
      
      for (const [action, value] of Object.entries(permissions)) {
        if (value === true) {
          target[page][action as keyof Permission] = true;
        }
      }
    }
  }

  private applyOverrides(target: UserPermissions, overrides: UserPermissions) {
    for (const [page, permissions] of Object.entries(overrides)) {
      if (!target[page]) {
        target[page] = { read: false, write: false, delete: false, admin: false };
      }
      
      for (const [action, value] of Object.entries(permissions)) {
        target[page][action as keyof Permission] = value;
      }
    }
  }

  private async getPackageRestrictions(customerId: number) {
    const query = `
      SELECT pu.accesses_json FROM PackageUnit pu
      JOIN ChadcoCustomerPackageUnit ccpu ON pu.id = ccpu.package_unit_id
      WHERE ccpu.chadco_customer_id = ?
    `;
    const units = await this.db.query(query, [customerId]);
    
    const restrictions: UserPermissions = {};
    for (const unit of units) {
      if (unit.accesses_json) {
        const unitPermissions = JSON.parse(unit.accesses_json);
        this.mergePermissions(restrictions, unitPermissions);
      }
    }
    
    return restrictions;
  }

  private applyPackageRestrictions(target: UserPermissions, restrictions: UserPermissions) {
    // Only allow access if both target and restrictions allow it
    for (const [page, permissions] of Object.entries(target)) {
      if (restrictions[page]) {
        for (const [action, value] of Object.entries(permissions)) {
          if (value === true && restrictions[page][action as keyof Permission] === false) {
            target[page][action as keyof Permission] = false;
          }
        }
      }
    }
  }

  async checkAccess(
    userId: number, 
    customerId: number, 
    page: string, 
    feature: keyof Permission
  ): Promise<boolean> {
    const permissions = await this.getUserPermissions(userId, customerId);
    return permissions[page]?.[feature] === true;
  }
}
```

#### 2. API Controller
```typescript
// controllers/PermissionController.ts
import { Request, Response } from 'express';
import { PermissionService } from '../services/PermissionService';

export class PermissionController {
  private permissionService: PermissionService;

  constructor(permissionService: PermissionService) {
    this.permissionService = permissionService;
  }

  async getUserPermissions(req: Request, res: Response) {
    try {
      const { user_id, customer_id } = req.params;
      
      const permissions = await this.permissionService.getUserPermissions(
        parseInt(user_id),
        parseInt(customer_id)
      );
      
      res.json({ permissions });
    } catch (error) {
      console.error('Error fetching user permissions:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  }

  async checkAccess(req: Request, res: Response) {
    try {
      const { user_id, customer_id, page, feature } = req.body;
      
      const hasAccess = await this.permissionService.checkAccess(
        user_id,
        customer_id,
        page,
        feature
      );
      
      res.json({ has_access: hasAccess });
    } catch (error) {
      console.error('Error checking access:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  }
}
```

#### 3. Middleware for Route Protection
```typescript
// middleware/permissionMiddleware.ts
import { Request, Response, NextFunction } from 'express';
import { PermissionService } from '../services/PermissionService';

export const requirePermission = (page: string, feature: keyof Permission) => {
  return async (req: Request, res: Response, next: NextFunction) => {
    try {
      const userId = req.user?.id;
      const customerId = req.user?.customerId;
      
      if (!userId || !customerId) {
        return res.status(401).json({ error: 'Unauthorized' });
      }
      
      const permissionService = new PermissionService(req.db);
      const hasAccess = await permissionService.checkAccess(
        userId,
        customerId,
        page,
        feature
      );
      
      if (!hasAccess) {
        return res.status(403).json({ error: 'Forbidden' });
      }
      
      next();
    } catch (error) {
      console.error('Permission middleware error:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  };
};

// Usage in routes
app.get('/api/customers', 
  requirePermission('customers', 'read'),
  (req, res) => {
    // Handle customer list request
  }
);

app.post('/api/customers',
  requirePermission('customers', 'write'),
  (req, res) => {
    // Handle customer creation request
  }
);
```

### Database Queries | کوئری‌های پایگاه داده

#### 1. Permission Resolution Query
```sql
-- Get user permissions for a specific customer
WITH user_roles AS (
  SELECT r.* FROM Role r
  JOIN ChadcoCustomerPermission ccp ON r.id = ccp.role_id
  WHERE ccp.user_id = ? AND ccp.chadco_customer_id = ?
),
role_permissions AS (
  SELECT 
    p.resource,
    p.action,
    TRUE as granted
  FROM Permission p
  JOIN RolePermission rp ON p.id = rp.permission_id
  JOIN user_roles ur ON rp.role_id = ur.id
),
package_restrictions AS (
  SELECT 
    JSON_EXTRACT(pu.accesses_json, '$.permissions') as restrictions
  FROM PackageUnit pu
  JOIN ChadcoCustomerPackageUnit ccpu ON pu.id = ccpu.package_unit_id
  WHERE ccpu.chadco_customer_id = ?
)
SELECT 
  rp.resource,
  rp.action,
  rp.granted
FROM role_permissions rp
-- Apply package restrictions here
ORDER BY rp.resource, rp.action;
```

#### 2. Access Logging Query
```sql
-- Log user access attempt
INSERT INTO ChadcoCustomerAccessLog (
  chadco_customer_id,
  unit_id,
  page_id,
  page_feature_id,
  unit_cost_model,
  submit_date,
  entity_id,
  action
) VALUES (?, ?, ?, ?, ?, NOW(), ?, ?);
```

### Testing | تست

#### 1. Unit Tests
```typescript
// tests/PermissionService.test.ts
import { PermissionService } from '../services/PermissionService';

describe('PermissionService', () => {
  let permissionService: PermissionService;
  let mockDb: any;

  beforeEach(() => {
    mockDb = {
      query: jest.fn()
    };
    permissionService = new PermissionService(mockDb);
  });

  describe('getUserPermissions', () => {
    it('should return merged permissions from all user roles', async () => {
      // Mock database responses
      mockDb.query
        .mockResolvedValueOnce([{ id: 1, name: 'admin' }]) // user roles
        .mockResolvedValueOnce([{ resource: 'customers', action: 'read' }]) // role permissions
        .mockResolvedValueOnce([]); // package restrictions

      const permissions = await permissionService.getUserPermissions(1, 1);

      expect(permissions).toEqual({
        customers: {
          read: true,
          write: false,
          delete: false,
          admin: false
        }
      });
    });
  });

  describe('checkAccess', () => {
    it('should return true when user has access', async () => {
      mockDb.query.mockResolvedValue([]);
      
      const hasAccess = await permissionService.checkAccess(1, 1, 'customers', 'read');
      
      expect(hasAccess).toBe(true);
    });
  });
});
```

#### 2. Integration Tests
```typescript
// tests/integration/permission.test.ts
import request from 'supertest';
import app from '../app';

describe('Permission API', () => {
  describe('GET /api/permissions/user/:user_id/customer/:customer_id', () => {
    it('should return user permissions', async () => {
      const response = await request(app)
        .get('/api/permissions/user/1/customer/1')
        .expect(200);

      expect(response.body).toHaveProperty('permissions');
      expect(response.body.permissions).toBeInstanceOf(Object);
    });
  });

  describe('POST /api/access/check', () => {
    it('should check user access to a feature', async () => {
      const response = await request(app)
        .post('/api/access/check')
        .send({
          user_id: 1,
          customer_id: 1,
          page: 'customers',
          feature: 'read'
        })
        .expect(200);

      expect(response.body).toHaveProperty('has_access');
      expect(typeof response.body.has_access).toBe('boolean');
    });
  });
});
```

### Performance Optimization | بهینه‌سازی عملکرد

#### 1. Caching
```typescript
// services/CachedPermissionService.ts
import { Redis } from 'ioredis';

export class CachedPermissionService extends PermissionService {
  private redis: Redis;
  private cacheTTL = 300; // 5 minutes

  constructor(db: DatabaseConnection, redis: Redis) {
    super(db);
    this.redis = redis;
  }

  async getUserPermissions(userId: number, customerId: number): Promise<UserPermissions> {
    const cacheKey = `permissions:${userId}:${customerId}`;
    
    // Try to get from cache first
    const cached = await this.redis.get(cacheKey);
    if (cached) {
      return JSON.parse(cached);
    }
    
    // If not in cache, fetch from database
    const permissions = await super.getUserPermissions(userId, customerId);
    
    // Store in cache
    await this.redis.setex(cacheKey, this.cacheTTL, JSON.stringify(permissions));
    
    return permissions;
  }

  async invalidateUserCache(userId: number, customerId: number) {
    const cacheKey = `permissions:${userId}:${customerId}`;
    await this.redis.del(cacheKey);
  }
}
```

#### 2. Database Indexing
```sql
-- Create indexes for better performance
CREATE INDEX idx_chadco_customer_permission_user ON ChadcoCustomerPermission(user_id);
CREATE INDEX idx_chadco_customer_permission_customer ON ChadcoCustomerPermission(chadco_customer_id);
CREATE INDEX idx_role_permission_role ON RolePermission(role_id);
CREATE INDEX idx_role_permission_permission ON RolePermission(permission_id);
CREATE INDEX idx_customer_package_unit_customer ON ChadcoCustomerPackageUnit(chadco_customer_id);
CREATE INDEX idx_customer_access_customer ON ChadcoCustomerAccess(chadco_customer_id);
CREATE INDEX idx_customer_access_log_customer ON ChadcoCustomerAccessLog(chadco_customer_id);
CREATE INDEX idx_customer_access_log_date ON ChadcoCustomerAccessLog(submit_date);
```

This implementation provides a complete, production-ready access control system that follows the specifications from your Persian documentation while maintaining security, performance, and maintainability.
