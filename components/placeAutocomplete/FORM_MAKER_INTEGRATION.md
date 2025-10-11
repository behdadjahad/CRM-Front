# یکپارچه‌سازی با Form Maker

این راهنما نحوه استفاده از PlaceAutocomplete در سیستم FormMaker موجود پروژه را توضیح می‌دهد.

## مرحله ۱: اضافه کردن به FormMaker

ابتدا باید فیلد جدید را به `form-maker.tsx` اضافه کنید:

### ویرایش `components/shared/form-maker.tsx`

```tsx
// در بخش imports
import PlaceAutocompleteFormField from '../placeAutocomplete/PlaceAutocompleteFormField';

// در تابع renderField، قبل از return، case جدید اضافه کنید:
const renderField = (item: FormMakerInterface['fields'][0]) => {
  switch (item.type) {
    // ... سایر case ها
    
    case 'place-autocomplete':
      return (
        <PlaceAutocompleteFormField
          key={item.key}
          form={form}
          item={item}
          disabled={disabled}
        />
      );

    // ... ادامه case ها
    default:
      return <TextInput key={item.key} form={form} item={item} />;
  }
};
```

## مرحله ۲: استفاده در فرم‌ها

حالا می‌توانید از `place-autocomplete` به عنوان یک نوع فیلد استفاده کنید:

### مثال ساده

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

### مثال پیشرفته با تمام گزینه‌ها

```tsx
const fields = [
  {
    key: 'eventLocation',
    type: 'place-autocomplete',
    placeholder: 'مکان برگزاری رویداد',
    required: true,
    countrycodes: 'ir',
    acceptLanguage: 'fa,en',
    maxResults: 10,
    debounceDelay: 500,
    storeCoordinates: true,      // ذخیره مختصات در فیلدهای جداگانه
    latitudeKey: 'latitude',     // کلید فیلد latitude (اختیاری)
    longitudeKey: 'longitude',   // کلید فیلد longitude (اختیاری)
    storeAddress: true,          // ذخیره اجزای آدرس
    showLocationInfo: true,      // نمایش اطلاعات مکان زیر input
    helpText: 'لطفاً مکان دقیق را انتخاب کنید',
    onChange: (place) => {
      console.log('Selected:', place);
    },
  },
];
```

## مرحله ۳: دسترسی به داده‌ها

### دسترسی به PlaceResult کامل

```tsx
const selectedPlace = form.values.location;

if (selectedPlace) {
  console.log('Name:', selectedPlace.displayName);
  console.log('Lat:', selectedPlace.latitude);
  console.log('Lon:', selectedPlace.longitude);
  console.log('Address:', selectedPlace.address);
}
```

### دسترسی به مختصات جداگانه (با storeCoordinates: true)

```tsx
const latitude = form.values.latitude;
const longitude = form.values.longitude;

// یا اگر کلیدهای سفارشی تعریف کرده‌اید:
const lat = form.values.eventLocation_latitude;
const lon = form.values.eventLocation_longitude;
```

## مثال‌های کامل

### مثال ۱: فرم ساده ثبت آدرس

```tsx
'use client';

import { useState } from 'react';
import FormMaker from '@/components/shared/form-maker';
import { useFormik } from 'formik';
import * as Yup from 'yup';

const validationSchema = Yup.object({
  name: Yup.string().required('نام الزامی است'),
  location: Yup.object().nullable().required('مکان الزامی است'),
});

function AddressForm() {
  const form = useFormik({
    initialValues: {
      name: '',
      location: null,
      latitude: 0,
      longitude: 0,
    },
    validationSchema,
    onSubmit: async (values) => {
      console.log('Submitting:', values);
      // ارسال به API
    },
  });

  const fields = [
    {
      key: 'name',
      type: 'text',
      placeholder: 'نام مکان',
      required: true,
    },
    {
      key: 'location',
      type: 'place-autocomplete',
      placeholder: 'آدرس',
      required: true,
      countrycodes: 'ir',
      storeCoordinates: true,
      latitudeKey: 'latitude',
      longitudeKey: 'longitude',
      showLocationInfo: true,
    },
  ];

  return (
    <form onSubmit={form.handleSubmit}>
      <FormMaker
        form={form}
        fields={fields}
      />
      <button type="submit">ذخیره</button>
    </form>
  );
}
```

