// types/packages-api.ts
import { ApiResponse } from './api';
import { Package, Label } from './packages';

// Packages API Response Data Structure
export interface PackagesApiData {
    packages: Package[];
    labels: Label[];
}

// Complete Packages API Response Type
export type PackagesApiResponse = ApiResponse<PackagesApiData>;

// Single Package API Response (if needed for individual package endpoints)
export type SinglePackageApiResponse = ApiResponse<Package>;

// Package Categories API Response (if needed for categories endpoint)
export type PackageCategoriesApiResponse = ApiResponse<Package[]>;

// Labels API Response (if needed for labels endpoint)
export type LabelsApiResponse = ApiResponse<Label[]>;
