import { NextRequest, NextResponse } from 'next/server';

/**
 * Nominatim Reverse Geocoding API Proxy
 * This API route proxies reverse geocoding requests to Nominatim
 * to convert coordinates to addresses.
 */

// Rate limiting configuration
const RATE_LIMIT_DELAY = 1000; // 1 second between requests (Nominatim requirement)
let lastRequestTime = 0;

interface NominatimReverseResult {
    place_id: number;
    licence: string;
    osm_type: string;
    osm_id: number;
    lat: string;
    lon: string;
    display_name: string;
    address: {
        [key: string]: string;
    };
    boundingbox: string[];
    class?: string;
    type?: string;
    importance?: number;
}

export async function GET(request: NextRequest) {
    try {
        // Get query parameters
        const searchParams = request.nextUrl.searchParams;
        const lat = searchParams.get('lat');
        const lon = searchParams.get('lon');
        const zoom = searchParams.get('zoom') || '18';
        const acceptLanguage = searchParams.get('accept-language') || 'fa,en';

        // Validate required parameters
        if (!lat || !lon) {
            return NextResponse.json(
                { error: 'Query parameters "lat" and "lon" are required' },
                { status: 400 }
            );
        }

        // Validate coordinate values
        const latitude = parseFloat(lat);
        const longitude = parseFloat(lon);

        if (isNaN(latitude) || latitude < -90 || latitude > 90) {
            return NextResponse.json(
                { error: 'Invalid latitude value. Must be between -90 and 90' },
                { status: 400 }
            );
        }

        if (isNaN(longitude) || longitude < -180 || longitude > 180) {
            return NextResponse.json(
                { error: 'Invalid longitude value. Must be between -180 and 180' },
                { status: 400 }
            );
        }

        // Rate limiting - ensure 1 second between requests
        const now = Date.now();
        const timeSinceLastRequest = now - lastRequestTime;
        if (timeSinceLastRequest < RATE_LIMIT_DELAY) {
            await new Promise(resolve =>
                setTimeout(resolve, RATE_LIMIT_DELAY - timeSinceLastRequest)
            );
        }
        lastRequestTime = Date.now();

        // Build Nominatim reverse geocoding URL
        const nominatimUrl = new URL('https://nominatim.openstreetmap.org/reverse');
        nominatimUrl.searchParams.set('lat', lat);
        nominatimUrl.searchParams.set('lon', lon);
        nominatimUrl.searchParams.set('format', 'json');
        nominatimUrl.searchParams.set('zoom', zoom);
        nominatimUrl.searchParams.set('addressdetails', '1');
        nominatimUrl.searchParams.set('accept-language', acceptLanguage);

        // Make request to Nominatim with proper User-Agent
        const response = await fetch(nominatimUrl.toString(), {
            headers: {
                'User-Agent': 'CRM-Front-PlaceAutocomplete/1.0 (CHADCO CRM Application)',
                'Accept': 'application/json',
            },
        });

        if (!response.ok) {
            throw new Error(`Nominatim API error: ${response.status} ${response.statusText}`);
        }

        const data: NominatimReverseResult = await response.json();

        // Check if result was found
        if (!data.place_id) {
            return NextResponse.json(
                { error: 'No results found for the given coordinates' },
                { status: 404 }
            );
        }

        // Transform data to a more usable format
        const transformedData = {
            placeId: data.place_id,
            name: data.display_name,
            displayName: data.display_name,
            latitude: parseFloat(data.lat),
            longitude: parseFloat(data.lon),
            lat: parseFloat(data.lat),
            lon: parseFloat(data.lon),
            address: data.address,
            boundingBox: data.boundingbox,
            type: data.type,
            class: data.class,
            importance: data.importance,
            osmType: data.osm_type,
            osmId: data.osm_id,
        };

        return NextResponse.json(transformedData);
    } catch (error: any) {
        console.error('Nominatim reverse geocoding error:', error);
        return NextResponse.json(
            { error: 'Failed to reverse geocode coordinates', message: error.message },
            { status: 500 }
        );
    }
}

