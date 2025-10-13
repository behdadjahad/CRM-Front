"use client";

import React, { useState, useMemo, useEffect } from "react";
import BillingContainer from "@/components/billing/billing-container";

import { BillingPageData, FeatureCategory, PackagesByInvoiceResponse } from "@/types/billing";
import Breadcrumb from "@/components/shared/breadcrumb";
import Title from "@/components/shared/title";
import { payInvoice, getSingleInvoice } from "@/api/invoices";
import { useSelector } from "react-redux";
import { RootState } from "@/store";
import { useParams } from "next/navigation";
import { useQuery } from "@tanstack/react-query";
import { getPackagesByInvoice } from "@/api/packages/package-api";


export default function InvoiceDetailPage() {

    const [billingData, setBillingData] = useState<BillingPageData | null>(null);
    const chadcoCustomerId = useSelector((state: RootState) => state.login.chadcoCustomerId);
    const { id } = useParams();

    // Fetch package data with calculatedPrices
    const { data: packageResponse, isLoading: isLoadingPackage } = useQuery<PackagesByInvoiceResponse>({
        queryKey: ["packages-by-invoice", id],
        queryFn: () => getPackagesByInvoice(Number(id)),
        enabled: !!id,
        staleTime: 5 * 60 * 1000, // 5 minutes
    });

    // Fetch invoice data
    const { data: invoiceResponse, isLoading: isLoadingInvoice } = useQuery({
        queryKey: ["invoice", id],
        queryFn: () => getSingleInvoice(Number(id)),
        enabled: !!id,
        staleTime: 5 * 60 * 1000,
    });

    // Transform calculatedPrices into duration options
    const durationOptions = useMemo(() => {
        if (!packageResponse?.data?.calculatedPrices) {
            return [];
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
            isSelected: billingData?.selectedDuration === `duration-${calc.months}` || (index === 0 && !billingData?.selectedDuration),
            isPopular: calc.months === 6,
        }));
    }, [packageResponse, billingData?.selectedDuration]);

    // Initialize billing data from API
    useEffect(() => {
        if (packageResponse?.data && invoiceResponse?.data && !billingData) {
            const packageData = packageResponse.data.package;
            const invoiceData = invoiceResponse.data;
            const firstDurationId = `duration-${packageResponse.data.calculatedPrices[0]?.months}`;

            setBillingData({
                user: {
                    name: "کاربر", // Will be fetched from user API if needed
                    avatar: undefined,
                },
                package: {
                    name: packageData.title,
                    type: "rental" as const,
                    purchaseType: "خرید پکیج",
                    basePrice: packageData.price.value,
                    discount: { percentage: 0, amount: 0 },
                    validityPeriod: invoiceData.dueAt ? new Date(invoiceData.dueAt).toLocaleDateString('fa-IR') : "-",
                },
                features: [], // Will be populated from package categories
                durationOptions: [],
                selectedDuration: firstDurationId,
            });
        }
    }, [packageResponse, invoiceResponse, billingData]);

    // Transform package categories into features from API
    const apiFeatures = useMemo(() => {
        if (!packageResponse?.data?.package?.packageCategories) {
            return []; // No fallback to mock data
        }

        return packageResponse.data.package.packageCategories.map((category, index) => ({
            id: `category-${category.id}`,
            title: category.name,
            isExpanded: false,
            features: category.units?.map((unit, unitIndex) => ({
                id: `feature-${category.id}-${unit.id}`,
                name: unit.name,
                description: unit.description || `توضیحات ${unit.name}`
            })) || [{
                id: `feature-${category.id}-1`,
                name: category.name,
                description: `توضیحات ${category.name}`
            }]
        }));
    }, [packageResponse]);

    // Update billingData when durationOptions change
    const updatedBillingData = useMemo(() => {
        if (!billingData) return null;

        return {
            ...billingData,
            // Use API features
            features: apiFeatures,
            // Use calculated duration options
            durationOptions,
        };
    }, [billingData, durationOptions, apiFeatures]);

    const handleDurationChange = (durationId: string) => {
        const months = parseInt(durationId.replace('duration-', ''));
        const selectedOption = durationOptions.find(opt => opt.id === durationId);

        // Log the selected duration
        console.log('Selected duration:', {
            durationId: durationId,
            months: months,
            title: selectedOption?.title,
            price: selectedOption?.currentPrice,
            packageTitle: packageResponse?.data?.package?.title
        });

        // Update local state only
        setBillingData(prev => prev ? ({
            ...prev,
            selectedDuration: durationId,
        }) : null);
    };
    console.log(id, "inboive id")
    console.log(chadcoCustomerId, "chadcoCustomerId")
    const handleFeatureToggle = (categoryId: string) => {
        setBillingData(prev => prev ? ({
            ...prev,
            features: prev.features.map(category =>
                category.id === categoryId
                    ? { ...category, isExpanded: !category.isExpanded }
                    : category
            ),
        }) : null);
    };

    const handlePay = async () => {
        if (!billingData) return;

        const selectedOption = billingData.durationOptions.find(
            option => option.id === billingData.selectedDuration
        );

        // if (selectedOption) {
        //     const response = await payInvoice(Number(id), Number(chadcoCustomerId));
        //     console.log(response, "response")
        // }

    };

    const handleLoadMoreFeatures = () => {
        // No more features to load from API
        console.log('No more features to load from API');
    };

    const handleCloseAllFeatures = () => {
        // Close all expanded features
        setBillingData(prev => prev ? ({
            ...prev,
            features: prev.features.map(category => ({
                ...category,
                isExpanded: false
            }))
        }) : null);
    };

    const handleLoadMoreDurations = () => {
        // No more duration options to load from API
        console.log('No more duration options to load from API');
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

            {/* Loading State */}
            {(isLoadingPackage || isLoadingInvoice) && (
                <div className="flex items-center justify-center p-8">
                    <div className="animate-spin h-8 w-8 border-2 border-blue-600 border-t-transparent rounded-full"></div>
                    <span className="mr-2 text-blue-800">در حال بارگذاری...</span>
                </div>
            )}

            {/* Error State */}
            {(!isLoadingPackage && !isLoadingInvoice && !updatedBillingData) && (
                <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
                    <div className="flex items-center gap-2">
                        <div className="text-red-500 text-xl">⚠️</div>
                        <div>
                            <h3 className="text-red-800 font-medium">خطا در بارگذاری اطلاعات</h3>
                            <p className="text-red-600 text-sm">لطفاً دوباره تلاش کنید</p>
                        </div>
                    </div>
                </div>
            )}

            {/* Billing Container */}
            {updatedBillingData && (
                <BillingContainer
                    data={updatedBillingData}
                    onDurationChange={handleDurationChange}
                    onPay={handlePay}
                    onFeatureToggle={handleFeatureToggle}
                    onLoadMoreFeatures={handleLoadMoreFeatures}
                    onLoadMoreDurations={handleLoadMoreDurations}
                    onCloseAllFeatures={handleCloseAllFeatures}
                />
            )}
        </main>

    );
}
