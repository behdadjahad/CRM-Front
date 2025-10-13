# SSE Notification Implementation

## Overview

This implementation provides real-time notification count updates using Server-Sent Events (SSE) with polling fallback, following the same pattern as the existing cart count implementation.

## Architecture

### 1. **SSE Hook (`useNotifications`)**
- Primary method for real-time updates
- Falls back to polling if SSE connection fails
- Updates Redux store automatically
- Provides connection status and error handling

### 2. **Polling Fallback (`useNotificationPolling`)**
- Backup mechanism when SSE is unavailable
- Configurable polling interval (default: 15 seconds)
- Same API as SSE hook for seamless fallback

### 3. **Redux Integration**
- Updates notification count in Redux store
- Syncs with existing notification slice
- Maintains consistency across components

## Files Created/Modified

### New Files:
- `hooks/useNotificationCount.ts` - Basic SSE hook
- `hooks/useNotificationPolling.ts` - Polling fallback hook
- `hooks/useNotifications.ts` - Combined SSE + polling hook
- `components/notification/NotificationBadge.tsx` - Standalone notification badge
- `components/shared/notification-header.tsx` - Header integration example

### Modified Files:
- `components/shared/notification.tsx` - Updated to use SSE
- `store/notification-slice.ts` - Added count update actions

## Usage Examples

### 1. **Basic Usage in Header (Already Integrated)**

The existing notification component in the header now automatically uses SSE:

```tsx
// components/shared/header.tsx
<Notification unread={true} className="mr-auto lg:mr-0 lg:ml-auto" />
```

### 2. **Standalone Notification Badge**

```tsx
import NotificationBadge from '@/components/notification/NotificationBadge';

function MyComponent() {
  return (
    <NotificationBadge 
      onClick={() => router.push('/notifications')}
      showCount={true}
    />
  );
}
```

### 3. **Direct Hook Usage**

```tsx
import { useNotifications } from '@/hooks/useNotifications';

function MyComponent() {
  const { count, isConnected, isPolling } = useNotifications();
  
  return (
    <div>
      <span>Notifications: {count}</span>
      <span>Status: {isConnected ? 'SSE' : isPolling ? 'Polling' : 'Disconnected'}</span>
    </div>
  );
}
```

### 4. **With Custom Configuration**

```tsx
const { count, isConnected } = useNotifications({
  fallbackToPolling: true,
  pollingInterval: 10000 // 10 seconds
});
```

## Configuration

### SSE Endpoint
```typescript
const SSE_URL = 'http://185.126.203.246:3001/api/v1/notifications/updates';
```

### Expected SSE Data Format
```json
{
  "type": "heartbeat", // or actual data
  "notificationCount": 5, // direct count
  "notifications": [ // or array of notifications
    {
      "id": 1,
      "isRead": false,
      "title": "New notification",
      "body": "Notification content"
    }
  ]
}
```

### Polling Endpoint
```typescript
// GET /notification?chadcoCustomerId={customerId}
// Returns: { data: Notification[] }
```

## Features

### ✅ **Real-time Updates**
- Instant notification count updates via SSE
- Automatic fallback to polling if SSE fails
- Heartbeat detection for connection health

### ✅ **Redux Integration**
- Automatic store updates
- Consistent state across components
- Syncs with existing notification slice

### ✅ **Error Handling**
- Connection error detection
- Automatic reconnection attempts
- Graceful degradation to polling

### ✅ **Performance Optimized**
- Only polls when SSE is unavailable
- Configurable polling intervals
- Efficient state updates

### ✅ **Developer Experience**
- Comprehensive logging (development mode)
- Connection status indicators
- Easy configuration options

## Connection Status Indicators

### Development Mode
- Green dot: SSE Connected
- Yellow dot: Polling
- Red dot: Disconnected

### Production Mode
- No visible indicators (clean UI)

## Error Handling

### SSE Connection Errors
1. Logs error to console
2. Sets connection status to false
3. Triggers polling fallback
4. Attempts reconnection on next render

### Polling Errors
1. Logs error to console
2. Continues polling with same interval
3. Does not affect SSE connection attempts

## Testing

### Manual Testing
1. Open browser dev tools
2. Check console for SSE connection logs
3. Verify notification count updates
4. Test fallback by disabling SSE endpoint

### Connection Status
```typescript
const { count, isConnected, isPolling, sseError, pollingError } = useNotifications();
console.log('SSE Connected:', isConnected);
console.log('Polling Active:', isPolling);
console.log('Count:', count);
```

## Integration with Existing System

### Notification Slice
The implementation automatically updates the existing notification Redux slice:

```typescript
// Updates unread count in tabList
dispatch(updateNotificationCount(count));
```

### Header Integration
The existing notification component now shows:
- Real-time count badge
- Connection status (development only)
- Automatic fallback to polling

### Backward Compatibility
- Existing `unread` prop still works
- Falls back to prop if SSE count is 0
- No breaking changes to existing components

## Monitoring

### Console Logs (Development)
```
🔔 SSE: Starting notification SSE connection for customer: 123
🔔 SSE: Notification connection opened
🔔 SSE: Notification update received: {notificationCount: 5}
🔔 SSE: Setting notification count to: 5
```

### Production
- Minimal logging
- Error reporting only
- Clean user experience

## Future Enhancements

### Planned Features
- [ ] WebSocket support as alternative to SSE
- [ ] Notification content streaming
- [ ] Push notification integration
- [ ] Offline notification queue
- [ ] Notification preferences

### Configuration Options
- [ ] Custom SSE endpoint per environment
- [ ] Retry logic configuration
- [ ] Polling interval per user preference
- [ ] Notification type filtering

## Troubleshooting

### Common Issues

1. **SSE Connection Fails**
   - Check if customer ID is available
   - Verify SSE endpoint is accessible
   - Check browser console for errors
   - System automatically falls back to polling

2. **Count Not Updating**
   - Verify SSE data format
   - Check Redux store updates
   - Test with polling fallback
   - Check network connectivity

3. **Multiple Connections**
   - Each component using hook creates separate connection
   - Consider using context provider for single connection
   - Monitor connection count in dev tools

### Debug Mode
Enable debug logging by setting:
```typescript
// In useNotifications hook
const DEBUG = process.env.NODE_ENV === 'development';
```

This implementation provides a robust, real-time notification system that seamlessly integrates with your existing architecture while providing excellent fallback mechanisms and developer experience.
