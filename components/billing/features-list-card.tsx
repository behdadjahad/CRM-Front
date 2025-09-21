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
import { Package } from "@/types/packages";

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
    console.log("id", id);

    // Fetch packages by invoice ID with proper generic typing
    const { data: packagesResponse, isLoading, error } = useQuery<ApiResponse<Package[]>>({
        queryKey: ["packages-by-invoice", id],
        queryFn: () => getPackagesByInvoice(Number(id)),
        enabled: !!id,
        staleTime: 5 * 60 * 1000, // 5 minutes
        gcTime: 10 * 60 * 1000, // 10 minutes
    });
    // Local state for individual feature expansion (showing description box)
    const [expandedFeatures, setExpandedFeatures] = useState<Set<string>>(new Set());

    // Local state for category expansion
    const [expandedCategories, setExpandedCategories] = useState<Set<string>>(new Set(["category-1"])); // Start with first category expanded

    // Check if there are any expanded categories or features
    const hasExpandedCategories = expandedCategories.size > 0;
    const hasExpandedFeatures = expandedFeatures.size > 0;
    const hasAnyExpanded = hasExpandedCategories || hasExpandedFeatures;
    2
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

    // Static data for features as sub-items of categories
    const staticFeatures = [
        {
            id: "category-1",
            title: "دسته بندی ۱",
            features: [
                {
                    id: "feature-1",
                    name: "ویژگی ۱",
                    description: "توضیحات ویژگی اول که شامل جزئیات مهمی است و کاربر می‌تواند آن را مشاهده کند",
                    inputValue: "۳ ماه",
                    hasDropdown: true
                },
                {
                    id: "feature-2",
                    name: "ویژگی ۲",
                    description: "توضیحات ویژگی دوم که شامل جزئیات مهمی است و کاربر می‌تواند آن را مشاهده کند",
                    inputValue: "۱۵",
                    hasDropdown: true
                },
                {
                    id: "feature-3",
                    name: "ویژگی ۳",
                    description: "توضیحات ویژگی سوم که شامل جزئیات مهمی است و کاربر می‌تواند آن را مشاهده کند",
                    inputValue: "۶ ماه",
                    hasDropdown: true
                }
            ]
        },
        {
            id: "category-2",
            title: "دسته بندی ۲",
            features: [
                {
                    id: "feature-4",
                    name: "ویژگی ۴",
                    description: "توضیحات ویژگی چهارم که شامل جزئیات مهمی است و کاربر می‌تواند آن را مشاهده کند",
                    inputValue: "۱۲ ماه",
                    hasDropdown: true
                },
                {
                    id: "feature-5",
                    name: "ویژگی ۵",
                    description: "توضیحات ویژگی پنجم که شامل جزئیات مهمی است و کاربر می‌تواند آن را مشاهده کند",
                    inputValue: "۲۴",
                    hasDropdown: true
                }
            ]
        },
        {
            id: "category-3",
            title: "دسته بندی ۳",
            features: [
                {
                    id: "feature-6",
                    name: "ویژگی ۶",
                    description: "توضیحات ویژگی ششم که شامل جزئیات مهمی است و کاربر می‌تواند آن را مشاهده کند",
                    inputValue: "۱۲",
                    hasDropdown: true
                }
            ]
        }
    ];

    return (
        <>
            <style dangerouslySetInnerHTML={{ __html: scrollbarStyles }} />
            <div className="bg-white rounded-lg shadow-sm border border-[#D3D3D3] mb-6 p-6">
                <h2 className="text-base font-medium leading-snug text-black mb-6 flex items-center gap-2">
                    <Image src="/icons/feature-list-icon.svg" alt="features-list-card-icon" width={20} height={20} />
                    لیست ویژگی ها
                </h2>

                <div className="space-y-4 max-h-96 overflow-y-auto custom-scrollbar">
                    {staticFeatures.map((category) => (
                        <div key={category.id} className="rounded-lg">
                            {/* Category Header - Gray background bar */}
                            <button
                                onClick={() => toggleCategoryExpansion(category.id)}
                                className="w-full  flex items-center justify-between bg-gray-100 hover:bg-gray-200 transition-colors rounded-lg p-3"
                            >
                                <div className="flex items-center gap-2">
                                    {expandedCategories.has(category.id) ? (
                                        <ChevronUpIcon className="w-5 h-5 text-[#414651]" />
                                    ) : (
                                        <ChevronDownIcon className="w-5 h-5 text-[#414651]" />
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
                                        {category.features.map((feature) => (
                                            <div key={feature.id} className={cn("space-y-2 w-11/12 bg-[#FDFDFD] rounded-lg border border-[#E9EAEB] transition-colors h-fit", expandedFeatures.has(feature.id) && "bg-gray-200 h-fit")}>
                                                {/* Feature Item - Clickable to show description */}
                                                <button
                                                    onClick={() => toggleFeatureDescription(feature.id)}
                                                    className="w-full  flex items-center justify-between text-right  p-2 rounded"
                                                >
                                                    <div className="flex items-center gap-2">
                                                        <ChevronDownIcon className="w-4 h-4 text-[#414651]" />
                                                        <span className="text-sm font-medium text-gray-600">
                                                            {feature.name}
                                                        </span>
                                                    </div>
                                                    {/* to-do: check if item have cont or duration  */}
                                                    <div className="bg-white text-[10px] text-secondary rounded-[10px] px-2.5 py-1 border border-[#D5D7DA]">
                                                        3 ماه
                                                    </div>
                                                    <div className="bg-white text-[10px] text-secondary rounded-[10px] px-5 py-1 border border-[#D5D7DA]">
                                                        15
                                                    </div>
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
                    ))}

                    {/* Action Buttons */}
                    <div className="pt-4 space-y-2">
                        {/* Close All Button - Show when there are expanded categories or features */}
                        {hasAnyExpanded && (
                            <Button
                                onClick={handleCloseAll}
                                variant="outline"
                                className="w-full text-gray-600 hover:text-gray-800"
                            >
                                <ChevronUpIcon className="w-5 h-5 text-[#414651]" />
                                کمتر
                            </Button>
                        )}

                        {/* Load More Button */}
                        <Button
                            onClick={onLoadMore}
                            variant="ghost"
                            className="w-full hover:text-black hover:bg-primary/10"
                        >
                            <ChevronDownIcon className="w-5 h-5 text-[#414651]" />
                            بیشتر
                        </Button>
                    </div>
                </div>
            </div>
        </>
    );
}
