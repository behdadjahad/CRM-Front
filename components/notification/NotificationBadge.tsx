"use client";

import React from 'react';
import { useNotifications } from '@/hooks/useNotifications';
import { Bell } from 'lucide-react';

interface NotificationBadgeProps {
    className?: string;
    showCount?: boolean;
    onClick?: () => void;
}

export default function NotificationBadge({
    className = "",
    showCount = true,
    onClick
}: NotificationBadgeProps) {
    const { count, isConnected, isPolling } = useNotifications();

    return (
        <div
            className={`relative cursor-pointer ${className}`}
            onClick={onClick}
        >
            <Bell className="w-6 h-6 text-gray-600 hover:text-gray-800 transition-colors" />

            {showCount && count > 0 && (
                <div className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full min-w-[20px] h-5 flex items-center justify-center px-1">
                    {count > 99 ? '99+' : count}
                </div>
            )}

            {/* Connection status indicator (optional, for debugging) */}
            {process.env.NODE_ENV === 'development' && (
                <div className="absolute -bottom-1 -right-1 w-2 h-2 rounded-full"
                    style={{
                        backgroundColor: isConnected ? '#10B981' : isPolling ? '#F59E0B' : '#EF4444'
                    }}
                    title={isConnected ? 'SSE Connected' : isPolling ? 'Polling' : 'Disconnected'}
                />
            )}
        </div>
    );
}
