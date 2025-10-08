export interface CartItem {
  id: number;
  name: string;
  accessesJson?: any;
  unitModel: string;
  enabledDurationInDays: number;
  showDurationInDays: number;
  countUnit: number;
  price: number;
  currencyId: number;
  createdAt: string;
  updatedAt: string;
}

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

export interface AddToCartPayload {
  packageUnitIds: number[]; // Can be single ID [1] or multiple [1, 2, 3]
  requestMessage?: string;
}

export interface UpdateCartItemPayload {
  itemId: string;
  quantity: number;
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
  data: {
    id: number;
    chadcoCustomerId: number;
    createdAt: string;
    updatedAt: string;
    packageUnits: CartItem[];
  };
}