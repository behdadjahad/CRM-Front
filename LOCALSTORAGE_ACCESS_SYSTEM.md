# LocalStorage-Based Access Control System

## 🎯 Overview

A lightweight, localStorage-based access control system that:
- ✅ Stores permissions in localStorage
- ✅ Checks features and access on each page
- ✅ No complex state management needed
- ✅ Fast and simple
- ✅ Works offline
- ✅ Easy to implement

---

## 🏗️ Core Implementation

### 1. LocalStorage Permission Manager

```typescript
// utils/permissionManager.ts
interface PageAccess {
  url: string;
  code: string;
  show: boolean;
  title: string;
  pageId: number;
  enabled: boolean;
  features: FeatureAccess[];
}

interface FeatureAccess {
  code: string;
  show: boolean;
  enabled: boolean;
  title: string;
}

interface AccessJson {
  pages: Record<string, PageAccess>[];
  hash: string;
}

class PermissionManager {
  private static readonly STORAGE_KEY = 'user_permissions';
  private static readonly ACCESS_JSON_KEY = 'access_json';

  // Save permissions to localStorage
  static savePermissions(accessJson: AccessJson): void {
    try {
      localStorage.setItem(this.ACCESS_JSON_KEY, JSON.stringify(accessJson));
      
      // Also save a processed version for faster access
      const processedPermissions = this.processPermissions(accessJson);
      localStorage.setItem(this.STORAGE_KEY, JSON.stringify(processedPermissions));
      
      console.log('Permissions saved to localStorage');
    } catch (error) {
      console.error('Failed to save permissions:', error);
    }
  }

  // Get permissions from localStorage
  static getPermissions(): AccessJson | null {
    try {
      const stored = localStorage.getItem(this.ACCESS_JSON_KEY);
      return stored ? JSON.parse(stored) : null;
    } catch (error) {
      console.error('Failed to get permissions:', error);
      return null;
    }
  }

  // Get processed permissions for faster access
  static getProcessedPermissions(): any {
    try {
      const stored = localStorage.getItem(this.STORAGE_KEY);
      return stored ? JSON.parse(stored) : null;
    } catch (error) {
      console.error('Failed to get processed permissions:', error);
      return null;
    }
  }

  // Process permissions for faster lookup
  private static processPermissions(accessJson: AccessJson): any {
    const processed: any = {};
    
    if (accessJson.pages) {
      accessJson.pages.forEach(pageObj => {
        Object.entries(pageObj).forEach(([pageCode, pageData]) => {
          processed[pageCode] = {
            ...pageData,
            features: pageData.features.reduce((acc, feature) => {
              acc[feature.code] = feature;
              return acc;
            }, {} as any)
          };
        });
      });
    }
    
    return processed;
  }

  // Clear permissions from localStorage
  static clearPermissions(): void {
    localStorage.removeItem(this.STORAGE_KEY);
    localStorage.removeItem(this.ACCESS_JSON_KEY);
  }

  // Check if permissions exist
  static hasPermissions(): boolean {
    return localStorage.getItem(this.STORAGE_KEY) !== null;
  }

  // Get page permission
  static getPagePermission(pageCode: string): PageAccess | null {
    const permissions = this.getProcessedPermissions();
    return permissions?.[pageCode] || null;
  }

  // Get feature permission
  static getFeaturePermission(pageCode: string, featureCode: string): FeatureAccess | null {
    const page = this.getPagePermission(pageCode);
    return page?.features?.[featureCode] || null;
  }

  // Check if page is accessible
  static canAccessPage(pageCode: string): boolean {
    const page = this.getPagePermission(pageCode);
    return page?.show === true;
  }

  // Check if page is enabled
  static isPageEnabled(pageCode: string): boolean {
    const page = this.getPagePermission(pageCode);
    return page?.show === true && page?.enabled === true;
  }

  // Check if feature is accessible
  static canAccessFeature(pageCode: string, featureCode: string): boolean {
    const page = this.getPagePermission(pageCode);
    if (!page?.show) return false;
    
    const feature = page.features?.[featureCode];
    return feature?.show === true;
  }

  // Check if feature is enabled
  static isFeatureEnabled(pageCode: string, featureCode: string): boolean {
    const page = this.getPagePermission(pageCode);
    if (!page?.show || !page?.enabled) return false;
    
    const feature = page.features?.[featureCode];
    return feature?.show === true && feature?.enabled === true;
  }

  // Get all accessible pages
  static getAccessiblePages(): string[] {
    const permissions = this.getProcessedPermissions();
    return Object.keys(permissions).filter(pageCode => 
      permissions[pageCode]?.show === true
    );
  }

  // Get all accessible features for a page
  static getAccessibleFeatures(pageCode: string): string[] {
    const page = this.getPagePermission(pageCode);
    if (!page?.show) return [];
    
    return Object.keys(page.features || {}).filter(featureCode =>
      page.features[featureCode]?.show === true
    );
  }
}

export default PermissionManager;
```

