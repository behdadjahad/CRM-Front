"use client";

import React, { useEffect, useState } from 'react';
import { Package, PackageCardProp, PackageItem } from '@/types/packages';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import PackageIcon from './package-icons';
import { getColorValue } from './package-icons';
import PurchaseFlowModal from './purchase-flow-modal';
import { selectPackage } from '@/api/packages/package-api';
import { CustomToast } from '../shared/custome-toast';


// Helper function to get border color class
const getBorderColorClass = (color: string): string => {
    switch (color) {
        case 'طلایی':
            return 'border-t-static-package-gold';
        case 'نقره ای':
            return 'border-t-static-package-silver';
        case 'برنزی':
            return 'border-t-static-package-bronze';
        case 'آبی':
            return 'border-t-static-primary-blue-dark';
        case 'سفید':
            return 'border-t-static-package-white';
        default:
            return 'border-t-static-primary-blue-dark';
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



    return (
        <div className="flex flex-col items-center space-y-2">
            {originalPrice && originalPrice > currentPrice && (
                <div className="text-xs text-static-secondary-gray-light line-through">
                    {formatPrice(originalPrice)} {currency}
                </div>
            )}
            {/* to-do apply padding-y for free package */}
            <div className={cn("text-xl whitespace-nowrap font-bold text-gray-900", currentPrice === 0 && "pt-7 pb-6")}>
                {currentPrice === 0 ? 'رایگان' : `${formatPrice(currentPrice)} ${currency}`}
            </div>
            {currentPrice > 0 && (
                <div className="text-sm whitespace-nowrap font-normal text-static-secondary-gray-light ">
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
    const [status, setStatus] = useState<"error" | "success" | "loading" | "order-details">('order-details');

    const handlePurchaseClick = (e: React.MouseEvent) => {
        e.stopPropagation();

        if (isPurchaseModalOpen) return; // Prevent multiple modals
        if (!chadcoCustomerId) {
            // Show toast error instead of console
            return;
        }

        setStatus('order-details');
        setIsPurchaseModalOpen(true);
    };

    const handlePurchaseComplete = async (description: string) => {
        setIsSelecting(true);
        setStatus('loading');
        if (description === '') {
            CustomToast({
                type: 'error',
                message: 'لطفا توضیحات را وارد کنید',
            });
            setStatus('error');
            return;

        }
        try {
            const result = await selectPackage({
                packageId: data.id,
                requestMessage: description,
                chadcoCustomerId: chadcoCustomerId!,

            });
            if (result?.status === "success") {

                setStatus('success');
            }
            else {
                setStatus('error');
            }


            // Call the callback if provided
            if (onPackageSelect) {
                onPackageSelect(data.id, result);
            }

        } catch (error) {
            setStatus('error');

            // Re-throw error so modal can handle it
            throw error;
        } finally {
            setIsSelecting(false);
        }
    };

    const handleModalClose = () => {
        setIsPurchaseModalOpen(false);
        setStatus('order-details');
    };

    useEffect(() => {
        return () => {

            setIsPurchaseModalOpen(false);
            setStatus('order-details');
        };
    }, []);

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

            <PurchaseFlowModal
                isOpen={isPurchaseModalOpen}
                onClose={handleModalClose}
                data={data}
                status={status}
                onComplete={handlePurchaseComplete} // This handles the API call
                packageName={data.title}
            />
        </div>
    );
};

export default PackageCard;
