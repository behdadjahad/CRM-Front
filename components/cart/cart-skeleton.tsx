"use client";
import React from 'react';

export default function CartSkeleton() {
    return (
        <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
            <div className="max-w-7xl mx-auto p-6">
                <div className="grid grid-cols-12 gap-6">
                    {/* Left side - Cart Items Skeleton */}
                    <div className="col-span-12 lg:col-span-8 bg-white sm:p-4 rounded-2xl flex flex-col gap-6">
                        <div className="flex justify-between items-center p-4">
                            <div className="h-6 bg-gray-200 rounded w-32 animate-pulse"></div>
                            <div className="h-4 bg-gray-200 rounded w-24 animate-pulse"></div>
                        </div>

                        {/* Skeleton Cart Items */}
                        {[1, 2, 3].map((i) => (
                            <div key={i} className="p-4 bg-static-background-light rounded-lg">
                                <div className="flex justify-between mb-4">
                                    <div className="h-6 bg-gray-200 rounded w-20 animate-pulse"></div>
                                    <div className="h-6 bg-gray-200 rounded w-6 animate-pulse"></div>
                                </div>
                                <div className="space-y-3">
                                    <div className="h-6 bg-gray-200 rounded w-3/4 animate-pulse"></div>
                                    <div className="h-4 bg-gray-200 rounded w-1/2 animate-pulse"></div>
                                    <div className="flex justify-between items-center mt-4">
                                        <div className="h-8 bg-gray-200 rounded w-24 animate-pulse"></div>
                                        <div className="h-6 bg-gray-200 rounded w-32 animate-pulse"></div>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>

                    {/* Right side - Summary Skeleton */}
                    <div className="col-span-12 lg:col-span-4 flex flex-col gap-4">
                        <div className="bg-white border p-6 rounded-xl">
                            <div className="h-6 bg-gray-200 rounded w-32 mb-6 animate-pulse"></div>
                            <div className="space-y-4">
                                {[1, 2, 3, 4].map((i) => (
                                    <div key={i} className="flex justify-between">
                                        <div className="h-4 bg-gray-200 rounded w-24 animate-pulse"></div>
                                        <div className="h-4 bg-gray-200 rounded w-20 animate-pulse"></div>
                                    </div>
                                ))}
                            </div>
                            <div className="mt-8">
                                <div className="h-10 bg-gray-200 rounded w-full animate-pulse"></div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

