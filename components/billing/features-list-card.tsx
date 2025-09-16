"use client";

import React from "react";
import { FeaturesListCardProps } from "@/types/billing";
import { ChevronDownIcon, ChevronUpIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import Image from "next/image";

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
    // Check if there are any expanded categories
    const hasExpandedCategories = features.some(category => category.isExpanded);
    return (
        <>
            <style dangerouslySetInnerHTML={{ __html: scrollbarStyles }} />
            <div className="bg-white rounded-lg shadow-sm border border-[#D3D3D3] mb-6  p-6">
                <h2 className="text-base font-medium leading-snug text-black mb-6 flex  items-center gap-2">

                    <Image src="/icons/feature-list-icon.svg" alt="features-list-card-icon" width={20} height={20} />

                    لیست ویژگی ها</h2>

                <div className="space-y-4 max-h-96 overflow-y-auto custom-scrollbar">
                    {features.map((category) => (
                        <div key={category.id} className=" rounded-lg">
                            {/* Category Header */}
                            <button
                                onClick={() => onFeatureToggle(category.id)}
                                className="w-full flex items-center justify-between  text-right  hover:bg-gray-50 transition-colors"
                            >
                                <div className="flex items-center gap-2">
                                    {category.isExpanded ? (
                                        <ChevronUpIcon className="w-5 h-5 text-[#414651]" />
                                    ) : (
                                        <ChevronDownIcon className="w-5 h-5 text-[#414651]" />
                                    )}
                                    <span className="font-medium text-sm leading-[140%] tracking-normal">{category.title}</span>
                                </div>
                            </button>

                            {/* Category Features */}
                            {category.isExpanded && (
                                <div className="px-4 pb-4  ">
                                    <div className="pt-4 space-y-2">
                                        {category.features.map((feature) => (
                                            <div key={feature.id} className="flex items-center gap-3">

                                                <span className="text-sm text-gray-700">
                                                    {feature.name}
                                                </span>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}
                        </div>
                    ))}

                    {/* Action Buttons */}
                    <div className="pt-4 space-y-2">
                        {/* Close All Button - Show when there are expanded categories */}
                        {hasExpandedCategories && (
                            <Button
                                onClick={onCloseAll}
                                variant="outline"
                                className="w-full text-gray-600 hover:text-gray-800"
                            >
                                <ChevronUpIcon className="w-5 h-5 text-[#414651]" />
                                بستن همه
                            </Button>
                        )}

                        {/* Load More Button */}
                        <Button
                            onClick={onLoadMore}
                            variant="ghost"
                            className="w-full  hover:text-black hover:bg-primary/10"
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
