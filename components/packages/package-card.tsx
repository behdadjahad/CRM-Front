"use client";

import React, { useState } from 'react';
import { Package, PackageCardProp, PackageItem } from '@/types/packages';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import PackageIcon from './package-icons';
import { getColorValue } from './package-icons';
import PurchaseFlowModal from './purchase-flow-modal';
import { selectPackage } from '@/api/packages/package-api';

// Helper function to get border color class
const getBorderColorClass = (color: string): string => {
    switch (color) {
        case 'طلایی':
            return 'border-t-[#F8AC3F]';
        case 'نقره ای':
            return 'border-t-[#B6BCC2]';
        case 'برنزی':
            return 'border-t-[#BF8970]';
        case 'آبی':
            return 'border-t-[#2949A4]';
        case 'سفید':
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

}> = ({ originalPrice, currentPrice, currency, }) => {
    const formatPrice = (price: number) => {
        return price.toLocaleString('fa-IR');
    };

    // const getDurationText = () => {
    //     switch (durationUnit) {
    //         case 'month':
    //             return 'در ماه';
    //         case 'year':
    //             return 'در سال';
    //         case 'day':
    //             return 'در روز';
    //         default:
    //             return 'در ماه';
    //     }
    // };

    return (
        <div className="flex flex-col items-center space-y-2">
            {originalPrice && originalPrice > currentPrice && (
                <div className="text-xs text-[#637381] line-through">
                    {formatPrice(originalPrice)} {currency}
                </div>
            )}
            {/* to-do apply padding-y for free package */}
            <div className={cn("text-xl whitespace-nowrap font-bold text-gray-900", currentPrice === 0 && "pt-7 pb-6")}>
                {currentPrice === 0 ? 'رایگان' : `${formatPrice(currentPrice)} ${currency}`}
            </div>
            {currentPrice > 0 && (
                <div className="text-sm whitespace-nowrap font-normal text-[#637381] ">
                    در ماه
                </div>
            )}
        </div>
    );
};


const PackageCard: React.FC<PackageCardProp> = ({
    data,
    chadcoCustomerId,
    onPackageSelect
}) => {
    const [isPurchaseModalOpen, setIsPurchaseModalOpen] = useState(false);
    const [isSelecting, setIsSelecting] = useState(false);

    // const handleCardClick = () => {
    //     onSelect(data.id);
    // };

    const handlePurchaseClick = async (e: React.MouseEvent) => {
        e.stopPropagation();

        if (!chadcoCustomerId) {
            console.error('Customer ID is required for package selection');
            return;
        }

        setIsSelecting(true);

        try {
            // Extract package categories and units for the API call
            const categories = data.packageCategories.map(cat => cat.id);
            const units = data.packageCategories.flatMap(cat =>
                cat.units.flatMap(unitLabel =>
                    unitLabel.units.map(unit => ({ unitId: unit.id }))
                )
            );

            const result = await selectPackage({
                packages: [data.id],
                categories,
                units
            }, chadcoCustomerId);

            console.log('Package selected successfully:', result);

            // Call the callback if provided
            if (onPackageSelect) {
                onPackageSelect(data.id, result);
            }

            // Open purchase modal after successful selection
            setIsPurchaseModalOpen(true);

        } catch (error) {
            console.error('Error selecting package:', error);
            // You can add toast notification here for error feedback
        } finally {
            setIsSelecting(false);
        }
    };

    // const handlePurchaseComplete = (description: string) => {
    //     // Here you can add logic to submit the order with description
    //     console.log('Order submitted:', { packageId: data.id, description });
    //     onPurchase(data.id); // Call the original onPurchase after success
    // };

    const handleModalClose = () => {
        setIsPurchaseModalOpen(false);
    };

    return (
        <div
            className={cn(
                "relative bg-white rounded-[8px] py-6 px-4 transition-all duration-300 cursor-pointer",
                "border-l border-r border-b border-zinc-200",
                "border-t-4",
                getBorderColorClass(data.title),
                !isPurchaseModalOpen && "hover:shadow-lg md:hover:scale-105 md:origin-center ",
                // "hover:shadow-lg md:hover:scale-105 md:origin-center  ",
                // {
                //     "border-orange-300 shadow-lg": isSelected,
                //     "border-gray-200 hover:border-gray-300": !isSelected,
                // },
                // className
            )}
        // onClick={handleCardClick}
        >

            <div className='flex justify-between items-start mb-8 lg:flex-col xl:flex-row  flex-row'>
                <div className='flex flex-col lg:order-2 order-1 xl:order-1'>
                    {/* Package name */}
                    <p className="text-lg  font-medium  text-gray-900 ">
                        {data.title}
                    </p>
                    {/* Package subtitle */}
                    {data.description ? (
                        <p className="text-sm text-gray-600 text-center ">
                            {data.description}
                        </p>
                    ) : (
                        <p className="text-sm h-5 text-gray-600 text-center ">

                        </p>
                    )}
                </div>
                {/* Package icon */}
                <div className="flex justify-center lg:order-1 order-2 xl:order-2">
                    <PackageIcon
                        type={data.title as 'طلایی' | 'نقره ای' | 'برنزی' | 'آبی' | 'سفید'}
                        color={data.title as 'طلایی' | 'نقره ای' | 'برنزی' | 'آبی' | 'سفید'}
                        className="w-12 h-12"
                    />
                </div>
            </div>




            {/* Price display */}
            <div className="mb-6">
                <PriceDisplay
                    originalPrice={data.price}
                    currentPrice={data.price || 0}
                    currency={data?.currency?.name || ''}
                // duration={data.duration}
                // durationUnit={data.durationUnit || ''}
                />
            </div>


            <Button variant={"info"} onClick={handlePurchaseClick} className="w-full border border-warning hover:bg-white hover:border-black hover:border" >
                شروع کردن
            </Button>

            {/* Purchase Flow Modal */}
            {/* <PurchaseFlowModal
                isOpen={isPurchaseModalOpen}
                onClose={handleModalClose}
                data={data}
                // onComplete={handlePurchaseComplete}
                packageName={data.title}
            /> */}
        </div>
    );
};

export default PackageCard;
