// types/packages.ts
import { ApiResponse } from './api';

// Feature Types
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

export interface AccessesJson {
  pages?: PageAccess[];
  usageCount?: number;
}

// Currency Types
export interface Currency {
  id: number;
  name: string;
  description: string;
}

// Unit Label Types
export interface UnitLabel {
  id: number;
  name: string;
}

// Unit Types
export interface Unit {
  code?: string;
  id: number;
  name: string;
  description?: string | null;
  accessesJson?: AccessesJson;
  unitType?: string | null;
  unitModel?: "perCount" | "perDuration" | "flat" | null;
  enabledDurationInDays?: number;
  showDurationInDays?: number;
  countUnit?: number;
  price?: number;
  createdAt: string;
  updatedAt: string;
  deletedAt?: string | null;
  currencyId?: number;
  packageUnitLabelId?: number | null;
  currency?: Currency;
  packageUnitLabel?: UnitLabel | null;
}

// Package Category Types
export interface PackageCategory {
  id: number;
  name: string;
  description?: string | null;
  createdAt: string;
  updatedAt: string;
  deletedAt?: string | null;
  currencyId?: number | null;
  price?: number;
  currency?: Currency | null;
  units?: Unit[];
}

// Package Types
export interface Package {
  id: number;
  title: string;
  description?: string | null;
  price?: number;
  createdAt: string;
  updatedAt: string;
  deletedAt?: string | null;
  currencyId?: number;
  packageCategories?: PackageCategory[];
  currency?: Currency;
}

// Labels Types
export interface Label {
  id: number;
  name: string;
  description?: string;
  createdAt: string;
  updatedAt: string;
  deletedAt?: string | null;
}

// Packages API Response Data
export interface PackagesResponseData {
  packages: Package[];
  labels: Label[];
}

// Complete API Response Type
export type PackagesApiResponse = ApiResponse<PackagesResponseData>;

// Legacy Types (for backward compatibility)
export interface PackageItem {
  id: number;
  title: string;
  description?: string | null;
  price?: number;
  packageCategories: PackageCategory[];
}

// Unit Identity Types - for units that are the same across packages
export interface UnitIdentity {
  label: UnitLabel | null; // Units with same label are considered the same unit
  name: string; // Unit name for display
  description?: string | null;
}

export interface UnitVariant {
  unitId: number; // Original unit ID from database
  packageId: number;
  packageTitle: string;
  unitType?: string | null;
  unitModel?: "perCount" | "perDuration" | "flat" | null;
  enabledDurationInDays?: number;
  showDurationInDays?: number;
  countUnit?: number;
  price?: number;
  currency?: Currency;
}

export interface UnitComparison {
  identity: UnitIdentity;
  variants: UnitVariant[]; // Different values across packages
}

export interface PackageComparisonData {
  packages: Package[];
  labels: Label[];
  unitComparisons: UnitComparison[]; // Units grouped by their identity (label)
  categories: PackageCategory[]; // All unique categories
}

// Legacy Comparison Types (for backward compatibility)
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

// Component Props Types
export interface PackageCardProp {
  data: Package;
  chadcoCustomerId?: number;
  onPackageSelect?: (packageId: number, result?: any) => void;
  isMobile?: boolean;
}