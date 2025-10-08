import React, { useState } from 'react';
import { useCartSSEContext } from '@/contexts/CartSSEContext';
import { Button } from '../ui/button';

interface SSEDebugProps {
    className?: string;
}

export default function SSEDebug({ className = '' }: SSEDebugProps) {
    const [isExpanded, setIsExpanded] = useState(false);
    const {
        connectionStatus,
        isConnected,
        cartCount,
        connect,
        disconnect,
        reconnect,
    } = useCartSSEContext();

    if (process.env.NODE_ENV === 'production') {
        return null; // Don't show in production
    }

    return (
        <div className={`fixed bottom-4 left-4 bg-white border border-gray-300 rounded-lg shadow-lg p-4 z-50 ${className}`}>
            <div className="flex items-center justify-between mb-2">
                <h3 className="text-sm font-medium text-gray-700">SSE Debug</h3>
                <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setIsExpanded(!isExpanded)}
                    className="text-xs"
                >
                    {isExpanded ? '▼' : '▶'}
                </Button>
            </div>

            <div className="space-y-2">
                <div className="flex items-center gap-2">
                    <span className="text-xs text-gray-600">Status:</span>
                    <span className={`text-xs px-2 py-1 rounded ${isConnected ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                        }`}>
                        {connectionStatus}
                    </span>
                </div>

                <div className="flex items-center gap-2">
                    <span className="text-xs text-gray-600">Items in Cart:</span>
                    <span className="text-xs font-medium">{cartCount}</span>
                </div>

                {isExpanded && (
                    <div className="pt-2 border-t border-gray-200 space-y-2">
                        <div className="flex gap-2">
                            <Button
                                variant="outline"
                                size="sm"
                                onClick={connect}
                                disabled={isConnected}
                                className="text-xs"
                            >
                                Connect
                            </Button>
                            <Button
                                variant="outline"
                                size="sm"
                                onClick={disconnect}
                                disabled={!isConnected}
                                className="text-xs"
                            >
                                Disconnect
                            </Button>
                            <Button
                                variant="outline"
                                size="sm"
                                onClick={reconnect}
                                className="text-xs"
                            >
                                Reconnect
                            </Button>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}
