# جریان کامل SSE برای نمایش تعداد سبد خرید

## 📚 فهرست مطالب
1. [SSE چیست؟](#sse-چیست)
2. [معماری ساده ما](#معماری-ساده-ما)
3. [جریان کامل داده](#جریان-کامل-داده)
4. [کد و توضیحات](#کد-و-توضیحات)
5. [مثال‌های عملی](#مثالهای-عملی)

---

## SSE چیست؟

**SSE** مخفف **Server-Sent Events** است.

### به زبان ساده:
- یک **کانال یک‌طرفه** از سرور به مرورگر
- سرور می‌تواند **هر لحظه** داده بفرستد
- مرورگر **گوش می‌دهد** و داده را دریافت می‌کند
- **اتصال همیشه باز** است (Real-time)

### تفاوت با روش‌های دیگر:

| روش | توضیح | مثال |
|-----|-------|------|
| **Polling** | هر چند ثانیه یکبار درخواست می‌زنیم | مثل اینکه هر 5 ثانیه بپرسیم: "خبری شده؟" |
| **WebSocket** | کانال دو طرفه | مثل تماس تلفنی - هر دو طرف می‌توانند حرف بزنند |
| **SSE** | کانال یک‌طرفه | مثل رادیو - فقط گوش می‌دهیم |

---

## معماری ساده ما

### قبل (پیچیده):
```
سرور → EventSource → Service → Hook → Context → Component
         (10+ فایل، 1500+ خط کد)
```

### الان (ساده):
```
سرور → EventSource → Hook → Component
         (1 فایل، 70 خط کد)
```

### نمودار کامل:

```
┌─────────────────────────────────────────────────┐
│                    سرور بک‌اند                  │
│        http://185.126.203.246:3001              │
│                                                  │
│  📡 هر چند ثانیه event می‌فرستد:              │
│  { "itemCount": 3 }                             │
└────────────────┬────────────────────────────────┘
                 │
                 │ SSE Connection
                 │ (اتصال همیشه باز)
                 ▼
┌─────────────────────────────────────────────────┐
│              EventSource API                     │
│          (API داخلی مرورگر)                     │
│                                                  │
│  📨 دریافت event از سرور                       │
│  🔄 مدیریت reconnection خودکار                │
└────────────────┬────────────────────────────────┘
                 │
                 │ onmessage
                 ▼
┌─────────────────────────────────────────────────┐
│          hooks/useCartCount.ts                   │
│                                                  │
│  const [count, setCount] = useState(0);         │
│                                                  │
│  eventSource.onmessage = (event) => {           │
│    const data = JSON.parse(event.data);         │
│    setCount(data.itemCount);                    │
│  }                                               │
└────────────────┬────────────────────────────────┘
                 │
                 │ return { count }
                 ▼
┌─────────────────────────────────────────────────┐
│       components/shared/cart-icon.tsx            │
│                                                  │
│  const { count } = useCartCount();              │
│  <span>{count}</span>                           │
│                                                  │
│  نمایش عدد روی آیکون سبد خرید 🛒               │
└─────────────────────────────────────────────────┘
```

---

## جریان کامل داده

### مرحله 1️⃣: برقراری اتصال

```javascript
// در useCartCount.ts

// وقتی component بارگذاری می‌شود
useEffect(() => {
  // 1. ساختن URL با شناسه کاربر
  const url = `http://185.126.203.246:3001/api/v1/cart/updates?chadcoCustomerId=${customerId}`;
  
  // 2. ایجاد اتصال SSE
  const eventSource = new EventSource(url);
  
  console.log('📞 در حال اتصال به سرور...');
  
  // بقیه کد...
}, [customerId]);
```

**چه اتفاقی می‌افتد:**
- مرورگر به سرور وصل می‌شود
- یک اتصال HTTP باز می‌ماند
- منتظر دریافت داده می‌ماند

---

### مرحله 2️⃣: اتصال برقرار شد

```javascript
// وقتی اتصال موفق شد
eventSource.onopen = () => {
  console.log('✅ اتصال برقرار شد!');
  setIsConnected(true); // نمایش نقطه سبز
};
```

**چه اتفاقی می‌افتد:**
- اتصال موفق بود
- نقطه سبز در CartIcon نمایش داده می‌شود
- آماده دریافت داده

---

### مرحله 3️⃣: دریافت داده (Event)

```javascript
// وقتی سرور event می‌فرستد
eventSource.onmessage = (event) => {
  console.log('📨 پیام دریافت شد:', event.data);
  
  // 1. تبدیل JSON به object
  const data = JSON.parse(event.data);
  // مثال: { "itemCount": 3 }
  
  // 2. چک کردن نوع event
  if (data.type === 'heartbeat') {
    console.log('💓 Heartbeat - فقط چک کردن اتصال');
    return; // کاری نمی‌کنیم، فقط نشان می‌دهد اتصال زنده است
  }
  
  // 3. به‌روزرسانی تعداد سبد
  if (data.itemCount !== undefined) {
    console.log('🛒 تعداد جدید سبد:', data.itemCount);
    setCount(data.itemCount); // ذخیره در state
  }
};
```

**چه اتفاقی می‌افتد:**
- سرور یک پیام JSON می‌فرستد
- ما آن را Parse می‌کنیم
- تعداد سبد را به‌روز می‌کنیم
- React خودکار UI را دوباره رندر می‌کند

---

### مرحله 4️⃣: مدیریت خطا

```javascript
// اگر مشکلی پیش آمد
eventSource.onerror = (error) => {
  console.error('❌ خطا در اتصال:', error);
  setIsConnected(false); // نمایش نقطه قرمز
  
  // نگران نباشید!
  // EventSource خودکار دوباره متصل می‌شود
};
```

**چه اتفاقی می‌افتد:**
- اگر اینترنت قطع شود
- یا سرور restart شود
- مرورگر **خودکار** دوباره وصل می‌شود
- نیازی به کد اضافی نیست!

---

### مرحله 5️⃣: پاکسازی (Cleanup)

```javascript
// وقتی component از بین می‌رود
return () => {
  console.log('🔌 قطع اتصال SSE');
  eventSource.close(); // بستن اتصال
};
```

**چه اتفاقی می‌افتد:**
- وقتی کاربر از صفحه خارج می‌شود
- یا component unmount می‌شود
- اتصال به درستی بسته می‌شود
- از نشت حافظه جلوگیری می‌کند

---

## کد و توضیحات

### فایل اصلی: `hooks/useCartCount.ts`

```javascript
/**
 * Hook ساده برای نمایش تعداد سبد خرید
 * از SSE استفاده می‌کند - بدون Context، بدون Redux sync
 */

import { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { RootState } from '@/store';

// آدرس سرور SSE
const SSE_URL = 'http://185.126.203.246:3001/api/v1/cart/updates';

export function useCartCount() {
    // 🔢 State برای نگهداری تعداد آیتم‌های سبد
    const [count, setCount] = useState(0);
    
    // 🟢 State برای نمایش وضعیت اتصال (متصل/قطع)
    const [isConnected, setIsConnected] = useState(false);
    
    // 👤 گرفتن شناسه کاربر از Redux
    const customerId = useSelector((state: RootState) => state?.login?.chadcoCustomerId);

    // 🔄 Effect اصلی - برقراری اتصال SSE
    useEffect(() => {
        // اگر کاربر login نکرده، کاری نکن
        if (!customerId) {
            setCount(0);
            setIsConnected(false);
            return;
        }

        console.log('[CartCount] 📞 در حال اتصال به SSE...');
        
        // ساختن URL کامل با شناسه کاربر
        const url = `${SSE_URL}?chadcoCustomerId=${customerId}`;
        
        // ایجاد اتصال EventSource
        const eventSource = new EventSource(url);

        // 1️⃣ وقتی اتصال برقرار شد
        eventSource.onopen = () => {
            console.log('[CartCount] ✅ اتصال موفق!');
            setIsConnected(true); // نقطه سبز نمایش بده
        };

        // 2️⃣ وقتی پیامی از سرور رسید
        eventSource.onmessage = (event) => {
            try {
                console.log('[CartCount] 📨 پیام دریافت شد:', event.data);
                
                // تبدیل JSON به object
                const data = JSON.parse(event.data);
                console.log('[CartCount] داده Parse شده:', data);

                // چک کردن Heartbeat (فقط چک اتصال، داده مهم نیست)
                if (data.type === 'heartbeat') {
                    console.log('[CartCount] 💓 Heartbeat - اتصال زنده است');
                    return; // کاری نکن
                }

                // اگر فیلد itemCount داشت
                if (data.itemCount !== undefined) {
                    console.log('[CartCount] 🛒 تعداد سبد:', data.itemCount);
                    setCount(data.itemCount); // به‌روزرسانی
                } 
                // یا اگر آرایه items داشت
                else if (data.items && Array.isArray(data.items)) {
                    console.log('[CartCount] 🛒 تعداد از آرایه items:', data.items.length);
                    setCount(data.items.length); // محاسبه طول آرایه
                }
            } catch (error) {
                console.error('[CartCount] ❌ خطا در Parse کردن:', error);
            }
        };

        // 3️⃣ وقتی خطایی رخ داد
        eventSource.onerror = (error) => {
            console.error('[CartCount] ❌ خطا در SSE:', error);
            setIsConnected(false); // نقطه قرمز نمایش بده
            // نگران نباش - EventSource خودش reconnect می‌کند
        };

        // 4️⃣ پاکسازی: وقتی component از بین رفت
        return () => {
            console.log('[CartCount] 🔌 قطع اتصال');
            eventSource.close(); // بستن اتصال
        };
    }, [customerId]); // هر بار که customerId تغییر کرد، دوباره اجرا شو

    // برگرداندن count و وضعیت اتصال
    return { count, isConnected };
}
```

---

### استفاده در Component: `cart-icon.tsx`

```javascript
import { useCartCount } from '@/hooks/useCartCount';

export default function CartIcon() {
  // 🎣 استفاده از Hook
  const { count, isConnected } = useCartCount();
  
  return (
    <Button>
      <ShoppingCart />
      
      {/* نمایش تعداد اگر بیشتر از 0 بود */}
      {count > 0 && (
        <span className="badge">
          {count > 99 ? "99+" : count}
        </span>
      )}
      
      {/* نقطه وضعیت اتصال */}
      <div className={isConnected ? 'bg-green-500' : 'bg-red-500'} />
    </Button>
  );
}
```

**توضیحات:**
- فقط باید `useCartCount()` را صدا بزنیم
- `count` را نمایش می‌دهیم
- `isConnected` را برای نمایش نقطه سبز/قرمز استفاده می‌کنیم
- تمام! خیلی ساده 🎉

---

## مثال‌های عملی

### سناریو 1: کاربر آیتم اضافه می‌کند

```
1. کاربر روی "افزودن به سبد" کلیک می‌کند
   ↓
2. فرانت‌اند API را صدا می‌زند
   POST /cart/add
   ↓
3. بک‌اند آیتم را اضافه می‌کند
   ↓
4. بک‌اند event SSE می‌فرستد:
   { "type": "cart_update", "itemCount": 4 }
   ↓
5. useCartCount این event را دریافت می‌کند
   ↓
6. setCount(4) اجرا می‌شود
   ↓
7. React خودکار CartIcon را دوباره رندر می‌کند
   ↓
8. عدد 4 روی آیکون نمایش داده می‌شود ✨
```

**زمان:** کمتر از 100 میلی‌ثانیه! ⚡

---

### سناریو 2: دستگاه دیگری آیتم اضافه می‌کند

```
📱 گوشی شما          💻 لپ‌تاپ شما         🖥️ سرور
     │                      │                  │
     │  کلیک "افزودن"      │                  │
     ├─────────────────────────────────────►  │
     │                      │         ✅ اضافه کرد
     │                      │                  │
     │  ◄──────────────── SSE Event ─────────┤
     │  itemCount: 5       │                  │
     │  ✅ به‌روز شد!     │                  │
     │                      │                  │
     │                      │  ◄── SSE Event ──┤
     │                      │  itemCount: 5    │
     │                      │  ✅ به‌روز شد!  │
```

**جادو:** هر دو دستگاه **بدون refresh** به‌روز می‌شوند! 🎩✨

---

### سناریو 3: اینترنت قطع شد

```
⏰ زمان    وضعیت                             UI
────────────────────────────────────────────────
10:00    ✅ متصل - count: 3                 🟢
10:01    ❌ اینترنت قطع شد                  🔴
10:01    ⏳ EventSource reconnect می‌کند...
10:02    ✅ اتصال برقرار شد                 🟢
10:02    📨 دریافت آخرین count: 5           
10:02    ✅ نمایش count: 5                   🟢
```

**EventSource خودش reconnect می‌کند - نیازی به کد اضافی نیست!** 🔄

---

## انواع Event‌ها

### 1. Heartbeat Event
```json
{
  "type": "heartbeat",
  "timestamp": 1698765432
}
```

**هدف:** نشان دادن اینکه اتصال زنده است  
**عملیات:** هیچ - فقط log می‌کنیم

---

### 2. Cart Update Event
```json
{
  "type": "cart_update",
  "itemCount": 3,
  "timestamp": 1698765432
}
```

**هدف:** تغییر تعداد سبد  
**عملیات:** `setCount(3)`

---

### 3. Connection Established Event
```json
{
  "type": "connection_established",
  "itemCount": 2,
  "timestamp": 1698765432
}
```

**هدف:** اولین بار که وصل می‌شویم  
**عملیات:** `setCount(2)` - set کردن تعداد اولیه

---

## مزایای SSE

### ✅ مزایا:

1. **Real-time**: به‌روزرسانی فوری، بدون تاخیر
2. **کارآمد**: یک اتصال، نه هزاران request
3. **ساده**: API داخلی مرورگر، نیازی به کتابخانه خارجی نیست
4. **قابل اعتماد**: Reconnection خودکار
5. **سبک**: کمتر از سایر روش‌ها منابع مصرف می‌کند

### ⚠️ محدودیت‌ها:

1. **یک‌طرفه**: فقط سرور می‌تواند بفرستد (کافی است برای ما!)
2. **HTTP/1.1**: محدودیت تعداد اتصال‌های همزمان (معمولاً مشکلی نیست)
3. **پشتیبانی مرورگر**: همه مرورگرهای مدرن ✅ (IE 11 ❌)

---

## جمع‌بندی

### قبل از SSE (Polling):
```
هر 5 ثانیه:
  - یک request بزن
  - منتظر response بمان
  - اگر تغییری بود، نمایش بده
  
مشکلات:
  ❌ تاخیر 5 ثانیه‌ای
  ❌ صدها request بیهوده
  ❌ هدر رفت منابع سرور
```

### بعد از SSE:
```
یکبار:
  - اتصال برقرار کن
  - منتظر بمان
  - هر تغییری فوراً می‌رسد
  
مزایا:
  ✅ Real-time (کمتر از 100ms)
  ✅ فقط یک اتصال
  ✅ کارآمد و سبک
```

---

## خلاصه در یک نگاه

```javascript
// همین! فقط همین!
const { count } = useCartCount();
```

**تمام!** 🎉

- بدون Context ❌
- بدون Provider ❌
- بدون Service ❌
- بدون Config ❌
- فقط یک Hook ساده ✅

**از 1500 خط کد به 70 خط رسیدیم!** 🚀

---

## سوالات متداول

### ❓ اگر سرور restart شود چه؟
**جواب:** EventSource خودکار reconnect می‌کند. نگران نباش!

### ❓ اگر اینترنت کاربر ضعیف باشد چه؟
**جواب:** اتصال ممکن است قطع و وصل شود، اما EventSource خودش مدیریت می‌کند.

### ❓ چند نفر می‌توانند همزمان متصل شوند؟
**جواب:** هزاران نفر! سرور باید قدرتمند باشد، اما SSE خیلی کارآمد است.

### ❓ امنیت چطور؟
**جواب:** مثل هر request HTTP دیگر. می‌توانیم HTTPS و Authentication اضافه کنیم.

### ❓ چرا بهتر از WebSocket است؟
**جواب:** برای use case ما (فقط نمایش count) WebSocket over-engineering است. SSE ساده‌تر و کافیست.

---

**موفق باشی! 🎉**