### مثال ۲: فرم رویداد با Validation

```tsx
'use client';

import FormMaker from '@/components/shared/form-maker';
import { useFormik } from 'formik';
import * as Yup from 'yup';

const validationSchema = Yup.object({
  title: Yup.string().required('عنوان الزامی است'),
  date: Yup.string().required('تاریخ الزامی است'),
  location: Yup.object()
    .nullable()
    .required('مکان الزامی است')
    .test('has-coordinates', 'مکان نامعتبر است', (value) => {
      return value && value.latitude && value.longitude;
    }),
});

function EventForm() {
  const form = useFormik({
    initialValues: {
      title: '',
      description: '',
      date: '',
      location: null,
      latitude: 0,
      longitude: 0,
    },
    validationSchema,
    onSubmit: async (values) => {
      const payload = {
        title: values.title,
        description: values.description,
        date: values.date,
        locationName: values.location?.displayName,
        latitude: values.latitude,
        longitude: values.longitude,
        address: values.location?.address,
      };

      await fetch('/api/events', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
    },
  });

  const fields = [
    {
      key: 'title',
      type: 'text',
      placeholder: 'عنوان رویداد',
      required: true,
    },
    {
      key: 'description',
      type: 'textarea',
      placeholder: 'توضیحات',
    },
    {
      key: 'date',
      type: 'date',
      placeholder: 'تاریخ برگزاری',
      required: true,
    },
    {
      key: 'location',
      type: 'place-autocomplete',
      placeholder: 'مکان برگزاری',
      required: true,
      countrycodes: 'ir',
      maxResults: 5,
      storeCoordinates: true,
      latitudeKey: 'latitude',
      longitudeKey: 'longitude',
      storeAddress: true,
      showLocationInfo: true,
      helpText: 'مکان دقیق برگزاری رویداد را انتخاب کنید',
      onChange: (place) => {
        if (place) {
          console.log('Location selected:', place.displayName);
        }
      },
    },
  ];

  return (
    <div className="max-w-2xl mx-auto p-6">
      <h1 className="text-2xl font-bold mb-6">ثبت رویداد جدید</h1>
      
      <form onSubmit={form.handleSubmit} className="space-y-4">
        <FormMaker form={form} fields={fields} />
        
        <div className="flex gap-4">
          <button
            type="submit"
            disabled={form.isSubmitting}
            className="bg-primary text-white px-6 py-2 rounded-lg"
          >
            {form.isSubmitting ? 'در حال ثبت...' : 'ثبت رویداد'}
          </button>
          
          <button
            type="button"
            onClick={() => form.resetForm()}
            className="bg-slate text-foreground px-6 py-2 rounded-lg"
          >
            پاک کردن
          </button>
        </div>
      </form>
    </div>
  );
}
```

### مثال ۳: فرم با چند مکان

```tsx
'use client';

import { useState } from 'react';
import FormMaker from '@/components/shared/form-maker';
import { useFormik } from 'formik';

function RouteForm() {
  const form = useFormik({
    initialValues: {
      routeName: '',
      origin: null,
      destination: null,
      waypoints: [] as any[],
    },
    onSubmit: async (values) => {
      console.log('Route:', values);
    },
  });

  const [waypointCount, setWaypointCount] = useState(0);

  const addWaypoint = () => {
    setWaypointCount(prev => prev + 1);
  };

  const fields = [
    {
      key: 'routeName',
      type: 'text',
      placeholder: 'نام مسیر',
      required: true,
    },
    {
      key: 'origin',
      type: 'place-autocomplete',
      placeholder: 'مبدا',
      required: true,
      countrycodes: 'ir',
      showLocationInfo: true,
    },
    {
      key: 'destination',
      type: 'place-autocomplete',
      placeholder: 'مقصد',
      required: true,
      countrycodes: 'ir',
      showLocationInfo: true,
    },
  ];

  // Add waypoint fields dynamically
  for (let i = 0; i < waypointCount; i++) {
    fields.push({
      key: `waypoint_${i}`,
      type: 'place-autocomplete',
      placeholder: `ایستگاه ${i + 1}`,
      countrycodes: 'ir',
    } as any);
  }

  return (
    <div>
      <form onSubmit={form.handleSubmit}>
        <FormMaker form={form} fields={fields} />
        
        <button
          type="button"
          onClick={addWaypoint}
          className="bg-secondary text-white px-4 py-2 rounded-lg mb-4"
        >
          افزودن ایستگاه
        </button>
        
        <button type="submit" className="bg-primary text-white px-6 py-2 rounded-lg">
          ذخیره مسیر
        </button>
      </form>
    </div>
  );
}
```