### 2. Simple Permission Hooks

```typescript
// hooks/useLocalPermissions.ts
import { useState, useEffect } from 'react';
import PermissionManager from '../utils/permissionManager';

// Hook for page permissions
export function usePagePermission(pageCode: string) {
  const [permission, setPermission] = useState(() => 
    PermissionManager.getPagePermission(pageCode)
  );

  useEffect(() => {
    const checkPermission = () => {
      const newPermission = PermissionManager.getPagePermission(pageCode);
      setPermission(newPermission);
    };

    // Check on mount
    checkPermission();

    // Listen for storage changes (if permissions are updated elsewhere)
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === 'user_permissions' || e.key === 'access_json') {
        checkPermission();
      }
    };

    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, [pageCode]);

  return {
    canShow: permission?.show === true,
    canUse: permission?.show === true && permission?.enabled === true,
    permission
  };
}

// Hook for feature permissions
export function useFeaturePermission(pageCode: string, featureCode: string) {
  const [permission, setPermission] = useState(() => 
    PermissionManager.getFeaturePermission(pageCode, featureCode)
  );

  useEffect(() => {
    const checkPermission = () => {
      const newPermission = PermissionManager.getFeaturePermission(pageCode, featureCode);
      setPermission(newPermission);
    };

    checkPermission();

    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === 'user_permissions' || e.key === 'access_json') {
        checkPermission();
      }
    };

    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, [pageCode, featureCode]);

  return {
    canShow: permission?.show === true,
    canUse: permission?.show === true && permission?.enabled === true,
    permission
  };
}

// Hook for multiple features
export function useMultipleFeatures(pageCode: string, featureCodes: string[]) {
  const [permissions, setPermissions] = useState(() => {
    const result: any = {};
    featureCodes.forEach(code => {
      result[code] = PermissionManager.getFeaturePermission(pageCode, code);
    });
    return result;
  });

  useEffect(() => {
    const checkPermissions = () => {
      const result: any = {};
      featureCodes.forEach(code => {
        result[code] = PermissionManager.getFeaturePermission(pageCode, code);
      });
      setPermissions(result);
    };

    checkPermissions();

    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === 'user_permissions' || e.key === 'access_json') {
        checkPermissions();
      }
    };

    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, [pageCode, featureCodes.join(',')]);

  return permissions;
}
```

### 3. Simple Permission Components

