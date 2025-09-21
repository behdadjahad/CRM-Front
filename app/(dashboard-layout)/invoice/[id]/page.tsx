"use client";

import React, { useState } from "react";
import BillingContainer from "@/components/billing/billing-container";
import { mockBillingData } from "@/data/billing-mock-data";
import { BillingPageData, FeatureCategory } from "@/types/billing";
import Breadcrumb from "@/components/shared/breadcrumb";
import Title from "@/components/shared/title";


export default function InvoiceDetailPage() {

    const [billingData, setBillingData] = useState<BillingPageData>(mockBillingData);

    const handleDurationChange = (durationId: string) => {
        setBillingData(prev => ({
            ...prev,
            selectedDuration: durationId,
            durationOptions: prev.durationOptions.map(option => ({
                ...option,
                isSelected: option.id === durationId,
            })),
        }));
    };

    const handleFeatureToggle = (categoryId: string) => {
        setBillingData(prev => ({
            ...prev,
            features: prev.features.map(category =>
                category.id === categoryId
                    ? { ...category, isExpanded: !category.isExpanded }
                    : category
            ),
        }));
    };

    const handlePay = () => {
        const selectedOption = billingData.durationOptions.find(
            option => option.id === billingData.selectedDuration
        );

        if (selectedOption) {
            alert(`پرداخت مبلغ ${selectedOption.currentPrice.toLocaleString('fa-IR')} تومان انجام شد!`);
        }
    };

    const handleLoadMoreFeatures = () => {
        // Simulate loading more features
        const newCategory: FeatureCategory = {
            id: `category-${billingData.features.length + 1}`,
            title: `دسته بندی ${billingData.features.length + 1}`,
            isExpanded: false,
            features: [
                {
                    id: `feature-${billingData.features.length + 1}-1`,
                    name: `ویژگی جدید ${billingData.features.length + 1}`,
                    description: "توضیحات ویژگی جدید",
                },
            ],
        };

        setBillingData(prev => ({
            ...prev,
            features: [...prev.features, newCategory],
        }));
    };

    const handleCloseAllFeatures = () => {
        // Reset to original 3 features and close all
        const originalFeatures = mockBillingData.features;
        setBillingData(prev => ({
            ...prev,
            features: originalFeatures.map(category => ({
                ...category,
                isExpanded: false
            }))
        }));
    };

    const handleLoadMoreDurations = () => {
        // Simulate loading more duration options
        const newDuration = {
            id: `duration-${billingData.durationOptions.length + 1}`,
            title: `${billingData.durationOptions.length + 1} ماهه`,
            description: "پکیج جدید",
            originalPrice: 2000000,
            discount: {
                percentage: 10,
                amount: 200000,
            },
            currentPrice: 1800000,
            isSelected: false,
        };

        setBillingData(prev => ({
            ...prev,
            durationOptions: [...prev.durationOptions, newDuration],
        }));
    };

    return (
        <main>
            {/* Page Header */}
            <div className="mb-8">
                <Title label="صورت حساب " />
                <Breadcrumb
                    list={[
                        {
                            label: "کاربر",
                            link: "/",
                        },
                        {
                            label: "صورت حساب ",

                        },
                        {
                            label: "جزییات سفارش",

                        },
                    ]}
                />

            </div>

            <BillingContainer
                data={billingData}
                onDurationChange={handleDurationChange}
                onPay={handlePay}
                onFeatureToggle={handleFeatureToggle}
                onLoadMoreFeatures={handleLoadMoreFeatures}
                onLoadMoreDurations={handleLoadMoreDurations}
                onCloseAllFeatures={handleCloseAllFeatures}
            />
        </main>

    );
}
