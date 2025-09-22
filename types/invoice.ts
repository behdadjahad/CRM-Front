// Invoice types based on the preview design
export interface Invoice {
    id: number;
    orderNumber: string;
    orderTitle: string;
    packageType: string;
    basePrice: number;
    discount: number;
    managerDiscount: number;
    finalPrice: number;
    paymentDeadline: string;
    orderDate: string;
    paymentDate?: string;
    validityPeriod: string;
    orderDescription: string;
    features: string;
    status: InvoiceStatus;
    currency: string;
    chadcoCustomerId: number;
    createdAt: string;
    updatedAt: string;
}

export type InvoiceStatus =
    | 'paid'
    | 'unpaid'
    | 'pending_payment'
    | 'pending_approval';

export interface InvoicePreviewProps {
    invoice: Invoice;
    isOpen: boolean;
    onClose: () => void;
    onOpen?: () => void;
    onDownload?: (invoice: Invoice) => void;
}

export interface InvoiceListProps {
    invoices: Invoice[];
    onPreview: (invoice: Invoice) => void;
    onDownload: (invoice: Invoice) => void;
    onView: (invoice: Invoice) => void;
}

export interface InvoiceStatusConfig {
    label: string;
    variant: 'success' | 'destructive' | 'warning' | 'info';
    color: string;
}

export const INVOICE_STATUS_CONFIG: Record<InvoiceStatus, InvoiceStatusConfig> = {
    paid: {
        label: 'پرداخت شده',
        variant: 'success',
        color: 'text-green-600 bg-green-50'
    },
    unpaid: {
        label: 'پرداخت نشده',
        variant: 'destructive',
        color: 'text-red-600 bg-red-50'
    },
    pending_payment: {
        label: 'در انتظار پرداخت',
        variant: 'warning',
        color: 'text-purple-600 bg-purple-50'
    },
    pending_approval: {
        label: 'در انتظار تایید',
        variant: 'info',
        color: 'text-orange-600 bg-orange-50'
    }
};
