# 🔄 SSE vs Polling Mode Switch Guide

## 📋 Current Status

**Currently Active:** Polling Mode (CartPollingProvider)  
**Reason:** Backend SSE endpoint not yet implemented (404 error)

## 🔄 How to Switch Between Modes

### **Switch to SSE Mode (when backend is ready):**

1. **Update Layout** (`app/(dashboard-layout)/layout.tsx`):
```tsx
// Comment out polling provider
{/* <CartPollingProvider>
  <Layout>{children}</Layout>
</CartPollingProvider> */}

// Uncomment SSE provider
<CartSSEProvider>
  <Layout>{children}</Layout>
</CartSSEProvider>
```

2. **Update CartIcon** (`components/shared/cart-icon.tsx`):
```tsx
// Change import
import { useCartCount } from "@/contexts/CartSSEContext";

// Restore full status handling
const getConnectionIndicatorColor = () => {
  switch (connectionStatus) {
    case 'connected':
      return 'bg-green-500';
    case 'connecting':
      return 'bg-yellow-500';
    case 'disconnected':
    case 'error':
    default:
      return 'bg-red-500';
  }
};
```

### **Switch Back to Polling Mode (if SSE fails):**

1. **Update Layout** (`app/(dashboard-layout)/layout.tsx`):
```tsx
// Comment out SSE provider
{/* <CartSSEProvider>
  <Layout>{children}</Layout>
</CartSSEProvider> */}

// Uncomment polling provider
<CartPollingProvider>
  <Layout>{children}</Layout>
</CartPollingProvider>
```

2. **Update CartIcon** (`components/shared/cart-icon.tsx`):
```tsx
// Change import
import { useCartCount } from "@/contexts/CartPollingContext";

// Use simplified status handling
const getConnectionIndicatorColor = () => {
  switch (connectionStatus) {
    case 'connected':
      return 'bg-green-500';
    case 'disconnected':
    default:
      return 'bg-red-500';
  }
};
```

## 🧪 Testing

### **Polling Mode:**
- Cart count updates every 5-10 seconds
- No SSE connection errors
- Green dot when connected, red when offline

### **SSE Mode:**
- Real-time cart count updates
- Connection status indicators (green/yellow/red)
- Auto-reconnection on network issues
- Fallback to polling if SSE fails completely

## 🎯 Backend Requirements for SSE

Your backend needs to implement:
```
GET /v1/cart/updates?chadcoCustomerId={id}
Content-Type: text/event-stream
```

**Test with curl:**
```bash
curl -N -H "Accept: text/event-stream" \
  "http://185.126.203.246:3001/v1/cart/updates?chadcoCustomerId=1"
```

**Expected response:**
```
data: {"type":"connection_established","itemCount":0,"message":"Connected"}

data: {"type":"heartbeat"}
```

## ✅ Current Implementation

- ✅ Polling mode active and working
- ✅ Cart count updates every 5 seconds
- ✅ No import errors
- ✅ All cart operations functional
- ✅ Ready to switch to SSE when backend is ready
