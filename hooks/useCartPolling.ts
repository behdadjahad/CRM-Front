/**
 * Cart Polling Hook - Fallback for when SSE is not available
 * This provides a backup mechanism to keep cart count updated
 */

import { useEffect, useRef, useState, useCallback } from 'react';
import { useSelector } from 'react-redux';
import { RootState } from '@/store';
import { fetchService } from '@/boot/chadco-customer-service';

interface UseCartPollingOptions {
  enabled?: boolean;
  interval?: number; // in milliseconds
  onCartCountUpdate?: (count: number) => void;
  onError?: (error: any) => void;
}

export function useCartPolling({
  enabled = true,
  interval = 10000, // 10 seconds default
  onCartCountUpdate,
  onError
}: UseCartPollingOptions = {}) {
  const chadcoCustomerId = useSelector((state: RootState) => state?.login?.chadcoCustomerId);
  const [cartCount, setCartCount] = useState<number>(0);
  const [isPolling, setIsPolling] = useState<boolean>(false);
  const [lastError, setLastError] = useState<string | null>(null);

  const intervalRef = useRef<NodeJS.Timeout | null>(null);
  const isActiveRef = useRef<boolean>(false);

  const fetchCartCount = useCallback(async () => {
    if (!chadcoCustomerId || !enabled) return;

    try {
      const result = await fetchService(`cart?chadcoCustomerId=${chadcoCustomerId}`, {
        method: 'GET',
      });
      
      const count = result.data?.packageUnits?.length || 0;
      
      setCartCount(count);
      setLastError(null);
      onCartCountUpdate?.(count);
    } catch (error: any) {
      console.error('Cart polling error:', error);
      setLastError(error.message || 'Failed to fetch cart count');
      onError?.(error);
    }
  }, [chadcoCustomerId, enabled, onCartCountUpdate, onError]);

  const startPolling = useCallback(() => {
    if (intervalRef.current || !enabled || !chadcoCustomerId) return;

    isActiveRef.current = true;
    setIsPolling(true);

    // Initial fetch
    fetchCartCount();

    // Set up interval
    intervalRef.current = setInterval(() => {
      if (isActiveRef.current) {
        fetchCartCount();
      }
    }, interval);
  }, [enabled, chadcoCustomerId, interval, fetchCartCount]);

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
    cartCount,
    isPolling,
    lastError,
    startPolling,
    stopPolling,
    refetch: fetchCartCount
  };
}