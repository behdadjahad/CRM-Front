"use client";

import React, { useState } from 'react';
import { PackageComparisonData, PackageCardProp } from '@/types/packages';
import PackageCard from './package-card';
import { cn } from '@/lib/utils';
import { useSelector } from 'react-redux';
import { RootState } from '@/store';

interface PackageComparisonContainerProps {
  data: PackageComparisonData;
  onPackageSelect?: (packageId: number, result?: any) => void;
  onPackagePurchase?: (packageId: number) => void;
}

const PackageComparisonContainer: React.FC<PackageComparisonContainerProps> = ({
  data,
  onPackageSelect,
  onPackagePurchase,
}) => {
  const { packages, categories } = data;
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedPackageId, setSelectedPackageId] = useState<string | null>(
    // packages[0].id || null
  );

  // Get customer ID from Redux store
  const chadcoCustomerId = useSelector((state: RootState) => state?.login?.chadcoCustomerId);

  const handlePackageSelect = (packageId: number, result?: any) => {
    setSelectedPackageId(packageId.toString());
    console.log('Package selected:', packageId, result);
    // Call the parent callback if provided
    if (onPackageSelect) {
      onPackageSelect(packageId, result);
    }
  };

  // const handlePackageSelect = (packageId: string) => {
  //   setSelectedPackageId(packageId);
  //   onPackageSelect(packageId);
  // };

  // const handlePackagePurchase = (packageId: string) => {
  //   onPackagePurchase(packageId);
  // };

  // Filter packages based on search term
  const filteredPackages = packages?.filter(pkg =>
    pkg.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    pkg.description?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className={cn("w-full flex justify-end items-end space-y-4 xl:space-y-8")}>

      {/* Mobile: Horizontal scrollable package cards */}
      <div className="xl:hidden w-full">
        <div className="flex overflow-x-auto gap-4 pb-4 scrollbar-hide">
          {filteredPackages?.map((packageData) => (
            <div key={packageData.id} className='flex-shrink-0 w-64'>
              <PackageCard
                data={packageData}
                chadcoCustomerId={chadcoCustomerId}
                onPackageSelect={handlePackageSelect}
                isMobile={true}
              />
            </div>
          ))}
        </div>
      </div>

      {/* Desktop: Package cards grid */}
      <div className="hidden xl:grid grid-cols-12 w-10/12 gap-6">
        {filteredPackages?.map((packageData) => (
          <div key={packageData.id} className='col-span-3'>
            <PackageCard
              data={packageData}
              chadcoCustomerId={chadcoCustomerId}
              onPackageSelect={handlePackageSelect}
              isMobile={false}
            />
          </div>
        ))}
      </div>

      {/* No results message */}
      {filteredPackages.length === 0 && (
        <div className="text-center py-12">
          <div className="text-gray-500 text-lg mb-2">
            هیچ پکیجی یافت نشد
          </div>
          <div className="text-gray-400 text-sm">
            لطفاً عبارت جستجوی خود را تغییر دهید
          </div>
        </div>
      )}


    </div>
  );
};

export default PackageComparisonContainer;