# Dynamic Access Control System - Complete Implementation

## 🎯 Overview

A comprehensive, reusable system that handles:
- ✅ Page-level permissions (`show`/`enabled`)
- ✅ Feature-level permissions (`show`/`enabled`) 
- ✅ Multiple features per page
- ✅ Hierarchical permission logic
- ✅ Dynamic permission checking
- ✅ Reusable components and hooks
- ✅ Type-safe implementation

---

## 🏗️ Core Architecture

### 1. Type Definitions

```typescript
// types/access.ts
export interface FeatureAccess {
  code: string;
  show: boolean;
  enabled: boolean;
  title: string;
  description?: string;
}

export interface PageAccess {
  url: string;
  code: string;
  show: boolean;
  title: string;
  pageId: number;
  enabled: boolean;
  features: FeatureAccess[];
}

export interface AccessJson {
  pages: Record<string, PageAccess>[];
  hash: string;
}

export interface PermissionResult {
  canShow: boolean;
  canUse: boolean;
  isVisible: boolean;
  isEnabled: boolean;
}

export interface MultiFeaturePermission {
  [featureCode: string]: PermissionResult;
}

export interface PagePermissionResult extends PermissionResult {
  features: MultiFeaturePermission;
}
```

### 2. Core Permission Service

```typescript
// services/PermissionService.ts
export class PermissionService {
  private accessJson: AccessJson | null = null;

  constructor(accessJson?: AccessJson) {
    this.accessJson = accessJson || null;
  }

  updateAccessJson(accessJson: AccessJson) {
    this.accessJson = accessJson;
  }

  // Get page from accessJson
  private getPage(pageCode: string): PageAccess | null {
    if (!this.accessJson?.pages) return null;
    
    for (const pageObj of this.accessJson.pages) {
      if (pageObj[pageCode]) {
        return pageObj[pageCode];
      }
    }
    return null;
  }

  // Get feature from page
  private getFeature(pageCode: string, featureCode: string): FeatureAccess | null {
    const page = this.getPage(pageCode);
    return page?.features?.find(f => f.code === featureCode) || null;
  }

  // Calculate final permission result
  private calculatePermission(
    pageShow: boolean,
    pageEnabled: boolean,
    featureShow?: boolean,
    featureEnabled?: boolean
  ): PermissionResult {
    const canShow = pageShow && (featureShow !== undefined ? featureShow : true);
    const canUse = pageShow && pageEnabled && (featureShow !== undefined ? featureShow : true) && (featureEnabled !== undefined ? featureEnabled : true);
    
    return {
      canShow,
      canUse,
      isVisible: canShow,
      isEnabled: canUse
    };
  }

  // Check page permission
  checkPagePermission(pageCode: string): PermissionResult {
    const page = this.getPage(pageCode);
    if (!page) {
      return { canShow: false, canUse: false, isVisible: false, isEnabled: false };
    }

    return this.calculatePermission(page.show, page.enabled);
  }

  // Check single feature permission
  checkFeaturePermission(pageCode: string, featureCode: string): PermissionResult {
    const page = this.getPage(pageCode);
    if (!page) {
      return { canShow: false, canUse: false, isVisible: false, isEnabled: false };
    }

    const feature = this.getFeature(pageCode, featureCode);
    if (!feature) {
      // If feature doesn't exist, return page-level permission
      return this.calculatePermission(page.show, page.enabled);
    }

    return this.calculatePermission(page.show, page.enabled, feature.show, feature.enabled);
  }

  // Check multiple features at once
  checkMultipleFeatures(pageCode: string, featureCodes: string[]): MultiFeaturePermission {
    const result: MultiFeaturePermission = {};
    
    featureCodes.forEach(featureCode => {
      result[featureCode] = this.checkFeaturePermission(pageCode, featureCode);
    });

    return result;
  }

  // Check page with all its features
  checkPageWithFeatures(pageCode: string): PagePermissionResult {
    const page = this.getPage(pageCode);
    if (!page) {
      return {
        canShow: false,
        canUse: false,
        isVisible: false,
        isEnabled: false,
        features: {}
      };
    }

    const pagePermission = this.checkPagePermission(pageCode);
    const features: MultiFeaturePermission = {};

    // Check all features in the page
    page.features.forEach(feature => {
      features[feature.code] = this.checkFeaturePermission(pageCode, feature.code);
    });

    return {
      ...pagePermission,
      features
    };
  }

  // Get all accessible pages
  getAccessiblePages(): PageAccess[] {
    if (!this.accessJson?.pages) return [];
    
    return this.accessJson.pages
      .map(pageObj => Object.values(pageObj)[0])
      .filter(page => page.show);
  }

  // Get all accessible features for a page
  getAccessibleFeatures(pageCode: string): FeatureAccess[] {
    const page = this.getPage(pageCode);
    if (!page) return [];
    
    return page.features.filter(feature => feature.show);
  }

  // Check if user has any access to a page
  hasPageAccess(pageCode: string): boolean {
    return this.checkPagePermission(pageCode).canShow;
  }

  // Check if user can perform any action on a page
  canUsePage(pageCode: string): boolean {
    return this.checkPagePermission(pageCode).canUse;
  }

  // Check if user has access to any feature in a page
  hasAnyFeatureAccess(pageCode: string): boolean {
    const page = this.getPage(pageCode);
    if (!page) return false;
    
    return page.features.some(feature => 
      this.checkFeaturePermission(pageCode, feature.code).canShow
    );
  }
}
```

