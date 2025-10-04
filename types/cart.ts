export interface CartItem {
    id: string;
    name: string;
    category: string;
    description: string;
    price: number;
    quantity: number;
    tag?: 'best-selling' | 'special' | 'suggested';
    usageCount?: number;
    durationMonths?: number;
}

export interface CartState {
    items: CartItem[];
    discountCode: string | null;
    discountAmount: number;
    isLoading: boolean;
    error: string | null;
}