"use client";

import React from 'react';
import SingleFeatureCard from './single-feature-card';
import { PackageUnit } from '@/types/single-features-api';
import { SingleFeatureUnit } from '@/data/single-features-mock-data';
import { hasFeatureCode } from '@/lib/feature-match-utils';

interface SingleFeaturesGridProps {
    units: PackageUnit[];
    convertToSingleFeatureUnit: (unit: PackageUnit) => SingleFeatureUnit;
    chadcoCustomerId?: number;
    isItemInCart: (itemId: number) => boolean;
    isItemChecked: (itemId: number) => boolean;
    onItemCheckChange: (itemId: number, checked: boolean) => void;
    onAddToCart: (unitId: number, requestMessage: string) => void;
    onRemoveFromCart: (itemId: string) => void;
    onPurchase?: (unitId: number, description: string) => void;
    loadingItems: Set<number>;
    highlightCode?: string;
}

export const SingleFeaturesGrid: React.FC<SingleFeaturesGridProps> = ({
    units,
    convertToSingleFeatureUnit,
    chadcoCustomerId,
    isItemInCart,
    isItemChecked,
    onItemCheckChange,
    onAddToCart,
    onRemoveFromCart,
    onPurchase,
    loadingItems,
    highlightCode,
}) => {
    if (units.length === 0) {
        return (
            <div className="text-center py-12">
                <div className="text-gray-500 text-lg mb-2">
                    هیچ فیچری یافت نشد
                </div>
                <div className="text-gray-400 text-sm">
                    لطفاً فیلترهای خود را تغییر دهید یا عبارت جستجوی دیگری امتحان کنید
                </div>
            </div>
        );
    }

    return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {units.map((unit) => {
                const isHighlighted = highlightCode ? hasFeatureCode(unit.accessesJson, highlightCode) : false;

                return (
                    <SingleFeatureCard
                        key={unit.id}
                        unit={convertToSingleFeatureUnit(unit)}
                        chadcoCustomerId={chadcoCustomerId}
                        onPurchase={onPurchase}
                        isInCart={isItemInCart(unit.id)}
                        onAddToCart={(unitId, requestMessage) => {
                            onAddToCart(unitId, requestMessage || '');
                        }}
                        onRemoveFromCart={onRemoveFromCart}
                        showCartActions={true}
                        isChecked={isItemChecked(unit.id)}
                        onCheckChange={onItemCheckChange}
                        cartLoading={loadingItems.has(unit.id)}
                        isSelectable={!isItemInCart(unit.id)}
                        isHighlighted={isHighlighted}
                        highlightCode={highlightCode || ""}
                        accessesJson={unit.accessesJson}
                    />
                );
            })}
        </div>
    );
};

