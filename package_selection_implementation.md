# Package Selection Implementation Guide
## راهنمای پیاده‌سازی انتخاب پکیج

### Backend Implementation | پیاده‌سازی بک‌اند

#### 1. Package Selection Service
```typescript
// services/PackageSelectionService.ts
import { DatabaseConnection } from '../database/connection';
import { PackagePermissionResolver } from './PackagePermissionResolver';

interface PackageSelection {
  package_id: number;
  categories?: number[];
  units?: number[];
}

interface PackageSelectionRequest {
  customer_id: number;
  packages: PackageSelection[];
  subscription_start_date: string;
  subscription_end_date?: string;
}

interface PackageSelectionResult {
  success: boolean;
  message: string;
  selected_packages: {
    packages: any[];
    categories: any[];
    units: any[];
  };
  updated_permissions: {
    roles_updated: number;
    permissions_updated: number;
    access_rights_created: number;
  };
}

export class PackageSelectionService {
  private db: DatabaseConnection;
  private permissionResolver: PackagePermissionResolver;

  constructor(db: DatabaseConnection) {
    this.db = db;
    this.permissionResolver = new PackagePermissionResolver(db);
  }

  async selectPackages(request: PackageSelectionRequest): Promise<PackageSelectionResult> {
    const { customer_id, packages, subscription_start_date, subscription_end_date } = request;

    try {
      // Step 1: Validate package selection
      await this.validatePackageSelection(customer_id, packages);

      // Step 2: Begin transaction
      await this.db.beginTransaction();

      // Step 3: Select packages
      const selectedPackages = await this.selectCustomerPackages(customer_id, packages, subscription_start_date, subscription_end_date);

      // Step 4: Resolve and update permissions
      const permissionUpdates = await this.permissionResolver.resolveCustomerPermissions(customer_id);

      // Step 5: Commit transaction
      await this.db.commit();

      // Step 6: Log selection
      await this.logPackageSelection(customer_id, packages, selectedPackages);

      return {
        success: true,
        message: 'Packages selected successfully',
        selected_packages: selectedPackages,
        updated_permissions: permissionUpdates
      };

    } catch (error) {
      await this.db.rollback();
      throw new Error(`Package selection failed: ${error.message}`);
    }
  }

  private async validatePackageSelection(customer_id: number, packages: PackageSelection[]): Promise<void> {
    // Check if customer exists
    const customer = await this.db.query('SELECT id FROM ChadcoCustomer WHERE id = ?', [customer_id]);
    if (!customer.length) {
      throw new Error('Customer not found');
    }

    // Check if packages are available
    for (const pkg of packages) {
      const packageExists = await this.db.query(
        'SELECT id FROM Package WHERE id = ? AND is_active = TRUE',
        [pkg.package_id]
      );
      if (!packageExists.length) {
        throw new Error(`Package ${pkg.package_id} not available`);
      }

      // Check categories if specified
      if (pkg.categories && pkg.categories.length > 0) {
        for (const categoryId of pkg.categories) {
          const categoryExists = await this.db.query(
            'SELECT id FROM PackageCategory WHERE id = ? AND package_id = ? AND is_active = TRUE',
            [categoryId, pkg.package_id]
          );
          if (!categoryExists.length) {
            throw new Error(`Category ${categoryId} not available for package ${pkg.package_id}`);
          }
        }
      }

      // Check units if specified
      if (pkg.units && pkg.units.length > 0) {
        for (const unitId of pkg.units) {
          const unitExists = await this.db.query(
            'SELECT id FROM PackageUnit WHERE id = ? AND is_active = TRUE',
            [unitId]
          );
          if (!unitExists.length) {
            throw new Error(`Unit ${unitId} not available`);
          }
        }
      }
    }
  }

  private async selectCustomerPackages(
    customer_id: number,
    packages: PackageSelection[],
    start_date: string,
    end_date?: string
  ) {
    const selectedPackages = {
      packages: [],
      categories: [],
      units: []
    };

    for (const pkg of packages) {
      // Select package
      const packageResult = await this.db.query(
        `INSERT INTO ChadcoCustomerPackage 
         (chadco_customer_id, package_id, subscription_start_date, subscription_end_date, status)
         VALUES (?, ?, ?, ?, 'active')
         ON DUPLICATE KEY UPDATE 
         subscription_start_date = VALUES(subscription_start_date),
         subscription_end_date = VALUES(subscription_end_date),
         status = 'active',
         updated_at = CURRENT_TIMESTAMP`,
        [customer_id, pkg.package_id, start_date, end_date]
      );

      selectedPackages.packages.push({
        id: packageResult.insertId,
        chadco_customer_id: customer_id,
        package_id: pkg.package_id,
        subscription_start_date: start_date,
        subscription_end_date: end_date,
        status: 'active'
      });

      // Select categories if specified
      if (pkg.categories && pkg.categories.length > 0) {
        for (const categoryId of pkg.categories) {
          const categoryResult = await this.db.query(
            `INSERT INTO ChadcoCustomerPackageCategory 
             (chadco_customer_id, package_category_id, subscription_start_date, subscription_end_date, status)
             VALUES (?, ?, ?, ?, 'active')
             ON DUPLICATE KEY UPDATE 
             subscription_start_date = VALUES(subscription_start_date),
             subscription_end_date = VALUES(subscription_end_date),
             status = 'active',
             updated_at = CURRENT_TIMESTAMP`,
            [customer_id, categoryId, start_date, end_date]
          );

          selectedPackages.categories.push({
            id: categoryResult.insertId,
            chadco_customer_id: customer_id,
            package_category_id: categoryId,
            subscription_start_date: start_date,
            subscription_end_date: end_date,
            status: 'active'
          });
        }
      }

      // Select units if specified
      if (pkg.units && pkg.units.length > 0) {
        for (const unitId of pkg.units) {
          // Get default cost for the unit
          const defaultCost = await this.db.query(
            'SELECT id FROM PackageUnitCost WHERE package_unit_id = ? AND is_active = TRUE LIMIT 1',
            [unitId]
          );

          if (!defaultCost.length) {
            throw new Error(`No active cost found for unit ${unitId}`);
          }

          const unitResult = await this.db.query(
            `INSERT INTO ChadcoCustomerPackageUnit 
             (chadco_customer_id, package_unit_id, package_unit_cost_id, subscription_start_date, subscription_end_date, status)
             VALUES (?, ?, ?, ?, ?, 'active')
             ON DUPLICATE KEY UPDATE 
             subscription_start_date = VALUES(subscription_start_date),
             subscription_end_date = VALUES(subscription_end_date),
             status = 'active',
             updated_at = CURRENT_TIMESTAMP`,
            [customer_id, unitId, defaultCost[0].id, start_date, end_date]
          );

          selectedPackages.units.push({
            id: unitResult.insertId,
            chadco_customer_id: customer_id,
            package_unit_id: unitId,
            package_unit_cost_id: defaultCost[0].id,
            subscription_start_date: start_date,
            subscription_end_date: end_date,
            status: 'active'
          });
        }
      }
    }

    return selectedPackages;
  }

  private async logPackageSelection(customer_id: number, packages: PackageSelection[], result: any) {
    await this.db.query(
      `INSERT INTO PackageSelectionLog 
       (customer_id, action, package_data, new_selection)
       VALUES (?, 'select', ?, ?)`,
      [customer_id, JSON.stringify(packages), JSON.stringify(result)]
    );
  }
}
```

