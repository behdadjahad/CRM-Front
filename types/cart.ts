// Feature within a page
export interface Feature {
  code: string;
  name: string;
  show: boolean;
  enabled: boolean;
  featureId: number;
  urlPattern: string;
  description?: string;
  packageUnitId: number;
}

// Page within accessesJson
export interface Page {
  url: string;
  code: string;
  show: boolean;
  title: string;
  pageId: number;
  enabled: boolean;
  features: Feature[];
  packageUnitId: number;
}

// AccessesJson structure
export interface AccessesJson {
  pages: Page[];
  usageCount?: number;
}

// Package Unit (Cart Item)
export interface CartItem {
  id: number;
  name: string;
  accessesJson: AccessesJson;
  unitType?: string;
  unitModel: "flat" | "perDuration" | "perCount";
  enabledDurationInDays: number;
  showDurationInDays: number;
  countUnit: number;
  price: number;
  currencyId: number;
  createdAt: string;
  updatedAt: string;
  bundleId?: number; // Track if added via bundle (null = individual, number = bundle ID)
  quantity?: number; // Quantity in cart (added by client-side processing)
}

// Cart Item with quantity
export interface CartItemWithQuantity {
  count: number;
  unitId: number;
}

// Cart data structure
export interface CartData {
  id: number;
  chadcoCustomerId: number;
  discountCodeId: number | null;
  originalTotal: number;
  discountAmount: number;
  discountPercent: number;
  discountAmountByDiscountCode: number | null;
  discountPercentByDiscountCode: number | null;
  taxAmount: number;
  taxPercent: number;
  finalTotal: number;
  createdAt: string;
  updatedAt: string;
  items: CartItemWithQuantity[];  // Array with count and unitId
  packageUnits: CartItem[];       // Full item details
  satisfiedBundles: SatisfiedBundle[];
}
export interface SatisfiedBundle {
  id: number;
  name: string;
  description: string;
  discountPercent: {
    value: number;
  };
  packageUnitIds: number[];
}


export interface CartApiResponse {
  status: "success" | "error";
  message: string;
  httpStatus: number;
  redirectURL: string | null;
  ui: {
    type: string | null;
    color: string | null;
  };
  data: CartData
}

// Redux Cart State (if still using Redux for cart)
export interface CartState {
  items: CartItem[];
  discountCode: string | null;
  discountAmount: number;
  loading: boolean;
  error: string | null;
  total: number;
  subtotal: number;
  lastUpdated: string;
}

// Payload types for API calls
export interface AddToCartPayload {
  packageUnitIds: number[]; // Can be single ID [1] or multiple [1, 2, 3]
  requestMessage?: string;
}

export interface RemoveFromCartPayload {
  packageUnitIds: number[];
}

export interface UpdateCartItemPayload {
  itemId: string;
  quantity: number;
}

// SSE-related types - moved to types/sse.ts for better organization
// Re-export for backward compatibility
