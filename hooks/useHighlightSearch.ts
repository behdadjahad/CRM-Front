import { useEffect, useState, useCallback } from 'react';
import toast from 'react-hot-toast';

interface UseHighlightSearchOptions<T> {
    items: T[];
    highlightCode?: string;
    currentPage: number;
    totalPages: number;
    isLoading: boolean;
    checkMatch: (item: T, code: string) => boolean;
    onLoadNextPage: () => Promise<void>;
    scrollDelay?: number;
}

interface UseHighlightSearchReturn {
    isSearching: boolean;
    searchComplete: boolean;
    resetSearch: () => void;
}

/**
 * Custom hook for auto-loading pages until a highlighted item is found
 * 
 * @param items - Current list of items
 * @param highlightCode - Code to search for
 * @param currentPage - Current page number
 * @param totalPages - Total number of pages
 * @param isLoading - Whether initial loading is in progress
 * @param checkMatch - Function to check if item matches the highlight code
 * @param onLoadNextPage - Callback to load next page
 * @param scrollDelay - Delay before scrolling (default: 300ms)
 */
export function useHighlightSearch<T>({
    items,
    highlightCode,
    currentPage,
    totalPages,
    isLoading,
    checkMatch,
    onLoadNextPage,
    scrollDelay = 300,
}: UseHighlightSearchOptions<T>): UseHighlightSearchReturn {
    const [isSearching, setIsSearching] = useState(false);
    const [searchComplete, setSearchComplete] = useState(false);
    const [lastCheckedPage, setLastCheckedPage] = useState(0);

    const resetSearch = useCallback(() => {
        setSearchComplete(false);
        setIsSearching(false);
        setLastCheckedPage(0);
    }, []);

    // Reset when highlightCode changes
    useEffect(() => {
        if (highlightCode) {
            resetSearch();
        }
    }, [highlightCode, resetSearch]);

    // Auto-load pages until item is found
    useEffect(() => {
        if (!highlightCode || isLoading || searchComplete || isSearching) return;

        // Prevent checking the same page multiple times
        if (currentPage <= lastCheckedPage) return;

        const hasMatch = items.some(item => checkMatch(item, highlightCode));

        if (hasMatch) {
            // Found! Stop searching and scroll to it
            setIsSearching(false);
            setSearchComplete(true);
            setLastCheckedPage(currentPage);

            setTimeout(() => {
                const matchIndex = items.findIndex(item => checkMatch(item, highlightCode));
                if (matchIndex !== -1) {
                    const cards = document.querySelectorAll('[data-unit-card]');
                    const targetCard = cards[matchIndex];
                    if (targetCard) {
                        targetCard.scrollIntoView({
                            behavior: 'smooth',
                            block: 'center',
                        });
                    }
                }
            }, scrollDelay);
        } else if (currentPage < totalPages) {
            // Not found, load next page
            setIsSearching(true);
            setLastCheckedPage(currentPage);

            onLoadNextPage().then(() => {
                setIsSearching(false);
            }).catch((error) => {
                console.error('Error during highlight search:', error);
                setIsSearching(false);
                setSearchComplete(true);
            });
        } else if (items.length > 0) {
            // All pages searched, not found
            setIsSearching(false);
            setSearchComplete(true);
            setLastCheckedPage(currentPage);
            toast.error(`ویژگی با کد "${highlightCode}" در لیست یافت نشد`);
        }
    }, [
        highlightCode,
        items.length, // Only depend on length, not full array
        currentPage,
        totalPages,
        isLoading,
        searchComplete,
        isSearching,
        lastCheckedPage,
        checkMatch,
        onLoadNextPage,
        scrollDelay,
    ]);

    return {
        isSearching,
        searchComplete,
        resetSearch,
    };
}

