'use client';

import React, { useState, useCallback, useRef, useEffect } from 'react';
import { cn } from '@/lib/utils';
import Image from 'next/image';
import { PlaceResult, PlaceAutocompleteProps } from '@/types/place';

/**
 * PlaceAutocomplete Component
 * 
 * A reusable autocomplete component for searching places using OpenStreetMap Nominatim API.
 * Supports Persian (fa) input and displays results in Persian where available.
 * 
 * @param onPlaceSelect - Callback function when a place is selected
 * @param placeholder - Placeholder text for the input
 * @param maxResults - Maximum number of results to display (default: 5)
 * @param debounceDelay - Debounce delay in milliseconds (default: 500)
 * @param countrycodes - ISO 3166-1 alpha-2 country codes to limit search (e.g., 'ir' for Iran)
 * @param className - Additional CSS classes
 * @param disabled - Whether the input is disabled
 * @param defaultValue - Default value for the input
 * @param acceptLanguage - Language preference for results (default: 'fa,en')
 */
export default function PlaceAutocomplete({
    onPlaceSelect,
    placeholder = 'جستجوی مکان...',
    maxResults = 5,
    debounceDelay = 500,
    countrycodes = '',
    className = '',
    disabled = false,
    defaultValue = '',
    acceptLanguage = 'fa,en',
}: PlaceAutocompleteProps) {
    const [searchValue, setSearchValue] = useState(defaultValue);
    const [isSearching, setIsSearching] = useState(false);
    const [results, setResults] = useState<PlaceResult[]>([]);
    const [showResults, setShowResults] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const debounceRef = useRef<NodeJS.Timeout | null>(null);
    const inputRef = useRef<HTMLInputElement>(null);
    const resultsRef = useRef<HTMLDivElement>(null);

    // Handle click outside to close results
    useEffect(() => {
        function handleClickOutside(event: MouseEvent) {
            if (
                inputRef.current &&
                !inputRef.current.contains(event.target as Node) &&
                resultsRef.current &&
                !resultsRef.current.contains(event.target as Node)
            ) {
                setShowResults(false);
            }
        }

        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, []);

    // Debounced search function
    const performSearch = useCallback(
        async (query: string) => {
            if (!query || query.trim() === '') {
                setResults([]);
                setShowResults(false);
                return;
            }

            setIsSearching(true);
            setError(null);

            try {
                // Build API URL
                const url = new URL('/api/nominatim/search', window.location.origin);
                url.searchParams.set('q', query);
                url.searchParams.set('limit', maxResults.toString());
                url.searchParams.set('accept-language', acceptLanguage);

                if (countrycodes) {
                    url.searchParams.set('countrycodes', countrycodes);
                }

                const response = await fetch(url.toString());

                if (!response.ok) {
                    throw new Error('Failed to fetch places');
                }

                const data: PlaceResult[] = await response.json();
                setResults(data);
                setShowResults(true);
            } catch (err: any) {
                console.error('Place search error:', err);
                setError(err.message || 'خطا در جستجوی مکان');
                setResults([]);
            } finally {
                setIsSearching(false);
            }
        },
        [maxResults, countrycodes, acceptLanguage]
    );

    // Handle input change with debounce
    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value;
        setSearchValue(value);

        // Clear previous timeout
        if (debounceRef.current) {
            clearTimeout(debounceRef.current);
        }

        // Set new timeout for debounced search
        debounceRef.current = setTimeout(() => {
            performSearch(value);
        }, debounceDelay);
    };

    // Handle place selection
    const handlePlaceSelect = (place: PlaceResult) => {
        setSearchValue(place.displayName);
        setShowResults(false);
        setResults([]);
        onPlaceSelect(place);
    };

    // Handle clear
    const handleClear = () => {
        setSearchValue('');
        setResults([]);
        setShowResults(false);
        setError(null);
        onPlaceSelect(null);
        inputRef.current?.focus();
    };

    // Handle key press
    const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === 'Escape') {
            setShowResults(false);
        }
    };

    // Cleanup on unmount
    useEffect(() => {
        return () => {
            if (debounceRef.current) {
                clearTimeout(debounceRef.current);
            }
        };
    }, []);

    return (
        <div className={cn('relative w-full', className)}>
            {/* Input field */}
            <div className="relative">
                <input
                    ref={inputRef}
                    type="text"
                    placeholder={placeholder}
                    value={searchValue}
                    onChange={handleInputChange}
                    onKeyDown={handleKeyPress}
                    onFocus={() => {
                        if (results.length > 0) {
                            setShowResults(true);
                        }
                    }}
                    className={cn(
                        'text-sm h-11 w-full placeholder:text-xs placeholder:text-subtitle/80',
                        'outline-none p-3 rounded-lg text-right border border-border/20',
                        'focus:border-foreground transition-all duration-200',
                        'pl-10 pr-3'
                    )}
                    disabled={disabled}
                />

                {/* Search Icon - Left side */}
                <div className="absolute left-3 top-1/2 transform -translate-y-1/2 flex items-center pointer-events-none">
                    {isSearching ? (
                        <div className="w-4 h-4 border-2 border-gray-300 border-t-blue-600 rounded-full animate-spin" />
                    ) : (
                        <Image
                            src="/icons/search.svg"
                            alt="search"
                            width={16}
                            height={16}
                            className="text-tertiary-background"
                        />
                    )}
                </div>

                {/* Clear button */}
                {searchValue && !disabled && (
                    <button
                        type="button"
                        onClick={handleClear}
                        className="absolute right-3 top-1/2 transform -translate-y-1/2 text-subtitle hover:text-foreground"
                    >
                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            width="16"
                            height="16"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                        >
                            <line x1="18" y1="6" x2="6" y2="18" />
                            <line x1="6" y1="6" x2="18" y2="18" />
                        </svg>
                    </button>
                )}
            </div>

            {/* Results dropdown */}
            {showResults && (results.length > 0 || error) && (
                <div
                    ref={resultsRef}
                    className="absolute z-50 w-full mt-2 bg-card border border-border/20 rounded-lg shadow-lg max-h-80 overflow-y-auto"
                >
                    {error ? (
                        <div className="p-4 text-sm text-danger text-center">{error}</div>
                    ) : (
                        <ul className="py-2">
                            {results.map((place, index) => (
                                <li key={`${place.placeId}-${index}`}>
                                    <button
                                        type="button"
                                        onClick={() => handlePlaceSelect(place)}
                                        className={cn(
                                            'w-full text-right px-4 py-3 hover:bg-primary-muted',
                                            'transition-colors duration-150 cursor-pointer',
                                            'border-b border-border/10 last:border-b-0'
                                        )}
                                    >
                                        <div className="flex items-start gap-3">
                                            <div className="flex-shrink-0 mt-1">
                                                <svg
                                                    xmlns="http://www.w3.org/2000/svg"
                                                    width="16"
                                                    height="16"
                                                    viewBox="0 0 24 24"
                                                    fill="none"
                                                    stroke="currentColor"
                                                    strokeWidth="2"
                                                    strokeLinecap="round"
                                                    strokeLinejoin="round"
                                                    className="text-secondary"
                                                >
                                                    <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
                                                    <circle cx="12" cy="10" r="3" />
                                                </svg>
                                            </div>
                                            <div className="flex-1 min-w-0">
                                                <p className="text-sm text-foreground font-medium truncate">
                                                    {place.displayName}
                                                </p>
                                                {place.address && (
                                                    <p className="text-xs text-subtitle mt-1">
                                                        {place.address.city && place.address.country
                                                            ? `${place.address.city}, ${place.address.country}`
                                                            : place.address.country || place.address.city || ''}
                                                    </p>
                                                )}
                                            </div>
                                        </div>
                                    </button>
                                </li>
                            ))}
                        </ul>
                    )}
                </div>
            )}

            {/* No results message */}
            {showResults && !isSearching && results.length === 0 && searchValue && !error && (
                <div
                    ref={resultsRef}
                    className="absolute z-50 w-full mt-2 bg-card border border-border/20 rounded-lg shadow-lg"
                >
                    <div className="p-4 text-sm text-subtitle text-center">
                        نتیجه‌ای یافت نشد
                    </div>
                </div>
            )}
        </div>
    );
}

