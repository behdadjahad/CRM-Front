import React from 'react';
import { useCartSSEContext } from '@/contexts/CartSSEContext';

interface SSEStatusProps {
    className?: string;
    showDetails?: boolean;
}

export default function SSEStatus({ className = '', showDetails = false }: SSEStatusProps) {
    const { connectionStatus, isConnected } = useCartSSEContext();

    const getStatusColor = () => {
        switch (connectionStatus) {
            case 'connected':
                return 'text-green-600 bg-green-100';
            case 'connecting':
            case 'reconnecting':
                return 'text-yellow-600 bg-yellow-100';
            case 'error':
                return 'text-red-600 bg-red-100';
            default:
                return 'text-gray-600 bg-gray-100';
        }
    };

    const getStatusText = () => {
        switch (connectionStatus) {
            case 'connected':
                return 'متصل';
            case 'connecting':
                return 'در حال اتصال';
            case 'reconnecting':
                return 'اتصال مجدد';
            case 'error':
                return 'خطا';
            default:
                return 'قطع شده';
        }
    };

    const getStatusIcon = () => {
        switch (connectionStatus) {
            case 'connected':
                return '🟢';
            case 'connecting':
            case 'reconnecting':
                return '🟡';
            case 'error':
                return '🔴';
            default:
                return '⚪';
        }
    };

    return (
        <div className={`flex items-center gap-2 ${className}`}>
            <span className="text-sm">{getStatusIcon()}</span>
            <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor()}`}>
                {getStatusText()}
            </span>

        </div>
    );
}

// Compact version for headers
export function CompactSSEStatus({ className = '' }: { className?: string }) {
    const { connectionStatus, isConnected } = useCartSSEContext();

    const getStatusColor = () => {
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

    return (
        <div className={`flex items-center gap-1 ${className}`}>
            <div className={`w-2 h-2 rounded-full ${getStatusColor()}`} />
            <span className="text-xs text-gray-600">
                {isConnected ? 'آنلاین' : 'آفلاین'}
            </span>
        </div>
    );
}
