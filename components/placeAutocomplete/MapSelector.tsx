'use client';

import React, { useState, useEffect, useRef } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMapEvents, useMap } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { cn } from '@/lib/utils';
import { PlaceResult, MapSelectorProps, MarkerData } from '@/types/place';

// Fix for default marker icon in Leaflet with Next.js
const createCustomIcon = () => {
    return L.icon({
        iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
        iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
        shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
        iconSize: [25, 41],
        iconAnchor: [12, 41],
        popupAnchor: [1, -34],
        shadowSize: [41, 41],
    });
};

// Component to handle map click events
function MapClickHandler({
    onLocationSelect,
    allowMultipleMarkers,
    acceptLanguage,
}: {
    onLocationSelect: (place: PlaceResult | null) => void;
    allowMultipleMarkers: boolean;
    acceptLanguage: string;
}) {
    const [isLoading, setIsLoading] = useState(false);

    useMapEvents({
        click: async (e) => {
            const { lat, lng } = e.latlng;

            setIsLoading(true);
            try {
                // Perform reverse geocoding
                const url = new URL('/api/nominatim/reverse', window.location.origin);
                url.searchParams.set('lat', lat.toString());
                url.searchParams.set('lon', lng.toString());
                url.searchParams.set('accept-language', acceptLanguage);

                const response = await fetch(url.toString());

                if (!response.ok) {
                    throw new Error('Failed to reverse geocode');
                }

                const place: PlaceResult = await response.json();
                onLocationSelect(place);
            } catch (error) {
                console.error('Reverse geocoding error:', error);
                // Still create a marker with coordinates only
                onLocationSelect({
                    placeId: Date.now(),
                    name: `${lat.toFixed(6)}, ${lng.toFixed(6)}`,
                    displayName: `${lat.toFixed(6)}, ${lng.toFixed(6)}`,
                    latitude: lat,
                    longitude: lng,
                    lat,
                    lon: lng,
                });
            } finally {
                setIsLoading(false);
            }
        },
    });

    return isLoading ? (
        <div className="absolute top-4 left-1/2 transform -translate-x-1/2 z-[1000] bg-white px-4 py-2 rounded-lg shadow-lg border border-border/20">
            <div className="flex items-center gap-2">
                <div className="w-4 h-4 border-2 border-gray-300 border-t-blue-600 rounded-full animate-spin" />
                <span className="text-sm text-foreground">در حال دریافت اطلاعات مکان...</span>
            </div>
        </div>
    ) : null;
}

// Component to update map view when location changes
function MapViewController({ center, zoom }: { center: [number, number]; zoom: number }) {
    const map = useMap();

    useEffect(() => {
        if (center) {
            map.setView(center, zoom);
        }
    }, [center, zoom, map]);

    return null;
}

/**
 * MapSelector Component
 * 
 * An interactive map component using Leaflet and OpenStreetMap.
 * Allows users to click on the map to select locations with reverse geocoding.
 * 
 * @param center - Initial center coordinates [latitude, longitude]
 * @param zoom - Initial zoom level (default: 13)
 * @param onLocationSelect - Callback function when a location is selected
 * @param selectedLocation - Currently selected location to display a marker
 * @param allowMultipleMarkers - Allow multiple markers (default: false)
 * @param className - Additional CSS classes
 * @param height - Map height (default: '400px')
 * @param acceptLanguage - Language preference for results (default: 'fa,en')
 */
