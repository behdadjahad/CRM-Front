"use client";

import React, { useState } from "react";
import Breadcrumb from "@/components/shared/breadcrumb";
import Title from "@/components/shared/title";
import PackageComparisonContainer from "@/components/packages/package-comparison-container";
import ComparisonTable from "@/components/packages/comparison-table";
import { mockPackageComparisonData } from "@/data/packages-mock-data";
import { PackageComparisonData } from "@/types/packages";

export default function PackagesPage() {
    const [comparisonData, setComparisonData] = useState<PackageComparisonData>(mockPackageComparisonData);
    const [selectedPackageId, setSelectedPackageId] = useState<string | null>(null);

    const handlePackageSelect = (packageId: string) => {
        setSelectedPackageId(packageId);
        setComparisonData(prev => ({
            ...prev,
            selectedPackageId: packageId
        }));
    };

    const handlePackagePurchase = (packageId: string) => {
        // Handle package purchase logic
      
        // You can add purchase logic here, such as:
        // - Redirect to checkout page
        // - Open purchase modal
        // - Call purchase API
    };

    return (
        <main className="space-y-8">
            {/* Page Header */}
            <div className="mb-8">
                <Title label="جدول ویژگی ها" />
                <Breadcrumb
                    list={[
                        {
                            label: "داشبورد",
                            link: "/",
                        },
                        {
                            label: "پکیج ها",
                        },
                    ]}
                />
            </div>

            {/* Package Cards Section */}
            <section className="mb-12">


                <PackageComparisonContainer
                    data={comparisonData}
                    onPackageSelect={handlePackageSelect}
                    onPackagePurchase={handlePackagePurchase}
                />
            </section>

            {/* Feature Comparison Table */}
            <section className="bg-white p-8">

                <ComparisonTable
                    data={comparisonData}
                />
            </section>
        </main>
    );
}
