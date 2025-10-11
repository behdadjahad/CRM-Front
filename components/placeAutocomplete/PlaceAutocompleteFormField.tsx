'use client';

import React from 'react';
import { cn } from '@/lib/utils';
import { FormMakerInterface } from '../shared/form-maker';
import PlaceAutocomplete from './PlaceAutocomplete';
import { PlaceResult } from '@/types/place';

/**
 * PlaceAutocompleteFormField Component
 * 
 * A wrapper component for PlaceAutocomplete that integrates with the existing
 * FormMaker system in the project. This allows you to use place autocomplete
 * as a form field type.
 * 
 * Usage in FormMaker:
 * 
 * const fields = [
 *   {
 *     key: 'location',
 *     type: 'place-autocomplete',
 *     placeholder: 'مکان را انتخاب کنید',
 *     countrycodes: 'ir',
 *     acceptLanguage: 'fa,en',
 *     maxResults: 5,
 *   },
 * ];
 * 
 * The selected place will be stored in form.values[item.key] as a PlaceResult object.
 * You can also configure it to store latitude and longitude in separate fields:
 * 
 * const fields = [
 *   {
 *     key: 'location',
 *     type: 'place-autocomplete',
 *     placeholder: 'مکان را انتخاب کنید',
 *     storeCoordinates: true, // Will store latitude/longitude in separate fields
 *     latitudeKey: 'lat',     // Optional: custom key for latitude
 *     longitudeKey: 'lng',    // Optional: custom key for longitude
 *   },
 * ];
 */
export default function PlaceAutocompleteFormField({
    form,
    item,
    disabled = false,
}: {
    form: any;
    item: FormMakerInterface['fields'][0];
    disabled?: boolean;
}) {
    const handlePlaceSelect = (place: PlaceResult | null) => {
        // Store the complete place object
        form.setFieldValue(item.key, place);

        // Optionally store coordinates in separate fields
        if ((item as any).storeCoordinates && place) {
            const latKey = (item as any).latitudeKey || `${item.key}_latitude`;
            const lonKey = (item as any).longitudeKey || `${item.key}_longitude`;

            form.setFieldValue(latKey, place.latitude);
            form.setFieldValue(lonKey, place.longitude);

            // Optionally store address components
            if ((item as any).storeAddress && place.address) {
                form.setFieldValue(`${item.key}_city`, place.address.city || '');
                form.setFieldValue(`${item.key}_state`, place.address.state || '');
                form.setFieldValue(`${item.key}_country`, place.address.country || '');
            }
        }

        // Call custom onChange if provided
        if (item.onChange) {
            item.onChange(place as any);
        }
    };

    const currentValue = form.values[item.key];
    const displayValue = currentValue?.displayName || '';

    return (
        <div className={cn('relative w-full', item.className)}>
            {/* Label */}
            {!item.floating && item.placeholder && (
                <label className="block text-sm font-medium text-foreground mb-2">
                    {item.placeholder}
                    {(item as any).required && (
                        <span className="text-danger mr-1">*</span>
                    )}
                </label>
            )}

            {/* PlaceAutocomplete Component */}
            <PlaceAutocomplete
                onPlaceSelect={handlePlaceSelect}
                placeholder={item.floating ? item.placeholder : 'جستجوی مکان...'}
                maxResults={(item as any).maxResults || 5}
                debounceDelay={(item as any).debounceDelay || 500}
                countrycodes={(item as any).countrycodes || ''}
                disabled={disabled || item.disabled}
                defaultValue={displayValue}
                acceptLanguage={(item as any).acceptLanguage || 'fa,en'}
                className={(item as any).inputClassName}
            />

            {/* Display selected location info */}
            {currentValue && (item as any).showLocationInfo && (
                <div className="mt-2 p-3 bg-primary-muted rounded-lg border border-border/20">
                    <div className="text-xs space-y-1">
                        <p className="font-medium text-foreground">
                            {currentValue.displayName}
                        </p>

                        {currentValue.address && (
                            <div className="text-subtitle">
                                {currentValue.address.city && (
                                    <p>شهر: {currentValue.address.city}</p>
                                )}
                                {currentValue.address.state && (
                                    <p>استان: {currentValue.address.state}</p>
                                )}
                            </div>
                        )}

                        <div className="text-subtitle pt-1 border-t border-border/10">
                            <p>
                                مختصات: {currentValue.latitude.toFixed(4)}, {currentValue.longitude.toFixed(4)}
                            </p>
                        </div>
                    </div>
                </div>
            )}

            {/* Error message */}
            {form.errors[item.key] && form.touched[item.key] && (
                <p className="text-danger text-xs mt-1">
                    {form.errors[item.key]}
                </p>
            )}

            {/* Help text */}
            {(item as any).helpText && (
                <p className="text-subtitle text-xs mt-1">
                    {(item as any).helpText}
                </p>
            )}
        </div>
    );
}


