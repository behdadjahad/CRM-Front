// Filter items configuration
export const FILTER_ITEMS = [
    {
        title: "وضعیت درخواست",
        component: (formik: any) => ({
            key: "status",
            component: "radio" as const,
            placeholder: "وضعیت",
            type: "text",
            className: "w-full items-start p-0",
            options: [
                { label: "در انتظار تایید", value: "pending" },
                { label: "در انتظار پرداخت", value: "waiting-for-payment" },
                { label: "پرداخت نشده", value: "not-paid" },
                { label: "پرداخت شده", value: "paid" },
                { label: "رد شده", value: "rejected" },
            ],
        })
    },
];

// Range items configuration
export const RANGE_ITEMS = [
    {
        title: "محدوده تاریخ",
        component: (formik: any) => [
            {
                key: "dateFrom",
                component: "date" as const,
                placeholder: "از تاریخ",
                type: "text",
                floating: true,
                className: "w-full px-0",
            },
            {
                key: "dateTo",
                component: "date" as const,
                placeholder: "تا تاریخ",
                type: "text",
                floating: true,
                className: "w-full items-start p-0",
            },
        ]
    },
    {
        title: "محدوده مبلغ",
        component: (formik: any) => [
            {
                key: "amountFrom",
                component: "input" as const,
                placeholder: "حداقل مبلغ",
                type: "number",
                floating: true,
                className: "w-full px-0",
            },
            {
                key: "amountTo",
                component: "input" as const,
                placeholder: "حداکثر مبلغ",
                type: "number",
                floating: true,
                className: "w-full items-start p-0",
            },
        ]
    },
];

// Sort options
export const SORT_OPTIONS = [
    { label: "تاریخ (جدیدترین - قدیمی‌ترین)", value: "createdAt", type: "desc" },
    { label: "تاریخ (قدیمی‌ترین - جدیدترین)", value: "createdAt", type: "asc" },
    { label: "مبلغ (بیشترین - کمترین)", value: "amount", type: "desc" },
    { label: "مبلغ (کمترین - بیشترین)", value: "amount", type: "asc" },
    { label: "وضعیت (الف-ی)", value: "status", type: "asc" },
    { label: "وضعیت (ی-الف)", value: "status", type: "desc" },
];

// Statistics card configuration
export const STATS_CARDS = [
    {
        key: 'pending',
        label: 'در انتظار تایید',
        icon: '⏳',
        className: 'bg-yellow-100 text-yellow-600'
    },
    {
        key: 'waiting-for-payment',
        label: 'در انتظار پرداخت',
        icon: '💳',
        className: 'bg-blue-100 text-blue-600'
    },
    {
        key: 'not-paid',
        label: 'پرداخت نشده',
        icon: '💳',
        className: 'bg-red-100 text-red-600'
    },
    {
        key: 'paid',
        label: 'پرداخت شده',
        icon: '✅',
        className: 'bg-green-100 text-green-600'
    },
    {
        key: 'rejected',
        label: 'رد شده',
        icon: '❌',
        className: 'bg-gray-100 text-gray-600'
    }
] as const;