---

## 🎣 React Hooks

### 1. Main Access Hook

```typescript
// hooks/useAccess.ts
import { useMemo } from 'react';
import { PermissionService } from '../services/PermissionService';
import { useAccessContext } from '../contexts/AccessContext';

export function useAccess() {
  const { accessJson } = useAccessContext();
  
  const permissionService = useMemo(() => {
    return new PermissionService(accessJson);
  }, [accessJson]);

  return {
    // Page-level checks
    checkPage: (pageCode: string) => permissionService.checkPagePermission(pageCode),
    hasPageAccess: (pageCode: string) => permissionService.hasPageAccess(pageCode),
    canUsePage: (pageCode: string) => permissionService.canUsePage(pageCode),
    
    // Feature-level checks
    checkFeature: (pageCode: string, featureCode: string) => 
      permissionService.checkFeaturePermission(pageCode, featureCode),
    checkMultipleFeatures: (pageCode: string, featureCodes: string[]) =>
      permissionService.checkMultipleFeatures(pageCode, featureCodes),
    
    // Combined checks
    checkPageWithFeatures: (pageCode: string) =>
      permissionService.checkPageWithFeatures(pageCode),
    
    // Utility methods
    getAccessiblePages: () => permissionService.getAccessiblePages(),
    getAccessibleFeatures: (pageCode: string) => 
      permissionService.getAccessibleFeatures(pageCode),
    hasAnyFeatureAccess: (pageCode: string) =>
      permissionService.hasAnyFeatureAccess(pageCode),
    
    // Direct service access for advanced usage
    permissionService
  };
}
```

### 2. Specific Permission Hooks

```typescript
// hooks/usePageAccess.ts
export function usePageAccess(pageCode: string) {
  const { checkPage } = useAccess();
  
  return useMemo(() => {
    return checkPage(pageCode);
  }, [checkPage, pageCode]);
}

// hooks/useFeatureAccess.ts
export function useFeatureAccess(pageCode: string, featureCode: string) {
  const { checkFeature } = useAccess();
  
  return useMemo(() => {
    return checkFeature(pageCode, featureCode);
  }, [checkFeature, pageCode, featureCode]);
}

// hooks/useMultipleFeatures.ts
export function useMultipleFeatures(pageCode: string, featureCodes: string[]) {
  const { checkMultipleFeatures } = useAccess();
  
  return useMemo(() => {
    return checkMultipleFeatures(pageCode, featureCodes);
  }, [checkMultipleFeatures, pageCode, featureCodes]);
}

// hooks/usePageWithFeatures.ts
export function usePageWithFeatures(pageCode: string) {
  const { checkPageWithFeatures } = useAccess();
  
  return useMemo(() => {
    return checkPageWithFeatures(pageCode);
  }, [checkPageWithFeatures, pageCode]);
}
```

---

## 🧩 Reusable Components

### 1. Access Guard Component

