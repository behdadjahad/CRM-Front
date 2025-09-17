-- CRM Database Schema
-- Generated from ERD analysis

-- Core Customer Table
CREATE TABLE ChadcoCustomer (
    id INTEGER PRIMARY KEY AUTO_INCREMENT,
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    phone VARCHAR(50),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    deleted_at TIMESTAMP NULL
);

-- Package System Tables
CREATE TABLE Package (
    id INTEGER PRIMARY KEY AUTO_INCREMENT,
    title VARCHAR(255) NOT NULL,
    description TEXT,
    price DECIMAL(10,2) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    deleted_at TIMESTAMP NULL
);

CREATE TABLE PackageCategory (
    id INTEGER PRIMARY KEY AUTO_INCREMENT,
    package_id INTEGER NOT NULL,
    title VARCHAR(255) NOT NULL,
    description TEXT,
    price DECIMAL(10,2) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    deleted_at TIMESTAMP NULL,
    FOREIGN KEY (package_id) REFERENCES Package(id) ON DELETE CASCADE
);

CREATE TABLE PackageUnitLabel (
    id INTEGER PRIMARY KEY AUTO_INCREMENT,
    label VARCHAR(255) NOT NULL,
    description TEXT,
    code VARCHAR(50) UNIQUE NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE PackageUnit (
    id INTEGER PRIMARY KEY AUTO_INCREMENT,
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
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    deleted_at TIMESTAMP NULL,
    FOREIGN KEY (package_unit_label_id) REFERENCES PackageUnitLabel(id) ON DELETE SET NULL
);

-- Customer-Package Associations
CREATE TABLE ChadcoCustomerPackage (
    id INTEGER PRIMARY KEY AUTO_INCREMENT,
    chadco_customer_id INTEGER NOT NULL,
    package_id INTEGER NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    deleted_at TIMESTAMP NULL,
    FOREIGN KEY (chadco_customer_id) REFERENCES ChadcoCustomer(id) ON DELETE CASCADE,
    FOREIGN KEY (package_id) REFERENCES Package(id) ON DELETE CASCADE,
    UNIQUE KEY unique_customer_package (chadco_customer_id, package_id)
);

CREATE TABLE ChadcoCustomerPackageCategory (
    id INTEGER PRIMARY KEY AUTO_INCREMENT,
    chadco_customer_id INTEGER NOT NULL,
    package_category_id INTEGER NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    deleted_at TIMESTAMP NULL,
    FOREIGN KEY (chadco_customer_id) REFERENCES ChadcoCustomer(id) ON DELETE CASCADE,
    FOREIGN KEY (package_category_id) REFERENCES PackageCategory(id) ON DELETE CASCADE,
    UNIQUE KEY unique_customer_category (chadco_customer_id, package_category_id)
);

CREATE TABLE ChadcoCustomerPackageUnit (
    id INTEGER PRIMARY KEY AUTO_INCREMENT,
    chadco_customer_id INTEGER NOT NULL,
    package_unit_id INTEGER NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    deleted_at TIMESTAMP NULL,
    FOREIGN KEY (chadco_customer_id) REFERENCES ChadcoCustomer(id) ON DELETE CASCADE,
    FOREIGN KEY (package_unit_id) REFERENCES PackageUnit(id) ON DELETE CASCADE,
    UNIQUE KEY unique_customer_unit (chadco_customer_id, package_unit_id)
);

-- Snapshot Tables for Historical Data
CREATE TABLE PackageUnitSnapshot (
    id INTEGER PRIMARY KEY AUTO_INCREMENT,
    chadco_customer_id INTEGER NOT NULL,
    title VARCHAR(255) NOT NULL,
    description TEXT,
    accesses_json JSON,
    unit_type ENUM('rent', 'sale') NOT NULL,
    unit_model ENUM('perDuration', 'perCount', 'flat') NOT NULL,
    enabled_duration_in_days INTEGER,
    show_duration_in_days INTEGER,
    count_unit INTEGER,
    price DECIMAL(10,2) NOT NULL,
    snapshot_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (chadco_customer_id) REFERENCES ChadcoCustomer(id) ON DELETE CASCADE
);

-- User and Permission System
CREATE TABLE User (
    id INTEGER PRIMARY KEY AUTO_INCREMENT,
    username VARCHAR(255) UNIQUE NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    deleted_at TIMESTAMP NULL
);

CREATE TABLE Role (
    id INTEGER PRIMARY KEY AUTO_INCREMENT,
    chadco_customer_id INTEGER NOT NULL,
    name VARCHAR(255) NOT NULL,
    description TEXT,
    inherited_roles JSON,
    accesses_json JSON,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (chadco_customer_id) REFERENCES ChadcoCustomer(id) ON DELETE CASCADE,
    UNIQUE KEY unique_customer_role (chadco_customer_id, name)
);

CREATE TABLE Permission (
    id INTEGER PRIMARY KEY AUTO_INCREMENT,
    name VARCHAR(255) NOT NULL,
    description TEXT,
    resource VARCHAR(255) NOT NULL,
    action VARCHAR(255) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE KEY unique_permission (resource, action)
);

CREATE TABLE ChadcoCustomerPermission (
    id INTEGER PRIMARY KEY AUTO_INCREMENT,
    chadco_customer_id INTEGER NOT NULL,
    user_id INTEGER NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (chadco_customer_id) REFERENCES ChadcoCustomer(id) ON DELETE CASCADE,
    FOREIGN KEY (user_id) REFERENCES User(id) ON DELETE CASCADE,
    UNIQUE KEY unique_customer_user (chadco_customer_id, user_id)
);

-- Access Control Tables
CREATE TABLE Page (
    id INTEGER PRIMARY KEY AUTO_INCREMENT,
    name VARCHAR(255) NOT NULL,
    path VARCHAR(500) NOT NULL,
    description TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE PageFeatures (
    id INTEGER PRIMARY KEY AUTO_INCREMENT,
    page_id INTEGER NOT NULL,
    name VARCHAR(255) NOT NULL,
    description TEXT,
    feature_type ENUM('read', 'write', 'delete', 'admin') NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (page_id) REFERENCES Page(id) ON DELETE CASCADE
);

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
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (chadco_customer_id) REFERENCES ChadcoCustomer(id) ON DELETE CASCADE,
    FOREIGN KEY (package_unit_id) REFERENCES PackageUnit(id) ON DELETE CASCADE,
    FOREIGN KEY (page_id) REFERENCES Page(id) ON DELETE CASCADE,
    FOREIGN KEY (page_feature_id) REFERENCES PageFeatures(id) ON DELETE CASCADE
);

CREATE TABLE ChadcoCustomerAccessLog (
    id INTEGER PRIMARY KEY AUTO_INCREMENT,
    chadco_customer_id INTEGER NOT NULL,
    unit_id INTEGER NOT NULL,
    page_id INTEGER NOT NULL,
    page_feature_id INTEGER NOT NULL,
    unit_cost_model VARCHAR(255),
    submit_date TIMESTAMP NOT NULL,
    entity_id INTEGER,
    action VARCHAR(255) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (chadco_customer_id) REFERENCES ChadcoCustomer(id) ON DELETE CASCADE,
    FOREIGN KEY (unit_id) REFERENCES PackageUnit(id) ON DELETE CASCADE,
    FOREIGN KEY (page_id) REFERENCES Page(id) ON DELETE CASCADE,
    FOREIGN KEY (page_feature_id) REFERENCES PageFeatures(id) ON DELETE CASCADE
);

-- Invoice System
CREATE TABLE ChadcoInvoice (
    id INTEGER PRIMARY KEY AUTO_INCREMENT,
    customer_id INTEGER NOT NULL,
    invoice_number VARCHAR(100) UNIQUE NOT NULL,
    total_amount DECIMAL(10,2) NOT NULL,
    status ENUM('draft', 'sent', 'paid', 'cancelled') NOT NULL DEFAULT 'draft',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    due_date DATE,
    paid_at TIMESTAMP NULL,
    FOREIGN KEY (customer_id) REFERENCES ChadcoCustomer(id) ON DELETE CASCADE
);

-- Indexes for Performance
CREATE INDEX idx_customer_package_customer ON ChadcoCustomerPackage(chadco_customer_id);
CREATE INDEX idx_customer_package_package ON ChadcoCustomerPackage(package_id);
CREATE INDEX idx_customer_access_customer ON ChadcoCustomerAccess(chadco_customer_id);
CREATE INDEX idx_customer_access_log_customer ON ChadcoCustomerAccessLog(chadco_customer_id);
CREATE INDEX idx_customer_access_log_date ON ChadcoCustomerAccessLog(submit_date);
CREATE INDEX idx_package_category_package ON PackageCategory(package_id);
CREATE INDEX idx_package_unit_label ON PackageUnit(package_unit_label_id);
CREATE INDEX idx_role_customer ON Role(chadco_customer_id);
CREATE INDEX idx_customer_permission_customer ON ChadcoCustomerPermission(chadco_customer_id);
CREATE INDEX idx_customer_permission_user ON ChadcoCustomerPermission(user_id);
