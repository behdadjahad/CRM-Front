# 🔧 SSE Backend Configuration Guide

## به توسعه‌دهنده بک‌اند عزیز

این راهنمای کامل برای پیکربندی SSE (Server-Sent Events) در سرور شماست.

---

## ❌ مشکل فعلی

خطای شبکه (Network Error) هنگام اتصال به SSE دریافت می‌شود. این به دلیل تنظیمات نادرست هدرهای HTTP است.

---

## ✅ راه‌حل: تنظیمات صحیح هدرها

### **1. هدرهای الزامی SSE**

سرور باید این هدرها را برای endpoint زیر ارسال کند:

**Endpoint:** `GET /api/v1/cart/updates?chadcoCustomerId={id}`

```javascript
// هدرهای الزامی
{
  'Content-Type': 'text/event-stream',           // مهم‌ترین هدر
  'Cache-Control': 'no-cache',                   // جلوگیری از کش شدن
  'Connection': 'keep-alive',                     // نگه داشتن اتصال
  'X-Accel-Buffering': 'no',                     // برای Nginx
  'Access-Control-Allow-Origin': '*',            // یا دامنه مشخص فرانت
  'Access-Control-Allow-Credentials': 'true',    // اگر احراز هویت دارید
  'Access-Control-Allow-Methods': 'GET, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type'
}
```

---

### **2. نمونه کد برای Node.js/Express**

```javascript
// مسیر SSE
app.get('/api/v1/cart/updates', (req, res) => {
  const { chadcoCustomerId } = req.query;

  // تنظیم هدرهای SSE
  res.writeHead(200, {
    'Content-Type': 'text/event-stream',
    'Cache-Control': 'no-cache',
    'Connection': 'keep-alive',
    'X-Accel-Buffering': 'no',
    'Access-Control-Allow-Origin': '*', // یا دامنه خاص: 'https://your-frontend.com'
    'Access-Control-Allow-Credentials': 'true'
  });

  // ارسال پیام اولیه
  res.write(`data: ${JSON.stringify({ 
    type: 'connection_status', 
    message: 'Connected' 
  })}\n\n`);

  // ارسال heartbeat هر 30 ثانیه
  const heartbeatInterval = setInterval(() => {
    res.write(`data: ${JSON.stringify({ 
      type: 'heartbeat' 
    })}\n\n`);
  }, 30000);

  // ارسال آپدیت سبد خرید
  const sendCartUpdate = (itemCount) => {
    res.write(`data: ${JSON.stringify({ 
      type: 'cart_update',
      itemCount: itemCount
    })}\n\n`);
  };

  // وقتی کاربر قطع می‌شود
  req.on('close', () => {
    clearInterval(heartbeatInterval);
    res.end();
  });

  // مثال: ارسال تعداد آیتم‌های فعلی سبد
  getCartItemCount(chadcoCustomerId).then(count => {
    sendCartUpdate(count);
  });
});
```

---

### **3. نمونه کد برای NestJS**

```typescript
import { Controller, Get, Query, Sse } from '@nestjs/common';
import { Observable, interval } from 'rxjs';
import { map } from 'rxjs/operators';

@Controller('cart')
export class CartController {
  @Sse('updates')
  streamCartUpdates(@Query('chadcoCustomerId') customerId: string): Observable<MessageEvent> {
    return interval(30000).pipe(
      map(() => ({
        type: 'heartbeat',
        data: { type: 'heartbeat' }
      }))
    );
  }
}

// در main.ts یا app configuration
app.enableCors({
  origin: '*', // یا دامنه خاص
  credentials: true,
  allowedHeaders: ['Content-Type'],
  methods: ['GET', 'OPTIONS']
});
```

---

### **4. تنظیمات Nginx (اگر استفاده می‌کنید)**

```nginx
location /api/v1/cart/updates {
    proxy_pass http://backend_server;
    
    # تنظیمات SSE
    proxy_set_header Connection '';
    proxy_http_version 1.1;
    chunked_transfer_encoding off;
    proxy_buffering off;
    proxy_cache off;
    
    # هدرهای CORS
    add_header 'Access-Control-Allow-Origin' '*' always;
    add_header 'Access-Control-Allow-Methods' 'GET, OPTIONS' always;
    add_header 'Access-Control-Allow-Headers' 'Content-Type' always;
    add_header 'Access-Control-Allow-Credentials' 'true' always;
    
    # تایم‌اوت طولانی برای SSE
    proxy_read_timeout 3600s;
    proxy_send_timeout 3600s;
}
```

