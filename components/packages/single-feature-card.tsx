"use client";

import React, { useState, useEffect } from 'react';
import { Unit, Currency } from '@/types/packages';
import { cn, formatPrice } from '@/lib/utils';
import { Button } from '@/components/ui/button';

import { selectUnit } from '@/api/packages/package-api';
import { CustomToast } from '../shared/custome-toast';
// import SingleFeaturePurchaseModal from './single-feature-purchase-modal';
import { SingleFeatureUnit } from '@/data/single-features-mock-data';
import Tag from '../billing/tag';
import { Checkbox } from '../ui/checkbox';
import { convertDaysToMonths } from '@/lib/duration-utils';
import { Clock, Plus } from 'lucide-react';
import Tooltip from '../ui/tooltip';



// Update the interface (around line 20-24)
interface SingleFeatureCardProps {
    unit: SingleFeatureUnit;
    chadcoCustomerId?: number;
    onPurchase?: (unitId: number, description: string) => void;
    // Add these cart-related props
    isInCart?: boolean;
    onAddToCart?: (unitId: number, requestMessage?: string) => void;
    onRemoveFromCart?: (itemId: string) => void;
    showCartActions?: boolean;
    cartLoading?: boolean;
}



// Price display component for single features
const getUnitModel = (unitModel?: "perCount" | "perDuration" | "flat" | null, showDurationInDays?: number, countUnit?: number) => {
    if (unitModel === "perDuration" && showDurationInDays) {

        return <p className="text-xs  flex items-center gap-1 text-gray-500">  <Clock size={12} /> {convertDaysToMonths(showDurationInDays)} </p>;
    }
    if (unitModel === "perCount" && countUnit) {
        return <p className="text-xs text-gray-500"> {countUnit} محدودیت</p>;
    }
    if (unitModel === "flat") {
        return <p className="text-xs text-gray-500">بدون محدودیت</p>;
    }
    return "";
};

const FeaturePriceDisplay: React.FC<{
    price?: number;
    currency?: Currency;

}> = ({ price, currency, }) => {

    return (
        <div className="flex flex-col items-center ">
            <div className={cn(
                "text-lg font-medium text-[#2949A4]",
                price === 0 && "text-green-600"
            )}>
                {price === 0 ? 'رایگان' : `${formatPrice(price || 0)} ${currency?.name || 'تومان'}`}
            </div>

        </div>
    );
};

const SingleFeatureCard: React.FC<SingleFeatureCardProps> = ({
    unit,
    chadcoCustomerId,
    onPurchase,
    isInCart,
    onAddToCart,
    onRemoveFromCart,
    showCartActions,
    cartLoading
}) => {
    const [isPurchaseModalOpen, setIsPurchaseModalOpen] = useState(false);
    const [isSelecting, setIsSelecting] = useState(false);
    const [status, setStatus] = useState<"error" | "success" | "loading" | "order-details">('order-details');

    const handlePurchaseClick = (e: React.MouseEvent) => {
        e.stopPropagation();

        if (isPurchaseModalOpen) return; // Prevent multiple modals
        if (!chadcoCustomerId) {
            CustomToast({
                type: 'error',
                message: 'لطفا ابتدا وارد شوید',
            });
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
            const result = await selectUnit({
                unitId: unit.id,
                requestMessage: description,
                chadcoCustomerId: chadcoCustomerId!,
            });

            if (result?.status === "success") {
                setStatus('success');
            } else {
                setStatus('error');
            }

            // Call the callback if provided
            if (onPurchase) {
                onPurchase(unit.id, description);
            }

        } catch (error) {
            setStatus('error');
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
    const handleAddToCart = () => {
        if (onAddToCart) {
            onAddToCart(unit.id, `Request for ${unit.name}`);
        }
    };


    return (
        <div
            className={cn(
                "relative bg-white rounded-lg p-4 transition-all duration-300 cursor-pointer",
                "border border-gray-200 shadow-sm",
                !isPurchaseModalOpen && "hover:shadow-md hover:-translate-y-1",
                "flex flex-col justify-between min-h-[266px]"
            )}
        >
            <div className='bg-[#F8F8F8] rounded-[8x] py-2.5 px-4'>

                <div className="mb-4">
                    <div className="flex justify-between items-start mb-2">
                        <div className="flex items-center gap-2">
                            <Checkbox
                                // checked={option.isSelected}
                                // onCheckedChange={() => onDurationChange(option.id)}
                                className="border border-[#D5D7DA]"
                            />
                            <Tooltip content={unit.name}>
                                <p className="text-lg lg:text-base xl:text-lg textlg font-medium zinc-900 text-right overflow-hidden whitespace-nowrap truncate lg:max-w-[100px] xl:max-w-[150px] max-w-[150px]" style={{
                                    display: '-webkit-box',
                                    WebkitLineClamp: 2,
                                    WebkitBoxOrient: 'vertical'
                                }}>
                                    {unit.name}
                                </p>
                            </Tooltip>

                        </div>

                        {unit.category && (
                            <Tag text={unit.category.name} />

                        )}
                    </div>

                    {/* Description */}
                    <p className="text-sm text-gray-500 text-right mb-4 overflow-hidden" style={{
                        display: '-webkit-box',
                        WebkitLineClamp: 3,
                        WebkitBoxOrient: 'vertical'
                    }}>
                        {unit.description || 'توضیحات در دسترس نیست'}
                    </p>


                </div>

                <div className="flex border border-[#D5D7DA] border-dashed rounded-full w-fit px-2.5 py-1 justify-between items-center">
                    {getUnitModel(unit.unitModel, unit.showDurationInDays, unit.countUnit)}
                </div>
            </div>

            {/* Price Section */}
            <div className="flex justify-between items-center">

                <FeaturePriceDisplay
                    price={unit.price}
                    currency={unit.currency}

                />

                {showCartActions && (
                    <div className="flex gap-2 mt-4">
                        {isInCart ? (
                            <Button
                                variant="outline"
                                onClick={() => onRemoveFromCart?.(unit.id.toString())}
                                disabled={cartLoading}
                                className="text-red-600 border-red-600 hover:bg-red-50"
                            >
                                {cartLoading ? 'Removing...' : 'Remove from Cart'}
                            </Button>
                        ) : (
                            <Button
                                className="text-base "
                                variant="info"
                                onClick={handleAddToCart}
                                disabled={!onAddToCart || cartLoading}
                            >
                                <Plus size={20} />
                                {cartLoading ? 'در حال پردازش...' : 'افزودن'}
                            </Button>
                        )}
                    </div>
                )}

            </div>

        </div>
    );
};

export default SingleFeatureCard;
