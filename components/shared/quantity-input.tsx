import React from 'react'
import { Minus, Plus } from 'lucide-react'
interface QanutityType {
    quantity: number
    onDecreaseQuantity: (quantity: number) => void
    onIncreaseQuantity: (quantity: number) => void
    isUpdating: boolean
}

export default function QuantityInput({
    quantity,
    onDecreaseQuantity,
    onIncreaseQuantity,
    isUpdating
}: QanutityType) {
    return (
        <div className="flex opacity-40 cursor-not-allowed items-center gap-2">
            <span className="text-black text-sm font-normal">مقدار:</span>
            <button
            disabled={true}
                onClick={() => onDecreaseQuantity(quantity - 1)}
                // disabled={isUpdating}
                className="p-2 flex items-center justify-center border border-border-gray-300 rounded-sm bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors disabled:opacity-50"
            >
                <Minus className="w-3 h-3 text-border-foreground" />
            </button>
            <div className="font-medium border px-7 text-sm my-2 py-1  bg-gray-100 flex items-center justify-center rounded-sm text-foreground dark:text-white text-center">{quantity}</div>
            <button
                onClick={() => onIncreaseQuantity(quantity + 1)}
                // disabled={isUpdating}
                disabled={true}
                className="p-2 flex items-center justify-center border border-border-gray-300 rounded-sm bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors disabled:opacity-50"
            >
                <Plus className="w-3 h-3 text-border-foreground" />
            </button>
        </div>
    )
}