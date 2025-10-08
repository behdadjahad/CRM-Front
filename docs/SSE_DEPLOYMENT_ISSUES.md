# 🚨 SSE Deployment Issues - Works Locally, Fails in Production

## مشکل: SSE در سیستم بک‌اند کار می‌کند، اما روی سرور خطا می‌دهد

---

## ✅ تشخیص دقیق مشکل

چون SSE در محیط توسعه کار می‌کند اما در پروداکشن خیر، مشکل **فقط** یکی از موارد زیر است:

---

## 🔴 1. مشکل Nginx/Apache (رایج‌ترین - 80% موارد)

### **مشکل:**
سرورهای Nginx/Apache به طور پیش‌فرض SSE را **بافر** می‌کنند و اتصال را قطع می‌کنند.

### **علائم:**
- اتصال بلافاصله قطع می‌شود
- خطای "net::ERR_INCOMPLETE_CHUNKED_ENCODING"
- در Network Tab: Status = (failed) یا canceled

### **✅ راه‌حل برای Nginx:**

```nginx
location /api/v1/cart/updates {
    proxy_pass http://localhost:3001;
    
    # 🔥 مهم‌ترین تنظیمات برای SSE
    proxy_set_header Connection '';
    proxy_http_version 1.1;
    chunked_transfer_encoding off;
    
    # ❌ غیرفعال کردن بافرینگ (خیلی مهم!)
    proxy_buffering off;
    proxy_cache off;
    proxy_read_timeout 86400s;  # 24 ساعت
    proxy_send_timeout 86400s;
    
    # برای Nginx + FastCGI/PHP
    fastcgi_buffering off;
    
    # CORS headers
    add_header 'Access-Control-Allow-Origin' '*' always;
    add_header 'Access-Control-Allow-Methods' 'GET, OPTIONS' always;
    add_header 'Access-Control-Allow-Credentials' 'true' always;
}
```

### **تست کنید:**
```bash
# بعد از تغییرات Nginx
sudo nginx -t                    # تست کانفیگ
sudo systemctl reload nginx      # ریلود Nginx
```

---

### **✅ راه‌حل برای Apache:**

```apache
<Location /api/v1/cart/updates>
    ProxyPass http://localhost:3001/api/v1/cart/updates
    ProxyPassReverse http://localhost:3001/api/v1/cart/updates
    
    # 🔥 غیرفعال کردن بافرینگ
    SetEnv proxy-nokeepalive 1
    SetEnv proxy-sendcl 0
    SetEnv proxy-interim-response RFC
    
    # Timeout settings
    ProxyTimeout 86400
    
    # CORS
    Header always set Access-Control-Allow-Origin "*"
    Header always set Access-Control-Allow-Methods "GET, OPTIONS"
</Location>

# فعال کردن ماژول‌های لازم
# a2enmod proxy
# a2enmod proxy_http
# a2enmod headers
```

---

## 🔴 2. مشکل CloudFlare / CDN (رایج در ایران - 15% موارد)

### **مشکل:**
CloudFlare و CDN های دیگر SSE را ساپورت نمی‌کنند.

### **علائم:**
- خطای 524 (Timeout)
- خطای 522 (Connection timed out)
- اتصال بعد از 100 ثانیه قطع می‌شود

### **✅ راه‌حل:**

#### **گزینه 1: Bypass کردن SSE از CloudFlare**
```nginx
# یک سابدامین مستقیم بدون CloudFlare بسازید
# مثلاً: sse.yourdomain.com (Cloud خاموش - DNS Only)

location /api/v1/cart/updates {
    # استفاده مستقیم از IP سرور
    proxy_pass http://your-server-ip:3001;
}
```

#### **گزینه 2: تنظیمات CloudFlare**
1. وارد CloudFlare Dashboard شوید
2. **Speed** > **Optimization**
3. **Rocket Loader** را خاموش کنید
4. **Auto Minify** را برای endpoint خاص غیرفعال کنید
5. **Page Rules** بسازید:
   ```
   URL: *yourdomain.com/api/v1/cart/updates*
   Settings:
   - Cache Level: Bypass
   - Rocket Loader: Off
   ```

#### **گزینه 3: استفاده از subdomain مستقیم**
```javascript
// در فرانت، از subdomain مستقیم استفاده کنید
const SSE_CONFIG = {
  API_BASE_URL: 'http://direct-ip-or-subdomain:3001/api/v1',
  // به جای:
  // API_BASE_URL: 'https://yourdomain.com/api/v1'
};
```

---

