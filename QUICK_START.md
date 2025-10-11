# Place Autocomplete - Quick Start Guide ⚡

یک راهنمای سریع برای شروع استفاده از کامپوننت‌های Place Autocomplete و Map Selection.

---

## 🚀 شروع در 5 دقیقه

### قدم 1: مشاهده Demo

بروید به:
```
http://localhost:3000/place-autocomplete-demo
```

و با کامپوننت‌ها آشنا شوید.

---

### قدم 2: Autocomplete ساده

```tsx
'use client';

import { useState } from 'react';
import PlaceAutocomplete from '@/components/placeAutocomplete/PlaceAutocomplete';
import { PlaceResult } from '@/types/place';

export default function MyPage() {
  const [place, setPlace] = useState<PlaceResult | null>(null);

  return (
    <div>
      <PlaceAutocomplete
        onPlaceSelect={setPlace}
        placeholder="جستجوی مکان..."
        countrycodes="ir"
      />
      
      {place && <p>انتخاب شده: {place.displayName}</p>}
    </div>
  );
}
```

**✅ همین! کار تمام است.**

---

### قدم 3: با نقشه

```tsx
'use client';

import dynamic from 'next/dynamic';

// حتماً dynamic import کنید
const PlaceAutocompleteWithMap = dynamic(
  () => import('@/components/placeAutocomplete/PlaceAutocompleteWithMap'),
  { ssr: false }
);

export default function MyPage() {
  return (
    <PlaceAutocompleteWithMap
      onPlaceSelect={(place) => console.log(place)}
      countrycodes="ir"
    />
  );
}
```

**✅ همین! نقشه و جستجو هر دو کار می‌کنند.**

---

## 📦 3 کامپوننت اصلی

### 1️⃣ PlaceAutocomplete
فقط جستجو - بدون نقشه

```tsx
import PlaceAutocomplete from '@/components/placeAutocomplete/PlaceAutocomplete';

<PlaceAutocomplete
  onPlaceSelect={(place) => console.log(place)}
  countrycodes="ir"
/>
```

### 2️⃣ MapSelector
فقط نقشه - بدون جستجو

```tsx
import dynamic from 'next/dynamic';

const MapSelector = dynamic(
  () => import('@/components/placeAutocomplete/MapSelector'),
  { ssr: false }
);

<MapSelector
  center={[35.6892, 51.3890]}
  zoom={13}
  onLocationSelect={(place) => console.log(place)}
/>
```

### 3️⃣ PlaceAutocompleteWithMap
جستجو + نقشه

```tsx
import dynamic from 'next/dynamic';

const PlaceAutocompleteWithMap = dynamic(
  () => import('@/components/placeAutocomplete/PlaceAutocompleteWithMap'),
  { ssr: false }
);

<PlaceAutocompleteWithMap
  onPlaceSelect={(place) => console.log(place)}
  layout="vertical"  // یا "horizontal"
/>
```

---

## ⚙️ Props مهم

### برای PlaceAutocomplete

```tsx
<PlaceAutocomplete
  onPlaceSelect={handleSelect}       // ✅ اجباری
  placeholder="جستجو..."             // متن placeholder
  countrycodes="ir"                  // محدود به ایران
  maxResults={5}                     // تعداد نتایج (پیش‌فرض: 5)
  debounceDelay={500}                // تاخیر (پیش‌فرض: 500ms)
  acceptLanguage="fa,en"             // زبان (پیش‌فرض: fa,en)
/>
```

### برای MapSelector

```tsx
<MapSelector
  onLocationSelect={handleSelect}    // ✅ اجباری
  center={[35.6892, 51.3890]}       // مرکز نقشه (تهران)
  zoom={13}                          // سطح zoom (پیش‌فرض: 13)
  height="400px"                     // ارتفاع (پیش‌فرض: 400px)
  allowMultipleMarkers={false}       // چند marker؟
/>
```

### برای PlaceAutocompleteWithMap

```tsx
<PlaceAutocompleteWithMap
  onPlaceSelect={handleSelect}       // ✅ اجباری
  layout="vertical"                  // "vertical" یا "horizontal"
  countrycodes="ir"                  // محدود به ایران
  mapCenter={[35.6892, 51.3890]}    // مرکز نقشه
  mapZoom={13}                       // zoom نقشه
  mapHeight="400px"                  // ارتفاع نقشه
/>
```

---

## 📊 دریافت داده

```tsx
const [place, setPlace] = useState<PlaceResult | null>(null);

<PlaceAutocomplete onPlaceSelect={setPlace} />

// بعد از انتخاب:
if (place) {
  console.log('نام:', place.displayName);
  console.log('عرض:', place.latitude);
  console.log('طول:', place.longitude);
  console.log('شهر:', place.address?.city);
  console.log('استان:', place.address?.state);
}
```

