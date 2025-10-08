import { NextRequest, NextResponse } from 'next/server';

/**
 * Nominatim Search API Proxy
 * This API route proxies requests to Nominatim to avoid IP blocking in Iran
 * and handle rate limiting properly.
 */

// Rate limiting configuration
const RATE_LIMIT_DELAY = 1000; // 1 second between requests (Nominatim requirement)
let lastRequestTime = 0;

interface NominatimSearchResult {
    place_id: number;
    licence: string;
    osm_type: string;
    osm_id: number;
    boundingbox: string[];
    lat: string;
    lon: string;
    display_name: string;
    class: string;
    type: string;
    importance: number;
    icon?: string;
    address?: {
        [key: string]: string;
    };
}

export async function GET(request: NextRequest) {
    try {
        // Get query parameters
        const searchParams = request.nextUrl.searchParams;
        const query = searchParams.get('q');
        const limit = searchParams.get('limit') || '5';
        const acceptLanguage = searchParams.get('accept-language') || 'fa,en';
        const countrycodes = searchParams.get('countrycodes') || '';
        const viewbox = searchParams.get('viewbox') || '';
        const bounded = searchParams.get('bounded') || '';

        // Validate required parameters
        if (!query || query.trim() === '') {
            return NextResponse.json(
                { error: 'Query parameter "q" is required' },
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

        // Build Nominatim API URL
        const nominatimUrl = new URL('https://nominatim.openstreetmap.org/search');
        nominatimUrl.searchParams.set('q', query);
        nominatimUrl.searchParams.set('format', 'json');
        nominatimUrl.searchParams.set('limit', limit);
        nominatimUrl.searchParams.set('addressdetails', '1');
        nominatimUrl.searchParams.set('accept-language', acceptLanguage);

        if (countrycodes) {
            nominatimUrl.searchParams.set('countrycodes', countrycodes);
        }

        if (viewbox) {
            nominatimUrl.searchParams.set('viewbox', viewbox);
            if (bounded) {
                nominatimUrl.searchParams.set('bounded', bounded);
            }
        }

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

        const data: NominatimSearchResult[] = await response.json();

        // Transform data to a more usable format
        const transformedData = data.map(result => ({
            placeId: result.place_id,
            name: result.display_name,
            displayName: result.display_name,
            latitude: parseFloat(result.lat),
            longitude: parseFloat(result.lon),
            lat: parseFloat(result.lat),
            lon: parseFloat(result.lon),
            boundingBox: result.boundingbox,
            type: result.type,
            class: result.class,
            importance: result.importance,
            address: result.address,
            osmType: result.osm_type,
            osmId: result.osm_id,
        }));

        return NextResponse.json(transformedData);
    } catch (error: any) {
        console.error('Nominatim search error:', error);
        return NextResponse.json(
            { error: 'Failed to search places', message: error.message },
            { status: 500 }
        );
    }
}

