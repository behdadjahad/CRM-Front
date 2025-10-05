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
    const handleIncrease = () => {
        onQuantityChange(item.id, item.quantity + 1);
    };

    const handleDecrease = () => {
        if (item.quantity > 1) {
            onQuantityChange(item.id, item.quantity - 1);
        } else if (item.quantity === 1) {
            onRemove();
        }
    };


    return (
        <div className="flex flex-col items-center p-4 bg-static-background-light rounded-lg shadow-sm ">
            <div className="flex items-center justify-between w-full mb-4">
                <div className="flex items-center gap-2">
                    {item.tag && (
                        <Badge className={cn("text-xs font-normal px-2.5 py-1 flex items-center justify-center rounded-full border",
                            getTagClasses(item.tag) === 'success' ? 'bg-static-error-light text-static-error-primary ' :
                                getTagClasses(item.tag) === 'warning' ? 'bg-static-warning-light text-static-warning-primary ' :
                                    getTagClasses(item.tag) === 'info' ? 'bg-static-info-light text-static-info-primary ' : 'bg-gray-100 text-gray-800 ')}>
                            {getTagLabel(item.tag)}
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
                        {item.usageCount && <div className="bg-static-background-light text-[10px] text-my-header-label rounded-[10px] sm:px-5 px-2 py-1 whitespace-nowrap border border-static-border-neutral">
                            تعداد استفاده:    {item.usageCount}
                        </div>}
                        {item.durationMonths && (
                            <span className="bg-static-background-light flex items-center gap-2 text-[10px] text-my-header-label rounded-[10px] sm:px-5 px-2 py-1 whitespace-nowrap border border-static-border-neutral">

                                <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-clock">
                                    <circle cx="12" cy="12" r="10" />
                                    <polyline points="12 6 12 12 16 14" />
                                </svg>
                                <span className="">۳ ماه</span>
                            </span>
                        )}
                    </div>
                </div>

                <p className="text-sm text-gray-600 font-normal dark:text-gray-400 -mt-1 mb-2">{item.category}</p>
                <p className="text-sm text-gray-500 font-normal dark:text-gray-400">{item.description}</p>

                <div className="flex items-center justify-between mt-2">

                    <QuantityInput quantity={item.quantity} onDecreaseQuantity={handleDecrease} onIncreaseQuantity={handleIncrease} isUpdating={isUpdating} />
                    <div className="sm:text-xl text-base font-bold text-static-info-primary   0">
                        {item.price.toLocaleString('fa-IR')} تومن
                    </div>
                </div>
            </div>


        </div>
    );
}