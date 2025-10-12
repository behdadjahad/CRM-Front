"use client";

import React from "react";
import Breadcrumb from "@/components/shared/breadcrumb";
import Title from "@/components/shared/title";
import PackageComparisonContainer from "@/components/packages/package-comparison-container";
import ComparisonTable from "@/components/packages/comparison-table";


import { useQuery } from "@tanstack/react-query";
import { getPackages, } from "@/api/packages/package-api";
import { buildComparisonData } from "@/hooks/usePackageComparison";
import { PackagesApiResponse } from "@/types/packages-api";
import { useRouter } from "next/navigation";


export default function PackagesPage() {
  const router = useRouter();

  const { data: packageData, isLoading, error } = useQuery<PackagesApiResponse>({
    queryKey: ["packageData"],
    queryFn: () => getPackages(),
  });

  console.log("packageData", packageData);



  if (!packageData) return <p>No data</p>;

  const comparisonData = buildComparisonData(packageData?.data?.packages || [], packageData?.data?.labels || []);

  return (
    <main className="space-y-4 xl:space-y-8">
      {/* Page Header */}
      <div className="mb-4 xl:mb-8">
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
      <section className="mb-6 xl:mb-12">
        <PackageComparisonContainer
          data={comparisonData}
          onPackageSelect={(packageId, result) => {
            console.log('Package selected:', packageId, result);
            // Package selection handled in PackageCard component
            // This callback can be used for additional tracking if needed
          }}
          onPackagePurchase={(packageId) => {
            console.log('Package purchase:', packageId);
            // Package purchase handled in PackageCard component
            // This callback can be used for additional tracking if needed
          }}
        />
      </section>

      {/* Feature Comparison Table */}
      <section className="bg-white p-4 xl:p-8">
        <ComparisonTable
          data={comparisonData}
        />
      </section>
    </main>
  );
}
