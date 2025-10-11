# Simple SSE Cart Count

## 🎯 Simplified Architecture

**Before**: Complex multi-layer architecture with Context, hooks, services, and Redux sync  
**After**: Direct EventSource connection - simple and efficient

## 📁 File Structure

```
hooks/
  └── useCartCount.ts          # Single hook - creates EventSource directly

components/shared/
  └── cart-icon.tsx            # Uses useCartCount hook directly
```

## 🔧 How It Works

### 1. Hook (`hooks/useCartCount.ts`)
```javascript
export function useCartCount() {
  const [count, setCount] = useState(0);
  const customerId = useSelector((state: RootState) => state?.login?.chadcoCustomerId);

  useEffect(() => {
    // Create EventSource directly
    const eventSource = new EventSource(`${SSE_URL}?chadcoCustomerId=${customerId}`);
    
    eventSource.onmessage = (event) => {
      const data = JSON.parse(event.data);
      if (data.itemCount !== undefined) {
        setCount(data.itemCount); // Update count directly
      }
    };

    return () => eventSource.close();
  }, [customerId]);

  return { count, isConnected };
}
```

### 2. Component (`components/shared/cart-icon.tsx`)
```javascript
export default function CartIcon() {
  const { count, isConnected } = useCartCount(); // Direct hook usage
  
  return (
    <Button>
      <ShoppingCart />
      {count > 0 && <span>{count}</span>}
    </Button>
  );
}
```

## ✅ Benefits

1. **Simple**: No complex layers, just EventSource
2. **Direct**: Cart count comes straight from SSE
3. **Fast**: No intermediate state management
4. **Clean**: ~70 lines instead of ~1000+ lines
5. **Maintainable**: Easy to understand and modify

## 🔄 Data Flow

```
Backend SSE
    ↓
EventSource (in useCartCount hook)
    ↓
setCount(data.itemCount)
    ↓
CartIcon displays count
```

That's it! No Context, no complex services, no Redux sync.

## 🎨 Features

- ✅ Real-time cart count updates via SSE
- ✅ Connection status indicator
- ✅ Automatic reconnection
- ✅ Heartbeat handling
- ✅ Development logging
- ✅ Error handling

## 🚀 Usage

Just use the hook in any component:

```javascript
import { useCartCount } from '@/hooks/useCartCount';

function MyComponent() {
  const { count, isConnected } = useCartCount();
  
  return <div>Cart has {count} items</div>;
}
```

## 📝 Event Format

The hook expects SSE events in this format:

```json
{
  "itemCount": 3
}
```

Or:

```json
{
  "items": [{...}, {...}, {...}]
}
```

The hook will automatically calculate `itemCount` from the `items` array length.

## 🔧 Configuration

To change the SSE URL, edit the constant in `hooks/useCartCount.ts`:

```javascript
const SSE_URL = 'http://185.126.203.246:3001/api/v1/cart/updates';
```

## 🧹 What Was Removed

- ❌ `contexts/CartSSEContext.tsx` - No longer needed
- ❌ `hooks/useCartSSE.ts` - Replaced by simple useCartCount
- ❌ `services/baseSSE.ts` - Direct EventSource is simpler
- ❌ `services/cartSSE.ts` - Not needed
- ❌ `config/sse.ts` - Configuration inline
- ❌ `types/sse.ts` - No complex types needed
- ❌ `components/debug/CartDebugger.tsx` - Simple console.log instead

**Result**: From ~1500 lines of complex code to ~70 lines of simple code! 🎉

