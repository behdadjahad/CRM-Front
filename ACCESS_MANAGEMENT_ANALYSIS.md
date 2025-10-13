# CRM Access Management Analysis & Implementation Guide

## 📋 Table of Contents
1. [Problem Statement](#problem-statement)
2. [Approach Comparison](#approach-comparison)
3. [Detailed Analysis](#detailed-analysis)
4. [Recommendation](#recommendation)
5. [Implementation Guidelines](#implementation-guidelines)
6. [Code Examples](#code-examples)
7. [Best Practices](#best-practices)

---

## 🎯 Problem Statement

Your CRM system has complex access requirements:
- **Role-based foundation** (admin, sales, support)
- **Individual access variations** within the same role
- **Two-level permissions**: `show` (visibility) and `enable` (functionality)
- **Dynamic feature access** that can't be determined by role alone

**Key Challenge**: Users with identical roles have different access levels, requiring a hybrid approach that combines role-based permissions with individual access overrides.

---

## 🔍 Approach Comparison

### 1. Pure Role-Based Access Control (RBAC)

#### How it works:
- Users are assigned roles (admin, sales, support)
- Roles have predefined permissions
- All users with the same role have identical access

#### Implementation:
```typescript
interface Role {
  name: string;
  permissions: Permission[];
}

interface Permission {
  resource: string;
  actions: string[];
}

// Example
const salesRole: Role = {
  name: "sales",
  permissions: [
    { resource: "customers", actions: ["read", "create", "update"] },
    { resource: "contracts", actions: ["read", "create"] },
    { resource: "calendar", actions: ["read", "create"] }
  ]
};
```

#### Pros:
- ✅ Simple to implement and understand
- ✅ Easy to audit and maintain
- ✅ Clear permission boundaries
- ✅ Good for organizations with uniform role requirements

#### Cons:
- ❌ **Cannot handle your use case** - no individual variations
- ❌ Inflexible for dynamic access requirements
- ❌ Role explosion problem (too many roles needed)
- ❌ No granular control over features

#### Verdict: ❌ **Not suitable** for your requirements

---

### 2. Permission-Based Access Control (PBAC)

#### How it works:
- Users are assigned individual permissions directly
- No role concept - pure permission-based
- Each permission is atomic and specific

#### Implementation:
```typescript
interface UserPermission {
  userId: string;
  permissions: Permission[];
}

interface Permission {
  resource: string;
  action: string;
  conditions?: Condition[];
}

// Example
const userPermissions: UserPermission = {
  userId: "user123",
  permissions: [
    { resource: "calendar", action: "read" },
    { resource: "calendar", action: "create" },
    { resource: "contracts", action: "read" },
    // No contracts:create permission
  ]
};
```

#### Pros:
- ✅ Maximum flexibility
- ✅ Granular control
- ✅ Can handle any access pattern
- ✅ No role limitations

#### Cons:
- ❌ Complex to manage at scale
- ❌ Difficult to audit
- ❌ No inheritance or grouping
- ❌ Performance overhead with many permissions
- ❌ Hard to understand permission relationships

#### Verdict: ⚠️ **Possible but not ideal** - too complex for your needs

---

### 3. Hybrid Approach (Role + AccessJson Override)

#### How it works:
- Base permissions from role
- Individual accessJson overrides specific permissions
- Final permission = Role permissions + AccessJson modifications

#### Implementation:
```typescript
interface UserAccess {
  userId: string;
  role: string;
  accessJson: AccessJson;
}

interface AccessJson {
  pages: Record<string, PageAccess>;
}

interface PageAccess {
  url: string;
  code: string;
  show: boolean;
  enabled: boolean;
  features: FeatureAccess[];
}

interface FeatureAccess {
  name: string;
  show: boolean;
  enabled: boolean;
}

// Permission calculation
function calculatePermissions(user: UserAccess): FinalPermissions {
  const rolePermissions = getRolePermissions(user.role);
  const individualAccess = user.accessJson;
  
  return mergePermissions(rolePermissions, individualAccess);
}
```

#### Pros:
- ✅ **Perfect for your use case**
- ✅ Combines role simplicity with individual flexibility
- ✅ Easy to understand and maintain
- ✅ Supports both show/enable permissions
- ✅ Scalable and performant
- ✅ Clear audit trail

#### Cons:
- ⚠️ Slightly more complex than pure RBAC
- ⚠️ Requires careful permission merging logic

#### Verdict: ✅ **Highly recommended** for your scenario

---

### 4. Attribute-Based Access Control (ABAC)

#### How it works:
- Permissions based on attributes (user, resource, environment, action)
- Dynamic policy evaluation
- Context-aware access decisions

#### Implementation:
```typescript
interface Policy {
  id: string;
  effect: "allow" | "deny";
  conditions: Condition[];
}

interface Condition {
  attribute: string;
  operator: "equals" | "contains" | "greaterThan";
  value: any;
}

// Example policy
const calendarPolicy: Policy = {
  id: "calendar-access",
  effect: "allow",
  conditions: [
    { attribute: "user.role", operator: "equals", value: "sales" },
    { attribute: "user.department", operator: "equals", value: "sales" },
    { attribute: "resource.type", operator: "equals", value: "calendar" }
  ]
};
```

#### Pros:
- ✅ Highly flexible and dynamic
- ✅ Context-aware decisions
- ✅ Can handle complex scenarios
- ✅ Fine-grained control

#### Cons:
- ❌ **Overkill for your use case**
- ❌ Complex to implement and maintain
- ❌ Performance overhead
- ❌ Difficult to debug and audit
- ❌ Requires policy engine

#### Verdict: ❌ **Not recommended** - too complex for your needs

---

## 📊 Detailed Analysis

### Comparison Matrix

| Approach | Complexity | Flexibility | Performance | Maintainability | Your Use Case Fit |
|----------|------------|-------------|-------------|-----------------|-------------------|
| RBAC | Low | Low | High | High | ❌ Poor |
| PBAC | High | Very High | Medium | Low | ⚠️ Good but complex |
| Hybrid | Medium | High | High | High | ✅ Excellent |
| ABAC | Very High | Very High | Low | Low | ❌ Overkill |

### Why Hybrid Approach is Best for Your CRM

1. **Matches Your Data Structure**: Your `accessJson` is already designed for individual overrides
2. **Role Foundation**: Maintains role-based simplicity for common cases
3. **Individual Flexibility**: Handles user-specific access variations
4. **Two-Level Permissions**: Naturally supports `show`/`enable` distinction
5. **Performance**: Efficient permission calculation
6. **Maintainability**: Clear separation of concerns

---

## 🏆 Recommendation

### **Hybrid Approach (Role + AccessJson Override)**

This is the optimal solution for your CRM system because:

1. **Perfect Fit**: Aligns with your existing data structure
2. **Scalable**: Works for small teams and large organizations
3. **Maintainable**: Clear logic and easy to debug
4. **Flexible**: Handles any access pattern you need
5. **Performance**: Efficient permission resolution

### Implementation Strategy

```typescript
// 1. Define base role permissions
const ROLE_PERMISSIONS = {
  admin: {
    pages: {
      customers: { show: true, enabled: true },
      contracts: { show: true, enabled: true },
      calendar: { show: true, enabled: true },
      reports: { show: true, enabled: true },
      admin: { show: true, enabled: true }
    }
  },
  sales: {
    pages: {
      customers: { show: true, enabled: true },
      contracts: { show: true, enabled: true },
      calendar: { show: true, enabled: true },
      reports: { show: false, enabled: false },
      admin: { show: false, enabled: false }
    }
  },
  support: {
    pages: {
      customers: { show: true, enabled: true },
      contracts: { show: false, enabled: false },
      calendar: { show: true, enabled: true },
      reports: { show: false, enabled: false },
      admin: { show: false, enabled: false }
    }
  }
};

// 2. Individual access overrides
interface UserAccess {
  userId: string;
  role: string;
  accessJson: {
    pages: Record<string, {
      show?: boolean;
      enabled?: boolean;
      features?: Record<string, {
        show?: boolean;
        enabled?: boolean;
      }>;
    }>;
  };
}

// 3. Permission calculation
function calculateFinalPermissions(user: UserAccess) {
  const rolePermissions = ROLE_PERMISSIONS[user.role];
  const individualAccess = user.accessJson;
  
  return mergePermissions(rolePermissions, individualAccess);
}
```

---

## 🛠️ Implementation Guidelines

### 1. Backend Implementation

#### Database Schema
```sql
-- Users table
CREATE TABLE users (
  id UUID PRIMARY KEY,
  email VARCHAR(255) UNIQUE NOT NULL,
  role VARCHAR(50) NOT NULL,
  access_json JSONB,
  created_at TIMESTAMP DEFAULT NOW()
);

-- Roles table (for reference)
CREATE TABLE roles (
  name VARCHAR(50) PRIMARY KEY,
  description TEXT,
  base_permissions JSONB
);
```

#### Permission Service
```typescript
class PermissionService {
  private rolePermissions: Map<string, RolePermissions>;
  
  constructor() {
    this.rolePermissions = new Map();
    this.loadRolePermissions();
  }
  
  calculatePermissions(user: User): FinalPermissions {
    const rolePermissions = this.rolePermissions.get(user.role);
    const individualAccess = user.accessJson;
    
    return this.mergePermissions(rolePermissions, individualAccess);
  }
  
  private mergePermissions(
    rolePermissions: RolePermissions,
    individualAccess: AccessJson
  ): FinalPermissions {
    const finalPermissions: FinalPermissions = {};
    
    // Start with role permissions
    Object.keys(rolePermissions.pages).forEach(pageCode => {
      finalPermissions[pageCode] = { ...rolePermissions.pages[pageCode] };
    });
    
    // Apply individual overrides
    if (individualAccess?.pages) {
      Object.keys(individualAccess.pages).forEach(pageCode => {
        if (finalPermissions[pageCode]) {
          // Override existing permissions
          finalPermissions[pageCode] = {
            ...finalPermissions[pageCode],
            ...individualAccess.pages[pageCode]
          };
        } else {
          // Add new permissions
          finalPermissions[pageCode] = individualAccess.pages[pageCode];
        }
      });
    }
    
    return finalPermissions;
  }
}
```

### 2. Middleware Implementation

#### Express.js Middleware
```typescript
interface RequestWithUser extends Request {
  user: User;
  permissions: FinalPermissions;
}

export function permissionMiddleware(requiredPermission: string) {
  return async (req: RequestWithUser, res: Response, next: NextFunction) => {
    try {
      const user = req.user;
      const permissionService = new PermissionService();
      const permissions = permissionService.calculatePermissions(user);
      
      // Check if user has required permission
      const hasPermission = this.checkPermission(permissions, requiredPermission);
      
      if (!hasPermission) {
        return res.status(403).json({
          success: false,
          message: "Insufficient permissions",
          code: "INSUFFICIENT_PERMISSIONS"
        });
      }
      
      req.permissions = permissions;
      next();
    } catch (error) {
      return res.status(500).json({
        success: false,
        message: "Permission check failed",
        code: "PERMISSION_CHECK_ERROR"
      });
    }
  };
}

// Usage
app.get('/api/customers', 
  authenticateUser,
  permissionMiddleware('customers:read'),
  getCustomersController
);
```

#### Next.js Middleware
```typescript
// middleware.ts
import { NextRequest, NextResponse } from 'next/server';
import { PermissionService } from './lib/permission-service';

export async function middleware(request: NextRequest) {
  const token = request.cookies.get('token')?.value;
  
  if (!token) {
    return NextResponse.redirect(new URL('/login', request.url));
  }
  
  try {
    const user = await verifyToken(token);
    const permissionService = new PermissionService();
    const permissions = permissionService.calculatePermissions(user);
    
    // Check page access
    const pathname = request.nextUrl.pathname;
    const pageCode = getPageCodeFromPath(pathname);
    
    if (!permissions[pageCode]?.show) {
      return NextResponse.redirect(new URL('/unauthorized', request.url));
    }
    
    // Add permissions to headers for frontend
    const response = NextResponse.next();
    response.headers.set('x-user-permissions', JSON.stringify(permissions));
    
    return response;
  } catch (error) {
    return NextResponse.redirect(new URL('/login', request.url));
  }
}

export const config = {
  matcher: ['/dashboard/:path*', '/admin/:path*']
};
```

### 3. Frontend Implementation

#### Access Context (React)
```typescript
interface AccessContextType {
  permissions: FinalPermissions;
  hasPageAccess: (pageCode: string) => boolean;
  hasFeatureAccess: (pageCode: string, feature: string) => boolean;
  isPageEnabled: (pageCode: string) => boolean;
  isPageVisible: (pageCode: string) => boolean;
}

export const AccessProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [permissions, setPermissions] = useState<FinalPermissions>({});
  const [loading, setLoading] = useState(true);
  
  useEffect(() => {
    const loadPermissions = async () => {
      try {
        const response = await fetch('/api/user/permissions');
        const data = await response.json();
        setPermissions(data.permissions);
      } catch (error) {
        console.error('Failed to load permissions:', error);
      } finally {
        setLoading(false);
      }
    };
    
    loadPermissions();
  }, []);
  
  const hasPageAccess = (pageCode: string): boolean => {
    return permissions[pageCode]?.show === true;
  };
  
  const hasFeatureAccess = (pageCode: string, feature: string): boolean => {
    const pagePermissions = permissions[pageCode];
    if (!pagePermissions?.show) return false;
    
    const featurePermissions = pagePermissions.features?.[feature];
    return featurePermissions?.show === true;
  };
  
  const isPageEnabled = (pageCode: string): boolean => {
    return permissions[pageCode]?.enabled === true;
  };
  
  const isPageVisible = (pageCode: string): boolean => {
    return permissions[pageCode]?.show === true;
  };
  
  const value: AccessContextType = {
    permissions,
    hasPageAccess,
    hasFeatureAccess,
    isPageEnabled,
    isPageVisible
  };
  
  if (loading) {
    return <LoadingSpinner />;
  }
  
  return (
    <AccessContext.Provider value={value}>
      {children}
    </AccessContext.Provider>
  );
};
```

#### Route Protection Component
```typescript
interface ProtectedRouteProps {
  pageCode: string;
  feature?: string;
  children: React.ReactNode;
  fallback?: React.ReactNode;
}

export const ProtectedRoute: React.FC<ProtectedRouteProps> = ({
  pageCode,
  feature,
  children,
  fallback = <UnauthorizedPage />
}) => {
  const { hasPageAccess, hasFeatureAccess } = useAccessContext();
  
  // Check page access
  if (!hasPageAccess(pageCode)) {
    return <>{fallback}</>;
  }
  
  // Check feature access if specified
  if (feature && !hasFeatureAccess(pageCode, feature)) {
    return <>{fallback}</>;
  }
  
  return <>{children}</>;
};

// Usage
<ProtectedRoute pageCode="customers">
  <CustomerPage />
</ProtectedRoute>

<ProtectedRoute pageCode="contracts" feature="create">
  <CreateContractButton />
</ProtectedRoute>
```

#### Navigation Component
```typescript
export const NavigationMenu: React.FC = () => {
  const { isPageVisible } = useAccessContext();
  
  const menuItems = [
    { code: 'customers', label: 'Customers', path: '/customers' },
    { code: 'contracts', label: 'Contracts', path: '/contracts' },
    { code: 'calendar', label: 'Calendar', path: '/calendar' },
    { code: 'reports', label: 'Reports', path: '/reports' },
    { code: 'admin', label: 'Admin', path: '/admin' }
  ];
  
  return (
    <nav>
      {menuItems.map(item => (
        isPageVisible(item.code) && (
          <NavLink key={item.code} to={item.path}>
            {item.label}
          </NavLink>
        )
      ))}
    </nav>
  );
};
```

### 4. API Layer Protection

#### API Route Protection
```typescript
// pages/api/customers/index.ts
export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  try {
    // Authenticate user
    const user = await authenticateUser(req);
    
    // Check permissions
    const permissionService = new PermissionService();
    const permissions = permissionService.calculatePermissions(user);
    
    if (!permissions.customers?.show) {
      return res.status(403).json({
        success: false,
        message: "Access denied to customers"
      });
    }
    
    // Handle request based on method
    switch (req.method) {
      case 'GET':
        if (!permissions.customers?.enabled) {
          return res.status(403).json({
            success: false,
            message: "Customers read access disabled"
          });
        }
        return getCustomers(req, res);
        
      case 'POST':
        if (!permissions.customers?.features?.create?.enabled) {
          return res.status(403).json({
            success: false,
            message: "Customer creation access disabled"
          });
        }
        return createCustomer(req, res);
        
      default:
        return res.status(405).json({ message: 'Method not allowed' });
    }
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Internal server error"
    });
  }
}
```

---

## 💡 Code Examples

### Complete Permission Service
```typescript
interface RolePermissions {
  pages: Record<string, PagePermissions>;
}

interface PagePermissions {
  show: boolean;
  enabled: boolean;
  features?: Record<string, FeaturePermissions>;
}

interface FeaturePermissions {
  show: boolean;
  enabled: boolean;
}

interface AccessJson {
  pages: Record<string, Partial<PagePermissions>>;
}

class PermissionService {
  private rolePermissions: Map<string, RolePermissions> = new Map();
  
  constructor() {
    this.initializeRolePermissions();
  }
  
  private initializeRolePermissions() {
    // Admin role - full access
    this.rolePermissions.set('admin', {
      pages: {
        customers: { show: true, enabled: true },
        contracts: { show: true, enabled: true },
        calendar: { show: true, enabled: true },
        reports: { show: true, enabled: true },
        admin: { show: true, enabled: true }
      }
    });
    
    // Sales role - limited access
    this.rolePermissions.set('sales', {
      pages: {
        customers: { show: true, enabled: true },
        contracts: { show: true, enabled: true },
        calendar: { show: true, enabled: true },
        reports: { show: false, enabled: false },
        admin: { show: false, enabled: false }
      }
    });
    
    // Support role - minimal access
    this.rolePermissions.set('support', {
      pages: {
        customers: { show: true, enabled: true },
        contracts: { show: false, enabled: false },
        calendar: { show: true, enabled: true },
        reports: { show: false, enabled: false },
        admin: { show: false, enabled: false }
      }
    });
  }
  
  calculatePermissions(user: User): FinalPermissions {
    const rolePermissions = this.rolePermissions.get(user.role);
    if (!rolePermissions) {
      throw new Error(`Unknown role: ${user.role}`);
    }
    
    const individualAccess = user.accessJson || { pages: {} };
    
    return this.mergePermissions(rolePermissions, individualAccess);
  }
  
  private mergePermissions(
    rolePermissions: RolePermissions,
    individualAccess: AccessJson
  ): FinalPermissions {
    const finalPermissions: FinalPermissions = {};
    
    // Start with role permissions
    Object.keys(rolePermissions.pages).forEach(pageCode => {
      finalPermissions[pageCode] = { ...rolePermissions.pages[pageCode] };
    });
    
    // Apply individual overrides
    Object.keys(individualAccess.pages).forEach(pageCode => {
      if (finalPermissions[pageCode]) {
        // Override existing permissions
        finalPermissions[pageCode] = {
          ...finalPermissions[pageCode],
          ...individualAccess.pages[pageCode]
        };
        
        // Handle feature overrides
        if (individualAccess.pages[pageCode].features) {
          finalPermissions[pageCode].features = {
            ...finalPermissions[pageCode].features,
            ...individualAccess.pages[pageCode].features
          };
        }
      } else {
        // Add new permissions (if allowed by role)
        finalPermissions[pageCode] = individualAccess.pages[pageCode] as PagePermissions;
      }
    });
    
    return finalPermissions;
  }
  
  // Helper methods for common permission checks
  hasPageAccess(permissions: FinalPermissions, pageCode: string): boolean {
    return permissions[pageCode]?.show === true;
  }
  
  isPageEnabled(permissions: FinalPermissions, pageCode: string): boolean {
    return permissions[pageCode]?.enabled === true;
  }
  
  hasFeatureAccess(permissions: FinalPermissions, pageCode: string, feature: string): boolean {
    const pagePermissions = permissions[pageCode];
    if (!pagePermissions?.show) return false;
    
    const featurePermissions = pagePermissions.features?.[feature];
    return featurePermissions?.show === true;
  }
  
  isFeatureEnabled(permissions: FinalPermissions, pageCode: string, feature: string): boolean {
    const pagePermissions = permissions[pageCode];
    if (!pagePermissions?.enabled) return false;
    
    const featurePermissions = pagePermissions.features?.[feature];
    return featurePermissions?.enabled === true;
  }
}
```

### React Hook for Permissions
```typescript
export const usePermissions = () => {
  const { permissions } = useAccessContext();
  
  const hasPageAccess = useCallback((pageCode: string) => {
    return permissions[pageCode]?.show === true;
  }, [permissions]);
  
  const isPageEnabled = useCallback((pageCode: string) => {
    return permissions[pageCode]?.enabled === true;
  }, [permissions]);
  
  const hasFeatureAccess = useCallback((pageCode: string, feature: string) => {
    const pagePermissions = permissions[pageCode];
    if (!pagePermissions?.show) return false;
    
    const featurePermissions = pagePermissions.features?.[feature];
    return featurePermissions?.show === true;
  }, [permissions]);
  
  const isFeatureEnabled = useCallback((pageCode: string, feature: string) => {
    const pagePermissions = permissions[pageCode];
    if (!pagePermissions?.enabled) return false;
    
    const featurePermissions = pagePermissions.features?.[feature];
    return featurePermissions?.enabled === true;
  }, [permissions]);
  
  return {
    permissions,
    hasPageAccess,
    isPageEnabled,
    hasFeatureAccess,
    isFeatureEnabled
  };
};
```

---

## 🎯 Best Practices

### 1. Security Best Practices

#### Principle of Least Privilege
```typescript
// Start with minimal permissions
const defaultRolePermissions = {
  pages: {
    // Only essential pages enabled by default
    dashboard: { show: true, enabled: true }
  }
};

// Add permissions explicitly
const addPermission = (role: string, pageCode: string, permissions: PagePermissions) => {
  // Validate permission addition
  if (!isValidPermission(permissions)) {
    throw new Error('Invalid permissions');
  }
  
  rolePermissions[role].pages[pageCode] = permissions;
};
```

#### Permission Validation
```typescript
function validatePermissions(permissions: any): boolean {
  // Check for required fields
  if (typeof permissions.show !== 'boolean') return false;
  if (typeof permissions.enabled !== 'boolean') return false;
  
  // Validate feature permissions
  if (permissions.features) {
    for (const [featureName, featurePerms] of Object.entries(permissions.features)) {
      if (typeof featurePerms.show !== 'boolean') return false;
      if (typeof featurePerms.enabled !== 'boolean') return false;
    }
  }
  
  return true;
}
```

### 2. Performance Optimization

#### Permission Caching
```typescript
class CachedPermissionService extends PermissionService {
  private cache = new Map<string, FinalPermissions>();
  private cacheTimeout = 5 * 60 * 1000; // 5 minutes
  
  calculatePermissions(user: User): FinalPermissions {
    const cacheKey = `${user.id}-${user.role}-${JSON.stringify(user.accessJson)}`;
    
    // Check cache first
    const cached = this.cache.get(cacheKey);
    if (cached && this.isCacheValid(cacheKey)) {
      return cached;
    }
    
    // Calculate permissions
    const permissions = super.calculatePermissions(user);
    
    // Cache the result
    this.cache.set(cacheKey, {
      permissions,
      timestamp: Date.now()
    });
    
    return permissions;
  }
  
  private isCacheValid(cacheKey: string): boolean {
    const cached = this.cache.get(cacheKey);
    if (!cached) return false;
    
    return Date.now() - cached.timestamp < this.cacheTimeout;
  }
}
```

#### Lazy Permission Loading
```typescript
// Load permissions only when needed
export const useLazyPermissions = () => {
  const [permissions, setPermissions] = useState<FinalPermissions | null>(null);
  const [loading, setLoading] = useState(false);
  
  const loadPermissions = useCallback(async () => {
    if (permissions) return permissions; // Already loaded
    
    setLoading(true);
    try {
      const response = await fetch('/api/user/permissions');
      const data = await response.json();
      setPermissions(data.permissions);
      return data.permissions;
    } finally {
      setLoading(false);
    }
  }, [permissions]);
  
  return { permissions, loading, loadPermissions };
};
```

### 3. Error Handling

#### Graceful Degradation
```typescript
export const SafePermissionCheck: React.FC<{
  pageCode: string;
  children: React.ReactNode;
  fallback?: React.ReactNode;
}> = ({ pageCode, children, fallback = null }) => {
  try {
    const { hasPageAccess } = usePermissions();
    
    if (!hasPageAccess(pageCode)) {
      return <>{fallback}</>;
    }
    
    return <>{children}</>;
  } catch (error) {
    console.error('Permission check failed:', error);
    // In case of error, show fallback for security
    return <>{fallback}</>;
  }
};
```

#### Permission Error Boundaries
```typescript
class PermissionErrorBoundary extends React.Component<
  { children: React.ReactNode },
  { hasError: boolean }
> {
  constructor(props: any) {
    super(props);
    this.state = { hasError: false };
  }
  
  static getDerivedStateFromError(error: Error) {
    // Check if it's a permission-related error
    if (error.message.includes('permission') || error.message.includes('access')) {
      return { hasError: true };
    }
    return null;
  }
  
  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error('Permission error:', error, errorInfo);
  }
  
  render() {
    if (this.state.hasError) {
      return <UnauthorizedPage />;
    }
    
    return this.props.children;
  }
}
```

### 4. Testing

#### Unit Tests for Permission Service
```typescript
describe('PermissionService', () => {
  let permissionService: PermissionService;
  
  beforeEach(() => {
    permissionService = new PermissionService();
  });
  
  describe('calculatePermissions', () => {
    it('should return role permissions when no individual access', () => {
      const user: User = {
        id: '1',
        role: 'sales',
        accessJson: null
      };
      
      const permissions = permissionService.calculatePermissions(user);
      
      expect(permissions.customers.show).toBe(true);
      expect(permissions.admin.show).toBe(false);
    });
    
    it('should override role permissions with individual access', () => {
      const user: User = {
        id: '1',
        role: 'sales',
        accessJson: {
          pages: {
            admin: { show: true, enabled: true }
          }
        }
      };
      
      const permissions = permissionService.calculatePermissions(user);
      
      expect(permissions.admin.show).toBe(true);
      expect(permissions.admin.enabled).toBe(true);
    });
    
    it('should handle feature-level overrides', () => {
      const user: User = {
        id: '1',
        role: 'sales',
        accessJson: {
          pages: {
            customers: {
              features: {
                delete: { show: true, enabled: false }
              }
            }
          }
        }
      };
      
      const permissions = permissionService.calculatePermissions(user);
      
      expect(permissions.customers.features.delete.show).toBe(true);
      expect(permissions.customers.features.delete.enabled).toBe(false);
    });
  });
});
```

#### Integration Tests
```typescript
describe('Permission Integration', () => {
  it('should protect API routes correctly', async () => {
    // Test with different user roles
    const salesUser = await createTestUser({ role: 'sales' });
    const adminUser = await createTestUser({ role: 'admin' });
    
    // Sales user should not access admin endpoints
    const salesResponse = await request(app)
      .get('/api/admin/users')
      .set('Authorization', `Bearer ${salesUser.token}`)
      .expect(403);
    
    // Admin user should access admin endpoints
    const adminResponse = await request(app)
      .get('/api/admin/users')
      .set('Authorization', `Bearer ${adminUser.token}`)
      .expect(200);
  });
});
```

---

## 📋 Summary

### Recommended Approach: **Hybrid (Role + AccessJson Override)**

**Why this is the best choice for your CRM:**

1. **Perfect Fit**: Matches your existing data structure and requirements
2. **Flexible**: Handles individual user variations within roles
3. **Maintainable**: Clear separation between role-based and individual permissions
4. **Performant**: Efficient permission calculation and caching
5. **Scalable**: Works for small teams and large organizations
6. **Secure**: Implements principle of least privilege with override capability

### Implementation Checklist

- [ ] **Backend**: Implement PermissionService with role + individual merge logic
- [ ] **Database**: Design user table with role and accessJson fields
- [ ] **Middleware**: Add permission checks to API routes
- [ ] **Frontend**: Create AccessContext and permission hooks
- [ ] **Components**: Implement ProtectedRoute and permission-aware navigation
- [ ] **Testing**: Write unit and integration tests
- [ ] **Documentation**: Document permission structure and usage
- [ ] **Monitoring**: Add logging and error tracking for permission issues

This approach will give you a robust, flexible, and maintainable access control system that perfectly fits your CRM requirements while being easy to understand and extend.
