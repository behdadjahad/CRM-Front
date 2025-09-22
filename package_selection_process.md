# Package Selection Process Documentation
## مستندات نحوه تهیه پکیج‌ها توسط هر آژانس

### Overview | نمای کلی

This document describes the process by which agencies select packages from different levels and how this selection affects their access permissions and role configurations.

این مستند فرایند انتخاب پکیج‌ها توسط آژانس‌ها از سطوح مختلف و تأثیر این انتخاب بر دسترسی‌ها و تنظیمات نقش‌های آن‌ها را شرح می‌دهد.

---

## Process Description | توصیف فرایند

### Step 1: Package Selection | مرحله 1: انتخاب پکیج

Each agency selects the desired packages from any level of the hierarchy. The selected packages are stored in the following tables:

هر آژانس پکیج‌های مدنظر خود را از هر لایه انتخاب می‌کند. پکیج‌های انتخاب شده در جداول زیر ذخیره می‌شوند:

1. **ChadcoCustomerPackage** - Selected packages
2. **ChadcoCustomerPackageCategory** - Selected package categories
3. **ChadcoCustomerPackageUnit** - Selected package units

### Step 2: Permission Resolution | مرحله 2: حل مجوزها

Using all active selections, the system accesses all roles, their permissions, and ultimately their access JSON files. These items are updated:

با استفاده از تمام این انتخاب‌ها (پکیج‌های active)، سیستم به تمام roleها، permissionهای آنها و در نهایت json دسترسی آنها دسترسی پیدا می‌کند. با استفاده از آنها این آیتم‌ها آپدیت می‌شوند:

1. **Role and Permission JSON files** - Updated access JSON for each role and permission
2. **ChadcoCustomerPermission** - Customer permission associations
3. **ChadcoCustomerAccess** - Customer access rights to specific features

---

## Database Schema Updates | به‌روزرسانی ساختار پایگاه داده

### 1. Package Selection Tables | جداول انتخاب پکیج

#### ChadcoCustomerPackage
```sql
CREATE TABLE ChadcoCustomerPackage (
    id INTEGER PRIMARY KEY AUTO_INCREMENT,
    chadco_customer_id INTEGER NOT NULL,
    package_id INTEGER NOT NULL,
    subscription_start_date TIMESTAMP NOT NULL,
    subscription_end_date TIMESTAMP,
    status ENUM('active', 'suspended', 'cancelled', 'expired') DEFAULT 'active',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    deleted_at TIMESTAMP NULL,
    FOREIGN KEY (chadco_customer_id) REFERENCES ChadcoCustomer(id) ON DELETE CASCADE,
    FOREIGN KEY (package_id) REFERENCES Package(id) ON DELETE CASCADE,
    UNIQUE KEY unique_customer_package (chadco_customer_id, package_id)
);
```

#### ChadcoCustomerPackageCategory
```sql
CREATE TABLE ChadcoCustomerPackageCategory (
    id INTEGER PRIMARY KEY AUTO_INCREMENT,
    chadco_customer_id INTEGER NOT NULL,
    package_category_id INTEGER NOT NULL,
    subscription_start_date TIMESTAMP NOT NULL,
    subscription_end_date TIMESTAMP,
    status ENUM('active', 'suspended', 'cancelled', 'expired') DEFAULT 'active',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    deleted_at TIMESTAMP NULL,
    FOREIGN KEY (chadco_customer_id) REFERENCES ChadcoCustomer(id) ON DELETE CASCADE,
    FOREIGN KEY (package_category_id) REFERENCES PackageCategory(id) ON DELETE CASCADE,
    UNIQUE KEY unique_customer_category (chadco_customer_id, package_category_id)
);
```

#### ChadcoCustomerPackageUnit
```sql
CREATE TABLE ChadcoCustomerPackageUnit (
    id INTEGER PRIMARY KEY AUTO_INCREMENT,
    chadco_customer_id INTEGER NOT NULL,
    package_unit_id INTEGER NOT NULL,
    package_unit_cost_id INTEGER NOT NULL,
    subscription_start_date TIMESTAMP NOT NULL,
    subscription_end_date TIMESTAMP,
    usage_count INTEGER DEFAULT 0,
    status ENUM('active', 'suspended', 'cancelled', 'expired') DEFAULT 'active',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    deleted_at TIMESTAMP NULL,
    FOREIGN KEY (chadco_customer_id) REFERENCES ChadcoCustomer(id) ON DELETE CASCADE,
    FOREIGN KEY (package_unit_id) REFERENCES PackageUnit(id) ON DELETE CASCADE,
    FOREIGN KEY (package_unit_cost_id) REFERENCES PackageUnitCost(id) ON DELETE CASCADE,
    UNIQUE KEY unique_customer_unit (chadco_customer_id, package_unit_id)
);
```

