"use client";

import React, { useState, useRef, useEffect } from 'react';
import { createPortal } from 'react-dom';

interface TooltipProps {
    children: React.ReactNode;
    content: string;
    disabled?: boolean;
    className?: string;
    delay?: number;
}

const Tooltip: React.FC<TooltipProps> = ({
    children,
    content,
    disabled = false,
    className = "",
    delay = 500
}) => {
    const [isVisible, setIsVisible] = useState(false);
    const [position, setPosition] = useState({ top: 0, left: 0 });
    const triggerRef = useRef<HTMLDivElement>(null);
    const timeoutRef = useRef<NodeJS.Timeout>();

    const showTooltip = (event: React.MouseEvent) => {
        if (disabled || !content) return;

        const rect = (event.currentTarget as HTMLElement).getBoundingClientRect();
        const tooltipWidth = 200; // Estimated tooltip width
        const tooltipHeight = 40; // Estimated tooltip height

        let left = rect.left + rect.width / 2 - tooltipWidth / 2;
        let top = rect.top - tooltipHeight - 8; // 8px gap above the element

        // Adjust if tooltip goes off screen
        const padding = 16;
        if (left < padding) {
            left = padding;
        } else if (left + tooltipWidth > window.innerWidth - padding) {
            left = window.innerWidth - tooltipWidth - padding;
        }

        // If tooltip goes above viewport, show it below
        if (top < padding) {
            top = rect.bottom + 8;
        }

        setPosition({ top, left });

        timeoutRef.current = setTimeout(() => {
            setIsVisible(true);
        }, delay);
    };

    const hideTooltip = () => {
        if (timeoutRef.current) {
            clearTimeout(timeoutRef.current);
        }
        setIsVisible(false);
    };

    useEffect(() => {
        const handleScroll = () => {
            if (isVisible) {
                hideTooltip();
            }
        };

        // Add scroll listener to hide tooltip when scrolling
        window.addEventListener('scroll', handleScroll, true);

        return () => {
            if (timeoutRef.current) {
                clearTimeout(timeoutRef.current);
            }
            window.removeEventListener('scroll', handleScroll, true);
        };
    }, [isVisible]);

    const tooltip = isVisible && typeof window !== 'undefined' ? (
        createPortal(
            <div
                className="fixed z-[9999] px-3 py-2 text-sm text-white bg-gray-800 rounded-lg shadow-lg max-w-xs break-words animate-in fade-in-0 zoom-in-95"
                style={{
                    top: `${position.top}px`,
                    left: `${position.left}px`,
                    direction: 'rtl',
                    textAlign: 'right'
                }}
            >
                {content}

                <div
                    className="absolute w-2 h-2 bg-gray-800 transform rotate-45"
                    style={{
                        bottom: '-4px', // Always at bottom of tooltip box
                        left: '50%',
                        transform: 'translateX(-50%) rotate(45deg)'
                    }}
                />
            </div>,
            document.body
        )
    ) : null;

    return (
        <>
            <div
                ref={triggerRef}
                className={className}
                onMouseEnter={showTooltip}
                onMouseLeave={hideTooltip}
                // onFocus={showTooltip}
                onBlur={hideTooltip}
            >
                {children}
            </div>
            {tooltip}
        </>
    );
};

export default Tooltip;
