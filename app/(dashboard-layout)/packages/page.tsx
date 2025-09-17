"use client";

import React, { useEffect } from "react";
import Breadcrumb from "@/components/shared/breadcrumb";
import Title from "@/components/shared/title";
import PackageComparisonContainer from "@/components/packages/package-comparison-container";
import ComparisonTable from "@/components/packages/comparison-table";
// import { usePackageComparison } from "@/hooks/usePackageComparison";
import { useDispatch } from "react-redux";
import { fetchCurrencies } from "@/store/currency-slice";
import { useQuery } from "@tanstack/react-query";
import { getPackages, getPackageUnits } from "@/api/packages/package-api";
import { buildComparisonData } from "@/hooks/usePackageComparison";

export default function PackagesPage() {

  const { data: packageData } = useQuery({
    queryKey: ["packageData"],
    queryFn: () => getPackages(),
  });

  console?.log(packageData, "--------------------------------")

  const handlePackagePurchase = (packageId: string) => {
    // Handle package purchase logic
    console.log('Purchasing package:', packageId);
    // You can add purchase logic here, such as:
    // - Redirect to checkout page
    // - Open purchase modal
    // - Call purchase API
  };

  // Show loading state

  // Show error state

  // Show empty state


  if (!packageData) return <p>No data</p>;

  // ساختار داده‌ی مورد نیاز جدول
  const comparisonData = buildComparisonData(packageData?.data);
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
      <section className="mb-12 ">
        <PackageComparisonContainer
          packages={comparisonData.packages}
          categories={comparisonData.categories}
          // onPackageSelect={handlePackageSelect}
          // onPackagePurchase={handlePackagePurchase}
        />
      </section> 

      {/* Feature Comparison Table */}
      <section className="bg-white p-8">
        {/* <ComparisonTable
          data={comparisonData}
        /> */}

        <ComparisonTable data={comparisonData} />      </section>
    </main>
  );
}
