"use client";

import React from 'react';
import { Button } from '@/components/ui/button';

interface FeatureSelectionBarProps {
    selectedCount: number;
    onAddToCart: () => void;
    onClearSelection: () => void;
    isLoading?: boolean;
}

export const FeatureSelectionBar: React.FC<FeatureSelectionBarProps> = ({
    selectedCount,
    onAddToCart,
    onClearSelection,
    isLoading = false,
}) => {
    if (selectedCount === 0) return null;

    return (
        <div className="fixed top-3 left-1/2 transform -translate-x-1/2 bg-white p-4 rounded-xl shadow-2xl border-2 border-blue-500 z-50 animate-in slide-in-from-bottom-5">
            <div className="flex items-center gap-4">
                <span className="text-sm font-medium text-gray-700">
                    {selectedCount} مورد انتخاب شده
                </span>
                <Button
                    onClick={onAddToCart}
                    variant="info"
                    size="lg"
                    className="px-6"
                    disabled={isLoading}
                >
                    {isLoading ? 'در حال افزودن...' : 'افزودن به سبد خرید'}
                </Button>
                <button
                    onClick={onClearSelection}
                    className="text-gray-500 hover:text-gray-700 text-sm"
                    disabled={isLoading}
                >
                    لغو انتخاب
                </button>
            </div>
        </div>
    );
};

