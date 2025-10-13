/**
 * Place autocomplete and map selection type definitions
 */

export interface PlaceResult {
    placeId: number;
    name: string;
    displayName: string;
    latitude: number;
    longitude: number;
    lat: number;
    lon: number;
    boundingBox?: string[];
    type?: string;
    class?: string;
    importance?: number;
    address?: PlaceAddress;
    osmType?: string;
    osmId?: number;
}

export interface PlaceAddress {
    [key: string]: string;
    road: string;
    neighbourhood: string;
    suburb: string;
    city: string;
    county: string;
    state: string;
    postcode: string;
    country: string;
    country_code: string;
}

export interface PlaceAutocompleteProps {
    onPlaceSelect: (place: PlaceResult | null) => void;
    placeholder?: string;
    maxResults?: number;
    debounceDelay?: number;
    countrycodes?: string;
    className?: string;
    disabled?: boolean;
    defaultValue?: string;
    acceptLanguage?: string;
}

export interface MapSelectorProps {
    center?: [number, number];
    zoom?: number;
    onLocationSelect: (place: PlaceResult | null) => void;
    selectedLocation?: PlaceResult | null;
    allowMultipleMarkers?: boolean;
    className?: string;
    height?: string;
    acceptLanguage?: string;
}

export interface PlaceAutocompleteWithMapProps {
    onPlaceSelect: (place: PlaceResult | null) => void;
    placeholder?: string;
    maxResults?: number;
    debounceDelay?: number;
    countrycodes?: string;
    mapCenter?: [number, number];
    mapZoom?: number;
    allowMultipleMarkers?: boolean;
    layout?: 'vertical' | 'horizontal';
    mapHeight?: string;
    className?: string;
    disabled?: boolean;
    defaultValue?: string;
    acceptLanguage?: string;
}

export interface MarkerData extends PlaceResult {
    id: string;
}

