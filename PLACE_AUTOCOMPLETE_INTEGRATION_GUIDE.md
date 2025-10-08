# Place Autocomplete & Map Selection - Integration Guide

این راهنما نحوه استفاده و یکپارچه‌سازی کامپوننت‌های Place Autocomplete و Map Selection در بخش‌های مختلف پروژه را توضیح می‌دهد.

## 📋 فهرست مطالب

1. [معرفی](#معرفی)
2. [معماری](#معماری)
3. [فایل‌های ایجاد شده](#فایلهای-ایجاد-شده)
4. [راه‌اندازی سریع](#راهاندازی-سریع)
5. [سناریوهای استفاده](#سناریوهای-استفاده)
6. [یکپارچه‌سازی با فرم‌های موجود](#یکپارچهسازی-با-فرمهای-موجود)
7. [بهینه‌سازی و Performance](#بهینهسازی-و-performance)
8. [عیب‌یابی](#عیبیابی)

## معرفی

این مجموعه کامپوننت‌ها امکانات زیر را فراهم می‌کنند:

- 🔍 **جستجوی مکان**: با استفاده از OpenStreetMap Nominatim API
- 🗺️ **انتخاب از روی نقشه**: با Leaflet و قابلیت Reverse Geocoding
- 🇮🇷 **پشتیبانی از فارسی**: نمایش نتایج به زبان فارسی
- 🚀 **Proxy API**: برای دور زدن محدودیت‌های IP در ایران
- ⚡ **Debouncing و Rate Limiting**: برای بهینه‌سازی درخواست‌ها
- 📱 **Responsive**: طراحی واکنشگرا برای موبایل و دسکتاپ

## معماری

```
┌─────────────────────────────────────────────────────┐
│                   React Components                   │
│  ┌────────────────┐  ┌──────────────────────────┐  │
│  │PlaceAutocomplete│  │PlaceAutocompleteWithMap │  │
│  └────────┬───────┘  └──────────┬───────────────┘  │
│           │                     │                    │
│           │        ┌────────────▼──────┐            │
│           │        │   MapSelector     │            │
│           │        └───────────────────┘            │
└───────────┼───────────────┬────────────────────────┘
            │               │
            │               │
            ▼               ▼
┌───────────────────────────────────────┐
│         Next.js API Routes            │
│  ┌──────────────────────────────────┐ │
│  │ /api/nominatim/search            │ │
│  │ - Proxy search requests          │ │
│  │ - Rate limiting                  │ │
│  └──────────────────────────────────┘ │
│  ┌──────────────────────────────────┐ │
│  │ /api/nominatim/reverse           │ │
│  │ - Reverse geocoding              │ │
│  │ - Rate limiting                  │ │
│  └──────────────────────────────────┘ │
└───────────────┬───────────────────────┘
                │
                ▼
┌─────────────────────────────────────┐
│   OpenStreetMap Nominatim API       │
│   https://nominatim.openstreetmap...│
└─────────────────────────────────────┘
```

## فایل‌های ایجاد شده

### 1. API Routes

```
app/api/nominatim/
├── search/
│   └── route.ts          # جستجوی مکان
└── reverse/
    └── route.ts          # Reverse geocoding
```

### 2. Components

```
components/placeAutocomplete/
├── PlaceAutocomplete.tsx              # کامپوننت Autocomplete
├── MapSelector.tsx                    # کامپوننت Map
├── PlaceAutocompleteWithMap.tsx      # کامپوننت ترکیبی
└── README.md                          # مستندات
```

### 3. Types

```
types/
└── place.ts              # Type definitions
```

### 4. Example Page

```
app/(dashboard-layout)/
└── place-autocomplete-demo/
    └── page.tsx          # صفحه نمایش
```

### 5. Documentation

```
PLACE_AUTOCOMPLETE_INTEGRATION_GUIDE.md    # این فایل
```

## راه‌اندازی سریع

### مرحله ۱: Import کامپوننت

برای استفاده از کامپوننت‌ها، آن‌ها را import کنید:

```tsx
'use client'; // مهم: این خط را فراموش نکنید

import { useState } from 'react';
import PlaceAutocomplete from '@/components/placeAutocomplete/PlaceAutocomplete';
import { PlaceResult } from '@/types/place';
```

### مرحله ۲: استفاده در کامپوننت

```tsx
function MyComponent() {
  const [selectedPlace, setSelectedPlace] = useState<PlaceResult | null>(null);

  return (
    <div>
      <PlaceAutocomplete
        onPlaceSelect={setSelectedPlace}
        placeholder="جستجوی مکان..."
        countrycodes="ir"
      />
      
      {selectedPlace && (
        <div>
          <p>مکان: {selectedPlace.displayName}</p>
          <p>مختصات: {selectedPlace.latitude}, {selectedPlace.longitude}</p>
        </div>
      )}
    </div>
  );
}
```

### مرحله ۳: برای Map (Dynamic Import)

```tsx
'use client';

import dynamic from 'next/dynamic';

// باید به صورت dynamic import شود
const MapSelector = dynamic(
  () => import('@/components/placeAutocomplete/MapSelector'),
  { 
    ssr: false,
    loading: () => <div>در حال بارگذاری نقشه...</div>
  }
);

function MyMapComponent() {
  return (
    <MapSelector
      center={[35.6892, 51.3890]}
      zoom={13}
      onLocationSelect={(place) => console.log(place)}
    />
  );
}
```

## سناریوهای استفاده

### سناریو ۱: ثبت آدرس مشتری

```tsx
'use client';

import { useState } from 'react';
import PlaceAutocomplete from '@/components/placeAutocomplete/PlaceAutocomplete';
import { PlaceResult } from '@/types/place';

function CustomerAddressForm() {
  const [address, setAddress] = useState<PlaceResult | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!address) return;

    const payload = {
      address: address.displayName,
      latitude: address.latitude,
      longitude: address.longitude,
      city: address.address?.city,
      state: address.address?.state,
      country: address.address?.country,
    };

    // ارسال به API
    await fetch('/api/customer/address', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });
  };

  return (
    <form onSubmit={handleSubmit}>
      <div className="mb-4">
        <label className="block text-sm font-medium mb-2">
          آدرس مشتری
        </label>
        <PlaceAutocomplete
          onPlaceSelect={setAddress}
          placeholder="آدرس را وارد کنید..."
          countrycodes="ir"
          acceptLanguage="fa,en"
        />
      </div>

      <button 
        type="submit" 
        disabled={!address}
        className="bg-primary text-white px-4 py-2 rounded"
      >
        ذخیره آدرس
      </button>
    </form>
  );
}
```

### سناریو ۲: انتخاب مکان برگزاری رویداد

```tsx
'use client';

import dynamic from 'next/dynamic';
import { useState } from 'react';
import { PlaceResult } from '@/types/place';

const PlaceAutocompleteWithMap = dynamic(
  () => import('@/components/placeAutocomplete/PlaceAutocompleteWithMap'),
  { ssr: false }
);

function EventLocationSelector() {
  const [eventLocation, setEventLocation] = useState<PlaceResult | null>(null);

  const saveEventLocation = async () => {
    if (!eventLocation) return;

    const response = await fetch('/api/event/location', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        eventId: 123,
        locationName: eventLocation.displayName,
        latitude: eventLocation.latitude,
        longitude: eventLocation.longitude,
      }),
    });

    if (response.ok) {
      alert('مکان ذخیره شد');
    }
  };

  return (
    <div className="space-y-4">
      <h2 className="text-xl font-bold">انتخاب مکان رویداد</h2>
      
      <PlaceAutocompleteWithMap
        onPlaceSelect={setEventLocation}
        placeholder="مکان برگزاری را جستجو کنید..."
        layout="vertical"
        mapHeight="500px"
        countrycodes="ir"
        mapCenter={[35.6892, 51.3890]}
        mapZoom={12}
      />

      {eventLocation && (
        <button 
          onClick={saveEventLocation}
          className="bg-success text-white px-6 py-2 rounded-lg"
        >
          ذخیره مکان رویداد
        </button>
      )}
    </div>
  );
}
```

### سناریو ۳: نمایش مکان‌های چندگانه

```tsx
'use client';

import dynamic from 'next/dynamic';
import { useState } from 'react';
import { PlaceResult } from '@/types/place';

const MapSelector = dynamic(
  () => import('@/components/placeAutocomplete/MapSelector'),
  { ssr: false }
);

function OfficeLocationsManager() {
  const [offices, setOffices] = useState<PlaceResult[]>([]);

  const addOfficeLocation = (place: PlaceResult | null) => {
    if (place && !offices.find(o => o.placeId === place.placeId)) {
      setOffices(prev => [...prev, place]);
    }
  };

  const removeOffice = (placeId: number) => {
    setOffices(prev => prev.filter(o => o.placeId !== placeId));
  };

  return (
    <div>
      <h2>مدیریت دفاتر شرکت</h2>
      
      <MapSelector
        onLocationSelect={addOfficeLocation}
        allowMultipleMarkers={true}
        height="600px"
        center={[35.6892, 51.3890]}
        zoom={11}
      />

      <div className="mt-6">
        <h3 className="font-bold mb-4">دفاتر ثبت شده ({offices.length})</h3>
        
        <ul className="space-y-2">
          {offices.map(office => (
            <li 
              key={office.placeId}
              className="flex justify-between items-center p-3 bg-card border rounded"
            >
              <div>
                <p className="font-medium">{office.displayName}</p>
                <p className="text-xs text-subtitle">
                  {office.latitude.toFixed(4)}, {office.longitude.toFixed(4)}
                </p>
              </div>
              <button 
                onClick={() => removeOffice(office.placeId)}
                className="text-danger text-sm"
              >
                حذف
              </button>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
```

### سناریو ۴: نمایش مسیر بین دو نقطه

```tsx
'use client';

import { useState } from 'react';
import PlaceAutocomplete from '@/components/placeAutocomplete/PlaceAutocomplete';
import { PlaceResult } from '@/types/place';

function RouteCalculator() {
  const [origin, setOrigin] = useState<PlaceResult | null>(null);
  const [destination, setDestination] = useState<PlaceResult | null>(null);

  const calculateDistance = () => {
    if (!origin || !destination) return null;

    // فرمول Haversine برای محاسبه فاصله
    const R = 6371; // شعاع زمین به کیلومتر
    const dLat = toRad(destination.latitude - origin.latitude);
    const dLon = toRad(destination.longitude - origin.longitude);
    
    const a = 
      Math.sin(dLat/2) * Math.sin(dLat/2) +
      Math.cos(toRad(origin.latitude)) * Math.cos(toRad(destination.latitude)) *
      Math.sin(dLon/2) * Math.sin(dLon/2);
    
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
    const distance = R * c;
    
    return distance.toFixed(2);
  };

  const toRad = (value: number) => (value * Math.PI) / 180;

  return (
    <div className="space-y-4">
      <h2 className="text-xl font-bold">محاسبه مسافت</h2>
      
      <div>
        <label className="block text-sm font-medium mb-2">مبدا</label>
        <PlaceAutocomplete
          onPlaceSelect={setOrigin}
          placeholder="مبدا را انتخاب کنید..."
          countrycodes="ir"
        />
      </div>

      <div>
        <label className="block text-sm font-medium mb-2">مقصد</label>
        <PlaceAutocomplete
          onPlaceSelect={setDestination}
          placeholder="مقصد را انتخاب کنید..."
          countrycodes="ir"
        />
      </div>

      {origin && destination && (
        <div className="p-4 bg-info/10 rounded-lg border border-info/20">
          <p className="text-lg font-bold">
            فاصله: {calculateDistance()} کیلومتر
          </p>
        </div>
      )}
    </div>
  );
}
```

## یکپارچه‌سازی با فرم‌های موجود

### استفاده با Formik

```tsx
'use client';

import { useFormik } from 'formik';
import PlaceAutocomplete from '@/components/placeAutocomplete/PlaceAutocomplete';
import { PlaceResult } from '@/types/place';

function FormWithLocation() {
  const formik = useFormik({
    initialValues: {
      name: '',
      location: null as PlaceResult | null,
      latitude: 0,
      longitude: 0,
    },
    onSubmit: (values) => {
      console.log('Form submitted:', values);
    },
  });

  const handleLocationSelect = (place: PlaceResult | null) => {
    formik.setFieldValue('location', place);
    formik.setFieldValue('latitude', place?.latitude || 0);
    formik.setFieldValue('longitude', place?.longitude || 0);
  };

  return (
    <form onSubmit={formik.handleSubmit}>
      <input
        name="name"
        value={formik.values.name}
        onChange={formik.handleChange}
        placeholder="نام"
      />

      <PlaceAutocomplete
        onPlaceSelect={handleLocationSelect}
        placeholder="مکان"
        countrycodes="ir"
        defaultValue={formik.values.location?.displayName}
      />

      <button type="submit">ارسال</button>
    </form>
  );
}
```

### استفاده با Form Maker موجود در پروژه

می‌توانید یک field type جدید به `form-maker` اضافه کنید:

```tsx
// در components/shared/form-maker.tsx

import PlaceAutocomplete from '@/components/placeAutocomplete/PlaceAutocomplete';

// در تابع renderField:
case 'place-autocomplete':
  return (
    <PlaceAutocomplete
      onPlaceSelect={(place) => {
        form.setFieldValue(item.key, place);
        // ذخیره مختصات در فیلدهای جداگانه
        if (place) {
          form.setFieldValue(`${item.key}_latitude`, place.latitude);
          form.setFieldValue(`${item.key}_longitude`, place.longitude);
        }
      }}
      placeholder={item.placeholder}
      countrycodes={item.countrycodes || 'ir'}
      defaultValue={form.values[item.key]?.displayName}
    />
  );
```

سپس می‌توانید در فرم‌ها استفاده کنید:

```tsx
const fields = [
  {
    key: 'location',
    type: 'place-autocomplete',
    placeholder: 'مکان را انتخاب کنید',
    countrycodes: 'ir',
  },
];
```

## بهینه‌سازی و Performance

### 1. Lazy Loading

همیشه کامپوننت‌های Map را به صورت dynamic import کنید:

```tsx
const MapComponent = dynamic(
  () => import('@/components/placeAutocomplete/MapSelector'),
  { 
    ssr: false,
    loading: () => <LoadingSkeleton />
  }
);
```

### 2. Memoization

برای فرم‌های پیچیده، از `useMemo` استفاده کنید:

```tsx
const memoizedPlace = useMemo(() => selectedPlace, [selectedPlace?.placeId]);
```

### 3. Debounce Timing

debounce delay را بر اساس نیاز تنظیم کنید:
- برای جستجوی سریع: 300ms
- برای کاهش درخواست‌ها: 700ms
- پیش‌فرض: 500ms

```tsx
<PlaceAutocomplete
  debounceDelay={300}  // سریع‌تر
  // یا
  debounceDelay={700}  // کمتر درخواست
/>
```

### 4. Caching

برای کاهش درخواست‌های تکراری، می‌توانید یک layer caching اضافه کنید:

```tsx
// utils/placeCache.ts
const cache = new Map<string, PlaceResult[]>();
const CACHE_DURATION = 5 * 60 * 1000; // 5 دقیقه

export function getCachedSearch(query: string) {
  return cache.get(query);
}

export function setCachedSearch(query: string, results: PlaceResult[]) {
  cache.set(query, results);
  setTimeout(() => cache.delete(query), CACHE_DURATION);
}
```

## عیب‌یابی

### مشکل: نقشه نمایش داده نمی‌شود

**علت‌های احتمالی:**
1. کامپوننت به صورت SSR render می‌شود
2. Leaflet CSS لود نشده است
3. خطای JavaScript در کنسول

**راه حل:**
```tsx
// ✅ درست
const MapSelector = dynamic(
  () => import('@/components/placeAutocomplete/MapSelector'),
  { ssr: false }
);

// ❌ غلط
import MapSelector from '@/components/placeAutocomplete/MapSelector';
```

### مشکل: خطای "window is not defined"

**راه حل:**
از `'use client'` در بالای فایل استفاده کنید:

```tsx
'use client';

import dynamic from 'next/dynamic';
// ...
```

### مشکل: Marker ها نمایش داده نمی‌شوند

**راه حل:**
بررسی کنید که آیا `selectedLocation` به درستی set می‌شود:

```tsx
console.log('Selected location:', selectedLocation);
```

### مشکل: نتایج جستجو فارسی نیست

**راه حل:**
`acceptLanguage` را به فارسی تنظیم کنید:

```tsx
<PlaceAutocomplete
  acceptLanguage="fa,en"  // ابتدا فارسی، سپس انگلیسی
  countrycodes="ir"       // محدود به ایران
/>
```

### مشکل: خطای Rate Limit

**علت:**
درخواست‌های بیش از حد به Nominatim API

**راه حل:**
1. debounce delay را افزایش دهید
2. از caching استفاده کنید
3. در API route، RATE_LIMIT_DELAY را افزایش دهید

### مشکل: نقشه بعد از انتخاب مکان update نمی‌شود

**راه حل:**
از `key` prop برای force re-render استفاده کنید:

```tsx
const [mapKey, setMapKey] = useState(0);

const handleSelect = (place) => {
  setSelectedPlace(place);
  setMapKey(prev => prev + 1); // Force re-render
};

return <MapSelector key={mapKey} ... />;
```

## نکات امنیتی

### 1. Sanitization

همیشه داده‌های ورودی را sanitize کنید:

```tsx
const sanitizedPlace = {
  ...place,
  displayName: DOMPurify.sanitize(place.displayName),
};
```

### 2. Validation

مختصات را validate کنید:

```tsx
function isValidCoordinate(lat: number, lon: number): boolean {
  return (
    lat >= -90 && lat <= 90 &&
    lon >= -180 && lon <= 180
  );
}
```

### 3. Rate Limiting

از rate limiting در سمت client هم استفاده کنید:

```tsx
let requestCount = 0;
const MAX_REQUESTS_PER_MINUTE = 60;

function checkRateLimit() {
  if (requestCount >= MAX_REQUESTS_PER_MINUTE) {
    throw new Error('Too many requests');
  }
  requestCount++;
  setTimeout(() => requestCount--, 60000);
}
```

## مثال کامل: فرم ثبت رویداد

```tsx
'use client';

import { useState } from 'react';
import dynamic from 'next/dynamic';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { PlaceResult } from '@/types/place';

const PlaceAutocompleteWithMap = dynamic(
  () => import('@/components/placeAutocomplete/PlaceAutocompleteWithMap'),
  { ssr: false }
);

interface EventFormValues {
  title: string;
  description: string;
  location: PlaceResult | null;
  date: string;
}

const validationSchema = Yup.object({
  title: Yup.string().required('عنوان الزامی است'),
  description: Yup.string(),
  location: Yup.object().nullable().required('مکان الزامی است'),
  date: Yup.string().required('تاریخ الزامی است'),
});

export default function EventForm() {
  const [isSubmitting, setIsSubmitting] = useState(false);

  const formik = useFormik<EventFormValues>({
    initialValues: {
      title: '',
      description: '',
      location: null,
      date: '',
    },
    validationSchema,
    onSubmit: async (values) => {
      setIsSubmitting(true);
      
      try {
        const response = await fetch('/api/events', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            title: values.title,
            description: values.description,
            locationName: values.location?.displayName,
            latitude: values.location?.latitude,
            longitude: values.location?.longitude,
            address: values.location?.address,
            date: values.date,
          }),
        });

        if (response.ok) {
          alert('رویداد با موفقیت ثبت شد');
          formik.resetForm();
        }
      } catch (error) {
        console.error('Error:', error);
        alert('خطا در ثبت رویداد');
      } finally {
        setIsSubmitting(false);
      }
    },
  });

  return (
    <form onSubmit={formik.handleSubmit} className="space-y-6">
      <div>
        <label className="block text-sm font-medium mb-2">
          عنوان رویداد *
        </label>
        <input
          name="title"
          type="text"
          value={formik.values.title}
          onChange={formik.handleChange}
          onBlur={formik.handleBlur}
          className="w-full p-3 border rounded-lg"
        />
        {formik.touched.title && formik.errors.title && (
          <p className="text-danger text-xs mt-1">{formik.errors.title}</p>
        )}
      </div>

      <div>
        <label className="block text-sm font-medium mb-2">
          توضیحات
        </label>
        <textarea
          name="description"
          value={formik.values.description}
          onChange={formik.handleChange}
          className="w-full p-3 border rounded-lg"
          rows={4}
        />
      </div>

      <div>
        <label className="block text-sm font-medium mb-2">
          تاریخ برگزاری *
        </label>
        <input
          name="date"
          type="date"
          value={formik.values.date}
          onChange={formik.handleChange}
          onBlur={formik.handleBlur}
          className="w-full p-3 border rounded-lg"
        />
        {formik.touched.date && formik.errors.date && (
          <p className="text-danger text-xs mt-1">{formik.errors.date}</p>
        )}
      </div>

      <div>
        <label className="block text-sm font-medium mb-2">
          مکان برگزاری *
        </label>
        <PlaceAutocompleteWithMap
          onPlaceSelect={(place) => formik.setFieldValue('location', place)}
          placeholder="جستجوی مکان..."
          countrycodes="ir"
          layout="vertical"
          mapHeight="400px"
        />
        {formik.touched.location && formik.errors.location && (
          <p className="text-danger text-xs mt-1">{formik.errors.location}</p>
        )}
      </div>

      {formik.values.location && (
        <div className="p-4 bg-success/10 rounded-lg border border-success/20">
          <h3 className="font-bold text-sm mb-2">مکان انتخاب شده:</h3>
          <p className="text-xs">{formik.values.location.displayName}</p>
        </div>
      )}

      <div className="flex gap-4">
        <button
          type="submit"
          disabled={isSubmitting || !formik.isValid}
          className="bg-primary text-white px-6 py-3 rounded-lg disabled:opacity-50"
        >
          {isSubmitting ? 'در حال ثبت...' : 'ثبت رویداد'}
        </button>
        
        <button
          type="button"
          onClick={() => formik.resetForm()}
          className="bg-slate text-foreground px-6 py-3 rounded-lg"
        >
          پاک کردن فرم
        </button>
      </div>
    </form>
  );
}
```

## خلاصه

این مجموعه کامپوننت‌ها به شما امکان می‌دهد:

- ✅ جستجوی مکان با autocomplete
- ✅ انتخاب مکان از روی نقشه
- ✅ reverse geocoding خودکار
- ✅ یکپارچه‌سازی آسان با فرم‌ها
- ✅ پشتیبانی کامل از فارسی
- ✅ بهینه‌سازی شده برای ایران

برای مشاهده نمونه عملی، به صفحه `/place-autocomplete-demo` مراجعه کنید.

## پشتیبانی

برای سوالات یا مشکلات:
1. مستندات کامل در `components/placeAutocomplete/README.md`
2. نمونه‌های کاربردی در `/place-autocomplete-demo`
3. تماس با تیم توسعه

---

**نکته مهم**: این کامپوننت‌ها طبق استانداردهای موجود در پروژه CRM-Front توسعه یافته‌اند و با معماری فعلی سازگار هستند.