## گزینه‌های پیکربندی

### گزینه‌های اصلی

| Option | Type | Default | Description |
|--------|------|---------|-------------|
| `type` | `string` | - | باید `'place-autocomplete'` باشد |
| `key` | `string` | - | کلید فیلد در form values |
| `placeholder` | `string` | - | متن placeholder |
| `required` | `boolean` | `false` | آیا فیلد اجباری است |

### گزینه‌های جستجو

| Option | Type | Default | Description |
|--------|------|---------|-------------|
| `countrycodes` | `string` | `''` | کد کشورها (مثال: 'ir') |
| `acceptLanguage` | `string` | `'fa,en'` | زبان‌های قابل قبول |
| `maxResults` | `number` | `5` | حداکثر تعداد نتایج |
| `debounceDelay` | `number` | `500` | تاخیر debounce (ms) |

### گزینه‌های ذخیره‌سازی

| Option | Type | Default | Description |
|--------|------|---------|-------------|
| `storeCoordinates` | `boolean` | `false` | ذخیره مختصات در فیلدهای جداگانه |
| `latitudeKey` | `string` | `'{key}_latitude'` | کلید فیلد latitude |
| `longitudeKey` | `string` | `'{key}_longitude'` | کلید فیلد longitude |
| `storeAddress` | `boolean` | `false` | ذخیره اجزای آدرس |

### گزینه‌های نمایش

| Option | Type | Default | Description |
|--------|------|---------|-------------|
| `showLocationInfo` | `boolean` | `false` | نمایش اطلاعات مکان |
| `helpText` | `string` | - | متن راهنما |
| `inputClassName` | `string` | - | کلاس CSS برای input |

### گزینه‌های رویداد

| Option | Type | Default | Description |
|--------|------|---------|-------------|
| `onChange` | `function` | - | تابع callback هنگام تغییر |

## نکات مهم

### 1. Validation

برای validation مکان:

```tsx
const validationSchema = Yup.object({
  location: Yup.object()
    .nullable()
    .required('مکان الزامی است')
    .test('has-coordinates', 'مکان نامعتبر است', (value) => {
      return value && 
             typeof value.latitude === 'number' && 
             typeof value.longitude === 'number';
    }),
});
```

### 2. مقدار اولیه

برای set کردن مقدار اولیه:

```tsx
const form = useFormik({
  initialValues: {
    location: {
      placeId: 123,
      displayName: 'تهران، ایران',
      latitude: 35.6892,
      longitude: 51.3890,
      // ... سایر فیلدها
    },
  },
  // ...
});
```

### 3. Reset فرم

برای reset کردن فیلد مکان:

```tsx
form.setFieldValue('location', null);
form.setFieldValue('latitude', 0);
form.setFieldValue('longitude', 0);
```

### 4. دسترسی برنامه‌نویسی

برای set کردن مکان به صورت برنامه‌نویسی:

```tsx
const setLocation = (lat: number, lon: number, name: string) => {
  form.setFieldValue('location', {
    placeId: Date.now(),
    displayName: name,
    latitude: lat,
    longitude: lon,
    lat,
    lon,
  });
};
```

## خلاصه

با این یکپارچه‌سازی، می‌توانید:

✅ از place autocomplete به عنوان یک فیلد در FormMaker استفاده کنید
✅ validation کامل روی مکان انجام دهید
✅ مختصات را در فیلدهای جداگانه ذخیره کنید
✅ اطلاعات کامل آدرس را دریافت کنید
✅ رویدادهای سفارشی تعریف کنید

برای مثال‌های بیشتر، به فایل `PLACE_AUTOCOMPLETE_INTEGRATION_GUIDE.md` مراجعه کنید.