```typescript
// components/AccessGuard.tsx
import React from 'react';
import { useFeatureAccess } from '../hooks/useFeatureAccess';

interface AccessGuardProps {
  pageCode: string;
  featureCode?: string;
  children: React.ReactNode;
  fallback?: React.ReactNode;
  mode?: 'hide' | 'disable' | 'custom';
  onAccessDenied?: () => void;
}

export const AccessGuard: React.FC<AccessGuardProps> = ({
  pageCode,
  featureCode,
  children,
  fallback = null,
  mode = 'hide',
  onAccessDenied
}) => {
  const permission = useFeatureAccess(pageCode, featureCode || '');
  
  React.useEffect(() => {
    if (!permission.canShow && onAccessDenied) {
      onAccessDenied();
    }
  }, [permission.canShow, onAccessDenied]);

  // Hide mode: don't render if no access
  if (mode === 'hide' && !permission.canShow) {
    return <>{fallback}</>;
  }

  // Disable mode: render but disable if no access
  if (mode === 'disable') {
    return (
      <div className={!permission.canUse ? 'opacity-50 pointer-events-none' : ''}>
        {children}
      </div>
    );
  }

  // Custom mode: render with custom logic
  if (mode === 'custom') {
    return (
      <div className={!permission.canUse ? 'access-denied' : ''}>
        {children}
      </div>
    );
  }

  return <>{children}</>;
};
```

### 2. Dynamic Button Component

```typescript
// components/AccessButton.tsx
import React from 'react';
import { useFeatureAccess } from '../hooks/useFeatureAccess';

interface AccessButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  pageCode: string;
  featureCode: string;
  children: React.ReactNode;
  hideWhenDisabled?: boolean;
  disabledMessage?: string;
  onClick?: (event: React.MouseEvent<HTMLButtonElement>) => void;
}

export const AccessButton: React.FC<AccessButtonProps> = ({
  pageCode,
  featureCode,
  children,
  hideWhenDisabled = false,
  disabledMessage,
  onClick,
  className = '',
  ...buttonProps
}) => {
  const permission = useFeatureAccess(pageCode, featureCode);

  // Hide button if no show permission
  if (!permission.canShow || (hideWhenDisabled && !permission.canUse)) {
    return null;
  }

  const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    if (!permission.canUse) {
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
      disabled={!permission.canUse}
      onClick={handleClick}
      className={`${className} ${!permission.canUse ? 'opacity-50 cursor-not-allowed' : ''}`}
      title={!permission.canUse ? disabledMessage : undefined}
    >
      {children}
    </button>
  );
};
```

### 3. Dynamic Form Component

```typescript
// components/AccessForm.tsx
import React from 'react';
import { usePageWithFeatures } from '../hooks/usePageWithFeatures';

interface AccessFormProps extends React.FormHTMLAttributes<HTMLFormElement> {
  pageCode: string;
  children: React.ReactNode;
  readOnlyMode?: boolean;
}

export const AccessForm: React.FC<AccessFormProps> = ({
  pageCode,
  children,
  readOnlyMode = false,
  className = '',
  ...formProps
}) => {
  const pagePermission = usePageWithFeatures(pageCode);

  if (!pagePermission.canShow) {
    return <div>Access denied to this form.</div>;
  }

  const isReadOnly = readOnlyMode || !pagePermission.canUse;

  return (
    <form
      {...formProps}
      className={`${className} ${isReadOnly ? 'read-only-form' : ''}`}
      onSubmit={isReadOnly ? (e) => e.preventDefault() : formProps.onSubmit}
    >
      <fieldset disabled={isReadOnly}>
        {children}
      </fieldset>
    </form>
  );
};
```

### 4. Dynamic Navigation Component

```typescript
// components/AccessNavigation.tsx
import React from 'react';
import { useAccess } from '../hooks/useAccess';
import { Link } from 'react-router-dom';

interface NavigationItem {
  pageCode: string;
  label: string;
  icon?: React.ReactNode;
  children?: NavigationItem[];
}

interface AccessNavigationProps {
  items: NavigationItem[];
  className?: string;
}

export const AccessNavigation: React.FC<AccessNavigationProps> = ({
  items,
  className = ''
}) => {
  const { hasPageAccess, canUsePage } = useAccess();

  const renderNavigationItem = (item: NavigationItem): React.ReactNode => {
    const canShow = hasPageAccess(item.pageCode);
    const canUse = canUsePage(item.pageCode);

    if (!canShow) return null;

    return (
      <li key={item.pageCode} className={!canUse ? 'read-only-nav-item' : ''}>
        <Link
          to={`/${item.pageCode}`}
          className={`nav-link ${!canUse ? 'disabled' : ''}`}
        >
          {item.icon}
          <span>{item.label}</span>
        </Link>
        
        {item.children && (
          <ul className="sub-nav">
            {item.children.map(renderNavigationItem)}
          </ul>
        )}
      </li>
    );
  };

  return (
    <nav className={`access-navigation ${className}`}>
      <ul>
        {items.map(renderNavigationItem)}
      </ul>
    </nav>
  );
};
```

