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
    <div className={cn("w-full flex justify-end items-end space-y-8 ",)}>


      {/* Package cards grid */}
      <div className="grid grid-cols-1 w-10/12 md:grid-cols-2 lg:grid-cols-12 gap-6">
        {filteredPackages?.map((packageData) => (
          <>
            <div key={packageData.id} className='col-span-3'>
              <PackageCard
                key={packageData.id}
                data={packageData}
                chadcoCustomerId={chadcoCustomerId}
                onPackageSelect={handlePackageSelect}
              // isSelected={selectedPackageId === packageData.id.toString()}
              // onSelect={handlePackageSelect}
              // onPurchase={handlePackagePurchase}
              // className="h-full"
              />
            </div>

          </>
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