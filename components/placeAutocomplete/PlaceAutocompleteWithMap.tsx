'use client';

import React, { useState } from 'react';
import dynamic from 'next/dynamic';
import { cn } from '@/lib/utils';
import { PlaceResult, PlaceAutocompleteWithMapProps } from '@/types/place';
import PlaceAutocomplete from './PlaceAutocomplete';

// Dynamically import MapSelector to avoid SSR issues with Leaflet
const MapSelector = dynamic(() => import('./MapSelector'), {
    ssr: false,
    loading: () => (
        <div className="w-full h-[400px] bg-slate rounded-lg flex items-center justify-center">
            <div className="text-subtitle text-sm">در حال بارگذاری نقشه...</div>
        </div>
    ),
});

/**
 * PlaceAutocompleteWithMap Component
 * 
 * A comprehensive component combining place autocomplete and interactive map selection.
 * Users can either search for a location or click on the map to select one.
 * 
 * @param onPlaceSelect - Callback function when a place is selected
 * @param placeholder - Placeholder text for the autocomplete input
 * @param maxResults - Maximum number of autocomplete results (default: 5)
 * @param debounceDelay - Debounce delay for autocomplete in milliseconds (default: 500)
 * @param countrycodes - ISO 3166-1 alpha-2 country codes to limit search
 * @param mapCenter - Initial center coordinates for the map [latitude, longitude]
 * @param mapZoom - Initial zoom level for the map (default: 13)
 * @param allowMultipleMarkers - Allow multiple markers on the map (default: false)
 * @param layout - Layout direction: 'vertical' or 'horizontal' (default: 'vertical')
 * @param mapHeight - Height of the map (default: '400px')
 * @param className - Additional CSS classes
 * @param disabled - Whether the autocomplete is disabled
 * @param defaultValue - Default value for the autocomplete input
 * @param acceptLanguage - Language preference for results (default: 'fa,en')
 */

export default function PlaceAutocompleteWithMap({
    onPlaceSelect,
    placeholder = 'جستجوی مکان...',
    maxResults = 5,
    debounceDelay = 500,
    countrycodes = '',
    mapCenter = [35.6892, 51.3890], // Default: Tehran
    mapZoom = 13,
    allowMultipleMarkers = false,
    layout = 'vertical',
    mapHeight = '400px',
    className = '',
    disabled = false,
    defaultValue = '',
    acceptLanguage = 'fa,en',
}: PlaceAutocompleteWithMapProps) {
    const [selectedLocation, setSelectedLocation] = useState<PlaceResult | null>(null);
    const [mapKey, setMapKey] = useState(0);

    // Handle place selection from autocomplete
    const handleAutocompleteSelect = (place: PlaceResult | null) => {
        setSelectedLocation(place);
        onPlaceSelect(place);
        // Force map to re-render with new location
        if (place) {
            setMapKey((prev) => prev + 1);
        }
    };

    // Handle location selection from map
    const handleMapSelect = (place: PlaceResult | null) => {
        setSelectedLocation(place);
        onPlaceSelect(place);
    };

    const isHorizontal = layout === 'horizontal';

    return (
        <div className={cn('w-full', className)}>
            <div
                className={cn(
                    'flex gap-4',
                    isHorizontal ? 'flex-row' : 'flex-col'
                )}
            >
                {/* Autocomplete Section */}
                <div className={cn('flex-1', isHorizontal ? 'min-w-0' : 'w-full')}>
                    <div className="mb-2">
                        <label className="block text-sm font-medium text-foreground mb-2">
                            جستجوی مکان
                        </label>
                        <PlaceAutocomplete
                            onPlaceSelect={handleAutocompleteSelect}
                            placeholder={placeholder}
                            maxResults={maxResults}
                            debounceDelay={debounceDelay}
                            countrycodes={countrycodes}
                            disabled={disabled}
                            defaultValue={defaultValue}
                            acceptLanguage={acceptLanguage}
                        />
                    </div>

                    {/* Selected Location Info */}
                    {selectedLocation && (
                        <div className="mt-4 p-4 bg-primary-muted rounded-lg border border-border/20">
                            <h3 className="text-sm font-bold text-foreground mb-2">
                                مکان انتخاب شده
                            </h3>

                            <div className="space-y-2 text-xs text-foreground-mute">
                                <div>
                                    <span className="font-medium">نام:</span>{' '}
                                    <span>{selectedLocation.displayName}</span>
                                </div>

                                {selectedLocation.address && (
                                    <div>
                                        <span className="font-medium">آدرس:</span>
                                        <div className="mt-1 space-y-1">
                                            {selectedLocation.address.road && (
                                                <p>خیابان: {selectedLocation.address.road}</p>
                                            )}
                                            {selectedLocation.address.city && (
                                                <p>شهر: {selectedLocation.address.city}</p>
                                            )}
                                            {selectedLocation.address.state && (
                                                <p>استان: {selectedLocation.address.state}</p>
                                            )}
                                            {selectedLocation.address.country && (
                                                <p>کشور: {selectedLocation.address.country}</p>
                                            )}
                                        </div>
                                    </div>
                                )}

                                <div>
                                    <span className="font-medium">مختصات:</span>
                                    <div className="mt-1">
                                        <p>عرض جغرافیایی: {selectedLocation.latitude.toFixed(6)}</p>
                                        <p>طول جغرافیایی: {selectedLocation.longitude.toFixed(6)}</p>
                                    </div>
                                </div>
                            </div>

                            <button
                                onClick={() => handleAutocompleteSelect(null)}
                                className="mt-3 text-xs text-danger hover:text-danger/80 transition-colors"
                            >
                                پاک کردن انتخاب
                            </button>
                        </div>
                    )}
                </div>

                {/* Map Section */}
                <div className={cn('flex-1', isHorizontal ? 'min-w-0' : 'w-full')}>
                    <div className="mb-2">
                        <label className="block text-sm font-medium text-foreground mb-2">
                            انتخاب از روی نقشه
                        </label>
                    </div>
                    <MapSelector
                        key={mapKey}
                        center={
                            selectedLocation
                                ? [selectedLocation.latitude, selectedLocation.longitude]
                                : mapCenter
                        }
                        zoom={selectedLocation ? 15 : mapZoom}
                        onLocationSelect={handleMapSelect}
                        selectedLocation={selectedLocation}
                        allowMultipleMarkers={allowMultipleMarkers}
                        height={mapHeight}
                        acceptLanguage={acceptLanguage}
                    />
                </div>
            </div>
        </div>
    );
}