#### 2. Package Permission Resolver
```typescript
// services/PackagePermissionResolver.ts
export class PackagePermissionResolver {
  private db: DatabaseConnection;

  constructor(db: DatabaseConnection) {
    this.db = db;
  }

  async resolveCustomerPermissions(customerId: number): Promise<any> {
    // Step 1: Get all active package selections
    const activeSelections = await this.getActivePackageSelections(customerId);

    // Step 2: Extract package units and their access definitions
    const packageUnits = await this.getPackageUnitsFromSelections(activeSelections);

    // Step 3: Resolve access permissions
    const accessPermissions = await this.resolveAccessPermissions(packageUnits);

    // Step 4: Update role permissions
    const rolesUpdated = await this.updateRolePermissions(customerId, accessPermissions);

    // Step 5: Update customer permissions
    const permissionsUpdated = await this.updateCustomerPermissions(customerId, accessPermissions);

    // Step 6: Update customer access rights
    const accessRightsCreated = await this.updateCustomerAccess(customerId, packageUnits);

    return {
      roles_updated: rolesUpdated,
      permissions_updated: permissionsUpdated,
      access_rights_created: accessRightsCreated
    };
  }

  private async getActivePackageSelections(customerId: number) {
    const query = `
      SELECT DISTINCT
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

  private async getPackageUnitsFromSelections(selections: any[]) {
    const unitIds = selections
      .filter(s => s.package_unit_id)
      .map(s => s.package_unit_id);

    if (unitIds.length === 0) return [];

    const query = `
      SELECT pu.*, puc.access_level, puc.features_json, puc.restrictions_json
      FROM PackageUnit pu
      JOIN PackageUnitCost puc ON pu.id = puc.package_unit_id
      WHERE pu.id IN (${unitIds.map(() => '?').join(',')})
        AND pu.is_active = TRUE
        AND puc.is_active = TRUE
    `;
    return await this.db.query(query, unitIds);
  }

  private async resolveAccessPermissions(packageUnits: any[]) {
    const accessPermissions = [];

    for (const unit of packageUnits) {
      if (unit.accesses_json) {
        const accesses = JSON.parse(unit.accesses_json);
        for (const [page, permissions] of Object.entries(accesses)) {
          accessPermissions.push({
            page,
            permissions: permissions,
            package_unit_id: unit.id,
            access_level: unit.access_level
          });
        }
      }
    }

    return accessPermissions;
  }

  private async updateRolePermissions(customerId: number, accessPermissions: any[]): Promise<number> {
    // Get customer's roles
    const roles = await this.db.query(
      'SELECT * FROM Role WHERE chadco_customer_id = ?',
      [customerId]
    );

    let updatedCount = 0;

    for (const role of roles) {
      // Merge access permissions into role's access JSON
      const mergedPermissions = await this.mergePermissionsIntoRole(role, accessPermissions);

      // Update role's access JSON
      await this.db.query(
        'UPDATE Role SET accesses_json = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?',
        [JSON.stringify(mergedPermissions), role.id]
      );

      updatedCount++;
    }

    return updatedCount;
  }

  private async mergePermissionsIntoRole(role: any, accessPermissions: any[]) {
    let rolePermissions = {};
    
    if (role.accesses_json) {
      rolePermissions = JSON.parse(role.accesses_json);
    }

    // Merge access permissions
    for (const access of accessPermissions) {
      if (!rolePermissions[access.page]) {
        rolePermissions[access.page] = {
          read: false,
          write: false,
          delete: false,
          admin: false
        };
      }

      // Merge permissions with priority to true values
      for (const [action, value] of Object.entries(access.permissions)) {
        if (value === true) {
          rolePermissions[access.page][action] = true;
        }
      }
    }

    return rolePermissions;
  }

  private async updateCustomerPermissions(customerId: number, accessPermissions: any[]): Promise<number> {
    // Clear existing customer permissions
    await this.db.query(
      'DELETE FROM ChadcoCustomerPermission WHERE chadco_customer_id = ?',
      [customerId]
    );

    // Get customer's users
    const users = await this.db.query(
      'SELECT u.* FROM User u JOIN ChadcoCustomerPermission ccp ON u.id = ccp.user_id WHERE ccp.chadco_customer_id = ?',
      [customerId]
    );

    let createdCount = 0;

    for (const user of users) {
      // Create permission record for each user
      await this.db.query(
        `INSERT INTO ChadcoCustomerPermission 
         (chadco_customer_id, user_id, access_type, access_json)
         VALUES (?, ?, 'custom', ?)`,
        [customerId, user.id, JSON.stringify(accessPermissions)]
      );
      createdCount++;
    }

    return createdCount;
  }

  private async updateCustomerAccess(customerId: number, packageUnits: any[]): Promise<number> {
    // Clear existing customer access
    await this.db.query(
      'DELETE FROM ChadcoCustomerAccess WHERE chadco_customer_id = ?',
      [customerId]
    );

    let createdCount = 0;

    for (const unit of packageUnits) {
      if (unit.accesses_json) {
        const accesses = JSON.parse(unit.accesses_json);
        
        for (const [page, permissions] of Object.entries(accesses)) {
          // Get page and feature IDs
          const pageData = await this.db.query(
            'SELECT id FROM Page WHERE name = ?',
            [page]
          );

          if (pageData.length > 0) {
            const pageId = pageData[0].id;

            // Create access record for each permission
            for (const [action, granted] of Object.entries(permissions)) {
              if (granted === true) {
                const featureData = await this.db.query(
                  'SELECT id FROM PageFeatures WHERE page_id = ? AND feature_type = ?',
                  [pageId, action]
                );

                if (featureData.length > 0) {
                  await this.db.query(
                    `INSERT INTO ChadcoCustomerAccess 
                     (chadco_customer_id, package_unit_id, page_id, page_feature_id, 
                      unit_model, enabled_date, show_date, access_level)
                     VALUES (?, ?, ?, ?, ?, NOW(), NOW(), ?)`,
                    [customerId, unit.id, pageId, featureData[0].id, unit.unit_model, unit.access_level]
                  );
                  createdCount++;
                }
              }
            }
          }
        }
      }
    }

    return createdCount;
  }
}
```

#### 3. API Controller
```typescript
// controllers/PackageSelectionController.ts
import { Request, Response } from 'express';
import { PackageSelectionService } from '../services/PackageSelectionService';

