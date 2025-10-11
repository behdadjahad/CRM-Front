import { useEffect, useRef, useCallback, useState } from 'react';

interface UseInfiniteScrollOptions {
    hasMore: boolean;
    isLoading: boolean;
    onLoadMore: () => void | Promise<void>;
    rootMargin?: string;
    threshold?: number;
    disabled?: boolean;
}

interface UseInfiniteScrollReturn {
    loadMoreRef: React.RefObject<HTMLDivElement>;
    isLoadingMore: boolean;
}

/**
 * Custom hook for infinite scroll functionality
 * Uses Intersection Observer API for efficient scroll detection
 * 
 * @param hasMore - Whether there are more items to load
 * @param isLoading - Whether initial/main loading is in progress
 * @param onLoadMore - Callback to load more items
 * @param rootMargin - Margin around root (default: '100px')
 * @param threshold - Intersection threshold (default: 0.1)
 * @param disabled - Disable infinite scroll
 */
export function useInfiniteScroll({
    hasMore,
    isLoading,
    onLoadMore,
    rootMargin = '100px',
    threshold = 0.1,
    disabled = false,
}: UseInfiniteScrollOptions): UseInfiniteScrollReturn {
    const loadMoreRef = useRef<HTMLDivElement>(null);
    const [isLoadingMore, setIsLoadingMore] = useState(false);

    const handleLoadMore = useCallback(async () => {
        if (disabled || !hasMore || isLoading || isLoadingMore) return;

        setIsLoadingMore(true);
        try {
            await onLoadMore();
        } catch (error) {
            console.error('Error loading more items:', error);
        } finally {
            setIsLoadingMore(false);
        }
    }, [disabled, hasMore, isLoading, isLoadingMore, onLoadMore]);

    useEffect(() => {
        const currentRef = loadMoreRef.current;
        if (!currentRef || disabled) return;

        const observer = new IntersectionObserver(
            (entries) => {
                const firstEntry = entries[0];
                if (firstEntry.isIntersecting && !isLoading && !isLoadingMore && hasMore) {
                    handleLoadMore();
                }
            },
            {
                root: null,
                rootMargin,
                threshold,
            }
        );

        observer.observe(currentRef);

        return () => {
            observer.unobserve(currentRef);
        };
    }, [disabled, hasMore, isLoading, isLoadingMore, handleLoadMore, rootMargin, threshold]);

    return {
        loadMoreRef,
        isLoadingMore,
    };
}

