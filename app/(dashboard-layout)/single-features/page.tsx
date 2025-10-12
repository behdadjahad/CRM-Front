"use client";

import React, { Suspense } from "react";

import Breadcrumb from "@/components/shared/breadcrumb";
import Title from "@/components/shared/title";
import SingleFeaturesContainer from "@/components/packages/single-features-container";
import { CustomToast } from "@/components/shared/custome-toast";


export default function SingleFeaturesPage() {


    // Handle unit purchase
    const handleUnitPurchase = (unitId: number, description: string) => {
        console.log('Unit purchase:', unitId, description);
        CustomToast({
            type: 'success',
            message: `درخواست خرید فیچر با موفقیت ثبت شد`,
        });
    };

    return (
        <main className="space-y-8">
            {/* Page Header */}
            <div className="mb-8">
                <Title label="خرید فیچر  " />
                <Breadcrumb
                    list={[
                        { label: "داشبورد", link: "/" },
                        { label: "خرید فیچر  " },
                    ]}
                />
            </div>


            <Suspense fallback={
                <div className="text-center py-12">
                    <div className="text-gray-500 text-lg">
                        در حال بارگذاری...
                    </div>
                </div>
            }>
                <SingleFeaturesContainer
                    onPurchase={handleUnitPurchase}

                />
            </Suspense>


            {/* Single Features Container */}
        </main>
    );
}