export class PackageSelectionController {
  private packageSelectionService: PackageSelectionService;

  constructor(packageSelectionService: PackageSelectionService) {
    this.packageSelectionService = packageSelectionService;
  }

  async selectPackages(req: Request, res: Response) {
    try {
      const { customer_id } = req.params;
      const selectionRequest = {
        customer_id: parseInt(customer_id),
        ...req.body
      };

      const result = await this.packageSelectionService.selectPackages(selectionRequest);

      res.json(result);
    } catch (error) {
      console.error('Package selection error:', error);
      res.status(400).json({
        success: false,
        error: {
          code: 'PACKAGE_SELECTION_FAILED',
          message: error.message
        }
      });
    }
  }

  async getCustomerPackages(req: Request, res: Response) {
    try {
      const { customer_id } = req.params;

      const packages = await this.packageSelectionService.getCustomerPackages(parseInt(customer_id));

      res.json({
        customer_id: parseInt(customer_id),
        packages
      });
    } catch (error) {
      console.error('Get customer packages error:', error);
      res.status(500).json({
        error: 'Failed to get customer packages'
      });
    }
  }

  async updatePackageSelection(req: Request, res: Response) {
    try {
      const { customer_id } = req.params;
      const { action, packages } = req.body;

      const result = await this.packageSelectionService.updatePackageSelection(
        parseInt(customer_id),
        action,
        packages
      );

      res.json(result);
    } catch (error) {
      console.error('Update package selection error:', error);
      res.status(400).json({
        success: false,
        error: {
          code: 'PACKAGE_UPDATE_FAILED',
          message: error.message
        }
      });
    }
  }
}
```

### Frontend Implementation | پیاده‌سازی فرانت‌اند

#### 1. Package Selection Component
```typescript
// components/PackageSelection.tsx
import React, { useState, useEffect } from 'react';
import { PackageSelectionService } from '../services/PackageSelectionService';

