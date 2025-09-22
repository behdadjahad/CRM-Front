"use client";

import React, { useEffect } from "react";
import Breadcrumb from "@/components/shared/breadcrumb";
import Title from "@/components/shared/title";
import PackageComparisonContainer from "@/components/packages/package-comparison-container";
import ComparisonTable from "@/components/packages/comparison-table";


import { useQuery } from "@tanstack/react-query";
import { getPackages, } from "@/api/packages/package-api";
import { buildComparisonData } from "@/hooks/usePackageComparison";
import { PackagesApiResponse } from "@/types/packages-api";
import { Package } from "@/types/packages";

export default function PackagesPage() {

  const { data: packageData, isLoading, error } = useQuery<PackagesApiResponse>({
    queryKey: ["packageData"],
    queryFn: () => getPackages(),
  });

  console.log("packageData", error);



  if (!packageData) return <p>No data</p>;


  const comparisonData = buildComparisonData(packageData?.data?.packages || [], packageData?.data?.labels || []);
  console.log("comparisonData", comparisonData);
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
          data={comparisonData}
          onPackageSelect={(packageId, result) => {
            console.log('Package selected:', packageId, result);
            // Handle package selection logic here
          }}
          onPackagePurchase={(packageId) => {
            console.log('Package purchase:', packageId);
            // Handle package purchase logic here
          }}
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