export default function MapSelector({
    center = [35.6892, 51.3890], // Default: Tehran
    zoom = 13,
    onLocationSelect,
    selectedLocation = null,
    allowMultipleMarkers = false,
    className = '',
    height = '400px',
    acceptLanguage = 'fa,en',
}: MapSelectorProps) {
    const [markers, setMarkers] = useState<MarkerData[]>([]);
    const [isClient, setIsClient] = useState(false);
    const mapRef = useRef<L.Map | null>(null);

    // Ensure component only renders on client side
    useEffect(() => {
        setIsClient(true);
    }, []);

    // Update markers when selectedLocation changes
    useEffect(() => {
        if (selectedLocation) {
            const newMarker: MarkerData = {
                ...selectedLocation,
                id: `marker-${Date.now()}`,
            };

            if (allowMultipleMarkers) {
                setMarkers((prev) => [...prev, newMarker]);
            } else {
                setMarkers([newMarker]);
            }
        }
    }, [selectedLocation, allowMultipleMarkers]);

    // Handle marker removal
    const handleRemoveMarker = (markerId: string) => {
        setMarkers((prev) => prev.filter((m) => m.id !== markerId));
        if (markers.length === 1) {
            onLocationSelect(null);
        }
    };

    // Clear all markers
    const handleClearAllMarkers = () => {
        setMarkers([]);
        onLocationSelect(null);
    };

    const customIcon = createCustomIcon();

    // Update center when selectedLocation changes
    const mapCenter: [number, number] = selectedLocation
        ? [selectedLocation.latitude, selectedLocation.longitude]
        : center;

    if (!isClient) {
        return (
            <div
                className={cn('w-full bg-slate rounded-lg flex items-center justify-center', className)}
                style={{ height }}
            >
                <div className="text-subtitle text-sm">در حال بارگذاری نقشه...</div>
            </div>
        );
    }

    return (
        <div className={cn('relative w-full', className)}>
            {/* Map controls */}
            {markers.length > 0 && (
                <div className="absolute top-4 right-4 z-[1000] bg-card px-3 py-2 rounded-lg shadow-lg border border-border/20">
                    <div className="flex items-center gap-3">
                        <span className="text-sm text-foreground">
                            {markers.length} مکان انتخاب شده
                        </span>
                        {allowMultipleMarkers && markers.length > 1 && (
                            <button
                                onClick={handleClearAllMarkers}
                                className="text-xs text-danger hover:text-danger/80 transition-colors"
                            >
                                پاک کردن همه
                            </button>
                        )}
                    </div>
                </div>
            )}

            {/* Map */}
            <div className="rounded-lg overflow-hidden border border-border/20" style={{ height }}>
                <MapContainer
                    center={mapCenter}
                    zoom={zoom}
                    style={{ height: '100%', width: '100%' }}
                    ref={mapRef}
                >
                    <TileLayer
                        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
                        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                    />

                    <MapClickHandler
                        onLocationSelect={onLocationSelect}
                        allowMultipleMarkers={allowMultipleMarkers}
                        acceptLanguage={acceptLanguage}
                    />

                    <MapViewController center={mapCenter} zoom={zoom} />

                    {/* Render markers */}
                    {markers.map((marker) => (
                        <Marker
                            key={marker.id}
                            position={[marker.latitude, marker.longitude]}
                            icon={customIcon}
                        >
                            <Popup>
                                <div className="text-right p-2 min-w-[200px]">
                                    <h3 className="font-bold text-sm mb-2 text-foreground">
                                        {marker.name}
                                    </h3>

                                    {marker.address && (
                                        <div className="text-xs text-subtitle space-y-1 mb-3">
                                            {marker.address.road && (
                                                <p>خیابان: {marker.address.road}</p>
                                            )}
                                            {marker.address.neighbourhood && (
                                                <p>محله: {marker.address.neighbourhood}</p>
                                            )}
                                            {marker.address.city && (
                                                <p>شهر: {marker.address.city}</p>
                                            )}
                                        </div>
                                    )}

                                    <div className="text-xs text-subtitle mb-3">
                                        <p>
                                            عرض: {marker.latitude.toFixed(6)}
                                        </p>
                                        <p>
                                            طول: {marker.longitude.toFixed(6)}
                                        </p>
                                    </div>

                                    {allowMultipleMarkers && (
                                        <button
                                            onClick={() => handleRemoveMarker(marker.id)}
                                            className="text-xs text-danger hover:text-danger/80 transition-colors"
                                        >
                                            حذف مارکر
                                        </button>
                                    )}
                                </div>
                            </Popup>
                        </Marker>
                    ))}
                </MapContainer>
            </div>

            {/* Instructions */}
            <div className="mt-2 text-xs text-subtitle text-center">
                برای انتخاب مکان، روی نقشه کلیک کنید
            </div>
        </div>
    );
}

