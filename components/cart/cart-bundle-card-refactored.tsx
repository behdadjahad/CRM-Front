import React from 'react';
import { CartBundleGroup } from '@/lib/cart-bundle-utils';
import { Package, Tag as TagIcon, TrendingDown, Trash2, Loader2 } from 'lucide-react';
import { cn, formatPrice } from '@/lib/utils';
import { Badge } from '../ui/badge';
import CartItem from './cart-item-refactored';
import { Button } from '../ui/button';

interface CartBundleCardProps {
    bundle: CartBundleGroup;
    onQuantityChange: (id: string, quantity: number) => void;
    onRemoveBundle: (bundleId: number) => void;
    isUpdating: boolean;
    isRemoving?: boolean;
    getOptimisticQuantity?: (itemId: number, fallbackQuantity: number) => number;
    isItemUpdating?: (itemId: number) => boolean;
}

const CartBundleCard: React.FC<CartBundleCardProps> = ({
    bundle,
    onQuantityChange,
    onRemoveBundle,
    isUpdating,
    isRemoving = false,
    getOptimisticQuantity,
    isItemUpdating,
}) => {
    const discountAmount = bundle.totalPrice - bundle.discountedPrice;
    const savingsPercent = bundle.discountPercent;

    const handleRemoveBundle = () => {
        onRemoveBundle(bundle.id);
    };

    return (
        <div className="bg-white rounded-lg shadow-sm border border-orange-200 relative overflow-hidden">
            {/* Bundle Header */}
            <div className="bg-gradient-to-r from-orange-50 to-orange-100 p-4 border-b border-orange-200">
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <div className="p-2 bg-orange-500 rounded-lg">
                            <Package className="w-5 h-5 text-white" />
                        </div>
                        <div>
                            <h3 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
                                {bundle.name}
                                <Badge variant="warning" className="text-xs">
                                    <TagIcon className="w-3 h-3 mr-1" />
                                    باندل
                                </Badge>
                            </h3>
                            <p className="text-sm text-gray-600 mt-1">{bundle.description}</p>
                        </div>
                    </div>

                    {/* Bundle Actions */}
                    <div className="flex items-center gap-3">
                        {/* Savings Badge */}
                        <div className="text-right">
                            <div className="flex items-center gap-1 text-green-600 text-sm font-medium">
                                <TrendingDown className="w-4 h-4" />
                                <span>صرفه‌جویی: {formatPrice(discountAmount)}</span>
                            </div>
                            <div className="text-xs text-gray-500">
                                {savingsPercent}% تخفیف
                            </div>
                        </div>

                        {/* Remove Bundle Button */}
                        <Button
                            variant="outline"
                            size="sm"
                            onClick={handleRemoveBundle}
                            disabled={isRemoving}
                            className="text-red-600 border-red-200 hover:bg-red-50 hover:border-red-300"
                        >
                            {isRemoving ? (
                                <Loader2 className="w-4 h-4 animate-spin" />
                            ) : (
                                <Trash2 className="w-4 h-4" />
                            )}
                            حذف باندل
                        </Button>
                    </div>
                </div>
            </div>

            {/* Bundle Items */}
            <div className="p-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {bundle.items.map((item) => (
                        <div key={item.id} className="relative">
                            <div className="bg-white rounded-lg shadow-sm border border-orange-100">
                                <CartItem
                                    item={item}
                                    onQuantityChange={onQuantityChange}
                                    onRemove={() => { }} // No-op: items in bundle can't be removed individually
                                    isUpdating={isUpdating}
                                    isRemoving={isRemoving}
                                    isInBundle={true}
                                    showRemoveButton={false} // Hide remove button for bundled items
                                    getOptimisticQuantity={getOptimisticQuantity}
                                    isItemUpdating={isItemUpdating}
                                />
                            </div>
                        </div>
                    ))}
                </div>

                {/* Bundle Pricing Summary */}
                <div className="mt-4 pt-4 border-t border-gray-200">
                    <div className="flex justify-between items-center text-sm">
                        <span className="text-gray-600">مجموع قیمت باندل:</span>
                        <div className="flex items-center gap-2">
                            <span className="text-gray-400 line-through">
                                {formatPrice(bundle.totalPrice)}
                            </span>
                            <span className="font-bold text-green-600">
                                {formatPrice(bundle.discountedPrice)}
                            </span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default CartBundleCard;
