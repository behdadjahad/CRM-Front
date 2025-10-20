"use client";

import React from 'react';
import AutocompleteInput from '../shared/autocomplete-input';
import { PackageUnit } from '@/types/single-features-api';

interface SingleFeaturesHeaderProps {
    searchTerm: string;
    onSearchChange: (value: string) => void;
    onSearchSelect: (feature: PackageUnit) => void;
    packageUnits: PackageUnit[];
    selectedCount: number;
    selectableCount: number;
    allSelected: boolean;
    onSelectAll: (checked: boolean) => void;
}

export const SingleFeaturesHeader: React.FC<SingleFeaturesHeaderProps> = ({
    searchTerm,
    onSearchChange,
    onSearchSelect,
    packageUnits,
    selectedCount,
    selectableCount,
    allSelected,
    onSelectAll,
}) => {
    return (
        <div className="flex justify-between items-center gap-4">
            {/* Select All Checkbox */}
            <div className="flex items-center gap-2">
                <input
                    type="checkbox"
                    checked={allSelected}
                    onChange={(e) => onSelectAll(e.target.checked)}
                    className="w-4 h-4 rounded border-gray-300"
                />
                <span className="text-sm text-gray-700">
                    {selectedCount > 0
                        ? `${selectedCount} مورد انتخاب شده`
                        : `انتخاب همه (${selectableCount} مورد قابل انتخاب)`}
                </span>
            </div>

            {/* Search Input */}
            <div>
                <AutocompleteInput<PackageUnit>
                    value={searchTerm}
                    onChange={onSearchChange}
                    onSelect={onSearchSelect}
                    data={packageUnits}
                    filterFn={(unit, query) => {
                        const lowerQuery = query.toLowerCase();
                        return (
                            unit.name.toLowerCase().includes(lowerQuery) ||
                            unit.description?.toLowerCase().includes(lowerQuery) ||
                            unit.packageCategories?.some(cat =>
                                cat.name.toLowerCase().includes(lowerQuery)
                            ) || false
                        );
                    }}
                    displayFn={(unit) => {
                        const category = unit.packageCategories?.[0]?.name || 'عمومی';
                        return `${unit.name} (${category})`;
                    }}
                    placeholder="جستجو در فیچرها..."
                    className="w-80"
                    maxResults={10}
                    debounceMs={300}
                />
            </div>
        </div>
    );
};

