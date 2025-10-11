import { Package } from "./packages";

export interface Discount {
    percentage: number;
    amount: number;
}

export interface PackageData {
    name: string;
    type: 'rental' | 'purchase';
    purchaseType: string;
    basePrice: number;
    discount: Discount;
    validityPeriod: string;
}

export interface Feature {
    id: string;
    name: string;
    description?: string;
}

export interface FeatureCategory {
    id: string;
    title: string;
    isExpanded: boolean;
    features: Feature[];
}

export interface DurationOption {
    id: string;
    title: string;
    description: string;
    originalPrice: number;
    discount: Discount;
    currentPrice: number;
    isSelected: boolean;
    isPopular?: boolean;
}

export interface UserInfo {
    name: string;
    avatar?: string;
}

export interface BillingPageData {
    user: UserInfo;
    package: PackageData;
    features: FeatureCategory[];
    durationOptions: DurationOption[];
    selectedDuration: string;
}

export interface BillingContainerProps {
    data: BillingPageData;
    onDurationChange: (durationId: string) => void;
    onPay: () => void;
    onFeatureToggle: (categoryId: string) => void;
    onLoadMoreFeatures: () => void;
    onLoadMoreDurations: () => void;
    onCloseAllFeatures: () => void;
    isLoading?: boolean;
}

export interface OrderSummaryCardProps {
    packageData: PackageData;
    selectedDuration: DurationOption | null;
    onPay: () => void;
    isLoading?: boolean;
}

export interface FeaturesListCardProps {
    features: FeatureCategory[];
    onFeatureToggle: (categoryId: string) => void;
    onLoadMore: () => void;
    onCloseAll: () => void;
}

export interface DurationSelectionCardProps {
    durationOptions: DurationOption[];
    selectedDuration: string;
    onDurationChange: (durationId: string) => void;
    onLoadMore: () => void;
}


export interface UiMessage {
    type: string | null;
    color: string | null;
}

export interface SingleInvoice {
    id: number;
    chadcoCustomerId: number;
    currencyId: number | null;
    invoiceNumber: string;
    issuedAt: string | null;
    dueAt: string | null;
    originalTotal: number;
    discountAmount: number;
    discountPercent: number;
    taxAmount: number;
    taxPercent: number;
    finalTotal: number;
    paymentStatus: "PAID" | "PENDING" | "FAILED" | string; // extend if API supports more
    paymentMethod: "GATEWAY" | "CASH" | "BANK_TRANSFER" | string;
    paidAt: string | null;
    requestMessage: string | null;
    updatedAt: string;
    currency: string | null;
}

export interface InvoiceResponse {
    status: "success" | "error" | string;
    message: string;
    httpStatus: number;
    redirectURL: string | null;
    ui: UiMessage;
    data: SingleInvoice;
}

export interface ApiResponse<T> {
    status: "success" | "error" | string;
    message: string;
    httpStatus: number;
    redirectURL: string | null;
    ui: UiMessage;
    data: T;
}

export type PackageResponse = ApiResponse<Package[]>;

// Calculated Price for different durations
export interface CalculatedPrice {
    months: number;
    price: number;
}

// Package with calculated prices response (from getPackagesByInvoice)
export interface PackageWithCalculatedPrices {
    id: number;
    title: string;
    description: string | null;
    price: {
        value: number;
    };
    currencyId: {
        value: number;
    };
    createdAt: string;
    updatedAt: string;
    packageCategories: Array<{
        id: number;
        name: string;
        price: {
            value: number;
        };
        createdAt: string;
        updatedAt: string;
        deletedAt: string | null;
        currencyId: number | null;
        units?: Array<{
            id: number;
            name: string;
            description: string | null;
            accessesJson: any;
            unitType: string | null;
            unitModel: "perCount" | "perDuration" | "flat" | null;
            enabledDurationInDays: number | null;
            showDurationInDays: number | null;
            countUnit: number | null;
            price: number | null;
            createdAt: string;
            updatedAt: string;
            deletedAt: string | null;
            currencyId: number;
            packageUnitLabelId: number | null;
        }>;
    }>;
}

// Response from getPackagesByInvoice API
export interface PackagesByInvoiceData {
    calculatedPrices: CalculatedPrice[];
    package: PackageWithCalculatedPrices;
}

export interface PackagesByInvoiceResponse {
    status: "success" | "error" | string;
    message: string;
    httpStatus: number;
    redirectURL: string | null;
    ui: UiMessage;
    data: PackagesByInvoiceData;
}