## 🔴 3. مشکل Firewall سرور (5% موارد)

### **مشکل:**
فایروال سرور اتصالات طولانی‌مدت را قطع می‌کند.

### **علائم:**
- اتصال بعد از 30-60 ثانیه قطع می‌شود
- خطای "Connection reset"

### **✅ راه‌حل:**

#### **UFW (Ubuntu/Debian):**
```bash
# اجازه دادن به پورت
sudo ufw allow 3001/tcp

# بررسی status
sudo ufw status
```

#### **Firewalld (CentOS/RHEL):**
```bash
# اجازه دادن به پورت
sudo firewall-cmd --permanent --add-port=3001/tcp
sudo firewall-cmd --reload

# بررسی
sudo firewall-cmd --list-ports
```

#### **iptables:**
```bash
# اجازه دادن به اتصالات SSE
sudo iptables -A INPUT -p tcp --dport 3001 -m conntrack --ctstate NEW,ESTABLISHED -j ACCEPT
sudo iptables -A OUTPUT -p tcp --sport 3001 -m conntrack --ctstate ESTABLISHED -j ACCEPT

# ذخیره
sudo iptables-save > /etc/iptables/rules.v4
```

---

## 🔴 4. مشکل SSL/HTTPS (مخلوط HTTP/HTTPS)

### **مشکل:**
فرانت HTTPS است اما backend HTTP - مرورگر Mixed Content را بلاک می‌کند.

### **علائم:**
- خطای "Mixed Content" در کنسول
- خطای CORS
- اتصال اصلاً برقرار نمی‌شود

### **✅ راه‌حل:**

#### **گزینه 1: HTTPS برای Backend**
```bash
# نصب Certbot برای SSL رایگان
sudo apt install certbot python3-certbot-nginx
sudo certbot --nginx -d yourdomain.com

# Nginx با SSL
server {
    listen 443 ssl http2;
    server_name yourdomain.com;
    
    ssl_certificate /etc/letsencrypt/live/yourdomain.com/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/yourdomain.com/privkey.pem;
    
    location /api/v1/cart/updates {
        # تنظیمات SSE
    }
}
```

#### **گزینه 2: Frontend Proxy**
```javascript
// در Next.js از API Route استفاده کنید
// app/api/sse-proxy/route.ts
export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const customerId = searchParams.get('chadcoCustomerId');
  
  // Proxy به backend (از سمت سرور، Mixed Content ندارد)
  const backendUrl = `http://localhost:3001/api/v1/cart/updates?chadcoCustomerId=${customerId}`;
  
  // Forward SSE
  const response = await fetch(backendUrl);
  return new Response(response.body, {
    headers: {
      'Content-Type': 'text/event-stream',
      'Cache-Control': 'no-cache',
      'Connection': 'keep-alive',
    },
  });
}
```

---

## 🔴 5. مشکل Network Timeout در کشور ایران

### **مشکل:**
اپراتورها/ISP ها اتصالات طولانی را قطع می‌کنند.

### **علائم:**
- اتصال بعد از 2-5 دقیقه قطع می‌شود
- با VPN کار می‌کند

### **✅ راه‌حل:**

#### **Heartbeat بیشتر ارسال کنید:**
```javascript
// در backend - heartbeat هر 10 ثانیه به جای 30 ثانیه
const heartbeatInterval = setInterval(() => {
  res.write(`data: ${JSON.stringify({ type: 'heartbeat' })}\n\n`);
}, 10000); // 10 ثانیه
```

#### **TCP Keep-Alive:**
```javascript
// در Node.js backend
const server = app.listen(3001);
server.keepAliveTimeout = 120000; // 120 ثانیه
server.headersTimeout = 125000;

// در Express middleware
app.use((req, res, next) => {
  req.socket.setKeepAlive(true, 10000); // Keep-alive هر 10 ثانیه
  next();
});
```

---

## 🔴 6. مشکل CORS در Production

### **مشکل:**
CORS در development کار می‌کند اما در production خیر.

### **علائم:**
- خطای CORS در console
- "Access-Control-Allow-Origin" missing

### **✅ راه‌حل:**

```javascript
// در Backend - دامنه صحیح را اضافه کنید
app.use((req, res, next) => {
  const allowedOrigins = [
    'https://yourdomain.com',
    'https://www.yourdomain.com',
    'http://localhost:3000' // فقط برای development
  ];
  
  const origin = req.headers.origin;
  if (allowedOrigins.includes(origin)) {
    res.setHeader('Access-Control-Allow-Origin', origin);
  }
  
  res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  res.setHeader('Access-Control-Allow-Credentials', 'true');
  next();
});
```

---

## 🧪 تست دقیق مشکل

### **1. تست مستقیم از سرور:**
```bash
# SSH به سرور بزنید و تست کنید
ssh user@your-server

