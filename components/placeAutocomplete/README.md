# Place Autocomplete & Map Selection Components

این مجموعه کامپوننت‌ها امکان جستجوی مکان و انتخاب از روی نقشه را با استفاده از OpenStreetMap و Nominatim API فراهم می‌کنند.

## فهرست مطالب

- [ویژگی‌ها](#ویژگی‌ها)
- [نصب و راه‌اندازی](#نصب-و-راهاندازی)
- [کامپوننت‌ها](#کامپوننتها)
  - [PlaceAutocomplete](#placeautocomplete)
  - [MapSelector](#mapselector)
  - [PlaceAutocompleteWithMap](#placeautocompletewithmap)
- [API Routes](#api-routes)
- [نمونه‌های استفاده](#نمونههای-استفاده)
- [تنظیمات پیشرفته](#تنظیمات-پیشرفته)

## ویژگی‌ها

- ✅ جستجوی مکان با Autocomplete و debouncing
- ✅ نقشه تعاملی با Leaflet
- ✅ کلیک روی نقشه برای انتخاب مکان
- ✅ Reverse geocoding خودکار
- ✅ پشتیبانی کامل از زبان فارسی
- ✅ Proxy برای جلوگیری از مسدود شدن IP در ایران
- ✅ Rate limiting خودکار مطابق با نیازهای Nominatim
- ✅ TypeScript Support کامل
- ✅ Responsive و Mobile-friendly
- ✅ کاملا قابل تنظیم و سفارشی‌سازی

## نصب و راه‌اندازی

### پیش‌نیازها

پکیج‌های زیر باید نصب باشند:

```bash
npm install leaflet react-leaflet
npm install -D @types/leaflet
```

این پکیج‌ها از قبل در پروژه نصب شده‌اند.

### راه‌اندازی

1. **Leaflet CSS**: در فایل `globals.css` اضافه شده است:
   ```css
   @import 'leaflet/dist/leaflet.css';
   ```

2. **API Routes**: دو API route برای Nominatim ایجاد شده است:
   - `/api/nominatim/search` - برای جستجوی مکان
   - `/api/nominatim/reverse` - برای reverse geocoding

3. **Type Definitions**: تایپ‌های TypeScript در `types/place.ts` تعریف شده‌اند.

## کامپوننت‌ها

### PlaceAutocomplete

کامپوننت جستجوی مکان با قابلیت autocomplete.

#### Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `onPlaceSelect` | `(place: PlaceResult \| null) => void` | **Required** | تابع callback هنگام انتخاب مکان |
| `placeholder` | `string` | `'جستجوی مکان...'` | متن placeholder |
| `maxResults` | `number` | `5` | حداکثر تعداد نتایج |
| `debounceDelay` | `number` | `500` | تاخیر debounce (میلی‌ثانیه) |
| `countrycodes` | `string` | `''` | کد کشورها (مثال: 'ir') |
| `className` | `string` | `''` | کلاس CSS اضافی |
| `disabled` | `boolean` | `false` | غیرفعال کردن input |
| `defaultValue` | `string` | `''` | مقدار پیش‌فرض |
| `acceptLanguage` | `string` | `'fa,en'` | زبان‌های قابل قبول |

#### مثال استفاده

```tsx
import PlaceAutocomplete from '@/components/placeAutocomplete/PlaceAutocomplete';

function MyComponent() {
  const handlePlaceSelect = (place: PlaceResult | null) => {
    if (place) {
      console.log('Selected:', place.displayName);
      console.log('Coordinates:', place.latitude, place.longitude);
    }
  };

  return (
    <PlaceAutocomplete
      onPlaceSelect={handlePlaceSelect}
      placeholder="نام شهر یا آدرس..."
      maxResults={5}
      countrycodes="ir"
    />
  );
}
```

### MapSelector

کامپوننت نقشه با قابلیت انتخاب مکان با کلیک.

#### Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `onLocationSelect` | `(place: PlaceResult \| null) => void` | **Required** | تابع callback هنگام انتخاب مکان |
| `center` | `[number, number]` | `[35.6892, 51.3890]` | مرکز اولیه نقشه (تهران) |
| `zoom` | `number` | `13` | سطح zoom اولیه |
| `selectedLocation` | `PlaceResult \| null` | `null` | مکان انتخاب شده |
| `allowMultipleMarkers` | `boolean` | `false` | اجازه چند marker |
| `className` | `string` | `''` | کلاس CSS اضافی |
| `height` | `string` | `'400px'` | ارتفاع نقشه |
| `acceptLanguage` | `string` | `'fa,en'` | زبان‌های قابل قبول |

#### مثال استفاده

```tsx
'use client';
import dynamic from 'next/dynamic';

// باید به صورت dynamic import شود
const MapSelector = dynamic(
  () => import('@/components/placeAutocomplete/MapSelector'),
  { ssr: false }
);

function MyComponent() {
  const [location, setLocation] = useState<PlaceResult | null>(null);

  return (
    <MapSelector
      center={[35.6892, 51.3890]}
      zoom={12}
      onLocationSelect={setLocation}
      selectedLocation={location}
      height="500px"
    />
  );
}
```

### PlaceAutocompleteWithMap

کامپوننت ترکیبی که هم جستجو و هم نقشه را ارائه می‌دهد.

#### Props

تمام props های `PlaceAutocomplete` و `MapSelector` به علاوه:

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `layout` | `'vertical' \| 'horizontal'` | `'vertical'` | چیدمان کامپوننت |
| `mapCenter` | `[number, number]` | `[35.6892, 51.3890]` | مرکز اولیه نقشه |
| `mapZoom` | `number` | `13` | سطح zoom اولیه نقشه |
| `mapHeight` | `string` | `'400px'` | ارتفاع نقشه |

#### مثال استفاده

```tsx
'use client';
import dynamic from 'next/dynamic';

const PlaceAutocompleteWithMap = dynamic(
  () => import('@/components/placeAutocomplete/PlaceAutocompleteWithMap'),
  { ssr: false }
);

function MyComponent() {
  const [place, setPlace] = useState<PlaceResult | null>(null);

  return (
    <PlaceAutocompleteWithMap
      onPlaceSelect={setPlace}
      layout="vertical"
      countrycodes="ir"
      mapCenter={[35.6892, 51.3890]}
      mapZoom={12}
    />
  );
}
```

## API Routes

### POST `/api/nominatim/search`

جستجوی مکان

**Query Parameters:**
- `q` (required): عبارت جستجو
- `limit`: حداکثر نتایج (default: 5)
- `accept-language`: زبان (default: fa,en)
- `countrycodes`: کد کشورها (مثال: ir)

**Response:**
```typescript
PlaceResult[]
```

### GET `/api/nominatim/reverse`

Reverse geocoding

**Query Parameters:**
- `lat` (required): عرض جغرافیایی
- `lon` (required): طول جغرافیایی
- `zoom`: سطح zoom (default: 18)
- `accept-language`: زبان (default: fa,en)

**Response:**
```typescript
PlaceResult
```

## نمونه‌های استفاده

### مثال ۱: فرم ثبت آدرس

```tsx
'use client';
import { useState } from 'react';
import PlaceAutocomplete from '@/components/placeAutocomplete/PlaceAutocomplete';
import { PlaceResult } from '@/types/place';

function AddressForm() {
  const [address, setAddress] = useState<PlaceResult | null>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (address) {
      // ارسال آدرس به سرور
      console.log('Submitting:', {
        name: address.displayName,
        latitude: address.latitude,
        longitude: address.longitude,
      });
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <PlaceAutocomplete
        onPlaceSelect={setAddress}
        placeholder="آدرس خود را وارد کنید..."
        countrycodes="ir"
      />
      
      {address && (
        <div className="mt-4">
          <p>آدرس انتخاب شده: {address.displayName}</p>
        </div>
      )}
      
      <button type="submit" disabled={!address}>
        ثبت آدرس
      </button>
    </form>
  );
}
```

### مثال ۲: انتخاب مکان رویداد

```tsx
'use client';
import dynamic from 'next/dynamic';
import { useState } from 'react';

const PlaceAutocompleteWithMap = dynamic(
  () => import('@/components/placeAutocomplete/PlaceAutocompleteWithMap'),
  { ssr: false }
);

function EventLocationPicker() {
  const [location, setLocation] = useState<PlaceResult | null>(null);

  return (
    <div>
      <h2>مکان برگزاری رویداد</h2>
      
      <PlaceAutocompleteWithMap
        onPlaceSelect={setLocation}
        placeholder="مکان رویداد را جستجو کنید..."
        layout="horizontal"
        mapHeight="500px"
        countrycodes="ir"
      />
      
      {location && (
        <button onClick={() => saveEventLocation(location)}>
          ذخیره مکان
        </button>
      )}
    </div>
  );
}
```

### مثال ۳: نقشه با چند marker

```tsx
'use client';
import dynamic from 'next/dynamic';
import { useState } from 'react';

const MapSelector = dynamic(
  () => import('@/components/placeAutocomplete/MapSelector'),
  { ssr: false }
);

function MultiLocationPicker() {
  const [locations, setLocations] = useState<PlaceResult[]>([]);

  const handleLocationSelect = (place: PlaceResult | null) => {
    if (place) {
      setLocations(prev => [...prev, place]);
    }
  };

  return (
    <div>
      <MapSelector
        onLocationSelect={handleLocationSelect}
        allowMultipleMarkers={true}
        height="600px"
      />
      
      <div className="mt-4">
        <h3>مکان‌های انتخاب شده: {locations.length}</h3>
        <ul>
          {locations.map((loc, idx) => (
            <li key={idx}>{loc.displayName}</li>
          ))}
        </ul>
      </div>
    </div>
  );
}
```

## تنظیمات پیشرفته

### محدود کردن جستجو به منطقه خاص

با استفاده از `viewbox` و `bounded`:

```tsx
// در PlaceAutocomplete یا PlaceAutocompleteWithMap
// برای محدود کردن به تهران
<PlaceAutocomplete
  onPlaceSelect={handleSelect}
  countrycodes="ir"
  // می‌توانید در API route پارامتر viewbox را اضافه کنید
/>
```

### تغییر User-Agent

در فایل‌های API route (`app/api/nominatim/search/route.ts` و `app/api/nominatim/reverse/route.ts`):

```typescript
headers: {
  'User-Agent': 'YourApp/1.0 (Your Contact Info)',
  'Accept': 'application/json',
}
```

### تغییر Rate Limit

در فایل‌های API route:

```typescript
const RATE_LIMIT_DELAY = 1000; // تغییر به مقدار دلخواه (میلی‌ثانیه)
```

### استفاده از Tile Server دیگر

در `MapSelector.tsx`:

```tsx
<TileLayer
  attribution='&copy; Your Attribution'
  url="https://your-tile-server/{z}/{x}/{y}.png"
/>
```

### Styling سفارشی

تمام کامپوننت‌ها prop `className` دارند:

```tsx
<PlaceAutocomplete
  className="my-custom-class"
  onPlaceSelect={handleSelect}
/>
```

و می‌توانید استایل‌های Tailwind را اضافه کنید.

## نکات مهم

### ⚠️ Dynamic Import

کامپوننت‌های `MapSelector` و `PlaceAutocompleteWithMap` باید به صورت dynamic import استفاده شوند:

```tsx
const MapSelector = dynamic(
  () => import('@/components/placeAutocomplete/MapSelector'),
  { ssr: false }
);
```

### ⚠️ Rate Limiting

Nominatim محدودیت rate limit دارد (1 request per second). سرور ما این را handle می‌کند، اما در صورت استفاده زیاد، ممکن است نیاز به اضافه کردن caching باشد.

### ⚠️ Attribution

طبق شرایط استفاده از OpenStreetMap، باید attribution را نمایش دهید. این در کامپوننت MapSelector به صورت خودکار انجام می‌شود.

## Troubleshooting

### مشکل: نقشه نمایش داده نمی‌شود

**راه حل:** 
1. مطمئن شوید که کامپوننت به صورت dynamic import شده است
2. بررسی کنید که Leaflet CSS import شده باشد

### مشکل: Marker ها نمایش داده نمی‌شوند

**راه حل:**
کامپوننت از CDN برای icon های marker استفاده می‌کند. اگر مشکل داشتید، می‌توانید icon ها را local استفاده کنید.

### مشکل: خطای CORS

**راه حل:**
تمام درخواست‌ها از طریق API routes پروکسی می‌شوند، نباید خطای CORS بگیرید. اگر خطا می‌گیرید، مطمئن شوید که از `/api/nominatim/*` استفاده می‌کنید نه مستقیم به Nominatim.

## پشتیبانی و توسعه

برای گزارش مشکل یا درخواست ویژگی جدید، لطفاً با تیم توسعه تماس بگیرید.

## لایسنس

این کامپوننت‌ها برای استفاده در پروژه CRM-Front توسعه داده شده‌اند.

داده‌های نقشه از OpenStreetMap استفاده می‌کنند که تحت لایسنس ODbL است.


