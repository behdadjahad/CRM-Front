export interface Feature {
    code: string;
    name: string;
    show?: boolean;
    enabled?: boolean;
    featureId: number;
    urlPattern?: string | string[];
    description?: string | null;
}

export interface Page {
    url: string;
    code: string;
    show: boolean;
    title: string;
    pageId: number;
    enabled: boolean;
    features: Feature[];
}

export interface AccessesJson {
    pages: Page[];
}

export interface PackageCategory {
    id: number;
    name: string;
}

export interface Permission {
    id: number;
    chadcoCustomerId: number | null;
    name: string;
    description: string | null;
    accessesJson: AccessesJson;
    createdAt: string;
    updatedAt: string;
    packageUnits: {
        id: number;
        name: string;
    }[];
    roles: {
        id: number;
        name: string;
    }[];
}

export interface PackageUnit {
    id: number;
    name: string;
    description: string | null;
    price: number;
    currencyId: number;
    deletedAt: string | null;
    accessesJson: AccessesJson;
    unitType: string | null;
    unitModel: "flat" | "perCount" | "perDuration";
    enabledDurationInDays: number;
    showDurationInDays: number;
    countUnit: number;
    createdAt: string;
    updatedAt: string;
    currency: {
        id: number;
        name: string;
        description: string;
    };
    packageCategories: PackageCategory[];
    permissions: Permission[];
    packageUnitLabel: string | null;
}

export interface Currency {
    id: number;
    name: string;
    symbol: string;
}

export interface PaginationMeta {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
    hasNextPage: boolean;
    hasPrevPage: boolean;
}

export interface SingleFeaturesApiResponse {
    status: "success" | "error";
    message: string;
    httpStatus: number;
    redirectURL: null | string;
    ui: {
        type: null | string;
        color: null | string;
    };
    data: PackageUnit[]; // The API returns data as an array directly
    pagination?: PaginationMeta; // Pagination might be at root level
    total?: number; // Total might be at root level
}

// For filtering and container logic
export interface SingleFeaturesFilters {
    keyword?: string;
    categories?: string[]; // Changed to array for multiple selection
    priceRanges?: string[]; // Changed to array for multiple selection
    featureTypes?: string[]; // Changed to array for multiple selection
    customerTypes?: string[]; // Changed to array for multiple selection
    unitModels?: string[]; // Changed to array for multiple selection
    minPrice?: number;
    maxPrice?: number;
    countFilter?: number;
    startDate?: string;
    endDate?: string;
    calendarOptions?: string[];
    panelSettings?: string[];
}

export interface SingleFeaturesContainerProps {
    packageUnits: PackageUnit[];
    onPurchase?: (unitId: number, description: string) => void;
    chadcoCustomerId?: number;
}
