import { CartItem as CartItemType } from "@/types/cart";
import { Clock, Minus, Plus, Trash2 } from "lucide-react";
import { cn } from "@/lib/utils";
import { Badge } from "../ui/badge";
import QuantityInput from "../shared/quantity-input";
import { convertDaysToMonths } from "@/lib/duration-utils";
import { canUpdateQuantity } from "@/hooks/cart/useCartOperations";

interface CartItemProps {
    item: CartItemType;
    onQuantityChange: (id: string, quantity: number) => void;
    onRemove: () => void;
    isUpdating: boolean;
    isRemoving?: boolean;
    isInBundle?: boolean; // If true, this item is part of a bundle
    showPrice?: boolean; // Control price display (default true)
    showRemoveButton?: boolean; // Control remove button display (default true)
    getOptimisticQuantity?: (itemId: number, fallbackQuantity: number) => number;
    isItemUpdating?: (itemId: number) => boolean;
}

export default function CartItem({
    item,
    onQuantityChange,
    onRemove,
    isUpdating,
    isRemoving = false,
    isInBundle = false,
    showPrice = true,
    showRemoveButton = true,
    getOptimisticQuantity,
    isItemUpdating,
}: CartItemProps) {
    const getTagClasses = (tag?: string) => {
        switch (tag) {
            case 'best-selling':
                return 'success';
            case 'special':
                return 'warning';
            case 'suggested':
                return 'info';
            default:
                return 'default';
        }
    };

    const getTagLabel = (tag?: string) => {
        switch (tag) {
            case 'best-selling':
                return 'پرفروش ترین';
            case 'special':
                return 'ویژه';
            case 'suggested':
                return 'پیشنهادی';
            default:
                return '';
        }
    };
    // Get quantity from item with optimistic updates (default to 1 if not set)
    const baseQuantity = item.quantity || 1;
    const quantity = getOptimisticQuantity ? getOptimisticQuantity(item.id, baseQuantity) : baseQuantity;

    // Check if this item supports quantity updates
    const supportsQuantityUpdate = canUpdateQuantity(item.unitType, item.unitModel);

    const handleIncrease = () => {
        if (supportsQuantityUpdate) {
            onQuantityChange(item.id.toString(), quantity + 1);
        }
    };

    const handleDecrease = () => {
        if (supportsQuantityUpdate) {
            if (quantity > 1) {
                onQuantityChange(item.id.toString(), quantity - 1);
            } else {
                onRemove(); // Remove item if quantity would be 0
            }
        }
    };

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
    // Get duration in months from API data (enabledDurationInDays / 30)
    const durationMonths = item.enabledDurationInDays ? Math.round(item.enabledDurationInDays / 30) : null;
    const usageCount = item.countUnit > 0 ? item.countUnit : null;

    const handleQuantityChange = (newQuantity: number) => {
        onQuantityChange(item.id.toString(), newQuantity);
    }
    return (
        <div className={cn(
            "flex flex-col items-center p-4 rounded-lg shadow-sm",
            isInBundle ? "bg-white" : "bg-static-background-light"
        )}>
            <div className="flex items-center justify-between w-full mb-4">
                <div className="flex  items-center gap-2">
                    {/* {item.unitModel && (
                        <Badge className={cn("text-xs font-normal px-2.5 py-1 flex items-center justify-center rounded-full border",
                            item.unitModel === 'flat' ? 'bg-static-info-light text-static-info-primary' :
                                item.unitModel === 'perCount' ? 'bg-static-warning-light text-static-warning-primary' :
                                    'bg-gray-100 text-gray-800')}>
                            {item.unitModel === 'perDuration' ? 'مدت زمانی' :
                                item.unitModel === 'perCount' ? 'تعدادی' :
                                    item.unitModel === 'flat' ? 'ثابت' :
                                        'ثابت'}
                        </Badge>
                    )} */}
                    {/* {isInBundle && (
                        <Badge className="text-xs font-normal px-2.5 py-1 bg-orange-100 text-orange-800 border border-orange-200">
                            بخشی از باندل
                        </Badge>
                    )} */}
                </div>
                {showRemoveButton && (
                    <button
                        onClick={onRemove}
                        className="text-red-500 transition-colors ml-4 rtl:mr-4 rtl:ml-0"
                        disabled={isUpdating}
                    >
                        <Trash2 className="w-5 h-5" />
                    </button>
                )}
            </div>

            <div className="flex-1 flex flex-col w-full gap-2">
                <div className="flex items-center justify-start gap-4 w-full">
                    <h3 className="sm:text-lg text-base font-medium   text-gray-900 dark:text-white">{item.name}</h3>
                    <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
                        {usageCount && <div className="bg-static-background-light text-[10px] text-my-header-label rounded-[10px] sm:px-5 px-2 py-1 whitespace-nowrap border border-static-border-neutral">
                            تعداد استفاده: {usageCount}
                        </div>}
                        {/* {durationMonths && durationMonths > 0 && (
                            <span className="bg-static-background-light flex items-center gap-2 text-[10px] text-my-header-label rounded-[10px] sm:px-5 px-2 py-1 whitespace-nowrap border border-static-border-neutral">
                                <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-clock">
                                    <circle cx="12" cy="12" r="10" />
                                    <polyline points="12 6 12 12 16 14" />
                                </svg>
                                <span className="">{durationMonths} ماه</span>
                            </span>
                        )} */}
                        <div className="flex border border-[#D5D7DA]  rounded-full w-fit px-2.5 py-1 justify-between items-center">
                            {getUnitModel(item.unitModel, item.showDurationInDays, item.countUnit)}
                        </div>
                    </div>
                </div>

                <p className="text-sm text-gray-600 font-normal dark:text-gray-400 -mt-1 mb-2">
                    {/* شناسه: {item.id} */}
                </p>

                <div className="flex items-center justify-between mt-2">
                    {supportsQuantityUpdate && !isInBundle && (
                        <QuantityInput
                            quantity={quantity}
                            onDecreaseQuantity={handleQuantityChange}
                            onIncreaseQuantity={handleQuantityChange}
                            isUpdating={isUpdating}
                            isItemUpdating={isItemUpdating?.(item.id)}
                        />
                    )}

                    {showPrice && (
                        <div className={cn(
                            "sm:text-xl text-base font-bold text-static-info-primary",
                            isInBundle && "text-gray-600"
                        )}>
                            {item?.price?.toLocaleString('fa-IR')} تومان
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}