interface Package {
  id: number;
  title: string;
  description: string;
  price: number;
  categories: PackageCategory[];
}

interface PackageCategory {
  id: number;
  title: string;
  description: string;
  price: number;
  units: PackageUnit[];
}

interface PackageUnit {
  id: number;
  title: string;
  description: string;
  price: number;
  unit_type: 'rent' | 'sale';
  unit_model: 'perDuration' | 'perCount' | 'flat';
}

interface PackageSelection {
  package_id: number;
  categories: number[];
  units: number[];
}

export const PackageSelection: React.FC = () => {
  const [packages, setPackages] = useState<Package[]>([]);
  const [selectedPackages, setSelectedPackages] = useState<PackageSelection[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    loadPackages();
  }, []);

  const loadPackages = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/packages');
      const data = await response.json();
      setPackages(data.packages);
    } catch (err) {
      setError('Failed to load packages');
    } finally {
      setLoading(false);
    }
  };

  const handlePackageSelect = (packageId: number, selected: boolean) => {
    if (selected) {
      setSelectedPackages(prev => [...prev, { package_id: packageId, categories: [], units: [] }]);
    } else {
      setSelectedPackages(prev => prev.filter(p => p.package_id !== packageId));
    }
  };

  const handleCategorySelect = (packageId: number, categoryId: number, selected: boolean) => {
    setSelectedPackages(prev => 
      prev.map(p => 
        p.package_id === packageId
          ? {
              ...p,
              categories: selected
                ? [...p.categories, categoryId]
                : p.categories.filter(id => id !== categoryId)
            }
          : p
      )
    );
  };

  const handleUnitSelect = (packageId: number, unitId: number, selected: boolean) => {
    setSelectedPackages(prev => 
      prev.map(p => 
        p.package_id === packageId
          ? {
              ...p,
              units: selected
                ? [...p.units, unitId]
                : p.units.filter(id => id !== unitId)
            }
          : p
      )
    );
  };

  const handleSubmit = async () => {
    try {
      setLoading(true);
      setError(null);

      const response = await fetch('/api/customers/123/packages/select', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          packages: selectedPackages,
          subscription_start_date: new Date().toISOString(),
          subscription_end_date: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000).toISOString()
        })
      });

      const result = await response.json();

      if (result.success) {
        alert('Packages selected successfully!');
        setSelectedPackages([]);
      } else {
        setError(result.error.message);
      }
    } catch (err) {
      setError('Failed to select packages');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <div>Loading packages...</div>;
  }

  return (
    <div className="package-selection">
      <h2>Select Packages</h2>
      
      {error && <div className="error">{error}</div>}

      <div className="packages-list">
        {packages.map(pkg => (
          <div key={pkg.id} className="package-card">
            <div className="package-header">
              <h3>{pkg.title}</h3>
              <p>{pkg.description}</p>
              <p className="price">${pkg.price}</p>
              <label>
                <input
                  type="checkbox"
                  checked={selectedPackages.some(p => p.package_id === pkg.id)}
                  onChange={(e) => handlePackageSelect(pkg.id, e.target.checked)}
                />
                Select Package
              </label>
            </div>

            {selectedPackages.some(p => p.package_id === pkg.id) && (
              <div className="package-details">
                <h4>Categories</h4>
                {pkg.categories.map(category => (
                  <div key={category.id} className="category-item">
                    <label>
                      <input
                        type="checkbox"
                        checked={selectedPackages
                          .find(p => p.package_id === pkg.id)
                          ?.categories.includes(category.id) || false
                        }
                        onChange={(e) => handleCategorySelect(pkg.id, category.id, e.target.checked)}
                      />
                      {category.title} - ${category.price}
                    </label>
                  </div>
                ))}

                <h4>Units</h4>
                {pkg.categories.map(category => 
                  category.units.map(unit => (
                    <div key={unit.id} className="unit-item">
                      <label>
                        <input
                          type="checkbox"
                          checked={selectedPackages
                            .find(p => p.package_id === pkg.id)
                            ?.units.includes(unit.id) || false
                          }
                          onChange={(e) => handleUnitSelect(pkg.id, unit.id, e.target.checked)}
                        />
                        {unit.title} - ${unit.price} ({unit.unit_type})
                      </label>
                    </div>
                  ))
                )}
              </div>
            )}
          </div>
        ))}
      </div>

      <div className="selection-summary">
        <h3>Selected Packages</h3>
        <p>Total Packages: {selectedPackages.length}</p>
        <p>Total Categories: {selectedPackages.reduce((sum, p) => sum + p.categories.length, 0)}</p>
        <p>Total Units: {selectedPackages.reduce((sum, p) => sum + p.units.length, 0)}</p>
      </div>

      <button 
        onClick={handleSubmit} 
        disabled={loading || selectedPackages.length === 0}
        className="submit-button"
      >
        {loading ? 'Selecting...' : 'Select Packages'}
      </button>
    </div>
  );
};
```

#### 2. Package Status Component
```typescript
// components/PackageStatus.tsx
import React, { useState, useEffect } from 'react';

