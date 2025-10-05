"use client";

import React, { useState } from "react";
import { ApiResponse, FeaturesListCardProps } from "@/types/billing";
import { ChevronDownIcon, ChevronUpIcon, ChevronRightIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import { cn } from "@/lib/utils";
import { useParams } from "next/navigation";
import { useQuery } from "@tanstack/react-query";
import { getPackagesByInvoice } from "@/api/packages/package-api";
import { Package, PackageCategory, Unit, UnitLabel } from "@/types/packages";

// Interface for transformed feature data
interface TransformedFeature {
    id: string;
    name: string;
    description: string;
    duration: string | null;
    count: number;
    hasDropdown: boolean;
}

// Interface for transformed category data
interface TransformedCategory {
    id: string;
    title: string;
    features: TransformedFeature[];
}

const scrollbarStyles = `
  .custom-scrollbar::-webkit-scrollbar {
    width: 6px;
  }
  
  .custom-scrollbar::-webkit-scrollbar-track {
    background: #f1f5f9;
    border-radius: 3px;
  }
  
  .custom-scrollbar::-webkit-scrollbar-thumb {
    background: #cbd5e1;
    border-radius: 3px;
    transition: background 0.2s ease;
  }
  
  .custom-scrollbar::-webkit-scrollbar-thumb:hover {
    background: #94a3b8;
  }
  
  .custom-scrollbar::-webkit-scrollbar-thumb:active {
    background: #64748b;
  }
  
  /* Firefox */
  .custom-scrollbar {
    scrollbar-width: thin;
    scrollbar-color: #cbd5e1 #f1f5f9;
  }
`;

export default function FeaturesListCard({
    features,
    onFeatureToggle,
    onLoadMore,
    onCloseAll,
}: FeaturesListCardProps) {

    const { id } = useParams();

    // Fetch packages by invoice ID with proper generic typing
    const { data: packagesResponse, isLoading, error } = useQuery<any>({
        queryKey: ["packages-by-invoice", id],
        queryFn: () => getPackagesByInvoice(Number(id)),
        enabled: !!id,
        staleTime: 5 * 60 * 1000, // 5 minutes
        gcTime: 10 * 60 * 1000, // 10 minutes
    });

    // Local state for individual feature expansion (showing description box)
    const [expandedFeatures, setExpandedFeatures] = useState<Set<string>>(new Set());

    // Local state for category expansion
    const [expandedCategories, setExpandedCategories] = useState<Set<string>>(new Set());

    // Check if there are any expanded categories or features
    const hasExpandedCategories = expandedCategories.size > 0;
    const hasExpandedFeatures = expandedFeatures.size > 0;
    const hasAnyExpanded = hasExpandedCategories || hasExpandedFeatures;

    // Toggle individual feature description box
    const toggleFeatureDescription = (featureId: string) => {
        setExpandedFeatures(prev => {
            const newSet = new Set(prev);
            if (newSet.has(featureId)) {
                newSet.delete(featureId);
            } else {
                newSet.add(featureId);
            }
            return newSet;
        });
    };

    // Close all expanded features and categories
    const handleCloseAll = () => {
        setExpandedFeatures(new Set());
        setExpandedCategories(new Set());
        onCloseAll();
    };

    // Toggle category expansion
    const toggleCategoryExpansion = (categoryId: string) => {
        setExpandedCategories(prev => {
            const newSet = new Set(prev);
            if (newSet.has(categoryId)) {
                newSet.delete(categoryId);
            } else {
                newSet.add(categoryId);
            }
            return newSet;
        });
    };

    // Transform API data to match the UI structure
    const transformedFeatures: TransformedCategory[] = React.useMemo(() => {
        if (!packagesResponse?.data?.package?.packageCategories) {
            return [];
        }

        return packagesResponse.data.package.packageCategories.map((category: any, categoryIndex: number) => ({
            id: `category-${category.id}`,
            title: category.name,
            features: category.units?.map((unit: any) => ({
                id: `feature-${unit.id}`,
                name: unit.name,
                description: unit.description || "توضیحات این ویژگی در دسترس نیست",
                duration: unit.showDurationInDays ? `${unit.showDurationInDays} روز` : null,
                count: unit.countUnit || 0,
                hasDropdown: true
            })) || []
        }));
    }, [packagesResponse]);

    // Use only API data
    const featuresToDisplay = transformedFeatures;

    return (
        <>
            <style dangerouslySetInnerHTML={{ __html: scrollbarStyles }} />
            <div className="bg-white rounded-lg shadow-sm border border-static-border-light mb-6 p-6">
                <h2 className="text-base font-medium leading-snug text-black mb-6 flex items-center gap-2">
                    <Image src="/icons/feature-list-icon.svg" alt="features-list-card-icon" width={20} height={20} />
                    لیست ویژگی ها
                </h2>

                <div className="space-y-4 max-h-96 overflow-y-auto custom-scrollbar">
                    {isLoading ? (
                        <div className="flex items-center justify-center py-8">
                            <div className="text-sm text-gray-500">در حال بارگذاری...</div>
                        </div>
                    ) : error ? (
                        <div className="flex items-center justify-center py-8">
                            <div className="text-sm text-red-500">خطا در بارگذاری داده‌ها</div>
                        </div>
                    ) : featuresToDisplay.length === 0 ? (
                        <div className="flex items-center justify-center py-8">
                            <div className="text-sm text-gray-500">هیچ ویژگی‌ای یافت نشد</div>
                        </div>
                    ) : (
                        featuresToDisplay.map((category: TransformedCategory) => (
                            <div key={category.id} className="rounded-lg">
                                {/* Category Header - Gray background bar */}
                                <button
                                    onClick={() => toggleCategoryExpansion(category.id)}
                                    className="w-full  flex items-center justify-between bg-gray-100 hover:bg-gray-200 transition-colors rounded-lg p-3"
                                >
                                    <div className="flex items-center gap-2">
                                        {expandedCategories.has(category.id) ? (
                                            <ChevronUpIcon className="w-5 h-5 text-static-secondary-gray-dark" />
                                        ) : (
                                            <ChevronDownIcon className="w-5 h-5 text-static-secondary-gray-dark" />
                                        )}
                                        <span className="font-medium text-gray-600 text-sm leading-[140%] tracking-normal text-right">
                                            {category.title}
                                        </span>
                                    </div>
                                </button>

                                {/* Category Features - Show when category is expanded */}
                                {expandedCategories.has(category.id) && (
                                    <div className="px-4 pb-4 ">
                                        <div className="pt-4  space-y-2">
                                            {category.features.map((feature: TransformedFeature, featureIndex: number) => (
                                                <div key={feature.id} className={cn("space-y-2 w-11/12 bg-static-background-light rounded-lg border border-static-border-card transition-colors h-fit", expandedFeatures.has(feature.id) && "bg-gray-200 h-fit")}>
                                                    {/* Feature Item - Clickable to show description */}
                                                    <button
                                                        onClick={() => toggleFeatureDescription(feature.id)}
                                                        className="w-full  flex items-center justify-between text-right  p-2 rounded"
                                                    >
                                                        <div className="flex items-center gap-2">
                                                            <ChevronDownIcon className="w-4 h-4 text-static-secondary-gray-dark" />
                                                            <span className="text-sm font-medium text-gray-600">
                                                                {feature.name}
                                                            </span>
                                                        </div>
                                                        {/* Display duration and count from API data */}
                                                        {feature.duration && (
                                                            <div className="bg-white text-[10px] text-secondary rounded-[10px] px-2.5 py-1 border border-static-border-neutral">
                                                                {feature.duration}
                                                            </div>
                                                        )}
                                                        {feature.count > 0 && (
                                                            <div className="bg-white text-[10px] text-secondary rounded-[10px] px-5 py-1 border border-static-border-neutral">
                                                                {feature.count}
                                                            </div>
                                                        )}
                                                    </button>

                                                    {/* Feature Description Box - Shows when feature is clicked */}
                                                    {expandedFeatures.has(feature.id) && (
                                                        <div className=" rounded-[8px] px-4 mt-4 pb-2 ">
                                                            <p className="text-xs font-medium  text-gray-600 leading-relaxed">
                                                                {feature.description}
                                                            </p>

                                                        </div>
                                                    )}
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                )}
                            </div>
                        ))
                    )}

                    {/* Action Buttons - Only show when there's data */}
                    {!isLoading && !error && featuresToDisplay.length > 0 && (
                        <div className="pt-4 space-y-2">
                            {/* Close All Button - Show when there are expanded categories or features */}
                            {hasAnyExpanded && (
                                <Button
                                    onClick={handleCloseAll}
                                    variant="outline"
                                    className="w-full text-gray-600 hover:text-gray-800"
                                >
                                    <ChevronUpIcon className="w-5 h-5 text-static-secondary-gray-dark" />
                                    کمتر
                                </Button>
                            )}

                            {/* Load More Button */}
                            <Button
                                onClick={onLoadMore}
                                variant="ghost"
                                className="w-full hover:text-black hover:bg-primary/10"
                            >
                                <ChevronDownIcon className="w-5 h-5 text-static-secondary-gray-dark" />
                                بیشتر
                            </Button>
                        </div>
                    )}
                </div>
            </div>
        </>
    );
}
