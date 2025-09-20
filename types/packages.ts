// types/packages.ts
export interface PageFeature {
  featureId: number;
  code?: string;
  name?: string;
  description?: string | null;
  urlPattern?: string | string[];
  show?: boolean;
  enabled?: boolean;
}

export interface PageAccess {
  url: string;
  code: string;
  title: string;
  pageId: number;
  show: boolean;
  enabled: boolean;
  features?: PageFeature[];
}

export interface Unit {
  id: number;
  name: string;
  description?: string | null;
  accessesJson?: { pages?: PageAccess[] };
  unitType?: string | null;
  unitModel?: string | null;
  enabledDurationInDays?: number;
  showDurationInDays?: number;
  countUnit?: number;
  price?: number;
  packageUnitLabel?: { id: number; name: string } | null;
  // createdAt, updatedAt...
}

export interface UnitLabel {
  label: { id: number; name: string };
  units: Unit[];
}

export interface PackageCategory {
  id: number;
  name: string;
  description?: string | null;
  deletedAt: string,
  currencyId: number,
  price: number,
  currency: string,
  units: UnitLabel[];
}

export interface PackageItem {
  id: number;
  title: string;
  description?: string | null;
  price?: number;
  packageCategories: PackageCategory[];
}

export interface ComparisonFeature {
  id: number; // label.id
  name: string;
}

export interface ComparisonCategory {
  id: number;
  name: string;
  features: ComparisonFeature[];
}

export interface ComparisonData {
  packages: Package[];
  categories: ComparisonCategory[];
}




export interface Package {
  id: number;
  title: string;
  description?: string | null;
  price?: number;

  createdAt: string,
  updatedAt: string,
  deletedAt: string,
  currencyId: number,
  currency: {
    id: number,
    name: string,
    description: string
  }
  packageCategories: {
    id: number;
    name: string;
    description?: string | null;

    units: {
      label: {
        id: number;
        name: string;
      };
      units: {
        id: number;
        name: string;
        description?: string | null;
        accessesJson?: {
          pages?: {
            url: string;
            code: string;
            title: string;
            pageId: number;
            show: boolean;
            enabled: boolean;
            features?: {
              featureId: number;
              code?: string;
              name?: string;
              description?: string | null;
              urlPattern?: string | string[];
              show?: boolean;
              enabled?: boolean;
            }[];
          }[];
        };
        unitType?: string | null;
        unitModel?: "perCount" | "perDuration"
        | "flat"
        enabledDurationInDays?: number;
        showDurationInDays?: number;
        countUnit?: number;
        price?: number;
        currencyId?: number;
        packageUnitLabel?: { id: number; name: string } | null;
      }[];
    }[];
  }[];
}


export interface PackageCardProp {
  data: Package;
  chadcoCustomerId?: number;
  onPackageSelect?: (packageId: number, result?: any) => void;
}