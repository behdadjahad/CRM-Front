"use client";

import React from "react";
import { DurationSelectionCardProps } from "@/types/billing";
import { Button } from "@/components/ui/button";

import { Checkbox } from "@/components/ui/checkbox";
import Image from "next/image";
import { ChevronDownIcon } from "lucide-react";

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

export default function DurationSelectionCard({
    durationOptions,
    selectedDuration,
    onDurationChange,
    onLoadMore,
}: DurationSelectionCardProps) {
    const formatPrice = (price: number) => {
        return new Intl.NumberFormat("fa-IR").format(price);
    };

    return (
        <>
            <style dangerouslySetInnerHTML={{ __html: scrollbarStyles }} />
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 relative">
                {/* Coming Soon Overlay */}
                <div className="absolute inset-0 bg-white/30 backdrop-blur-sm rounded-lg flex items-center justify-center z-10">
                    <div className="text-center">
                        <div className="text-2xl font-bold text-gray-700 mb-2">به زودی</div>
                        <div className="text-sm text-gray-500">این بخش در حال توسعه است</div>
                    </div>
                </div>

                <h2 className="text-base font-medium leading-snug text-black mb-6 flex  items-center gap-2">
                    <Image src="/icons/durations-icon.svg" alt="order-summary-card-icon" width={20} height={20} />
                    انتخاب مدت زمان
                </h2>

                <div className="space-y-4 p-2.5 max-h-96 overflow-x-hidden overflow-y-auto custom-scrollbar">
                    {durationOptions.map((option) => (
                        <div
                            key={option.id}
                            className={`border-2 w-full rounded-lg py-3 px-4 m-1 cursor-pointer transition-all `}
                            style={{
                                background: "linear-gradient(90deg, rgba(255, 255, 255, 0.1) 0%, rgba(0, 97, 254, 0.1) 100%)"
                            }}
                            onClick={() => onDurationChange(option.id)}
                        >
                            <div className="flex-1 lg:flex-row flex-col  flex items-center justify-between w-full">

                                {/* right side discount and name */}
                                <div className="flex items-center lg:w-3/5 w-full">
                                    {/* Checkbox */}
                                    <Checkbox
                                        checked={option.isSelected}
                                        onCheckedChange={() => onDurationChange(option.id)}
                                        className="w-4 h-4"
                                    />
                                    <Image className="mx-4" src="/icons/package-icon.svg" alt="duration-icon" width={32} height={32} />
                                    <div className="flex-1 flex items-center justify-between w-full">
                                        {/* icon */}


                                        <div className="flex flex-col  items-start ">
                                            <p className="font-medium sm:text-base text-sm text-[#17181A]">{option.title}</p>
                                            <p className="sm:text-sm text-[10px] font-normal text-gray-600 ">{option.description}</p>
                                        </div>


                                        {/* discount */}
                                        {option.discount.percentage > 0 && (
                                            <div className="flex items-center ">
                                                <div className=" text-[10px] text-[#1C68DA]  bg-white border-[#1C68DA] rounded-lg border  whitespace-nowrap py-1 px-2">
                                                    {option.discount.percentage}% تخفیف
                                                </div>

                                            </div>
                                        )}



                                    </div>
                                </div>


                                {/* PRICING */}
                                <div className="flex flex-col lg:w-1/3  lg:items-end items-start w-full">
                                    {option.originalPrice !== option.currentPrice && (
                                        <span className="text-[10px] font-normal text-gray-500 line-through">
                                            {formatPrice(option.originalPrice)} تومان
                                        </span>
                                    )}
                                    <span className="text-base font-medium text-primary">
                                        {formatPrice(option.currentPrice)} تومان
                                    </span>
                                    {/* Pricing */}
                                </div>


                            </div>

                        </div>
                    ))}

                    {/* Load More Button */}
                    <div className="pt-4" >
                        <Button
                            onClick={onLoadMore}
                            variant="ghost"
                            className="w-full  hover:text-black hover:bg-primary/10"
                        >
                            بیشتر
                            <ChevronDownIcon className="w-5 h-5 text-[#414651]" />
                        </Button>
                    </div>
                </div>
            </div>
        </>
    );
}