### 5. Feature List Component

```typescript
// components/FeatureList.tsx
import React from 'react';
import { usePageWithFeatures } from '../hooks/usePageWithFeatures';

interface FeatureItem {
  code: string;
  component: React.ComponentType<any>;
  props?: any;
}

interface FeatureListProps {
  pageCode: string;
  features: FeatureItem[];
  className?: string;
}

export const FeatureList: React.FC<FeatureListProps> = ({
  pageCode,
  features,
  className = ''
}) => {
  const pagePermission = usePageWithFeatures(pageCode);

  if (!pagePermission.canShow) {
    return null;
  }

  return (
    <div className={`feature-list ${className}`}>
      {features.map(({ code, component: Component, props = {} }) => {
        const featurePermission = pagePermission.features[code];
        
        if (!featurePermission?.canShow) return null;

        return (
          <div
            key={code}
            className={`feature-item ${!featurePermission.canUse ? 'disabled' : ''}`}
          >
            <Component
              {...props}
              disabled={!featurePermission.canUse}
              readOnly={!featurePermission.canUse}
            />
          </div>
        );
      })}
    </div>
  );
};
```

---

## 🎯 Usage Examples

### 1. Basic Page Access

```typescript
// pages/CustomerPage.tsx
import React from 'react';
import { usePageAccess } from '../hooks/usePageAccess';
import { AccessGuard } from '../components/AccessGuard';

export const CustomerPage: React.FC = () => {
  const pagePermission = usePageAccess('customer');

  if (!pagePermission.canShow) {
    return <div>Access denied to customer page.</div>;
  }

  return (
    <div className={`customer-page ${!pagePermission.canUse ? 'read-only' : ''}`}>
      <h1>Customer Management</h1>
      
      <AccessGuard pageCode="customer" featureCode="add-customer">
        <button>Add New Customer</button>
      </AccessGuard>

      <AccessGuard pageCode="customer" featureCode="export-customers">
        <button>Export Customers</button>
      </AccessGuard>
    </div>
  );
};
```

### 2. Multiple Features Check

```typescript
// components/CustomerActions.tsx
import React from 'react';
import { useMultipleFeatures } from '../hooks/useMultipleFeatures';
import { AccessButton } from '../components/AccessButton';

export const CustomerActions: React.FC = () => {
  const features = useMultipleFeatures('customer', [
    'add-customer',
    'edit-customer', 
    'delete-customer',
    'export-customers'
  ]);

  return (
    <div className="customer-actions">
      <AccessButton
        pageCode="customer"
        featureCode="add-customer"
        onClick={() => console.log('Add customer')}
      >
        Add Customer
      </AccessButton>

      <AccessButton
        pageCode="customer"
        featureCode="export-customers"
        onClick={() => console.log('Export customers')}
        disabledMessage="Export feature is disabled for your account"
      >
        Export Customers
      </AccessButton>

      {/* Show status for debugging */}
      <div className="permission-status">
        {Object.entries(features).map(([code, permission]) => (
          <div key={code}>
            {code}: {permission.canShow ? '✅' : '❌'} show, {permission.canUse ? '✅' : '❌'} use
          </div>
        ))}
      </div>
    </div>
  );
};
```

### 3. Dynamic Navigation

```typescript
// components/MainNavigation.tsx
import React from 'react';
import { AccessNavigation } from '../components/AccessNavigation';

const navigationItems = [
  {
    pageCode: 'customers',
    label: 'Customers',
    icon: <i className="icon-users" />
  },
  {
    pageCode: 'contracts', 
    label: 'Contracts',
    icon: <i className="icon-contract" />
  },
  {
    pageCode: 'reports',
    label: 'Reports', 
    icon: <i className="icon-chart" />
  }
];

export const MainNavigation: React.FC = () => {
  return (
    <AccessNavigation items={navigationItems} className="main-nav" />
  );
};
```

### 4. Feature List with Dynamic Components

```typescript
// pages/ContractPage.tsx
import React from 'react';
import { FeatureList } from '../components/FeatureList';
import { CreateContractForm } from '../components/CreateContractForm';
import { ExportContractButton } from '../components/ExportContractButton';
import { ContractSettings } from '../components/ContractSettings';

const contractFeatures = [
  {
    code: 'create-contract',
    component: CreateContractForm,
    props: { className: 'create-form' }
  },
  {
    code: 'export-contracts',
    component: ExportContractButton,
    props: { format: 'excel' }
  },
  {
    code: 'contract-settings',
    component: ContractSettings,
    props: { mode: 'advanced' }
  }
];

export const ContractPage: React.FC = () => {
  return (
    <div className="contract-page">
      <h1>Contract Management</h1>
      
      <FeatureList
        pageCode="contract"
        features={contractFeatures}
        className="contract-features"
      />
    </div>
  );
};
```

