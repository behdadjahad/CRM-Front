export type RequestStatus = 'pending' | 'waiting-for-payment' | 'not-paid' | 'paid' | 'rejected';

export interface Request {
    id: string;
    invoiceId: string;
    userId: string;
    userName: string;
    userEmail: string;
    packageId: string;
    packageName: string;
    packagePrice: number;
    currency: string;
    notes?: string;
    status: RequestStatus;
    createdAt: string;
    updatedAt: string;
    paymentMethod?: string;
    transactionId?: string;
    invoiceHistory?: {
        timestamp: string;
        status: RequestStatus;
        adminNotes?: string;
    }[];
}

export interface RequestFilters {
    status?: RequestStatus;
    search?: string;
    dateFrom?: string;
    dateTo?: string;
    amountFrom?: number;
    amountTo?: number;
}

export interface RequestSort {
    field: 'createdAt' | 'amount' | 'status' | 'userName';
    direction: 'asc' | 'desc';
}

export interface RequestAction {
    id: string;
    label: string;
    variant: 'approve' | 'reject' | 'mark-paid' | 'cancel';
    status: RequestStatus;
}
