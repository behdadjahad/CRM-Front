"use client";

import React, { useState, useMemo } from "react";
import BillingContainer from "@/components/billing/billing-container";
import { mockBillingData } from "@/data/billing-mock-data";
import { BillingPageData, FeatureCategory, PackagesByInvoiceResponse } from "@/types/billing";
import Breadcrumb from "@/components/shared/breadcrumb";
import Title from "@/components/shared/title";
import { payInvoice } from "@/api/invoices";
import { useSelector } from "react-redux";
import { RootState } from "@/store";
import { useParams } from "next/navigation";
import { useQuery } from "@tanstack/react-query";
import { getPackagesByInvoice } from "@/api/packages/package-api";


export default function InvoiceDetailPage() {

    const [billingData, setBillingData] = useState<BillingPageData>(mockBillingData);
    const chadcoCustomerId = useSelector((state: RootState) => state.login.chadcoCustomerId);
    const { id } = useParams();

    // Fetch package data with calculatedPrices
    const { data: packageResponse, isLoading: isLoadingPackage } = useQuery<PackagesByInvoiceResponse>({
        queryKey: ["packages-by-invoice", id],
        queryFn: () => getPackagesByInvoice(Number(id)),
        enabled: !!id,
        staleTime: 5 * 60 * 1000, // 5 minutes
    });

    // Transform calculatedPrices into duration options
    const durationOptions = useMemo(() => {
        if (!packageResponse?.data?.calculatedPrices) {
            return billingData.durationOptions;
        }

        return packageResponse.data.calculatedPrices.map((calc, index) => ({
            id: `duration-${calc.months}`,
            title: `${calc.months} ماهه`,
            description: calc.months === 6 ? "محبوب ترین" : `پکیج ${calc.months} ماهه`,
            originalPrice: calc.price,
            discount: {
                percentage: 0,
                amount: 0,
            },
            currentPrice: calc.price,
            isSelected: index === 0, // First option selected by default
            isPopular: calc.months === 6,
        }));
    }, [packageResponse, billingData.durationOptions]);

    // Update billingData when durationOptions change
    const updatedBillingData = useMemo(() => ({
        ...billingData,
        durationOptions,
        selectedDuration: durationOptions.find(opt => opt.isSelected)?.id || durationOptions[0]?.id || "",
    }), [billingData, durationOptions]);

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
    console.log(id, "inboive id")
    console.log(chadcoCustomerId, "chadcoCustomerId")
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

    const handlePay = async () => {
        const selectedOption = billingData.durationOptions.find(
            option => option.id === billingData.selectedDuration
        );

        // if (selectedOption) {
        //     const response = await payInvoice(Number(id), Number(chadcoCustomerId));
        //     console.log(response, "response")
        // }

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
                data={updatedBillingData}
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