### 2. Permission Resolution Tables | جداول حل مجوزها

#### ChadcoCustomerPermission
```sql
CREATE TABLE ChadcoCustomerPermission (
    id INTEGER PRIMARY KEY AUTO_INCREMENT,
    chadco_customer_id INTEGER NOT NULL,
    user_id INTEGER NOT NULL,
    role_id INTEGER,
    permission_id INTEGER,
    access_type ENUM('role', 'permission', 'custom') NOT NULL,
    access_json JSON,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (chadco_customer_id) REFERENCES ChadcoCustomer(id) ON DELETE CASCADE,
    FOREIGN KEY (user_id) REFERENCES User(id) ON DELETE CASCADE,
    FOREIGN KEY (role_id) REFERENCES Role(id) ON DELETE CASCADE,
    FOREIGN KEY (permission_id) REFERENCES Permission(id) ON DELETE CASCADE
);
```

#### ChadcoCustomerAccess
```sql
CREATE TABLE ChadcoCustomerAccess (
    id INTEGER PRIMARY KEY AUTO_INCREMENT,
    chadco_customer_id INTEGER NOT NULL,
    package_unit_id INTEGER NOT NULL,
    page_id INTEGER NOT NULL,
    page_feature_id INTEGER NOT NULL,
    package_unit_cost_id INTEGER,
    unit_model ENUM('perDuration', 'perCount', 'flat') NOT NULL,
    enabled_date TIMESTAMP NOT NULL,
    show_date TIMESTAMP NOT NULL,
    counter INTEGER DEFAULT 0,
    access_level ENUM('basic', 'premium', 'enterprise') NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (chadco_customer_id) REFERENCES ChadcoCustomer(id) ON DELETE CASCADE,
    FOREIGN KEY (package_unit_id) REFERENCES PackageUnit(id) ON DELETE CASCADE,
    FOREIGN KEY (page_id) REFERENCES Page(id) ON DELETE CASCADE,
    FOREIGN KEY (page_feature_id) REFERENCES PageFeatures(id) ON DELETE CASCADE,
    FOREIGN KEY (package_unit_cost_id) REFERENCES PackageUnitCost(id) ON DELETE CASCADE
);
```

---

## Package Selection Process | فرایند انتخاب پکیج

### 1. Agency Package Selection | انتخاب پکیج توسط آژانس

```typescript
interface PackageSelectionRequest {
  customer_id: number;
  packages: {
    package_id: number;
    categories?: number[];
    units?: number[];
  }[];
  subscription_start_date: string;
  subscription_end_date?: string;
}

interface PackageSelectionResponse {
  success: boolean;
  message: string;
  selected_packages: {
    packages: ChadcoCustomerPackage[];
    categories: ChadcoCustomerPackageCategory[];
    units: ChadcoCustomerPackageUnit[];
  };
  updated_permissions: {
    roles: Role[];
    permissions: Permission[];
    access_rights: ChadcoCustomerAccess[];
  };
}
```

### 2. Permission Resolution Algorithm | الگوریتم حل مجوزها

```typescript
class PackagePermissionResolver {
  async resolveCustomerPermissions(customerId: number): Promise<ResolvedPermissions> {
    // Step 1: Get all active package selections
    const activeSelections = await this.getActivePackageSelections(customerId);
    
    // Step 2: Extract all package units and their access definitions
    const packageUnits = await this.getPackageUnitsFromSelections(activeSelections);
    
    // Step 3: Resolve access permissions from package units
    const accessPermissions = await this.resolveAccessPermissions(packageUnits);
    
    // Step 4: Update role permissions based on package access
    const updatedRoles = await this.updateRolePermissions(customerId, accessPermissions);
    
    // Step 5: Update customer permissions and access rights
    const customerPermissions = await this.updateCustomerPermissions(customerId, accessPermissions);
    const customerAccess = await this.updateCustomerAccess(customerId, packageUnits);
    
    return {
      roles: updatedRoles,
      permissions: customerPermissions,
      access_rights: customerAccess
    };
  }

  private async getActivePackageSelections(customerId: number) {
    const query = `
      SELECT 
        ccp.package_id,
        ccpc.package_category_id,
        ccpu.package_unit_id,
        ccpu.package_unit_cost_id
      FROM ChadcoCustomerPackage ccp
      LEFT JOIN ChadcoCustomerPackageCategory ccpc ON ccp.chadco_customer_id = ccpc.chadco_customer_id
      LEFT JOIN ChadcoCustomerPackageUnit ccpu ON ccp.chadco_customer_id = ccpu.chadco_customer_id
      WHERE ccp.chadco_customer_id = ? 
        AND ccp.status = 'active'
        AND (ccpc.status = 'active' OR ccpc.status IS NULL)
        AND (ccpu.status = 'active' OR ccpu.status IS NULL)
    `;
    return await this.db.query(query, [customerId]);
  }

  private async resolveAccessPermissions(packageUnits: PackageUnit[]) {
    const accessPermissions: AccessPermission[] = [];
    
    for (const unit of packageUnits) {
      if (unit.accesses_json) {
        const accesses = JSON.parse(unit.accesses_json);
        for (const [page, permissions] of Object.entries(accesses)) {
          accessPermissions.push({
            page,
            permissions: permissions as Permission,
            package_unit_id: unit.id,
            access_level: unit.access_level
          });
        }
      }
    }
    
    return accessPermissions;
  }
}
```