---

### **5. تنظیمات Apache (اگر استفاده می‌کنید)**

```apache
<Location /api/v1/cart/updates>
    # فعال کردن SSE
    SetEnv proxy-nokeepalive 1
    SetEnv proxy-sendcl 0
    
    ProxyPass http://backend_server/api/v1/cart/updates
    ProxyPassReverse http://backend_server/api/v1/cart/updates
    
    # CORS Headers
    Header always set Access-Control-Allow-Origin "*"
    Header always set Access-Control-Allow-Methods "GET, OPTIONS"
    Header always set Access-Control-Allow-Headers "Content-Type"
    Header always set Access-Control-Allow-Credentials "true"
    
    # Timeout settings
    ProxyTimeout 3600
</Location>
```

---

## 🔒 مشکلات رایج در سرورهای ایرانی

### **مشکل 1: فایروال**
```bash
# بررسی کنید که پورت سرور باز است
# معمولاً پورت 3001 یا 8080

# در سرور Ubuntu/Debian
sudo ufw allow 3001/tcp

# در سرور CentOS/RedHat
sudo firewall-cmd --zone=public --add-port=3001/tcp --permanent
sudo firewall-cmd --reload
```

### **مشکل 2: پروکسی/CDN**
اگر از CloudFlare یا CDN دیگری استفاده می‌کنید:
- SSE را از CDN exclude کنید
- مستقیماً به IP سرور اصلی متصل شوید

### **مشکل 3: تایم‌اوت کوتاه**
```javascript
// در کد Node.js خود timeout را افزایش دهید
server.timeout = 0; // بدون timeout
server.keepAliveTimeout = 0;
server.headersTimeout = 0;
```

---

## 🧪 تست کردن SSE

### **روش 1: استفاده از cURL**
```bash
curl -N -H "Accept: text/event-stream" \
  "http://your-server.com/api/v1/cart/updates?chadcoCustomerId=1"
```

باید خروجی شبیه این ببینید:
```
data: {"type":"heartbeat"}

data: {"type":"cart_update","itemCount":3}
```

### **روش 2: استفاده از Browser Console**
```javascript
const eventSource = new EventSource('http://your-server.com/api/v1/cart/updates?chadcoCustomerId=1');

eventSource.onopen = () => console.log('✅ Connected');
eventSource.onmessage = (e) => console.log('📨 Message:', e.data);
eventSource.onerror = (e) => console.error('❌ Error:', e);
```

---

## 📋 چک‌لیست نهایی

- [ ] هدر `Content-Type: text/event-stream` تنظیم شده
- [ ] هدر `Cache-Control: no-cache` تنظیم شده
- [ ] هدر `Connection: keep-alive` تنظیم شده
- [ ] هدرهای CORS صحیح تنظیم شده
- [ ] Nginx/Apache (اگر دارید) برای SSE پیکربندی شده
- [ ] فایروال سرور پورت مورد نظر را باز کرده
- [ ] Timeout های سرور به اندازه کافی بالا هستند
- [ ] با cURL یا Browser تست شده

---

## 🆘 در صورت همچنان داشتن مشکل

1. **لاگ سرور را بررسی کنید**
2. **Network Tab مرورگر را بررسی کنید** (F12 > Network)
3. **از VPN استفاده کنید** (ممکن است فیلترینگ باشد)
4. **از شبکه دیگری تست کنید** (موبایل هات‌اسپات)

---

## 📞 اطلاعات مورد نیاز برای دیباگ

اگر همچنان کار نمی‌کند، این اطلاعات را بفرستید:

```
1. Framework بک‌اند: (Node.js, NestJS, Django, etc.)
2. Web Server: (Nginx, Apache, Direct, etc.)
3. کد endpoint مربوط به SSE
4. خروجی cURL test
5. هدرهای Response از Network Tab
```

---

## ✅ موفق باشید! 🚀

