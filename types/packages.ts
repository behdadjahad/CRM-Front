// Package-related type definitions
export interface Package {
    id: string;
    name: string;
    subtitle: string;
    originalPrice?: number;
    currentPrice: number;
    currency: string;
    duration: number;
    durationUnit: 'month' | 'year' | 'day';
    icon: PackageIcon;
    buttonText: string;
    buttonVariant: 'primary' | 'secondary' | 'outline';
    isPopular?: boolean;
    isSelected?: boolean;
    features: PackageFeature[];
    categories: PackageCategory[];
}

export interface PackageIcon {
    type: 'gold' | 'silver' | 'bronze' | 'blue' | 'white';
    color: 'gold' | 'silver' | 'bronze' | 'blue' | 'white';
}

export interface PackageFeature {
    id: string;
    name: string;
    description?: string;
    isIncluded: boolean;
    usageLimit?: number | 'unlimited';
    remainingUsage?: number;
    isExpired?: boolean;
}

export interface PackageCategory {
    id: string;
    name: string;
    features: PackageFeature[];
    isExpanded?: boolean;
}

export interface PackageComparisonData {
    packages: Package[];
    categories: PackageCategory[];
    selectedPackageId?: string;
}

export interface PackageCardProps {
    package: Package;
    isSelected: boolean;
    onSelect: (packageId: string) => void;
    onPurchase: (packageId: string) => void;
    className?: string;
}

export interface PackageComparisonContainerProps {
    data: PackageComparisonData;
    onPackageSelect: (packageId: string) => void;
    onPackagePurchase: (packageId: string) => void;
    className?: string;
}
