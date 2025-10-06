"use client";

import React, { ReactNode } from 'react';
import { X } from 'lucide-react';

interface TagProps {
    text: string;
    // Optional functionality props
    closable?: boolean;
    onClose?: () => void;
    icon?: ReactNode;
    onClick?: () => void;
    className?: string;
}

const Tag: React.FC<TagProps> = ({
    text,
    closable = false,
    onClose,
    icon,
    onClick,
    className = ""
}) => {
    return (
        <div onClick={onClick} className={` lg:text-xs xl:text-sm text-sm flex-nowrap flex justify-between align-center text-[#1C68DA] whitespace-nowrap bg-white border-[#1C68DA] rounded-full border py-1 px-2 ${onClick ? 'cursor-pointer hover:bg-[#1C68DA] hover:text-white transition-colors' : ''} ${className}`} >
            {/* Optional icon */}
            {icon && (
                <div className="flex justify-center  items-center">
                    {icon}
                </div>
            )}

            {/* Optional close button */}
            {closable && onClose && (
                <button
                    onClick={onClose}
                    className={`flex items-center justify-center w-3 h-3 border border-[#1C68DA] rounded-full text-[#1C68DA] hover:text-[#1C68DA] transition-colors ${className}`}
                    aria-label="Close"
                >
                    <X className={`w-2 h-2 text-[#1C68DA] ${className}`} />
                </button>
            )}

            <p >{text}</p>



        </div>
    );
};

export default Tag;