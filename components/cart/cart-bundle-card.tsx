"use client";

import React from 'react';
import { CartBundleGroup } from '@/lib/cart-bundle-utils';
import { Package, Tag as TagIcon, TrendingDown, Trash2, Loader2 } from 'lucide-react';
import { cn, formatPrice } from '@/lib/utils';
import { Badge } from '../ui/badge';
import CartItem from './cart-item';
import { Button } from '../ui/button';

interface CartBundleCardProps {
    bundle: CartBundleGroup;
    onQuantityChange: (id: string, quantity: number) => void;
    onRemoveBundle: (bundleId: number) => void;
    isUpdating: boolean;
    isRemoving?: boolean;
}

const CartBundleCard: React.FC<CartBundleCardProps> = ({
    bundle,
    onQuantityChange,
    onRemoveBundle,
    isUpdating,
    isRemoving = false,
}) => {
    const discountAmount = bundle.totalPrice - bundle.discountedPrice;
    const savingsPercent = bundle.discountPercent;

    const handleRemoveBundle = () => {
        onRemoveBundle(bundle.id);
    };

    return (
        <div className="bg-[#F8AC3F1F] rounded-[20px]  p-4 shadow-sm transition-all duration-300 border-gray-300 border-dashed border-2 hover:shadow-md">
            {/* Bundle Header */}
            <div className="my-4">
                <div className="flex items-start justify-between mb-3">
                    <div className="flex items-center gap-3">
                        <div className="p-2  rounded-lg">
                            <Package className="w-5 h-5 text-black" />
                        </div>
                        <div>
                            <h3 className="text-lg font-bold text-gray-900">
                                {bundle.name}
                            </h3>
                            {/* {bundle.description && (
                                <p className="text-sm text-gray-600 mt-1">
                                    {bundle.description}
                                </p>
                            )} */}
                        </div>
                    </div>

                    <div className="flex items-center gap-2">
                        {/* Discount Badge */}
                        {savingsPercent > 0 && (
                            <Badge className="bg-orange-500 text-white px-3 py-1 text-sm font-semibold flex items-center gap-1">
                                <TrendingDown className="w-4 h-4" />
                                تخفیف
                            </Badge>
                        )}

                        {/* Remove Bundle Button */}
                        <Button
                            variant="transparent"
                            size="sm"
                            onClick={handleRemoveBundle}
                            disabled={isUpdating || isRemoving}

                        >
                            {isRemoving ? <Loader2 className="w-4 h-4 ml-1 animate-spin" /> : <Trash2 className="w-4 h-4 text-red-500 ml-1" />}
                            {/* <Trash2 className="w-4 h-4 ml-1" /> */}
                            {/* {isRemoving ? 'در حال حذف...' : 'حذف باندل'} */}
                        </Button>
                    </div>
                </div>

                {/* Price Summary */}
                {/* <div className="flex items-center justify-between bg-white rounded-lg p-3 shadow-sm">
                    <div className="flex flex-col">
                        <span className="text-xs text-gray-500 mb-1">قیمت کل فیچرها</span>
                        <span className="text-lg font-bold text-gray-400 line-through">
                            {formatPrice(bundle.totalPrice)} تومان
                        </span>
                    </div>

                    {discountAmount > 0 && (
                        <div className="flex flex-col items-center">
                            <span className="text-xs text-green-600 mb-1">صرفه‌جویی شما</span>
                            <span className="text-lg font-bold text-green-600">
                                {formatPrice(discountAmount)} تومان
                            </span>
                        </div>
                    )}

                    <div className="flex flex-col items-end">
                        <span className="text-xs text-gray-500 mb-1">قیمت باندل</span>
                        <span className="text-2xl font-bold text-orange-600">
                            {formatPrice(bundle.discountedPrice)} تومان
                        </span>
                    </div>
                </div> */}
            </div>

            {/* Bundle Items */}
            <div className="space-y-3">
                {/* <div className="flex items-center gap-2 mb-2">
                    <TagIcon className="w-4 h-4 text-gray-600" />
                    <span className="text-sm font-medium text-gray-700">
                        آیتم‌های باندل ({bundle.items.length} مورد)
                    </span>
                </div> */}

                {bundle.items.map((item, index) => (
                    <div key={item.id} className="relative">
                        {/* Bundle Item Indicator */}
                        {/* <div className="absolute -right-2 top-1/2 -translate-y-1/2 w-1 h-12 bg-orange-400 rounded-full z-10"></div> */}

                        <div className="bg-white rounded-lg shadow-sm border border-orange-100">
                            <CartItem
                                item={item}
                                onQuantityChange={onQuantityChange}
                                onRemove={() => { }} // No-op: items in bundle can't be removed individually
                                isUpdating={isUpdating}
                                isRemoving={isRemoving}
                                isInBundle={true}
                                showRemoveButton={false} // Hide remove button for bundled items
                            />
                        </div>
                    </div>
                ))}
            </div>

            {/* Bundle Benefits */}
            {/* {savingsPercent > 0 && (
                <div className="mt-4 p-3 bg-green-50 rounded-lg border border-green-200">
                    <p className="text-sm text-green-800 text-center">
                        🎉 با خرید این باندل، {formatPrice(discountAmount)} تومان صرفه‌جویی می‌کنید!
                    </p>
                
            </div>
            )} */}
        </div>
    );
};

export default CartBundleCard;

