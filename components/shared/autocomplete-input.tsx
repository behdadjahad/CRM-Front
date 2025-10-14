'use client'

import React, { useState, useEffect, useRef, useCallback } from 'react';
import { debounce } from 'lodash';
import { cn } from '@/lib/utils';

interface AutocompleteInputProps<T> {
    value: string;
    onChange: (value: string) => void;
    onSelect: (item: T) => void;
    data: T[];
    filterFn: (item: T, query: string) => boolean;
    displayFn: (item: T) => string;
    placeholder?: string;
    className?: string;
    fetchMore?: (query: string) => Promise<T[]>;
    debounceMs?: number;
    maxResults?: number;
    disabled?: boolean;
}

export default function AutocompleteInput<T>({
    value,
    onChange,
    onSelect,
    data,
    filterFn,
    displayFn,
    placeholder = "جستجو...",
    className,
    fetchMore,
    debounceMs = 300,
    maxResults = 5,
    disabled,
}: AutocompleteInputProps<T>) {
    const [isOpen, setIsOpen] = useState(false);
    const [suggestions, setSuggestions] = useState<T[]>([]);
    const [highlightedIndex, setHighlightedIndex] = useState(-1);
    const [isLoading, setIsLoading] = useState(false);
    const inputRef = useRef<HTMLInputElement>(null);
    const dropdownRef = useRef<HTMLDivElement>(null);
    // Handle click outside to close dropdown
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (
                dropdownRef.current &&
                !dropdownRef.current.contains(event.target as Node) &&
                inputRef.current &&
                !inputRef.current.contains(event.target as Node)
            ) {
                setIsOpen(false);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    // Debounced search function
    const debouncedSearch = useCallback(
        debounce(async (query: string) => {
            if (!query.trim()) {
                setSuggestions([]);
                setIsOpen(false);
                return;
            }

            // Filter local data first
            const localResults = data.filter(item => filterFn(item, query)).slice(0, maxResults);
            console.log('AutocompleteInput - Query:', query, 'Found results:', localResults.length, 'Results:', localResults.map(item => displayFn(item)));
            setSuggestions(localResults);
            setIsOpen(true);
            setHighlightedIndex(-1);

            // Optionally fetch more from API
            if (fetchMore && localResults.length < maxResults) {
                setIsLoading(true);
                try {
                    const apiResults = await fetchMore(query);
                    const combined = [...localResults, ...apiResults].slice(0, maxResults);
                    setSuggestions(combined);
                } catch (error) {
                    console.error('Error fetching suggestions:', error);
                } finally {
                    setIsLoading(false);
                }
            }
        }, debounceMs),
        [data, filterFn, fetchMore, debounceMs, maxResults]



    );
    // Handle item selection
    const handleSelectItem = (item: T) => {
        const displayText = displayFn(item);
        onChange(displayText);
        onSelect(item);
        setIsOpen(false);
        setHighlightedIndex(-1);
        inputRef.current?.blur();
    };

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const newValue = e.target.value;
        onChange(newValue);
        debouncedSearch(newValue);
    };
    // Handle keyboard navigation
    const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (!isOpen) {
            if (e.key === 'ArrowDown' && value.trim()) {
                debouncedSearch(value);
            }
            return;
        }

        switch (e.key) {
            case 'ArrowDown':
                e.preventDefault();
                setHighlightedIndex(prev =>
                    prev < suggestions.length - 1 ? prev + 1 : prev
                );
                break;

            case 'ArrowUp':
                e.preventDefault();
                setHighlightedIndex(prev => (prev > 0 ? prev - 1 : -1));
                break;

            case 'Enter':
                e.preventDefault();
                if (highlightedIndex >= 0 && highlightedIndex < suggestions.length) {
                    handleSelectItem(suggestions[highlightedIndex]);
                }
                break;

            case 'Escape':
                e.preventDefault();
                setIsOpen(false);
                setHighlightedIndex(-1);
                break;
        }
    };

    // Highlight matching text
    const highlightMatch = (text: string, query: string) => {
        if (!query.trim()) return text;

        const parts = text.split(new RegExp(`(${query})`, 'gi'));
        return parts.map((part, index) =>
            part.toLowerCase() === query.toLowerCase() ? (
                <span key={index} className="font-bold text-blue-600">
                    {part}
                </span>
            ) : (
                part
            )
        );
    };
    // Scroll highlighted item into view
    useEffect(() => {
        if (highlightedIndex >= 0 && dropdownRef.current) {
            const highlightedElement = dropdownRef.current.children[highlightedIndex] as HTMLElement;
            if (highlightedElement) {
                highlightedElement.scrollIntoView({
                    block: 'nearest',
                    behavior: 'smooth',
                });
            }
        }
    }, [highlightedIndex]);
    // Filter local data first
    return (
        <div className={cn("relative", className)}>
            {/* Input Field */}
            <div className="relative">
                <input
                    ref={inputRef}
                    type="text"
                    value={value}
                    onChange={handleInputChange}
                    onKeyDown={handleKeyDown}
                    onFocus={() => {
                        if (value.trim() && suggestions.length > 0) {
                            setIsOpen(true);
                        }
                    }}
                    placeholder={placeholder}
                    disabled={disabled}
                    className={cn(
                        "w-full px-4 py-2 pr-10 border border-gray-300 rounded-md",
                        "focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent",
                        "disabled:bg-gray-100 disabled:cursor-not-allowed",
                        "text-right" // RTL support
                    )}
                />
                {/* Search Icon */}
                <div className="absolute right-3 top-1/2 transform -translate-y-1/2 pointer-events-none">
                    <svg
                        className="w-4 h-4 text-gray-400"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                    >
                        <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                        />
                    </svg>
                </div>
            </div>

            {/* Dropdown Suggestions */}
            {isOpen && (suggestions.length > 0 || isLoading) && (
                <div
                    ref={dropdownRef}
                    className="absolute z-50 w-full mt-1 bg-white border border-gray-200 rounded-md shadow-lg max-h-60 overflow-y-auto"
                >
                    {isLoading && (
                        <div className="px-4 py-3 text-center text-gray-500 text-sm">
                            <div className="inline-block animate-spin rounded-full h-4 w-4 border-b-2 border-blue-600 ml-2"></div>
                            در حال جستجو...
                        </div>
                    )}

                    {suggestions.length > 0 && (
                        <>
                            {console.log('Rendering suggestions:', suggestions.length, suggestions.map(item => displayFn(item)))}
                            {suggestions.map((item, index) => (
                                <div
                                    key={index}
                                    onClick={() => handleSelectItem(item)}
                                    onMouseEnter={() => setHighlightedIndex(index)}
                                    className={cn(
                                        "px-4 py-3 cursor-pointer text-right transition-colors",
                                        highlightedIndex === index
                                            ? "bg-blue-50 text-blue-700"
                                            : "hover:bg-gray-50"
                                    )}
                                >
                                    <div className="text-sm">
                                        {highlightMatch(displayFn(item), value)}
                                    </div>
                                </div>
                            ))}
                        </>
                    )}

                    {!isLoading && suggestions.length === 0 && value.trim() && (
                        <div className="px-4 py-3 text-center text-gray-500 text-sm">
                            نتیجه‌ای یافت نشد
                        </div>
                    )}
                </div>
            )}
        </div>
    );
}

