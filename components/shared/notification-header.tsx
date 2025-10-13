"use client";

import React from 'react';
import NotificationBadge from '@/components/notification/NotificationBadge';

interface NotificationHeaderProps {
    className?: string;
}

export default function NotificationHeader({ className = "" }: NotificationHeaderProps) {
    const handleNotificationClick = () => {
        // Navigate to notifications page or open notification drawer
        console.log('Notification clicked');
        // You can add navigation logic here
        // router.push('/notifications');
    };

    return (
        <div className={`flex items-center gap-4 ${className}`}>
            <NotificationBadge
                onClick={handleNotificationClick}
                showCount={true}
            />
        </div>
    );
}
