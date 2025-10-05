"use client";

import React, { useMemo } from 'react';
import { PackageComparisonData, UnitComparison, UnitVariant } from '@/types/packages';
import { cn } from '@/lib/utils';
import { Check } from 'lucide-react';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { findUnitVariant, hasUnitInPackage } from '@/lib/package-comparison';

interface ComparisonTableProps {
    data: PackageComparisonData;
    className?: string;
}

const ComparisonTable: React.FC<ComparisonTableProps> = ({ data, className }) => {

    // Group units by category and then by label
    const categoryGroups = useMemo(() => {
        const categoryMap = new Map<number, { category: any; units: UnitComparison[] }>();

        // Initialize categories
        data.categories.forEach(category => {
            categoryMap.set(category.id, {
                category,
                units: []
            });
        });

        // Group units by their categories - use a simpler approach
        data.unitComparisons.forEach(unitComparison => {
            // Find which category this unit belongs to by checking all packages
            for (const pkg of data.packages) {
                for (const category of pkg.packageCategories || []) {
                    // Check if this unit exists in this category by comparing unit IDs
                    const hasUnitInCategory = category.units?.some(unit => {
                        // Check if any variant of this unit comparison matches this unit
                        return unitComparison.variants.some(variant => variant.unitId === unit.id);
                    });

                    if (hasUnitInCategory && categoryMap.has(category.id)) {
                        const categoryData = categoryMap.get(category.id)!;
                        // Check if this unit comparison is already added to this category
                        if (!categoryData.units.some(u => u.identity.name === unitComparison.identity.name)) {
                            categoryData.units.push(unitComparison);
                        }
                        break; // Found the category, no need to check other packages
                    }
                }
            }
        });

        // Return ALL categories, even if they have no units
        return Array.from(categoryMap.values());
    }, [data.unitComparisons, data.categories, data.packages, data.labels]);

    // Memoize expanded categories for better performance
    const expandedCategories = useMemo(
        () => categoryGroups.map(group => group.category.id.toString()),
        [categoryGroups]
    );

    // Enhanced feature cell renderer with unitModel logic
    const renderFeatureCell = (unitComparison: UnitComparison, packageId: number) => {
        const variant = findUnitVariant(unitComparison, packageId);
        const isAvailable = !!variant;
        const hasLabel = !!unitComparison.identity.label;

        return (
            <div className="flex justify-center">
                {isAvailable ? (
                    <div className="text-center">
                        {hasLabel ? (
                            // Show details for labeled units only
                            <div className="flex flex-col items-center gap-1">
                                <Check className="w-4 h-4 text-green-500" />
                                <div className="text-xs text-gray-600 space-y-1">
                                    {variant.unitModel === "flat" && (
                                        <div>نامحدود</div>
                                    )}
                                    {variant.unitModel === "perCount" && variant.countUnit && (
                                        <div>{variant.countUnit} count</div>
                                    )}
                                    {variant.unitModel === "perDuration" && variant.showDurationInDays && (
                                        <div>{variant.showDurationInDays} روز</div>
                                    )}
                                </div>
                            </div>
                        ) : (
                            // Show only checkmark for non-labeled units
                            <Check className="w-4 h-4 text-green-500" />
                        )}
                    </div>
                ) : (
                    <span className="text-gray-400">-</span>
                )}
            </div>
        );
    };

    return (
        <div className={cn("w-full bg-white space-y-4", className)}>
            <Accordion type="multiple" defaultValue={expandedCategories}>
                {categoryGroups.map((group) => (
                    <AccordionItem key={group.category.id} value={group.category.id.toString()} className="border-0 mb-4">
                        <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
                            <AccordionTrigger className="px-4 py-3 hover:bg-gray-50 bg-static-border-card border-0 rounded-t-lg">
                                <div className="grid grid-cols-5 w-full">
                                    <div className="text-right whitespace-nowrap font-bold text-zinc-900 text-[20px]">
                                        {group.category.name}
                                    </div>
                                    {/* Empty columns for alignment */}
                                    {data.packages.map((packageData) => (
                                        <div key={packageData.id} className="text-center" />
                                    ))}
                                </div>
                            </AccordionTrigger>

                            <AccordionContent className="border-t border-gray-100 rounded-b-lg">
                                <div className="bg-white">
                                    {group.units.length > 0 ? (
                                        group.units.map((unitComparison, index) => (
                                            <div
                                                key={unitComparison.identity.name}
                                                className={cn(
                                                    "grid grid-cols-5 border-b border-gray-100",
                                                    index === group.units.length - 1 && "border-b-0"
                                                )}
                                            >
                                                <div className="p-4 text-right text-sm text-gray-600 pr-4">
                                                    {unitComparison.identity.label ?
                                                        // Show label name for grouped units
                                                        unitComparison.identity.label.name :
                                                        // Show unit name for individual units
                                                        unitComparison.identity.name
                                                    }
                                                </div>
                                                {data.packages.map((packageData) => (
                                                    <div
                                                        key={packageData.id}
                                                        className="p-4 text-center border-r border-gray-100 last:border-r-0"
                                                    >
                                                        {renderFeatureCell(unitComparison, packageData.id)}
                                                    </div>
                                                ))}
                                            </div>
                                        ))
                                    ) : (
                                        // Show empty state for categories with no units
                                        <div className="grid grid-cols-5 p-4">
                                            <div className="text-right text-sm text-gray-400 pr-4">
                                                هیچ واحدی در این دسته‌بندی وجود ندارد
                                            </div>
                                            {data.packages.map((packageData) => (
                                                <div
                                                    key={packageData.id}
                                                    className="text-center border-r border-gray-100 last:border-r-0"
                                                >
                                                    <span className="text-gray-400">-</span>
                                                </div>
                                            ))}
                                        </div>
                                    )}
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
