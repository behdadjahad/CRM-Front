"use client";

import React, { useState } from 'react';
import { PackageComparisonContainerProps } from '@/types/packages';
import PackageCard from './package-card';
import { cn } from '@/lib/utils';



const PackageComparisonContainer: React.FC<PackageComparisonContainerProps> = ({
  data,
  onPackageSelect,
  onPackagePurchase,
  className
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedPackageId, setSelectedPackageId] = useState<string | null>(
    data.selectedPackageId || null
  );

  const handlePackageSelect = (packageId: string) => {
    setSelectedPackageId(packageId);
    onPackageSelect(packageId);
  };

  const handlePackagePurchase = (packageId: string) => {
    onPackagePurchase(packageId);
  };

  // Filter packages based on search term
  const filteredPackages = data.packages.filter(pkg =>
    pkg.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    pkg.subtitle.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className={cn("w-full space-y-8", className)}>


      {/* Package cards grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {filteredPackages.map((packageData) => (
          <PackageCard
            key={packageData.id}
            package={packageData}
            isSelected={selectedPackageId === packageData.id}
            onSelect={handlePackageSelect}
            onPurchase={handlePackagePurchase}
            className="h-full"
          />
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

      {/* Package comparison info */}
      {selectedPackageId && (
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
          <div className="flex items-center space-x-2 space-x-reverse">
            <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
            <span className="text-blue-800 font-medium">
              پکیج انتخاب شده: {data.packages.find(p => p.id === selectedPackageId)?.name}
            </span>
          </div>
        </div>
      )}
    </div>
  );
};

export default PackageComparisonContainer;