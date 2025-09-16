import { Request, RequestStatus } from '@/types/requests';

// Status configuration for consistent styling and behavior
export const STATUS_CONFIG = {
    pending: {
        label: 'در انتظار تایید',
        color: 'yellow',
        icon: '⏳',
        className: 'bg-yellow-100 text-yellow-800 border-yellow-200'
    },
    'waiting-for-payment': {
        label: 'در انتظار پرداخت',
        color: 'blue',
        icon: '💳',
        className: 'bg-blue-100 text-blue-800 border-blue-200'
    },
    'not-paid': {
        label: 'پرداخت نشده',
        color: 'red',
        icon: '💳',
        className: 'bg-red-100 text-red-800 border-red-200'
    },
    paid: {
        label: 'پرداخت شده',
        color: 'green',
        icon: '✅',
        className: 'bg-green-100 text-green-800 border-green-200'
    },
    rejected: {
        label: 'رد شده',
        color: 'gray',
        icon: '❌',
        className: 'bg-gray-100 text-gray-800 border-gray-200'
    }
} as const;

// Filter functions
export const filterRequests = (requests: Request[], filters: {
    searchTerm?: string;
    status?: string;
    amountFrom?: string;
    amountTo?: string;
    dateFrom?: string;
    dateTo?: string;
}): Request[] => {
    return requests.filter(request => {
        // Search filter
        if (filters.searchTerm) {
            const searchLower = filters.searchTerm.toLowerCase();
            const matchesSearch =
                request.invoiceId.toLowerCase().includes(searchLower) ||
                request.userName.toLowerCase().includes(searchLower) ||
                request.packageName.toLowerCase().includes(searchLower);

            if (!matchesSearch) return false;
        }

        // Status filter
        if (filters.status && request.status !== filters.status) {
            return false;
        }

        // Amount filters
        if (filters.amountFrom && request.packagePrice < Number(filters.amountFrom)) {
            return false;
        }
        if (filters.amountTo && request.packagePrice > Number(filters.amountTo)) {
            return false;
        }

        // Date filters
        if (filters.dateFrom && new Date(request.createdAt) < new Date(filters.dateFrom)) {
            return false;
        }
        if (filters.dateTo && new Date(request.createdAt) > new Date(filters.dateTo)) {
            return false;
        }

        return true;
    });
};

// Status count calculation
export const getStatusCounts = (requests: Request[]) => {
    const counts = {
        pending: 0,
        'waiting-for-payment': 0,
        'not-paid': 0,
        paid: 0,
        rejected: 0
    } as Record<RequestStatus, number>;

    requests.forEach(request => {
        counts[request.status]++;
    });

    return counts;
};

// Format functions - reuse existing utilities from lib/utils.ts
export const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('fa-IR');
};

export const formatPrice = (price: number, currency: string) => {
    return `${price.toLocaleString('fa-IR')} ${currency}`;
};


// Status action configurations
export const getStatusActions = (currentStatus: RequestStatus) => {
    const actionConfigs = {
        pending: [
            {
                label: 'تایید',
                status: 'waiting-for-payment' as RequestStatus,
                icon: '/icons/check.png',
                className: 'border-none p-0 text-green-600'
            },
            {
                label: 'رد',
                status: 'rejected' as RequestStatus,
                icon: '/icons/close.png',
                className: 'border-none p-0 text-red-600'
            }
        ],
        'waiting-for-payment': [
            {
                label: 'پرداخت شده',
                status: 'paid' as RequestStatus,
                icon: '/icons/check.png',
                className: 'border-none p-0 text-green-600'
            },
            {
                label: 'پرداخت نشده',
                status: 'not-paid' as RequestStatus,
                icon: '/icons/close.png',
                className: 'border-none p-0 text-red-600'
            },
            {
                label: 'رد',
                status: 'rejected' as RequestStatus,
                icon: '/icons/close.png',
                className: 'border-none p-0 text-red-600'
            }
        ],
        'not-paid': [
            {
                label: 'پرداخت شده',
                status: 'paid' as RequestStatus,
                icon: '/icons/check.png',
                className: 'border-none p-0 text-green-600'
            },
            {
                label: 'بازگشت',
                status: 'waiting-for-payment' as RequestStatus,
                icon: '/icons/refresh.png',
                className: 'border-none p-0 text-blue-600'
            }
        ],
        paid: [
            {
                label: 'بازگشت',
                status: 'waiting-for-payment' as RequestStatus,
                icon: '/icons/refresh.png',
                className: 'border-none p-0 text-blue-600'
            }
        ],
        rejected: [
            {
                label: 'بازگشت',
                status: 'pending' as RequestStatus,
                icon: '/icons/refresh.png',
                className: 'border-none p-0 text-blue-600'
            }
        ]
    };

    return actionConfigs[currentStatus] || [];
};
