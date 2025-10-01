"use client";

import React from "react";
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
                <Title label="خرید فیچرهای تکی" />
                <Breadcrumb
                    list={[
                        { label: "داشبورد", link: "/" },
                        { label: "خرید فیچرهای تکی" },
                    ]}
                />
            </div>

            {/* Single Features Container */}
            <SingleFeaturesContainer onPurchase={handleUnitPurchase} />
        </main>
    );
}