# تست از داخل سرور
curl -N -H "Accept: text/event-stream" \
  "http://localhost:3001/api/v1/cart/updates?chadcoCustomerId=1"

# اگر جواب داد = Backend سالم است ✅
# اگر جواب نداد = مشکل Backend است ❌
```

### **2. تست از بیرون سرور:**
```bash
# از کامپیوتر خودتان
curl -N -H "Accept: text/event-stream" \
  "http://your-server-ip:3001/api/v1/cart/updates?chadcoCustomerId=1"

# اگر جواب نداد = مشکل Firewall/Network است
```

### **3. تست با مرورگر:**
```javascript
// در Console مرورگر
fetch('https://yourdomain.com/api/v1/cart/updates?chadcoCustomerId=1', {
  method: 'GET',
  headers: { 'Accept': 'text/event-stream' }
})
.then(r => {
  console.log('Status:', r.status);
  console.log('Headers:', [...r.headers.entries()]);
})
.catch(e => console.error('Error:', e));
```

### **4. بررسی لاگ‌های سرور:**
```bash
# Nginx error log
sudo tail -f /var/log/nginx/error.log

# Application log (Node.js)
pm2 logs your-app-name

# System log
sudo journalctl -u nginx -f
```

---

## 📋 چک‌لیست رفع مشکل (به ترتیب اولویت)

### **مرحله 1: Nginx/Apache** ⭐⭐⭐⭐⭐ (بیشترین احتمال)
- [ ] `proxy_buffering off;` تنظیم شده؟
- [ ] `proxy_read_timeout` زیاد است؟ (حداقل 3600s)
- [ ] بعد از تغییرات Nginx reload شد؟

### **مرحله 2: CloudFlare/CDN** ⭐⭐⭐⭐
- [ ] آیا CloudFlare/CDN استفاده می‌شود?
- [ ] SSE endpoint از CDN bypass شده؟
- [ ] یک subdomain مستقیم ساختید؟

### **مرحله 3: SSL/HTTPS** ⭐⭐⭐
- [ ] آیا Mixed Content دارید؟
- [ ] Backend هم HTTPS است؟
- [ ] Certificate معتبر است؟

### **مرحله 4: Firewall** ⭐⭐
- [ ] پورت باز است؟
- [ ] اتصالات طولانی مجاز هستند؟

### **مرحله 5: CORS** ⭐⭐
- [ ] دامنه production در CORS است؟
- [ ] Preflight request جواب می‌دهد؟

---

## 🆘 راه‌حل سریع (اگر هیچ کدام کار نکرد)

### **گزینه Fallback: Polling به جای SSE**

```typescript
// در frontend - fallback به polling
const useCartCountWithFallback = () => {
  const [useSSE, setUseSSE] = useState(true);
  
  // سعی کنید SSE وصل کنید
  useEffect(() => {
    const timeout = setTimeout(() => {
      // اگر بعد از 5 ثانیه وصل نشد
      if (!isConnected) {
        console.warn('SSE failed, falling back to polling');
        setUseSSE(false);
      }
    }, 5000);
    
    return () => clearTimeout(timeout);
  }, [isConnected]);
  
  // اگر SSE کار نکرد، از polling استفاده کنید
  if (!useSSE) {
    return useCartPolling(); // Polling هر 10 ثانیه
  }
  
  return useCartSSE();
};
```

---

## 💡 توصیه نهایی

**رایج‌ترین مشکل:** Nginx buffering  
**سریع‌ترین راه‌حل:** افزودن `proxy_buffering off;` به کانفیگ Nginx

```bash
# فایل کانفیگ Nginx را ویرایش کنید
sudo nano /etc/nginx/sites-available/your-app

# خط زیر را اضافه کنید
proxy_buffering off;

# Nginx را reload کنید
sudo nginx -t && sudo systemctl reload nginx
```

---

## 📞 اطلاعات مورد نیاز برای Debug

اگر هنوز کار نکرد، این اطلاعات را جمع کنید:

```
1. خروجی: curl از داخل سرور
2. خروجی: curl از بیرون سرور
3. Network Tab screenshot (F12)
4. آیا CDN/CloudFlare دارید؟
5. آیا Nginx/Apache دارید؟
6. لاگ error از Nginx/Apache
7. SSL دارید یا HTTP؟
```

