/**
 * Combined Notifications Hook - Uses SSE with polling fallback
 * Similar to cart implementation pattern
 */

import { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '@/store';
import { useNotificationPolling } from './useNotificationPolling';
import { updateNotificationCount } from '@/store/notification-slice';

const SSE_URL = 'http://185.126.203.246:3001/api/v1/notifications/updates';

interface UseNotificationsOptions {
    fallbackToPolling?: boolean;
    pollingInterval?: number;
}

export function useNotifications({
    fallbackToPolling = true,
    pollingInterval = 15000
}: UseNotificationsOptions = {}) {
    const dispatch = useDispatch();
    const [count, setCount] = useState(0);
    const [isConnected, setIsConnected] = useState(false);
    const [sseError, setSseError] = useState<string | null>(null);
    const customerId = useSelector((state: RootState) => state?.login?.chadcoCustomerId);

    // Polling fallback
    const {
        notificationCount: pollingCount,
        isPolling,
        lastError: pollingError,
        refetch: refetchPolling
    } = useNotificationPolling({
        enabled: fallbackToPolling && !isConnected, // Only poll if SSE is not connected
        interval: pollingInterval,
        onNotificationCountUpdate: (count) => {
            setCount(count);
            dispatch(updateNotificationCount(count));
        },
        onError: (error) => {
            console.error('🔔 Polling: Notification polling error:', error);
        }
    });

    useEffect(() => {
        if (!customerId) {
            setCount(0);
            setIsConnected(false);
            setSseError(null);
            return;
        }

        console.log('🔔 SSE: Starting notification SSE connection for customer:', customerId);
        const url = `${SSE_URL}?chadcoCustomerId=${customerId}`;
        const eventSource = new EventSource(url);

        eventSource.onopen = () => {
            console.log('🔔 SSE: Notification connection opened');
            setIsConnected(true);
            setSseError(null);
        };

        eventSource.onmessage = (event) => {
            try {
                const data = JSON.parse(event.data);
                console.log('🔔 SSE: Notification update received:', data);

                // Handle heartbeat
                if (data.type === 'heartbeat') {
                    console.log('🔔 SSE: Notification heartbeat received');
                    return;
                }

                // Handle notification count update
                if (data.notificationCount !== undefined) {
                    console.log('🔔 SSE: Setting notification count to:', data.notificationCount);
                    setCount(data.notificationCount);
                    dispatch(updateNotificationCount(data.notificationCount));
                } else if (data.notifications && Array.isArray(data.notifications)) {
                    // Count unread notifications
                    const unreadCount = data.notifications.filter((notification: any) => !notification.isRead).length;
                    console.log('🔔 SSE: Calculated unread count:', unreadCount);
                    setCount(unreadCount);
                    dispatch(updateNotificationCount(unreadCount));
                }
            } catch (error) {
                console.error('🔔 SSE: Error parsing notification data:', error);
                setSseError('Failed to parse notification data');
            }
        };

        eventSource.onerror = (error) => {
            console.error('🔔 SSE: Notification connection error:', error);
            setIsConnected(false);
            setSseError('SSE connection failed');

            // Trigger polling fallback if enabled
            if (fallbackToPolling) {
                console.log('🔔 SSE: Falling back to polling');
                refetchPolling();
            }
        };

        // Cleanup
        return () => {
            console.log('🔔 SSE: Closing notification connection');
            eventSource.close();
        };
    }, [customerId, fallbackToPolling, refetchPolling]);

    // Use polling count when SSE is not connected
    useEffect(() => {
        if (!isConnected && fallbackToPolling) {
            setCount(pollingCount);
        }
    }, [isConnected, fallbackToPolling, pollingCount]);

    return {
        count,
        isConnected,
        isPolling,
        sseError,
        pollingError,
        refetch: () => {
            if (isConnected) {
                // If SSE is connected, we can't manually refetch, but we can trigger polling
                refetchPolling();
            } else {
                refetchPolling();
            }
        }
    };
}
