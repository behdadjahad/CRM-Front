# Package Structure Documentation
## مستندات ساختار پکیج‌ها

### Overview | نمای کلی

The package system is designed as a hierarchical structure where agencies can purchase different levels of access. Each package consists of three main components:

سیستم پکیج به صورت سلسله مراتبی طراحی شده است که آژانس‌ها می‌توانند سطوح مختلف دسترسی را خریداری کنند. هر پکیج شامل سه بخش اصلی است:

1. **Package** - Top level package definition
2. **PackageCategory** - Mid-level categories within packages
3. **PackageUnit** - Lowest level units that define access levels

---

## Hierarchical Structure | ساختار سلسله مراتبی

### 1. Package (پکیج)
The highest level in the package hierarchy. Each package represents a complete service offering.

بالاترین سطح در سلسله مراتب پکیج. هر پکیج نمایانگر یک پیشنهاد خدمات کامل است.

**Database Table: `Package`**
```sql
CREATE TABLE Package (
    id INTEGER PRIMARY KEY AUTO_INCREMENT,
    title VARCHAR(255) NOT NULL,
    description TEXT,
    price DECIMAL(10,2) NOT NULL,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    deleted_at TIMESTAMP NULL
);
```

**Example Package:**
```json
{
  "id": 1,
  "title": "Basic CRM Package",
  "description": "Essential CRM features for small businesses",
  "price": 99.99,
  "is_active": true
}
```

### 2. PackageCategory (دسته‌بندی پکیج)
Mid-level categories within packages. Each package can contain multiple categories.

دسته‌بندی‌های سطح میانی در پکیج‌ها. هر پکیج می‌تواند شامل چندین دسته‌بندی باشد.

**Database Table: `PackageCategory`**
```sql
CREATE TABLE PackageCategory (
    id INTEGER PRIMARY KEY AUTO_INCREMENT,
    package_id INTEGER NOT NULL,
    title VARCHAR(255) NOT NULL,
    description TEXT,
    price DECIMAL(10,2) NOT NULL,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    deleted_at TIMESTAMP NULL,
    FOREIGN KEY (package_id) REFERENCES Package(id) ON DELETE CASCADE
);
```

**Example PackageCategory:**
```json
{
  "id": 1,
  "package_id": 1,
  "title": "Customer Management",
  "description": "Tools for managing customer relationships",
  "price": 29.99,
  "is_active": true
}
```

### 3. PackageUnit (واحد پکیج)
The lowest level in the hierarchy. PackageUnits define the specific access levels for an organization.

پایین‌ترین سطح در سلسله مراتب. واحدهای پکیج سطوح دسترسی خاص یک سازمان را تعریف می‌کنند.

**Database Table: `PackageUnit`**
```sql
CREATE TABLE PackageUnit (
    id INTEGER PRIMARY KEY AUTO_INCREMENT,
    package_category_id INTEGER NOT NULL,
    title VARCHAR(255) NOT NULL,
    description TEXT,
    package_unit_label_id INTEGER,
    accesses_json JSON,
    unit_type ENUM('rent', 'sale') NOT NULL,
    unit_model ENUM('perDuration', 'perCount', 'flat') NOT NULL,
    enabled_duration_in_days INTEGER,
    show_duration_in_days INTEGER,
    count_unit INTEGER,
    price DECIMAL(10,2) NOT NULL,
    currency_id INTEGER,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    deleted_at TIMESTAMP NULL,
    FOREIGN KEY (package_category_id) REFERENCES PackageCategory(id) ON DELETE CASCADE,
    FOREIGN KEY (package_unit_label_id) REFERENCES PackageUnitLabel(id),
    FOREIGN KEY (currency_id) REFERENCES Currency(id)
);
```

**Example PackageUnit:**
```json
{
  "id": 1,
  "package_category_id": 1,
  "title": "Customer List View",
  "description": "View and search customer database",
  "accesses_json": {
    "customers": {
      "read": true,
      "write": false,
      "delete": false,
      "admin": false
    }
  },
  "unit_type": "rent",
  "unit_model": "perDuration",
  "enabled_duration_in_days": 30,
  "show_duration_in_days": 30,
  "count_unit": 1,
  "price": 9.99,
  "currency_id": 1
}
```

