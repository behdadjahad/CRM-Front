import { CartItem as CartItemType } from "@/types/cart";
import { Minus, Plus, Trash2 } from "lucide-react";
import { cn } from "@/lib/utils";
import { Badge } from "../ui/badge";
import QuantityInput from "../shared/quantity-input";

interface CartItemProps {
    item: CartItemType;
    onQuantityChange: (id: string, quantity: number) => void;
    onRemove: () => void;
    isUpdating: boolean;
}

export default function CartItem({
    item,
    onQuantityChange,
    onRemove,
    isUpdating,
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
    // For API items, we don't have quantity concept yet
    // So we'll keep quantity as 1 for now
    const quantity = 1;

    const handleIncrease = () => {
        // Quantity management can be added later if needed
        console.log('Increase quantity');
    };

    const handleDecrease = () => {
        // If there's no quantity management, just remove the item
        onRemove();
    };


    // Get duration in months from API data (enabledDurationInDays / 30)
    const durationMonths = item.enabledDurationInDays ? Math.round(item.enabledDurationInDays / 30) : null;
    const usageCount = item.countUnit > 0 ? item.countUnit : null;

    return (
        <div className="flex flex-col items-center p-4 bg-static-background-light rounded-lg shadow-sm ">
            <div className="flex items-center justify-between w-full mb-4">
                <div className="flex items-center gap-2">
                    {item.unitModel && (
                        <Badge className={cn("text-xs font-normal px-2.5 py-1 flex items-center justify-center rounded-full border",
                            item.unitModel === 'flat' ? 'bg-static-info-light text-static-info-primary' :
                                item.unitModel === 'usage' ? 'bg-static-warning-light text-static-warning-primary' :
                                    'bg-gray-100 text-gray-800')}>
                            {item.unitModel === 'flat' ? 'ثابت' :
                                item.unitModel === 'usage' ? 'استفاده محور' :
                                    item.unitModel}
                        </Badge>
                    )}
                </div>
                <button
                    onClick={onRemove}
                    className="text-red-500 transition-colors ml-4 rtl:mr-4 rtl:ml-0"
                    disabled={isUpdating}
                >
                    <Trash2 className="w-5 h-5" />
                </button>
            </div>

            <div className="flex-1 flex flex-col w-full gap-2">
                <div className="flex items-center justify-start gap-4 w-full">
                    <h3 className="sm:text-lg text-base font-medium  text-gray-900 dark:text-white">{item.name}</h3>
                    <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
                        {usageCount && <div className="bg-static-background-light text-[10px] text-my-header-label rounded-[10px] sm:px-5 px-2 py-1 whitespace-nowrap border border-static-border-neutral">
                            تعداد استفاده: {usageCount}
                        </div>}
                        {durationMonths && durationMonths > 0 && (
                            <span className="bg-static-background-light flex items-center gap-2 text-[10px] text-my-header-label rounded-[10px] sm:px-5 px-2 py-1 whitespace-nowrap border border-static-border-neutral">
                                <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-clock">
                                    <circle cx="12" cy="12" r="10" />
                                    <polyline points="12 6 12 12 16 14" />
                                </svg>
                                <span className="">{durationMonths} ماه</span>
                            </span>
                        )}
                    </div>
                </div>

                <p className="text-sm text-gray-600 font-normal dark:text-gray-400 -mt-1 mb-2">
                    شناسه: {item.id}
                </p>

                <div className="flex items-center justify-between mt-2">
                    <button
                        onClick={onRemove}
                        disabled={isUpdating}
                        className="text-red-600 text-sm font-medium hover:text-red-700 disabled:opacity-50"
                    >
                        حذف از سبد
                    </button>
                    <div className="sm:text-xl text-base font-bold text-static-info-primary">
                        {item.price.toLocaleString('fa-IR')} تومان
                    </div>
                </div>
            </div>
        </div>
    );
}