---

## 🎯 مثال‌های سریع

### فرم ثبت آدرس

```tsx
'use client';

import { useState } from 'react';
import PlaceAutocomplete from '@/components/placeAutocomplete/PlaceAutocomplete';

export default function AddressForm() {
  const [address, setAddress] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    await fetch('/api/save-address', {
      method: 'POST',
      body: JSON.stringify({
        name: address?.displayName,
        lat: address?.latitude,
        lon: address?.longitude,
      }),
    });
  };

  return (
    <form onSubmit={handleSubmit}>
      <PlaceAutocomplete
        onPlaceSelect={setAddress}
        countrycodes="ir"
      />
      <button type="submit">ذخیره</button>
    </form>
  );
}
```

### انتخاب مکان رویداد

```tsx
'use client';

import dynamic from 'next/dynamic';
import { useState } from 'react';

const PlaceAutocompleteWithMap = dynamic(
  () => import('@/components/placeAutocomplete/PlaceAutocompleteWithMap'),
  { ssr: false }
);

export default function EventLocation() {
  const [location, setLocation] = useState(null);

  return (
    <div>
      <h2>مکان رویداد</h2>
      <PlaceAutocompleteWithMap
        onPlaceSelect={setLocation}
        countrycodes="ir"
      />
      {location && <p>✅ {location.displayName}</p>}
    </div>
  );
}
```

---

## ⚠️ نکات مهم

### ✅ DO (انجام دهید)

```tsx
// ✅ برای Map از dynamic import استفاده کنید
const Map = dynamic(() => import('./MapSelector'), { ssr: false });

// ✅ 'use client' را اضافه کنید
'use client';

// ✅ برای ایران از countrycodes استفاده کنید
countrycodes="ir"
```

### ❌ DON'T (انجام ندهید)

```tsx
// ❌ Map را مستقیم import نکنید
import MapSelector from './MapSelector';

// ❌ SSR را disable نکنید
const Map = dynamic(() => import('./MapSelector'));

// ❌ بدون 'use client' استفاده نکنید (در App Router)
```

---

## 🔧 عیب‌یابی سریع

### نقشه نمایش داده نمی‌شود؟
```tsx
// از dynamic import استفاده کنید
const Map = dynamic(() => import('./MapSelector'), { ssr: false });
```

### خطای "window is not defined"؟
```tsx
// در بالای فایل اضافه کنید
'use client';
```

### نتایج فارسی نیست؟
```tsx
// این دو را اضافه کنید
acceptLanguage="fa,en"
countrycodes="ir"
```

---

## 📚 مستندات کامل

برای اطلاعات بیشتر:

- **راهنمای جامع**: `PLACE_AUTOCOMPLETE_INTEGRATION_GUIDE.md`
- **مستندات کامپوننت**: `components/placeAutocomplete/README.md`
- **یکپارچه‌سازی با Form**: `components/placeAutocomplete/FORM_MAKER_INTEGRATION.md`
- **خلاصه پروژه**: `PLACE_AUTOCOMPLETE_SUMMARY.md`
- **صفحه Demo**: `/place-autocomplete-demo`

---

## 🎉 آماده‌اید!

با این راهنما می‌توانید:

✅ Autocomplete اضافه کنید
✅ نقشه اضافه کنید
✅ مکان را دریافت کنید
✅ در فرم استفاده کنید

**موفق باشید! 🚀**

---

## 💡 نکته‌های سریع

### کپی-پیست برای شروع سریع

```tsx
'use client';

import { useState } from 'react';
import dynamic from 'next/dynamic';
import { PlaceResult } from '@/types/place';

const PlaceAutocompleteWithMap = dynamic(
  () => import('@/components/placeAutocomplete/PlaceAutocompleteWithMap'),
  { ssr: false }
);

export default function MyPage() {
  const [place, setPlace] = useState<PlaceResult | null>(null);

  const handleSubmit = () => {
    if (place) {
      console.log('Selected:', {
        name: place.displayName,
        lat: place.latitude,
        lon: place.longitude,
      });
    }
  };

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">انتخاب مکان</h1>
      
      <PlaceAutocompleteWithMap
        onPlaceSelect={setPlace}
        placeholder="جستجوی مکان..."
        countrycodes="ir"
        layout="vertical"
        mapHeight="400px"
      />
      
      {place && (
        <button
          onClick={handleSubmit}
          className="mt-4 bg-primary text-white px-6 py-2 rounded-lg"
        >
          ذخیره مکان
        </button>
      )}
    </div>
  );
}
```

**کپی کنید و استفاده کنید! ⚡**


