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
}

export interface OrderSummaryCardProps {
    packageData: PackageData;
    selectedDuration: DurationOption | null;
    onPay: () => void;
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