```typescript
// components/PageGuard.tsx
import React from 'react';
import { usePagePermission } from '../hooks/useLocalPermissions';

interface PageGuardProps {
  pageCode: string;
  children: React.ReactNode;
  fallback?: React.ReactNode;
}

export const PageGuard: React.FC<PageGuardProps> = ({
  pageCode,
  children,
  fallback = <div>Access denied to this page.</div>
}) => {
  const { canShow } = usePagePermission(pageCode);

  if (!canShow) {
    return <>{fallback}</>;
  }

  return <>{children}</>;
};

// components/FeatureGuard.tsx
import React from 'react';
import { useFeaturePermission } from '../hooks/useLocalPermissions';

interface FeatureGuardProps {
  pageCode: string;
  featureCode: string;
  children: React.ReactNode;
  fallback?: React.ReactNode;
  mode?: 'hide' | 'disable';
}

export const FeatureGuard: React.FC<FeatureGuardProps> = ({
  pageCode,
  featureCode,
  children,
  fallback = null,
  mode = 'hide'
}) => {
  const { canShow, canUse } = useFeaturePermission(pageCode, featureCode);

  if (!canShow && mode === 'hide') {
    return <>{fallback}</>;
  }

  if (!canShow) {
    return <>{fallback}</>;
  }

  if (mode === 'disable') {
    return (
      <div className={!canUse ? 'opacity-50 pointer-events-none' : ''}>
        {children}
      </div>
    );
  }

  return <>{children}</>;
};

// components/PermissionButton.tsx
import React from 'react';
import { useFeaturePermission } from '../hooks/useLocalPermissions';

interface PermissionButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  pageCode: string;
  featureCode: string;
  children: React.ReactNode;
  hideWhenDisabled?: boolean;
  disabledMessage?: string;
}

export const PermissionButton: React.FC<PermissionButtonProps> = ({
  pageCode,
  featureCode,
  children,
  hideWhenDisabled = false,
  disabledMessage,
  onClick,
  className = '',
  ...buttonProps
}) => {
  const { canShow, canUse } = useFeaturePermission(pageCode, featureCode);

  if (!canShow || (hideWhenDisabled && !canUse)) {
    return null;
  }

  const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    if (!canUse) {
      event.preventDefault();
      if (disabledMessage) {
        alert(disabledMessage);
      }
      return;
    }
    onClick?.(event);
  };

  return (
    <button
      {...buttonProps}
      disabled={!canUse}
      onClick={handleClick}
      className={`${className} ${!canUse ? 'opacity-50 cursor-not-allowed' : ''}`}
      title={!canUse ? disabledMessage : undefined}
    >
      {children}
    </button>
  );
};
```

---

## 🚀 Usage Examples

### 1. Login and Save Permissions

```typescript
// pages/Login.tsx
import PermissionManager from '../utils/permissionManager';

export const LoginPage = () => {
  const handleLogin = async (credentials: any) => {
    try {
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        body: JSON.stringify(credentials)
      });
      
      const data = await response.json();
      
      if (data.success) {
        // Save permissions to localStorage
        PermissionManager.savePermissions(data.accessJson);
        
        // Redirect to dashboard
        window.location.href = '/dashboard';
      }
    } catch (error) {
      console.error('Login failed:', error);
    }
  };

  return (
    <form onSubmit={handleLogin}>
      {/* Login form */}
    </form>
  );
};
```

### 2. Page-Level Access Check

```typescript
// pages/CustomerPage.tsx
import { PageGuard } from '../components/PageGuard';
import { usePagePermission } from '../hooks/useLocalPermissions';

export const CustomerPage = () => {
  const { canUse } = usePagePermission('customer');

  return (
    <PageGuard pageCode="customer">
      <div className={`customer-page ${!canUse ? 'read-only' : ''}`}>
        <h1>Customer Management</h1>
        
        {/* Page content */}
        <div className="customer-content">
          {/* Your customer content here */}
        </div>
      </div>
    </PageGuard>
  );
};
```

### 3. Feature-Level Access Check

```typescript
// components/CustomerActions.tsx
import { PermissionButton } from '../components/PermissionButton';
import { FeatureGuard } from '../components/FeatureGuard';
import { useMultipleFeatures } from '../hooks/useLocalPermissions';

export const CustomerActions = () => {
  const features = useMultipleFeatures('customer', [
    'add-customer',
    'edit-customer',
    'delete-customer',
    'export-customers'
  ]);

  return (
    <div className="customer-actions">
      {/* Add Customer Button */}
      <PermissionButton
        pageCode="customer"
        featureCode="add-customer"
        onClick={() => console.log('Add customer')}
      >
        Add Customer
      </PermissionButton>

      {/* Export Button - Your specific example */}
      <PermissionButton
        pageCode="customer"
        featureCode="export-customers"
        onClick={() => exportCustomers()}
        disabledMessage="Export feature is disabled for your account"
      >
        Export Customers
      </PermissionButton>

      {/* Edit Customer - Hidden if no access */}
      <FeatureGuard pageCode="customer" featureCode="edit-customer">
        <button>Edit Customer</button>
      </FeatureGuard>

      {/* Debug info */}
      <div className="permission-debug">
        <h4>Permission Status:</h4>
        {Object.entries(features).map(([code, permission]) => (
          <div key={code}>
            {code}: {permission?.show ? '✅' : '❌'} show, {permission?.enabled ? '✅' : '❌'} enabled
          </div>
        ))}
      </div>
    </div>
  );
};
```

