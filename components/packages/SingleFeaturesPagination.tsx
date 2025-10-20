"use client";

import React from 'react';

interface SingleFeaturesPaginationProps {
    hasMore: boolean;
    isLoading: boolean;
    loadMoreRef: React.RefObject<HTMLDivElement>;
    currentCount: number;
    totalCount: number;
}

export const SingleFeaturesPagination: React.FC<SingleFeaturesPaginationProps> = ({
    hasMore,
    isLoading,
    loadMoreRef,
    currentCount,
    totalCount,
}) => {
    if (hasMore) {
        return (
            <div ref={loadMoreRef} className="flex justify-center py-8">
                {isLoading ? (
                    <div className="flex flex-col items-center gap-2">
                        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
                        <span className="text-sm text-gray-500">در حال بارگذاری...</span>
                    </div>
                ) : (
                    <div className="text-sm text-gray-400">
                        اسکرول کنید تا بیشتر ببینید
                    </div>
                )}
            </div>
        );
    }

    if (currentCount > 0) {
        return (
            <div className="flex justify-center py-8">
                <div className="text-sm text-gray-400">
                    همه موارد نمایش داده شد ({totalCount} مورد)
                </div>
            </div>
        );
    }

    return null;
};

