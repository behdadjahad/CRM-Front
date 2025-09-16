"use client";

import React, { useMemo } from 'react';
import { PackageComparisonData } from '@/types/packages';
import { cn } from '@/lib/utils';
import { Check } from 'lucide-react';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';

interface ComparisonTableProps {
    data: PackageComparisonData;
    className?: string;
}

const ComparisonTable: React.FC<ComparisonTableProps> = ({ data, className }) => {
    // Memoize expanded categories for better performance
    const expandedCategories = useMemo(
        () => data.categories.filter(cat => cat.isExpanded).map(cat => cat.id),
        [data.categories]
    );

    // Optimized feature availability check
    const isFeatureAvailable = (featureId: string, packageId: string): boolean => {
        const packageData = data.packages.find(p => p.id === packageId);
        if (!packageData) return false;

        const feature = packageData.features.find(f => f.id === featureId);
        return Boolean(feature?.isIncluded && !feature?.isExpired && feature?.usageLimit !== 0);
    };

    // Simplified feature cell renderer
    const renderFeatureCell = (featureId: string, packageId: string) => {
        const isAvailable = isFeatureAvailable(featureId, packageId);

        return (
            <div className="flex justify-center">
                {isAvailable ? (
                    <Check className="w-4 h-4 text-green-500" />
                ) : (
                    <span className="text-gray-400 text-lg">—</span>
                )}
            </div>
        );
    };

    return (
        <div className={cn("w-full bg-white space-y-4", className)}>
            <Accordion type="multiple" defaultValue={expandedCategories}>
                {data.categories.map((category) => (
                    <AccordionItem key={category.id} value={category.id} className="border-0 mb-4">
                        <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
                            <AccordionTrigger className="px-4 py-3 hover:bg-gray-50 bg-[#E9EAEB] border-0 rounded-t-lg">
                                <div className="grid grid-cols-5 w-full">
                                    <div className="text-right whitespace-nowrap font-bold text-zinc-900 text-[20px]">
                                        {category.name}
                                    </div>
                                    {/* Empty columns for alignment */}
                                    {data.packages.map((packageData) => (
                                        <div key={packageData.id} className="text-center" />
                                    ))}
                                </div>
                            </AccordionTrigger>

                            <AccordionContent className="border-t border-gray-100 rounded-b-lg">
                                <div className="bg-white">
                                    {category.features.map((feature, index) => (
                                        <div
                                            key={feature.id}
                                            className={cn(
                                                "grid grid-cols-5 border-b border-gray-100",
                                                index === category.features.length - 1 && "border-b-0"
                                            )}
                                        >
                                            <div className="p-4 text-right text-sm text-gray-600 pr-4">
                                                {feature.name}
                                            </div>
                                            {data.packages.map((packageData) => (
                                                <div
                                                    key={packageData.id}
                                                    className="p-4 text-center border-r border-gray-100 last:border-r-0"
                                                >
                                                    {renderFeatureCell(feature.id, packageData.id)}
                                                </div>
                                            ))}
                                        </div>
                                    ))}
                                </div>
                            </AccordionContent>
                        </div>
                    </AccordionItem>
                ))}
            </Accordion>
        </div>
    );
};

export default ComparisonTable;