---

## JSON Structure Updates | به‌روزرسانی ساختار JSON

### 1. Role Access JSON Update | به‌روزرسانی JSON دسترسی نقش

```json
{
  "role_id": 1,
  "role_name": "admin",
  "customer_id": 123,
  "access_json": {
    "dashboard": {
      "read": true,
      "write": true,
      "delete": false,
      "admin": true
    },
    "customers": {
      "read": true,
      "write": true,
      "delete": true,
      "admin": true
    },
    "reports": {
      "read": true,
      "write": true,
      "delete": false,
      "admin": true
    },
    "settings": {
      "read": true,
      "write": true,
      "delete": false,
      "admin": true
    }
  },
  "package_restrictions": {
    "max_customers": 1000,
    "max_users": 10,
    "features": ["advanced_reporting", "api_access", "custom_fields"]
  },
  "inherited_roles": [2, 3],
  "updated_at": "2024-01-15T10:30:00Z"
}
```

### 2. Permission JSON Update | به‌روزرسانی JSON مجوز

```json
{
  "permission_id": 1,
  "permission_name": "customer_management",
  "customer_id": 123,
  "access_json": {
    "customers": {
      "read": true,
      "write": true,
      "delete": false,
      "admin": false
    },
    "customer_contacts": {
      "read": true,
      "write": true,
      "delete": false,
      "admin": false
    }
  },
  "package_units": [1, 2, 3],
  "access_level": "premium",
  "updated_at": "2024-01-15T10:30:00Z"
}
```

---

## API Endpoints | نقاط پایانی API

### 1. Select Packages | انتخاب پکیج‌ها

```http
POST /api/customers/{customer_id}/packages/select
```

**Request Body:**
```json
{
  "packages": [
    {
      "package_id": 1,
      "categories": [1, 2],
      "units": [1, 2, 3, 4]
    },
    {
      "package_id": 2,
      "categories": [3],
      "units": [5, 6]
    }
  ],
  "subscription_start_date": "2024-01-01T00:00:00Z",
  "subscription_end_date": "2024-12-31T23:59:59Z"
}
```

**Response:**
```json
{
  "success": true,
  "message": "Packages selected successfully",
  "selected_packages": {
    "packages": [
      {
        "id": 1,
        "chadco_customer_id": 123,
        "package_id": 1,
        "status": "active",
        "subscription_start_date": "2024-01-01T00:00:00Z"
      }
    ],
    "categories": [
      {
        "id": 1,
        "chadco_customer_id": 123,
        "package_category_id": 1,
        "status": "active"
      }
    ],
    "units": [
      {
        "id": 1,
        "chadco_customer_id": 123,
        "package_unit_id": 1,
        "package_unit_cost_id": 1,
        "status": "active"
      }
    ]
  },
  "updated_permissions": {
    "roles_updated": 3,
    "permissions_updated": 5,
    "access_rights_created": 12
  }
}
```

### 2. Get Customer Package Status | دریافت وضعیت پکیج مشتری

```http
GET /api/customers/{customer_id}/packages/status
```

**Response:**
```json
{
  "customer_id": 123,
  "active_packages": [
    {
      "package_id": 1,
      "package_name": "Basic CRM Package",
      "status": "active",
      "subscription_start_date": "2024-01-01T00:00:00Z",
      "subscription_end_date": "2024-12-31T23:59:59Z",
      "categories": [
        {
          "category_id": 1,
          "category_name": "Customer Management",
          "status": "active",
          "units": [
            {
              "unit_id": 1,
              "unit_name": "Customer List View",
              "status": "active",
              "usage_count": 150,
              "access_level": "premium"
            }
          ]
        }
      ]
    }
  ],
  "permission_summary": {
    "total_roles": 3,
    "total_permissions": 5,
    "total_access_rights": 12,
    "last_updated": "2024-01-15T10:30:00Z"
  }
}
```