interface CustomerPackage {
  package_id: number;
  package_name: string;
  status: string;
  subscription_start_date: string;
  subscription_end_date: string;
  categories: CustomerPackageCategory[];
}

interface CustomerPackageCategory {
  category_id: number;
  category_name: string;
  status: string;
  units: CustomerPackageUnit[];
}

interface CustomerPackageUnit {
  unit_id: number;
  unit_name: string;
  status: string;
  usage_count: number;
  access_level: string;
}

export const PackageStatus: React.FC = () => {
  const [packages, setPackages] = useState<CustomerPackage[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    loadCustomerPackages();
  }, []);

  const loadCustomerPackages = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/customers/123/packages/status');
      const data = await response.json();
      setPackages(data.active_packages);
    } catch (err) {
      setError('Failed to load package status');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <div>Loading package status...</div>;
  }

  if (error) {
    return <div className="error">{error}</div>;
  }

  return (
    <div className="package-status">
      <h2>Package Status</h2>
      
      {packages.length === 0 ? (
        <p>No packages selected</p>
      ) : (
        <div className="packages-list">
          {packages.map(pkg => (
            <div key={pkg.package_id} className="package-card">
              <div className="package-header">
                <h3>{pkg.package_name}</h3>
                <span className={`status ${pkg.status}`}>{pkg.status}</span>
                <p>Start: {new Date(pkg.subscription_start_date).toLocaleDateString()}</p>
                <p>End: {new Date(pkg.subscription_end_date).toLocaleDateString()}</p>
              </div>

              <div className="categories">
                <h4>Categories</h4>
                {pkg.categories.map(category => (
                  <div key={category.category_id} className="category-item">
                    <h5>{category.category_name}</h5>
                    <span className={`status ${category.status}`}>{category.status}</span>
                    
                    <div className="units">
                      <h6>Units</h6>
                      {category.units.map(unit => (
                        <div key={unit.unit_id} className="unit-item">
                          <span>{unit.unit_name}</span>
                          <span className={`status ${unit.status}`}>{unit.status}</span>
                          <span className="usage">Usage: {unit.usage_count}</span>
                          <span className="access-level">{unit.access_level}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
```

### Database Migration Scripts | اسکریپت‌های مهاجرت پایگاه داده

#### 1. Create Package Selection Tables
```sql
-- Create package selection tables
CREATE TABLE IF NOT EXISTS ChadcoCustomerPackage (
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

CREATE TABLE IF NOT EXISTS ChadcoCustomerPackageCategory (
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

CREATE TABLE IF NOT EXISTS ChadcoCustomerPackageUnit (
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

#### 2. Create Logging Tables
```sql
-- Create logging tables
CREATE TABLE IF NOT EXISTS PackageSelectionLog (
    id INTEGER PRIMARY KEY AUTO_INCREMENT,
    customer_id INTEGER NOT NULL,
    action ENUM('select', 'update', 'cancel') NOT NULL,
    package_data JSON,
    old_selection JSON,
    new_selection JSON,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (customer_id) REFERENCES ChadcoCustomer(id)
);

CREATE TABLE IF NOT EXISTS PermissionUpdateLog (
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

This comprehensive implementation provides a complete package selection system that handles the entire process from package selection to permission updates, ensuring agencies can effectively manage their package subscriptions and access rights.