---

## PackageUnitCost System | سیستم هزینه واحد پکیج

The PackageUnitCost system determines what access rights each package has, what prices they have, and to what extent access is granted to each.

سیستم PackageUnitCost مشخص می‌کند که هر پکیج چه دسترسی‌هایی دارد، هر کدام از آنها چه قیمت‌هایی دارند و میزان دسترسی به هرکدام تا چه اندازه است.

### Database Table: `PackageUnitCost`
```sql
CREATE TABLE PackageUnitCost (
    id INTEGER PRIMARY KEY AUTO_INCREMENT,
    package_unit_id INTEGER NOT NULL,
    cost_model ENUM('perDuration', 'perCount', 'flat') NOT NULL,
    base_price DECIMAL(10,2) NOT NULL,
    duration_days INTEGER,
    count_limit INTEGER,
    access_level ENUM('basic', 'premium', 'enterprise') NOT NULL,
    features_json JSON,
    restrictions_json JSON,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (package_unit_id) REFERENCES PackageUnit(id) ON DELETE CASCADE
);
```

### Cost Model Types | انواع مدل هزینه

#### 1. Per Duration (بر اساس مدت زمان)
```json
{
  "cost_model": "perDuration",
  "base_price": 29.99,
  "duration_days": 30,
  "access_level": "premium",
  "features_json": {
    "max_customers": 1000,
    "max_users": 5,
    "features": ["advanced_reporting", "api_access"]
  }
}
```

#### 2. Per Count (بر اساس تعداد)
```json
{
  "cost_model": "perCount",
  "base_price": 0.50,
  "count_limit": 1000,
  "access_level": "basic",
  "features_json": {
    "max_customers": 100,
    "max_users": 2,
    "features": ["basic_reporting"]
  }
}
```

#### 3. Flat Rate (نرخ ثابت)
```json
{
  "cost_model": "flat",
  "base_price": 199.99,
  "access_level": "enterprise",
  "features_json": {
    "max_customers": -1,
    "max_users": -1,
    "features": ["all_features", "priority_support", "custom_integrations"]
  }
}
```

---

## Customer Package Associations | ارتباطات پکیج مشتری

### Database Tables for Customer Associations

#### 1. ChadcoCustomerPackage
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

#### 2. ChadcoCustomerPackageCategory
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

#### 3. ChadcoCustomerPackageUnit
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

---

## Package Structure Examples | نمونه‌های ساختار پکیج

### Example 1: Basic CRM Package
```json
{
  "package": {
    "id": 1,
    "title": "Basic CRM Package",
    "description": "Essential CRM features for small businesses",
    "price": 99.99
  },
  "categories": [
    {
      "id": 1,
      "title": "Customer Management",
      "description": "Tools for managing customer relationships",
      "price": 29.99,
      "units": [
        {
          "id": 1,
          "title": "Customer List View",
          "description": "View and search customer database",
          "price": 9.99,
          "unit_type": "rent",
          "unit_model": "perDuration",
          "costs": [
            {
              "cost_model": "perDuration",
              "base_price": 9.99,
              "duration_days": 30,
              "access_level": "basic"
            }
          ]
        },
        {
          "id": 2,
          "title": "Customer Contact Management",
          "description": "Manage customer contact information",
          "price": 19.99,
          "unit_type": "rent",
          "unit_model": "perDuration",
          "costs": [
            {
              "cost_model": "perDuration",
              "base_price": 19.99,
              "duration_days": 30,
              "access_level": "premium"
            }
          ]
        }
      ]
    },
    {
      "id": 2,
      "title": "Reporting",
      "description": "Business intelligence and reporting tools",
      "price": 49.99,
      "units": [
        {
          "id": 3,
          "title": "Basic Reports",
          "description": "Standard business reports",
          "price": 24.99,
          "unit_type": "rent",
          "unit_model": "perDuration",
          "costs": [
            {
              "cost_model": "perDuration",
              "base_price": 24.99,
              "duration_days": 30,
              "access_level": "basic"
            }
          ]
        }
      ]
    }
  ]
}
```