---

## 🚀 Advanced Features

### 1. Permission Debug Component

```typescript
// components/PermissionDebug.tsx
import React from 'react';
import { useAccess } from '../hooks/useAccess';

interface PermissionDebugProps {
  pageCode: string;
  featureCodes?: string[];
}

export const PermissionDebug: React.FC<PermissionDebugProps> = ({
  pageCode,
  featureCodes = []
}) => {
  const { checkPageWithFeatures, checkMultipleFeatures } = useAccess();
  
  const pagePermission = checkPageWithFeatures(pageCode);
  const featurePermissions = featureCodes.length > 0 
    ? checkMultipleFeatures(pageCode, featureCodes)
    : {};

  return (
    <div className="permission-debug">
      <h3>Permission Debug: {pageCode}</h3>
      
      <div className="page-permission">
        <strong>Page:</strong>
        <ul>
          <li>Show: {pagePermission.canShow ? '✅' : '❌'}</li>
          <li>Use: {pagePermission.canUse ? '✅' : '❌'}</li>
        </ul>
      </div>

      <div className="features-permission">
        <strong>Features:</strong>
        <ul>
          {Object.entries(pagePermission.features).map(([code, permission]) => (
            <li key={code}>
              {code}: Show {permission.canShow ? '✅' : '❌'}, Use {permission.canUse ? '✅' : '❌'}
            </li>
          ))}
        </ul>
      </div>

      {featureCodes.length > 0 && (
        <div className="specific-features">
          <strong>Specific Features:</strong>
          <ul>
            {Object.entries(featurePermissions).map(([code, permission]) => (
              <li key={code}>
                {code}: Show {permission.canShow ? '✅' : '❌'}, Use {permission.canUse ? '✅' : '❌'}
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};
```

### 2. Permission Context Provider

```typescript
// contexts/AccessContext.tsx
import React, { createContext, useContext, useState, useEffect } from 'react';
import { AccessJson, PermissionService } from '../types/access';

interface AccessContextType {
  accessJson: AccessJson | null;
  permissionService: PermissionService | null;
  loading: boolean;
  error: string | null;
  refreshPermissions: () => Promise<void>;
}

const AccessContext = createContext<AccessContextType | undefined>(undefined);

export const AccessProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [accessJson, setAccessJson] = useState<AccessJson | null>(null);
  const [permissionService, setPermissionService] = useState<PermissionService | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const refreshPermissions = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await fetch('/api/user/access');
      const data = await response.json();
      
      setAccessJson(data.accessJson);
      setPermissionService(new PermissionService(data.accessJson));
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load permissions');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    refreshPermissions();
  }, []);

  const value: AccessContextType = {
    accessJson,
    permissionService,
    loading,
    error,
    refreshPermissions
  };

  return (
    <AccessContext.Provider value={value}>
      {children}
    </AccessContext.Provider>
  );
};

export const useAccessContext = () => {
  const context = useContext(AccessContext);
  if (context === undefined) {
    throw new Error('useAccessContext must be used within an AccessProvider');
  }
  return context;
};
```

---

## 🎯 Benefits of This Approach

### ✅ **Comprehensive Coverage**
- Handles all page and feature combinations
- Supports multiple features per page
- Type-safe implementation

### ✅ **Reusable Components**
- `AccessGuard` - Generic access control
- `AccessButton` - Smart button with permissions
- `AccessForm` - Form with read-only mode
- `AccessNavigation` - Dynamic navigation
- `FeatureList` - Dynamic feature rendering

### ✅ **Flexible Hooks**
- `useAccess()` - Main access hook
- `usePageAccess()` - Page-specific
- `useFeatureAccess()` - Feature-specific
- `useMultipleFeatures()` - Multiple features
- `usePageWithFeatures()` - Complete page data

### ✅ **Developer Experience**
- Intuitive API
- TypeScript support
- Debug components
- Clear error messages

### ✅ **Performance Optimized**
- Memoized calculations
- Efficient permission checking
- Minimal re-renders

This system provides a complete, reusable solution for your access control needs while maintaining flexibility and performance!

