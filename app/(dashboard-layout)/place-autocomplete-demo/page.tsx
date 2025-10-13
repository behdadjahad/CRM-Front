'use client';

import React, { useState } from 'react';
import dynamic from 'next/dynamic';
import { PlaceResult } from '@/types/place';
import PlaceAutocomplete from '@/components/placeAutocomplete/PlaceAutocomplete';

// Dynamically import components that use Leaflet to avoid SSR issues
const MapSelector = dynamic(() => import('@/components/placeAutocomplete/MapSelector'), {
    ssr: false,
});

const PlaceAutocompleteWithMap = dynamic(
    () => import('@/components/placeAutocomplete/PlaceAutocompleteWithMap'),
    { ssr: false }
);

/**
 * Place Autocomplete Demo Page
 * 
 * This page demonstrates the usage of Place Autocomplete and Map Selection components.
 * It shows three different use cases:
 * 1. Standalone Autocomplete
 * 2. Standalone Map Selector
 * 3. Combined Autocomplete with Map
 */
export default function PlaceAutocompleteDemoPage() {
    const [autocompletePlace, setAutocompletePlace] = useState<PlaceResult | null>(null);
    const [mapPlace, setMapPlace] = useState<PlaceResult | null>(null);
    const [combinedPlace, setCombinedPlace] = useState<PlaceResult | null>(null);

    return (
        <div className="w-full">
            {/* Page Header */}
            <div className="mb-8">
                <h1 className="text-2xl font-bold text-foreground mb-2">
                    نمایش Place Autocomplete و Map Selection
                </h1>
                <p className="text-sm text-subtitle">
                    این صفحه نمونه‌ای از استفاده از کامپوننت‌های جستجوی مکان و انتخاب از روی نقشه است
                </p>
            </div>

            {/* Demo Sections */}
            <div className="space-y-8">
                {/* Section 1: Standalone Autocomplete */}
                <section className="bg-card p-6 rounded-lg border border-border/20">
                    <h2 className="text-lg font-bold text-foreground mb-4">
                        ۱. جستجوی مکان (Autocomplete)
                    </h2>
                    <p className="text-sm text-subtitle mb-4">
                        یک کامپوننت ساده برای جستجوی مکان با قابلیت پیشنهاد خودکار
                    </p>

                    <div className="max-w-xl">
                        <PlaceAutocomplete
                            onPlaceSelect={setAutocompletePlace}
                            placeholder="نام شهر، محله، یا آدرس را وارد کنید..."
                            maxResults={5}
                            debounceDelay={500}
                            countrycodes="ir"
                            acceptLanguage="fa,en"
                        />
                    </div>

                    {/* Display Selected Place */}
                    {autocompletePlace && (
                        <div className="mt-4 p-4 bg-success/10 rounded-lg border border-success/20">
                            <h3 className="text-sm font-bold text-foreground mb-2">مکان انتخاب شده:</h3>
                            <div className="text-xs space-y-1">
                                <p>
                                    <span className="font-medium">نام:</span> {autocompletePlace.displayName}
                                </p>
                                <p>
                                    <span className="font-medium">عرض جغرافیایی:</span>{' '}
                                    {autocompletePlace.latitude.toFixed(6)}
                                </p>
                                <p>
                                    <span className="font-medium">طول جغرافیایی:</span>{' '}
                                    {autocompletePlace.longitude.toFixed(6)}
                                </p>
                                {autocompletePlace.address && (
                                    <p>
                                        <span className="font-medium">شهر:</span>{' '}
                                        {autocompletePlace.address.city || 'نامشخص'}
                                    </p>
                                )}
                            </div>
                        </div>
                    )}

                    {/* Code Example */}
                    <details className="mt-4">
                        <summary className="text-sm font-medium text-secondary cursor-pointer hover:text-secondary-hover">
                            مشاهده کد
                        </summary>
                        <pre className="mt-2 p-4 bg-primary-muted rounded-lg text-xs overflow-x-auto direction-ltr text-left">
                            {`<PlaceAutocomplete
  onPlaceSelect={(place) => console.log(place)}
  placeholder="نام شهر، محله، یا آدرس را وارد کنید..."
  maxResults={5}
  debounceDelay={500}
  countrycodes="ir"
  acceptLanguage="fa,en"
/>`}
                        </pre>
                    </details>
                </section>

                {/* Section 2: Standalone Map Selector */}
                <section className="bg-card p-6 rounded-lg border border-border/20">
                    <h2 className="text-lg font-bold text-foreground mb-4">
                        ۲. انتخاب مکان از روی نقشه (Map Selector)
                    </h2>
                    <p className="text-sm text-subtitle mb-4">
                        یک نقشه تعاملی برای انتخاب مکان با کلیک. پس از کلیک، اطلاعات مکان به صورت خودکار دریافت می‌شود.
                    </p>

                    <MapSelector
                        center={[35.6892, 51.3890]} // Tehran
                        zoom={12}
                        onLocationSelect={setMapPlace}
                        selectedLocation={mapPlace}
                        allowMultipleMarkers={false}
                        height="450px"
                        acceptLanguage="fa,en"
                    />

                    {/* Display Selected Place */}
                    {mapPlace && (
                        <div className="mt-4 p-4 bg-success/10 rounded-lg border border-success/20">
                            <h3 className="text-sm font-bold text-foreground mb-2">مکان انتخاب شده:</h3>
                            <div className="text-xs space-y-1">
                                <p>
                                    <span className="font-medium">نام:</span> {mapPlace.displayName}
                                </p>
                                <p>
                                    <span className="font-medium">عرض جغرافیایی:</span>{' '}
                                    {mapPlace.latitude.toFixed(6)}
                                </p>
                                <p>
                                    <span className="font-medium">طول جغرافیایی:</span>{' '}
                                    {mapPlace.longitude.toFixed(6)}
                                </p>
                                {mapPlace.address && (
                                    <>
                                        {mapPlace.address.road && (
                                            <p>
                                                <span className="font-medium">خیابان:</span> {mapPlace.address.road}
                                            </p>
                                        )}
                                        {mapPlace.address.city && (
                                            <p>
                                                <span className="font-medium">شهر:</span> {mapPlace.address.city}
                                            </p>
                                        )}
                                    </>
                                )}
                            </div>
                        </div>
                    )}

                    {/* Code Example */}
                    <details className="mt-4">
                        <summary className="text-sm font-medium text-secondary cursor-pointer hover:text-secondary-hover">
                            مشاهده کد
                        </summary>
                        <pre className="mt-2 p-4 bg-primary-muted rounded-lg text-xs overflow-x-auto direction-ltr text-left">
                            {`<MapSelector
  center={[35.6892, 51.3890]} // Tehran
  zoom={12}
  onLocationSelect={(place) => console.log(place)}
  selectedLocation={selectedPlace}
  allowMultipleMarkers={false}
  height="450px"
  acceptLanguage="fa,en"
/>`}
                        </pre>
                    </details>
                </section>

                {/* Section 3: Combined Component */}
                <section className="bg-card p-6 rounded-lg border border-border/20">
                    <h2 className="text-lg font-bold text-foreground mb-4">
                        ۳. ترکیب جستجو و نقشه (Combined)
                    </h2>
                    <p className="text-sm text-subtitle mb-4">
                        کامپوننت ترکیبی که هم جستجوی مکان و هم انتخاب از روی نقشه را فراهم می‌کند.
                    </p>

                    <PlaceAutocompleteWithMap
                        onPlaceSelect={setCombinedPlace}
                        placeholder="جستجوی مکان..."
                        maxResults={5}
                        debounceDelay={500}
                        countrycodes="ir"
                        mapCenter={[35.6892, 51.3890]}
                        mapZoom={12}
                        allowMultipleMarkers={false}
                        layout="vertical"
                        mapHeight="400px"
                        acceptLanguage="fa,en"
                    />

                    {/* Code Example */}
                    <details className="mt-4">
                        <summary className="text-sm font-medium text-secondary cursor-pointer hover:text-secondary-hover">
                            مشاهده کد
                        </summary>
                        <pre className="mt-2 p-4 bg-primary-muted rounded-lg text-xs overflow-x-auto direction-ltr text-left">
                            {`<PlaceAutocompleteWithMap
  onPlaceSelect={(place) => console.log(place)}
  placeholder="جستجوی مکان..."
  maxResults={5}
  debounceDelay={500}
  countrycodes="ir"
  mapCenter={[35.6892, 51.3890]}
  mapZoom={12}
  allowMultipleMarkers={false}
  layout="vertical"
  mapHeight="400px"
  acceptLanguage="fa,en"
/>`}
                        </pre>
                    </details>
                </section>

                {/* Configuration Guide */}
                <section className="bg-card p-6 rounded-lg border border-border/20">
                    <h2 className="text-lg font-bold text-foreground mb-4">
                        راهنمای پیکربندی
                    </h2>

                    <div className="space-y-4 text-sm">
                        <div>
                            <h3 className="font-bold text-foreground mb-2">پارامترهای مشترک:</h3>
                            <ul className="list-disc list-inside space-y-1 text-subtitle mr-4">
                                <li><code className="bg-primary-muted px-1 rounded">onPlaceSelect</code>: تابع callback برای دریافت مکان انتخاب شده</li>
                                <li><code className="bg-primary-muted px-1 rounded">acceptLanguage</code>: زبان نتایج (پیش‌فرض: &quot;fa,en&quot;)</li>
                                <li><code className="bg-primary-muted px-1 rounded">countrycodes</code>: محدود کردن جستجو به کشورهای خاص (مثال: &quot;ir&quot;)</li>
                            </ul>
                        </div>

                        <div>
                            <h3 className="font-bold text-foreground mb-2">پارامترهای PlaceAutocomplete:</h3>
                            <ul className="list-disc list-inside space-y-1 text-subtitle mr-4">
                                <li><code className="bg-primary-muted px-1 rounded">placeholder</code>: متن placeholder</li>
                                <li><code className="bg-primary-muted px-1 rounded">maxResults</code>: حداکثر تعداد نتایج (پیش‌فرض: 5)</li>
                                <li><code className="bg-primary-muted px-1 rounded">debounceDelay</code>: تاخیر debounce به میلی‌ثانیه (پیش‌فرض: 500)</li>
                            </ul>
                        </div>

                        <div>
                            <h3 className="font-bold text-foreground mb-2">پارامترهای MapSelector:</h3>
                            <ul className="list-disc list-inside space-y-1 text-subtitle mr-4">
                                <li><code className="bg-primary-muted px-1 rounded">center</code>: مرکز اولیه نقشه [latitude, longitude]</li>
                                <li><code className="bg-primary-muted px-1 rounded">zoom</code>: سطح zoom اولیه (پیش‌فرض: 13)</li>
                                <li><code className="bg-primary-muted px-1 rounded">height</code>: ارتفاع نقشه (پیش‌فرض: &quot;400px&quot;)</li>
                                <li><code className="bg-primary-muted px-1 rounded">allowMultipleMarkers</code>: اجازه چند مارکر (پیش‌فرض: false)</li>
                            </ul>
                        </div>

                        <div>
                            <h3 className="font-bold text-foreground mb-2">پارامترهای PlaceAutocompleteWithMap:</h3>
                            <ul className="list-disc list-inside space-y-1 text-subtitle mr-4">
                                <li><code className="bg-primary-muted px-1 rounded">layout</code>: چیدمان (&quot;vertical&quot; یا &quot;horizontal&quot;)</li>
                                <li>همه پارامترهای PlaceAutocomplete و MapSelector</li>
                            </ul>
                        </div>
                    </div>
                </section>

                {/* Usage Tips */}
                <section className="bg-info/10 p-6 rounded-lg border border-info/20">
                    <h2 className="text-lg font-bold text-foreground mb-4">
                        نکات استفاده
                    </h2>

                    <ul className="space-y-2 text-sm text-foreground-mute">
                        <li className="flex items-start gap-2">
                            <span className="text-success-foreground">✓</span>
                            <span>برای جلوگیری از مسدود شدن IP در ایران، تمام درخواست‌ها از طریق API Route پروکسی می‌شوند</span>
                        </li>
                        <li className="flex items-start gap-2">
                            <span className="text-success-foreground">✓</span>
                            <span>Rate limiting به صورت خودکار اعمال می‌شود (۱ ثانیه بین درخواست‌ها)</span>
                        </li>
                        <li className="flex items-start gap-2">
                            <span className="text-success-foreground">✓</span>
                            <span>کامپوننت‌های نقشه به صورت dynamic import می‌شوند تا از SSR issues جلوگیری شود</span>
                        </li>
                        <li className="flex items-start gap-2">
                            <span className="text-success-foreground">✓</span>
                            <span>پشتیبانی کامل از زبان فارسی برای نتایج در ایران</span>
                        </li>
                        <li className="flex items-start gap-2">
                            <span className="text-success-foreground">✓</span>
                            <span>Reverse geocoding خودکار هنگام کلیک روی نقشه</span>
                        </li>
                    </ul>
                </section>
            </div>
        </div>
    );
}

