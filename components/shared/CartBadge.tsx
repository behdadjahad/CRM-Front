import React from 'react';
import Link from 'next/link';
import { ShoppingCart } from 'lucide-react';
import { useCartCount } from '@/contexts/CartSSEContext';

interface CartBadgeProps {
    className?: string;
    showConnectionStatus?: boolean;
    onClick?: () => void;
}

export default function CartBadge({
    className = '',
    showConnectionStatus = false,
    onClick
}: CartBadgeProps) {
    const { count, isConnected, connectionStatus } = useCartCount();

    const getConnectionStatusColor = () => {
        switch (connectionStatus) {
            case 'connected':
                return 'bg-green-500';
            case 'connecting':
            case 'reconnecting':
                return 'bg-yellow-500';
            case 'error':
                return 'bg-red-500';
            default:
                return 'bg-gray-400';
        }
    };

    const getConnectionStatusText = () => {
        switch (connectionStatus) {
            case 'connected':
                return 'متصل';
            case 'connecting':
                return 'در حال اتصال';
            case 'reconnecting':
                return 'در حال اتصال مجدد';
            case 'error':
                return 'خطا در اتصال';
            default:
                return 'قطع شده';
        }
    };

    return (
        <div className={`relative ${className}`}>
            <Link
                href="/cart"
                className="relative flex items-center gap-2 p-2 rounded-lg hover:bg-gray-100 transition-colors"
                onClick={onClick}
            >
                <div className="relative">
                    <ShoppingCart className="w-6 h-6 text-gray-700" />
                    {count > 0 && (
                        <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center font-medium">
                            {count > 99 ? '99+' : count}
                        </span>
                    )}
                </div>

                <div className="flex flex-col items-start">
                    <span className="text-sm font-medium text-gray-700">
                        سبد خرید
                    </span>
                    {count > 0 && (
                        <span className="text-xs text-gray-500">
                            {count} آیتم
                        </span>
                    )}
                </div>

                {showConnectionStatus && (
                    <div className="flex flex-col items-center gap-1">
                        <div className={`w-2 h-2 rounded-full ${getConnectionStatusColor()}`} />
                        <span className="text-xs text-gray-500">
                            {getConnectionStatusText()}
                        </span>
                    </div>
                )}
            </Link>

            {/* Connection status tooltip */}
            {showConnectionStatus && (
                <div className="absolute top-full left-0 mt-1 p-2 bg-gray-800 text-white text-xs rounded shadow-lg opacity-0 hover:opacity-100 transition-opacity pointer-events-none">
                    <div className="flex items-center gap-2">
                        <div className={`w-2 h-2 rounded-full ${getConnectionStatusColor()}`} />
                        <span>{getConnectionStatusText()}</span>
                    </div>
                </div>
            )}
        </div>
    );
}

// Alternative compact version
export function CompactCartBadge({ className = '' }: { className?: string }) {
    const { count, isConnected } = useCartCount();

    return (
        <Link
            href="/cart"
            className={`relative inline-flex items-center justify-center w-10 h-10 rounded-full bg-gray-100 hover:bg-gray-200 transition-colors ${className}`}
        >
            <ShoppingCart className="w-5 h-5 text-gray-700" />
            {count > 0 && (
                <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center font-medium">
                    {count > 9 ? '9+' : count}
                </span>
            )}
            {!isConnected && (
                <div className="absolute -bottom-1 -right-1 w-3 h-3 bg-red-500 rounded-full border-2 border-white" />
            )}
        </Link>
    );
}

// Connection status indicator
export function SSEConnectionStatus({ className = '' }: { className?: string }) {
    const { isConnected, connectionStatus } = useCartCount();

    const getStatusColor = () => {
        switch (connectionStatus) {
            case 'connected':
                return 'text-green-500';
            case 'connecting':
            case 'reconnecting':
                return 'text-yellow-500';
            case 'error':
                return 'text-red-500';
            default:
                return 'text-gray-400';
        }
    };

    const getStatusText = () => {
        switch (connectionStatus) {
            case 'connected':
                return 'آنلاین';
            case 'connecting':
                return 'در حال اتصال';
            case 'reconnecting':
                return 'اتصال مجدد';
            case 'error':
                return 'خطا';
            default:
                return 'آفلاین';
        }
    };

    return (
        <div className={`flex items-center gap-2 text-sm ${className}`}>
            <div className={`w-2 h-2 rounded-full ${getStatusColor().replace('text-', 'bg-')}`} />
            <span className={getStatusColor()}>
                {getStatusText()}
            </span>
        </div>
    );
}