### 4. Navigation with Permissions

```typescript
// components/Navigation.tsx
import PermissionManager from '../utils/permissionManager';

export const Navigation = () => {
  const accessiblePages = PermissionManager.getAccessiblePages();

  const navigationItems = [
    { code: 'customers', label: 'Customers', path: '/customers' },
    { code: 'contracts', label: 'Contracts', path: '/contracts' },
    { code: 'reports', label: 'Reports', path: '/reports' },
    { code: 'admin', label: 'Admin', path: '/admin' }
  ];

  return (
    <nav>
      {navigationItems.map(item => {
        const canAccess = accessiblePages.includes(item.code);
        const canUse = PermissionManager.isPageEnabled(item.code);
        
        if (!canAccess) return null;

        return (
          <a
            key={item.code}
            href={item.path}
            className={`nav-link ${!canUse ? 'read-only' : ''}`}
          >
            {item.label}
          </a>
        );
      })}
    </nav>
  );
};
```

### 5. API Route Protection

```typescript
// pages/api/customers/export.ts
import PermissionManager from '../../../utils/permissionManager';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  try {
    // Get user token from request
    const token = req.headers.authorization?.replace('Bearer ', '');
    
    // Verify token and get user info
    const user = await verifyToken(token);
    
    // Check permissions from localStorage (you'd need to pass this from frontend)
    const canExport = PermissionManager.isFeatureEnabled('customer', 'export-customers');
    
    if (!canExport) {
      return res.status(403).json({
        success: false,
        message: 'Export feature is disabled for your account'
      });
    }
    
    // Proceed with export
    const exportData = await generateCustomerExport();
    
    res.json({
      success: true,
      data: exportData
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Export failed'
    });
  }
}
```

### 6. Simple Permission Check Utility

```typescript
// utils/checkPermissions.ts
import PermissionManager from './permissionManager';

// Simple utility functions for quick checks
export const canAccessPage = (pageCode: string): boolean => {
  return PermissionManager.canAccessPage(pageCode);
};

export const canUsePage = (pageCode: string): boolean => {
  return PermissionManager.isPageEnabled(pageCode);
};

export const canAccessFeature = (pageCode: string, featureCode: string): boolean => {
  return PermissionManager.canAccessFeature(pageCode, featureCode);
};

export const canUseFeature = (pageCode: string, featureCode: string): boolean => {
  return PermissionManager.isFeatureEnabled(pageCode, featureCode);
};

// Usage in components
export const SomeComponent = () => {
  if (!canAccessPage('customer')) {
    return <div>Access denied</div>;
  }

  return (
    <div>
      {canUseFeature('customer', 'export-customers') && (
        <button onClick={() => exportData()}>Export</button>
      )}
    </div>
  );
};
```

---

## 🎯 Benefits of LocalStorage Approach

### ✅ **Simple & Fast**
- No complex state management
- Direct localStorage access
- No API calls for permission checks
- Works offline

### ✅ **Easy to Implement**
- Just save permissions on login
- Check permissions on each page
- No context providers needed
- Minimal setup

### ✅ **Performance**
- No re-renders for permission changes
- Fast permission lookups
- No network requests for checks

### ✅ **Flexible**
- Can be used anywhere in the app
- Easy to debug
- Simple to understand

### ✅ **Your Use Case Perfect**
- Handles your `accessJson` structure
- Supports page + feature permissions
- Works with your customer/export example

---

## 🚀 Quick Setup

1. **Save permissions on login:**
```typescript
PermissionManager.savePermissions(accessJson);
```

2. **Check permissions on pages:**
```typescript
const { canShow, canUse } = usePagePermission('customer');
```

3. **Check feature permissions:**
```typescript
const { canShow, canUse } = useFeaturePermission('customer', 'export-customers');
```

4. **Use permission components:**
```typescript
<PermissionButton pageCode="customer" featureCode="export-customers">
  Export
</PermissionButton>
```

This localStorage approach is perfect for your needs - simple, fast, and handles all your permission requirements!
