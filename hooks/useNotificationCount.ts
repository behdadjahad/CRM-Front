import { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { RootState } from '@/store';

const SSE_URL = 'http://185.126.203.246:3001/api/v1/notifications/updates';

export function useNotificationCount() {
    const [count, setCount] = useState(0);
    const [isConnected, setIsConnected] = useState(false);
    const customerId = useSelector((state: RootState) => state?.login?.chadcoCustomerId);

    useEffect(() => {
        if (!customerId) {
            setCount(0);
            setIsConnected(false);
            return;
        }

        const url = `${SSE_URL}?chadcoCustomerId=${customerId}`;
        const eventSource = new EventSource(url);

        eventSource.onopen = () => {
            console.log('🔔 SSE: Notification connection opened');
            setIsConnected(true);
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
                } else if (data.notifications && Array.isArray(data.notifications)) {
                    // Count unread notifications
                    const unreadCount = data.notifications.filter((notification: any) => !notification.isRead).length;
                    console.log('🔔 SSE: Calculated unread count:', unreadCount);
                    setCount(unreadCount);
                }
            } catch (error) {
                console.error('🔔 SSE: Error parsing notification data:', error);
            }
        };

        eventSource.onerror = (error) => {
            console.error('🔔 SSE: Notification connection error:', error);
            setIsConnected(false);
        };

        // Cleanup
        return () => {
            console.log('🔔 SSE: Closing notification connection');
            eventSource.close();
        };
    }, [customerId]);

    return { count, isConnected };
}
