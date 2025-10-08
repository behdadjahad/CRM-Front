import React, { useState, useCallback, useRef, useEffect } from 'react';
import { FormMakerInterface } from './form-maker';
import { cn } from '@/lib/utils';
import Image from 'next/image';
import { Button } from '../ui/button';

export default function SearchInput({
    form,
    item,
    disabled = false
}: {
    form: any;
    item: FormMakerInterface['fields'][0];
    disabled?: boolean;
}) {
    const [searchValue, setSearchValue] = useState('');
    const [isSearching, setIsSearching] = useState(false);
    const debounceRef = useRef<NodeJS.Timeout | null>(null);

    // Initialize search value from form
    useEffect(() => {
        if (form.values[item.key]) {
            setSearchValue(form.values[item.key]);
        }
    }, [form.values, item.key]);

    // Debounced search function
    const debouncedSearch = useCallback(
        (value: string) => {
            if (debounceRef.current) {
                clearTimeout(debounceRef.current);
            }

            debounceRef.current = setTimeout(() => {
                setIsSearching(false);
                // Call the search callback if provided
                if (item.onChange) {
                    item.onChange(value as any);
                }
            }, (item as any).debounceDelay || 300);
        },
        [item.onChange, (item as any).debounceDelay]
    );

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value;
        setSearchValue(value);
        form.setFieldValue(item.key, value);

        // Show searching state
        setIsSearching(true);

        // Trigger debounced search
        debouncedSearch(value);
    };

    const handleClearSearch = () => {
        setSearchValue('');
        form.setFieldValue(item.key, '');
        setIsSearching(false);

        // Clear any pending debounced calls
        if (debounceRef.current) {
            clearTimeout(debounceRef.current);
        }

        // Call onChange with empty value
        if (item.onChange) {
            item.onChange('' as any);
        }
    };

    const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === 'Enter') {
            e.preventDefault();
            // Trigger immediate search on Enter
            if (debounceRef.current) {
                clearTimeout(debounceRef.current);
            }
            setIsSearching(false);
            if (item.onChange) {
                item.onChange(searchValue as any);
            }
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
        <div className={cn('relative w-full', { 'input-container': item.floating })}>
            <input
                key={item.key}
                type="text"
                placeholder={item.floating ? ' ' : item.placeholder || 'جستجو کنید...'}
                value={searchValue}
                onChange={handleInputChange}
                onKeyPress={handleKeyPress}
                className={cn(
                    'text-sm h-11 w-full placeholder:text-xs placeholder:text-subtitle/80 outline-none p-3 rounded-lg text-right border',
                    item.labelClassName,
                    {
                        'floating-input bg-primary-foreground': item.floating,
                        
                        'pl-10': true, // Always reserve space for left search icon
                    }
                )}
                readOnly={item.readonly}
                disabled={(item?.disabled || disabled) ?? false}
            />

            {item.floating && (
                <label className="floating-label">
                    {item.placeholder || 'جستجو کنید...'}
                </label>
            )}

            {/* Search Icon - Left side */}
            <div className="absolute left-3 top-1/2 transform -translate-y-1/2 flex items-center">
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

            

           
        </div>
    );
}