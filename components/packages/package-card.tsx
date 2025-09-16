"use client";

import React from 'react';
import { PackageCardProps } from '@/types/packages';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import PackageIcon from './package-icons';
import { getColorValue } from './package-icons';

// Helper function to get border color class
const getBorderColorClass = (color: string): string => {
    switch (color) {
        case 'gold':
            return 'border-t-[#F8AC3F]';
        case 'silver':
            return 'border-t-[#B6BCC2]';
        case 'bronze':
            return 'border-t-[#BF8970]';
        case 'blue':
            return 'border-t-[#2949A4]';
        case 'white':
            return 'border-t-[#6B7280]';
        default:
            return 'border-t-[#2949A4]';
    }
};
// Price display component
const PriceDisplay: React.FC<{
    originalPrice?: number;
    currentPrice: number;
    currency: string;
    duration: number;
    durationUnit: string;
}> = ({ originalPrice, currentPrice, currency, duration, durationUnit }) => {
    const formatPrice = (price: number) => {
        return price.toLocaleString('fa-IR');
    };

    const getDurationText = () => {
        switch (durationUnit) {
            case 'month':
                return 'در ماه';
            case 'year':
                return 'در سال';
            case 'day':
                return 'در روز';
            default:
                return 'در ماه';
        }
    };

    return (
        <div className="flex flex-col items-center space-y-2">
            {originalPrice && originalPrice > currentPrice && (
                <div className="text-xs text-[#637381] line-through">
                    {formatPrice(originalPrice)} {currency}
                </div>
            )}
            {/* to-do apply padding-y for free package */}
            <div className={cn("text-2xl font-bold text-gray-900", currentPrice === 0 && "pt-7 pb-6")}>
                {currentPrice === 0 ? 'رایگان' : `${formatPrice(currentPrice)} ${currency}`}
            </div>
            {currentPrice > 0 && (
                <div className="text-sm font-normal text-[#637381] ">
                    {getDurationText()}
                </div>
            )}
        </div>
    );
};


const PackageCard: React.FC<PackageCardProps> = ({
    package: packageData,
    isSelected,
    onSelect,
    onPurchase,
    className
}) => {
    const handleCardClick = () => {
        onSelect(packageData.id);
    };

    const handlePurchaseClick = (e: React.MouseEvent) => {
        e.stopPropagation();
        onPurchase(packageData.id);
    };

    return (
        <div
            className={cn(
                "relative bg-white rounded-[8px] py-6 px-4 transition-all duration-300 cursor-pointer",
                "border-l border-r border-b border-zinc-200",
                "border-t-4",
                getBorderColorClass(packageData.icon.color),
                "hover:shadow-lg hover:scale-105 origin-center ",
                // {
                //     "border-orange-300 shadow-lg": isSelected,
                //     "border-gray-200 hover:border-gray-300": !isSelected,
                // },
                className
            )}
            onClick={handleCardClick}
        >

            <div className='flex justify-between items-start mb-8 lg:flex-col xl:flex-row  flex-row'>
                <div className='flex flex-col lg:order-2 order-1 xl:order-1'>
                    {/* Package name */}
                    <p className="text-lg  font-medium  text-gray-900 ">
                        {packageData.name}
                    </p>
                    {/* Package subtitle */}
                    <p className="text-sm text-gray-600 text-center ">
                        {packageData.subtitle}
                    </p>
                </div>
                {/* Package icon */}
                <div className="flex justify-center lg:order-1 order-2 xl:order-2">
                    <PackageIcon
                        type={packageData.icon.type}
                        color={packageData.icon.color}
                        className="w-12 h-12"
                    />
                </div>
            </div>




            {/* Price display */}
            <div className="mb-6">
                <PriceDisplay
                    originalPrice={packageData.originalPrice}
                    currentPrice={packageData.currentPrice}
                    currency={packageData.currency}
                    duration={packageData.duration}
                    durationUnit={packageData.durationUnit}
                />
            </div>


            <Button variant={"info"} onClick={handlePurchaseClick} className="w-full border border-warning hover:bg-white hover:border-black hover:border" >
                شروع کردن
            </Button>

        </div>
    );
};

export default PackageCard;