### 3. Update Package Selection | به‌روزرسانی انتخاب پکیج

```http
PUT /api/customers/{customer_id}/packages/update
```

**Request Body:**
```json
{
  "action": "add", // or "remove", "modify"
  "packages": [
    {
      "package_id": 3,
      "categories": [4, 5],
      "units": [7, 8]
    }
  ]
}
```

---

## Business Logic Implementation | پیاده‌سازی منطق کسب و کار

### 1. Package Selection Rules | قوانین انتخاب پکیج

```typescript
class PackageSelectionRules {
  async validatePackageSelection(customerId: number, selections: PackageSelection[]): Promise<ValidationResult> {
    const errors: string[] = [];
    
    // Rule 1: Check if customer can afford the packages
    const totalCost = await this.calculateTotalCost(selections);
    const customerBudget = await this.getCustomerBudget(customerId);
    
    if (totalCost > customerBudget) {
      errors.push('Insufficient budget for selected packages');
    }
    
    // Rule 2: Check for conflicting package selections
    const conflicts = await this.checkPackageConflicts(selections);
    if (conflicts.length > 0) {
      errors.push(`Package conflicts detected: ${conflicts.join(', ')}`);
    }
    
    // Rule 3: Validate subscription dates
    const dateValidation = await this.validateSubscriptionDates(selections);
    if (!dateValidation.valid) {
      errors.push(dateValidation.error);
    }
    
    return {
      valid: errors.length === 0,
      errors
    };
  }
}
```

### 2. Permission Update Rules | قوانین به‌روزرسانی مجوز

```typescript
class PermissionUpdateRules {
  async updateCustomerPermissions(customerId: number, packageUnits: PackageUnit[]): Promise<void> {
    // Step 1: Clear existing permissions
    await this.clearExistingPermissions(customerId);
    
    // Step 2: Create new permissions based on package units
    for (const unit of packageUnits) {
      await this.createPermissionsFromUnit(customerId, unit);
    }
    
    // Step 3: Update role permissions
    await this.updateRolePermissions(customerId);
    
    // Step 4: Update access rights
    await this.updateAccessRights(customerId, packageUnits);
    
    // Step 5: Log permission changes
    await this.logPermissionChanges(customerId, packageUnits);
  }
}
```

---

## Error Handling | مدیریت خطا

### Common Error Scenarios | سناریوهای خطای رایج

1. **Package Not Available** - Selected package is no longer active
2. **Insufficient Budget** - Customer doesn't have enough budget
3. **Package Conflicts** - Selected packages have conflicting features
4. **Invalid Dates** - Subscription dates are invalid
5. **Permission Update Failure** - Failed to update permissions

### Error Response Format | فرمت پاسخ خطا

```json
{
  "success": false,
  "error": {
    "code": "PACKAGE_SELECTION_FAILED",
    "message": "Failed to select packages",
    "details": [
      {
        "field": "packages[0].package_id",
        "message": "Package not available"
      },
      {
        "field": "subscription_start_date",
        "message": "Invalid date format"
      }
    ]
  }
}
```

---

## Monitoring and Logging | نظارت و ثبت

### 1. Package Selection Logs | ثبت انتخاب پکیج

```sql
CREATE TABLE PackageSelectionLog (
    id INTEGER PRIMARY KEY AUTO_INCREMENT,
    customer_id INTEGER NOT NULL,
    action ENUM('select', 'update', 'cancel') NOT NULL,
    package_data JSON,
    old_selection JSON,
    new_selection JSON,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (customer_id) REFERENCES ChadcoCustomer(id)
);
```

### 2. Permission Update Logs | ثبت به‌روزرسانی مجوز

```sql
CREATE TABLE PermissionUpdateLog (
    id INTEGER PRIMARY KEY AUTO_INCREMENT,
    customer_id INTEGER NOT NULL,
    update_type ENUM('role', 'permission', 'access') NOT NULL,
    old_data JSON,
    new_data JSON,
    package_units JSON,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (customer_id) REFERENCES ChadcoCustomer(id)
);
```

This comprehensive documentation covers the complete package selection process, from initial selection to permission updates, ensuring agencies can effectively manage their package subscriptions and access rights.