### Example 2: Enterprise Package
```json
{
  "package": {
    "id": 2,
    "title": "Enterprise CRM Package",
    "description": "Complete CRM solution for large organizations",
    "price": 999.99
  },
  "categories": [
    {
      "id": 3,
      "title": "Advanced Customer Management",
      "description": "Advanced customer relationship management",
      "price": 199.99,
      "units": [
        {
          "id": 4,
          "title": "Unlimited Customer Access",
          "description": "Unlimited customer database access",
          "price": 99.99,
          "unit_type": "sale",
          "unit_model": "flat",
          "costs": [
            {
              "cost_model": "flat",
              "base_price": 99.99,
              "access_level": "enterprise",
              "features_json": {
                "max_customers": -1,
                "max_users": -1,
                "features": ["unlimited_access", "priority_support"]
              }
            }
          ]
        }
      ]
    }
  ]
}
```

---

## Package Management API | API مدیریت پکیج

### 1. Get Package Structure
```http
GET /api/packages/{package_id}/structure
```

**Response:**
```json
{
  "package": {
    "id": 1,
    "title": "Basic CRM Package",
    "description": "Essential CRM features",
    "price": 99.99
  },
  "categories": [
    {
      "id": 1,
      "title": "Customer Management",
      "units": [
        {
          "id": 1,
          "title": "Customer List View",
          "costs": [
            {
              "id": 1,
              "cost_model": "perDuration",
              "base_price": 9.99,
              "duration_days": 30
            }
          ]
        }
      ]
    }
  ]
}
```

### 2. Get Customer Packages
```http
GET /api/customers/{customer_id}/packages
```

**Response:**
```json
{
  "packages": [
    {
      "id": 1,
      "title": "Basic CRM Package",
      "status": "active",
      "subscription_start_date": "2024-01-01T00:00:00Z",
      "subscription_end_date": "2024-12-31T23:59:59Z",
      "categories": [
        {
          "id": 1,
          "title": "Customer Management",
          "status": "active",
          "units": [
            {
              "id": 1,
              "title": "Customer List View",
              "status": "active",
              "usage_count": 150,
              "cost": {
                "cost_model": "perDuration",
                "base_price": 9.99,
                "duration_days": 30
              }
            }
          ]
        }
      ]
    }
  ]
}
```

### 3. Subscribe to Package
```http
POST /api/customers/{customer_id}/packages
```

**Request Body:**
```json
{
  "package_id": 1,
  "categories": [1, 2],
  "units": [1, 2, 3],
  "costs": [
    {
      "unit_id": 1,
      "cost_id": 1
    },
    {
      "unit_id": 2,
      "cost_id": 2
    }
  ],
  "subscription_start_date": "2024-01-01T00:00:00Z",
  "subscription_end_date": "2024-12-31T23:59:59Z"
}
```

---

## Business Logic | منطق کسب و کار

### 1. Package Subscription Rules
- A customer can subscribe to multiple packages
- A customer can subscribe to individual categories from different packages
- A customer can subscribe to individual units from different categories
- Subscription hierarchy: Package → Category → Unit

### 2. Access Control Rules
- PackageUnit defines the lowest level of access control
- Access is granted based on active subscriptions
- Expired subscriptions are automatically disabled
- Usage tracking is maintained for per-count models

### 3. Pricing Rules
- Package price is the base price for the entire package
- Category price is additional cost for specific functionality
- Unit price is the cost for specific access rights
- Cost models determine how pricing is calculated

---

## Implementation Considerations | ملاحظات پیاده‌سازی

### 1. Performance
- Index frequently queried fields
- Cache package structures
- Use pagination for large package lists

### 2. Security
- Validate package access before granting permissions
- Log all package subscription changes
- Implement proper authorization for package management

### 3. Scalability
- Design for multi-tenant architecture
- Consider package versioning
- Plan for package migration scenarios

This hierarchical package system provides flexibility for agencies to purchase exactly the access levels they need while maintaining clear pricing and access control structures.

