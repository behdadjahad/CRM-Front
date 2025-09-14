import { BillingPageData } from "@/types/billing";

export const mockBillingData: BillingPageData = {
    user: {
        name: "امیر مقدسی",
        avatar: "/avatars/amir.jpg",
    },
    package: {
        name: "طلایی",
        type: "rental",
        purchaseType: "۳ ماهه",
        basePrice: 1850000,
        discount: {
            percentage: 15,
            amount: 400000,
        },
        validityPeriod: "۱۴۰۴/۰۸/۲۶",
    },
    features: [
        {
            id: "category-1",
            title: "دسته بندی ۱",
            isExpanded: false,
            features: [
                {
                    id: "feature-1-1",
                    name: "ویژگی اول دسته بندی ۱",
                    description: "توضیحات ویژگی اول",
                },
                {
                    id: "feature-1-2",
                    name: "ویژگی دوم دسته بندی ۱",
                    description: "توضیحات ویژگی دوم",
                },
                {
                    id: "feature-1-3",
                    name: "ویژگی سوم دسته بندی ۱",
                },
            ],
        },
        {
            id: "category-2",
            title: "دسته بندی ۲",
            isExpanded: false,
            features: [
                {
                    id: "feature-2-1",
                    name: "ویژگی اول دسته بندی ۲",
                    description: "توضیحات ویژگی اول دسته بندی ۲",
                },
                {
                    id: "feature-2-2",
                    name: "ویژگی دوم دسته بندی ۲",
                },
            ],
        },
        {
            id: "category-3",
            title: "دسته بندی ۳",
            isExpanded: false,
            features: [
                {
                    id: "feature-3-1",
                    name: "ویژگی اول دسته بندی ۳",
                    description: "توضیحات ویژگی اول دسته بندی ۳",
                },
            ],
        },
    ],
    durationOptions: [
        {
            id: "one-month",
            title: "یک ماهه",
            description: "مناسب برای آزمایش",
            originalPrice: 1600000,
            discount: {
                percentage: 15,
                amount: 240000,
            },
            currentPrice: 1360000,
            isSelected: true,
        },
        {
            id: "three-months",
            title: "سه ماهه",
            description: "محبوب ترین پکیج",
            originalPrice: 2850000,
            discount: {
                percentage: 15,
                amount: 500000,
            },
            currentPrice: 2350000,
            isSelected: false,
            isPopular: true,
        },
        {
            id: "six-months",
            title: "شش ماهه",
            description: "مناسب برای آزمایش",
            originalPrice: 2850000,
            discount: {
                percentage: 15,
                amount: 704000,
            },
            currentPrice: 2146000,
            isSelected: false,
        },
    ],
    selectedDuration: "one-month",
};
