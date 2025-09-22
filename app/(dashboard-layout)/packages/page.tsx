"use client";

import React, { useEffect } from "react";
import Breadcrumb from "@/components/shared/breadcrumb";
import Title from "@/components/shared/title";
import PackageComparisonContainer from "@/components/packages/package-comparison-container";
import ComparisonTable from "@/components/packages/comparison-table";


import { useQuery } from "@tanstack/react-query";
import { getPackages,  } from "@/api/packages/package-api";
import { buildComparisonData } from "@/hooks/usePackageComparison";
import { ApiResponse } from "@/types/billing";
import { Package } from "@/types/packages";

export default function PackagesPage() {

  const { data: packageData, isLoading, error } = useQuery<ApiResponse<Package[]>>({
    queryKey: ["packageData"],
    queryFn: () => getPackages(),
  });

  console.log("packageData", packageData);

  

  if (!packageData) return <p>No data</p>;


  const comparisonData = buildComparisonData(packageData?.data || []);
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
