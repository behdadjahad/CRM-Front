"use client";

import React from 'react';
import { BundleGroup } from '@/types/single-features-api';
import { cn, formatPrice } from '@/lib/utils';
import SingleFeatureCard from './single-feature-card';
// convertToSingleFeatureUnit will be passed as prop from container
import { Package } from 'lucide-react';
interface BundleCardProps {
    bundle: BundleGroup;
    isChecked?: boolean;
    onCheckChange?: (bundleId: number, checked: boolean) => void;
    isSelectable?: boolean;
    onAddToCart?: (bundleId: number, bundleName: string) => void;
    cartLoading?: boolean;
    isInCart?: boolean;
    onRemoveFromCart?: (bundleId: number) => void;
    showCartActions?: boolean;
    bundleLoading?: boolean;
    chadcoCustomerId?: number;
    convertToSingleFeatureUnit: (unit: any) => any;
}

const BundleCard: React.FC<BundleCardProps> = ({
    bundle,
    isChecked = false,
    onCheckChange,
    isSelectable = true,
    onAddToCart,
    cartLoading = false,
    isInCart = false,
    onRemoveFromCart,
    showCartActions = true,
    bundleLoading = false,
    chadcoCustomerId,
    convertToSingleFeatureUnit
}) => {
    const handleAddToCart = () => {
        if (onAddToCart) {
            onAddToCart(bundle.id, bundle.name);
        }
    };

    const handleRemoveFromCart = () => {
        if (onRemoveFromCart) {
            onRemoveFromCart(bundle.id);
        }
    };

    // Create a virtual bundle unit for the container
    const bundleUnit = {
        id: bundle.id,
        name: bundle.name,
        description: `مجموع ${bundle.features.length} ویژگی`,
        price: bundle.totalPrice,
        unitType: 'bundle',
        unitModel: 'flat' as const,
        enabledDurationInDays: 0,
        showDurationInDays: 0,
        countUnit: bundle.features.length,
        currencyId: bundle.currency?.id || 1,
        packageUnitLabelId: 1,
        currency: bundle.currency || {
            id: 1,
            name: 'تومان',
            description: 'تومان ایران'
        },
        category: {
            id: 1,
            name: 'باندل'
        },
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
    };

    return (
        <div className="bg-[#F8AC3F1F] rounded-[20px]  shadow-sm transition-all duration-300 border-gray-100 border-dashed border-2 hover:shadow-md">
            {/* Bundle Header */}
            <div className="p-4 ">
                <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-3">
                        <Package size={22} className="text-black" />
                        <h3 className="text-lg font-semibold text-gray-900">
                            {bundle.name}
                        </h3>
                    </div>

                    {/* Bundle Total Price */}
                    <div className="text-right">
                        <div className="text-lg font-bold text-[#2949A4]">
                            {formatPrice(bundle.totalPrice)} {bundle.currency?.name || 'تومان'}
                        </div>
                        <div className="text-xs text-gray-500">
                            مجموع {bundle.features.length} ویژگی
                        </div>
                    </div>
                </div>

                {/* Bundle Actions */}
                {showCartActions && (
                    <div className="flex justify-end">
                        {isInCart ? (
                            <button
                                onClick={handleRemoveFromCart}
                                disabled={cartLoading || bundleLoading}
                                className="px-4 py-2 text-sm border border-red-600 text-red-600 rounded hover:bg-red-50 disabled:opacity-50"
                            >
                                {cartLoading || bundleLoading ? 'در حال حذف...' : 'حذف باندل از سبد خرید'}
                            </button>
                        ) : (
                            <button
                                onClick={handleAddToCart}
                                disabled={cartLoading || bundleLoading}
                                className="px-4 py-2 text-sm bg-blue-600 text-white rounded hover:bg-blue-700 disabled:opacity-50 flex items-center gap-2"
                            >
                                <span>+</span>
                                {bundleLoading ? 'در حال پردازش باندل...' :
                                    cartLoading ? 'در حال پردازش...' : 'افزودن باندل به سبد خرید'}
                            </button>
                        )}
                    </div>
                )}
            </div>

            {/* Nested Features Grid - Inside the bundle card */}
            <div className="p-4">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                    {bundle.features.map((feature) => (
                        <div
                            key={feature.id}
                            className="bg-gray-50 rounded-lg p-3 border border-gray-200"
                        >
                            <div className="flex items-start justify-between mb-2">
                                <h4 className="text-sm font-medium text-gray-900 line-clamp-2">
                                    {feature.name}
                                </h4>
                                {feature.packageCategories?.[0] && (
                                    <span className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded">
                                        {feature.packageCategories[0].name}
                                    </span>
                                )}
                            </div>

                            <p className="text-xs text-gray-600 line-clamp-2 mb-2">
                                {feature.description || 'توضیحات در دسترس نیست'}
                            </p>

                            {/* Feature details without price/buttons */}
                            <div className="flex items-center justify-between text-xs text-gray-500">
                                <span>
                                    {feature.unitModel === 'flat' && 'بدون محدودیت'}
                                    {feature.unitModel === 'perCount' && `${feature.countUnit} محدودیت`}
                                    {feature.unitModel === 'perDuration' && `${feature.showDurationInDays} روز`}
                                </span>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default BundleCard;
