/**
 * Notification Polling Hook - Fallback for when SSE is not available
 * This provides a backup mechanism to keep notification count updated
 */

import { useEffect, useRef, useState, useCallback } from 'react';
import { useSelector } from 'react-redux';
import { RootState } from '@/store';
import { fetchService } from '@/boot/chadco-customer-service';

interface UseNotificationPollingOptions {
    enabled?: boolean;
    interval?: number; // in milliseconds
    onNotificationCountUpdate?: (count: number) => void;
    onError?: (error: any) => void;
}

export function useNotificationPolling({
    enabled = true,
    interval = 15000, // 15 seconds default (longer than cart since notifications are less frequent)
    onNotificationCountUpdate,
    onError
}: UseNotificationPollingOptions = {}) {
    const chadcoCustomerId = useSelector((state: RootState) => state?.login?.chadcoCustomerId);
    const [notificationCount, setNotificationCount] = useState<number>(0);
    const [isPolling, setIsPolling] = useState<boolean>(false);
    const [lastError, setLastError] = useState<string | null>(null);

    const intervalRef = useRef<NodeJS.Timeout | null>(null);
    const isActiveRef = useRef<boolean>(false);

    const fetchNotificationCount = useCallback(async () => {
        if (!chadcoCustomerId || !enabled) return;

        try {
            const result = await fetchService(`notification?chadcoCustomerId=${chadcoCustomerId}`, {
                method: 'GET',
            });

            // Count unread notifications
            const unreadCount = result.data?.filter((notification: any) => !notification.isRead).length || 0;

            setNotificationCount(unreadCount);
            setLastError(null);
            onNotificationCountUpdate?.(unreadCount);
        } catch (error: any) {
            console.error('Notification polling error:', error);
            setLastError(error.message || 'Failed to fetch notification count');
            onError?.(error);
        }
    }, [chadcoCustomerId, enabled, onNotificationCountUpdate, onError]);

    const startPolling = useCallback(() => {
        if (intervalRef.current || !enabled || !chadcoCustomerId) return;

        isActiveRef.current = true;
        setIsPolling(true);

        // Initial fetch
        fetchNotificationCount();

        // Set up interval
        intervalRef.current = setInterval(() => {
            if (isActiveRef.current) {
                fetchNotificationCount();
            }
        }, interval);
    }, [enabled, chadcoCustomerId, interval, fetchNotificationCount]);

    const stopPolling = useCallback(() => {
        if (intervalRef.current) {
            clearInterval(intervalRef.current);
            intervalRef.current = null;
        }
        isActiveRef.current = false;
        setIsPolling(false);
    }, []);

    // Auto-start/stop based on enabled state and customer ID
    useEffect(() => {
        if (enabled && chadcoCustomerId) {
            startPolling();
        } else {
            stopPolling();
        }

        return () => {
            stopPolling();
        };
    }, [enabled, chadcoCustomerId, startPolling, stopPolling]);

    // Cleanup on unmount
    useEffect(() => {
        return () => {
            stopPolling();
        };
    }, [stopPolling]);

    return {
        notificationCount,
        isPolling,
        lastError,
        startPolling,
        stopPolling,
        refetch: fetchNotificationCount
    };
}
