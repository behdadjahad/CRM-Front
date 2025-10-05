"use client";

import React, { ReactNode } from 'react';
import { X } from 'lucide-react';
import { Unit } from '@/types/packages';
import { getFeatureDurationText, getUnitModelText, getUnitTypeText } from '@/lib/feature-utils';

interface FeatureTagProps {
    feature: Unit;
    tagType?: 'duration' | 'unitModel' | 'unitType' | 'custom';
    customText?: string;
    // Optional functionality props
    closable?: boolean;
    onClose?: () => void;
    icon?: ReactNode;
    onClick?: () => void;
    className?: string;
}

const FeatureTag: React.FC<FeatureTagProps> = ({
    feature,
    tagType = 'duration',
    customText,
    closable = false,
    onClose,
    icon,
    onClick,
    className = ""
}) => {

    // Get text based on feature data and tag type
    const getTagText = (): string => {
        if (customText) return customText;

        switch (tagType) {
            case 'duration':
                return getFeatureDurationText(feature);
            case 'unitModel':
                return getUnitModelText(feature.unitModel);
            case 'unitType':
                return getUnitTypeText(feature.unitType);
            default:
                return getFeatureDurationText(feature);
        }
    };

    const text = getTagText();

    // Don't render if no text
    if (!text) return null;

    return (
        <div
            onClick={onClick}
            className={`text-sm flex-nowrap flex justify-between items-center text-static-info-primary whitespace-nowrap bg-white border-static-info-primary rounded-full border py-1 px-2 ${onClick ? 'cursor-pointer hover:bg-static-info-primary hover:text-white transition-colors' : ''} ${className}`}
        >
            {/* Optional icon */}
            {icon && (
                <div className="flex justify-center items-center ml-1">
                    {icon}
                </div>
            )}

            <p className="flex-1">{text}</p>

            {/* Optional close button */}
            {closable && onClose && (
                <button
                    onClick={(e) => {
                        e.stopPropagation();
                        onClose();
                    }}
                    className="flex items-center justify-center w-3 h-3 border border-static-info-primary rounded-full text-static-info-primary hover:text-static-info-primary transition-colors mr-1"
                    aria-label="Close"
                >
                    <X className="w-2 h-2 text-static-info-primary" />
                </button>
            )}
        </div>
    );
};

export default FeatureTag;
