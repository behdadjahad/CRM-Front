import React, { useState } from 'react';
import { useCartSSEContext } from '@/contexts/CartSSEContext';
import { Button } from '../ui/button';
import SSENetworkDiagnostic from './SSENetworkDiagnostic';
import SSEHeaderChecker from './SSEHeaderChecker';

interface SSETestPageProps {
    className?: string;
}

export default function SSETestPage({ className = '' }: SSETestPageProps) {
    const [apiUrl, setApiUrl] = useState('http://localhost:3001/api/v1');
    const [customerId, setCustomerId] = useState('1');
    const [unitIds, setUnitIds] = useState('1,2,3');
    const [events, setEvents] = useState<Array<{ message: string; time: string; isHeartbeat?: boolean }>>([]);

    const {
        cartCount,
        isConnected,
        connectionStatus,
        connect,
        disconnect,
        reconnect
    } = useCartSSEContext();

    const addEvent = (message: string, isHeartbeat = false) => {
        const now = new Date().toLocaleTimeString();
        setEvents(prev => [
            { message, time: now, isHeartbeat },
            ...prev.slice(0, 19) // Keep only last 20 events
        ]);
    };

    const handleConnect = () => {
        if (isConnected) {
            addEvent('⚠️ Already connected. Disconnect first.', false);
            return;
        }

        if (!customerId) {
            alert('Please enter a customer ID');
            return;
        }

        addEvent(`🔌 Connecting to SSE: ${apiUrl}/cart/updates?chadcoCustomerId=${customerId}`);
        connect();
    };

    const handleDisconnect = () => {
        if (!isConnected) {
            addEvent('⚠️ Not connected', false);
            return;
        }

        disconnect();
        addEvent('🔌 SSE connection closed');
    };

    const handleAddToCart = async () => {
        if (!customerId || !unitIds) {
            alert('Please enter customer ID and unit IDs');
            return;
        }

        const unitIdsArray = unitIds.split(',').map(id => parseInt(id.trim())).filter(id => !isNaN(id));

        try {
            const response = await fetch(`${apiUrl}/cart/add?chadcoCustomerId=${customerId}`, {
                method: 'PATCH',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    packageUnitIds: unitIdsArray
                })
            });

            const data = await response.json();

            if (response.ok) {
                addEvent(`✅ Added units ${unitIdsArray.join(', ')} to cart`);
            } else {
                addEvent(`❌ Failed to add to cart: ${data.message || 'Unknown error'}`);
            }
        } catch (error: any) {
            console.error('Add to cart error:', error);
            addEvent(`❌ Error adding to cart: ${error.message}`);
        }
    };

    const handleRemoveFromCart = async () => {
        if (!customerId || !unitIds) {
            alert('Please enter customer ID and unit IDs');
            return;
        }

        const unitIdsArray = unitIds.split(',').map(id => parseInt(id.trim())).filter(id => !isNaN(id));

        try {
            const response = await fetch(`${apiUrl}/cart/remove?chadcoCustomerId=${customerId}`, {
                method: 'PATCH',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    packageUnitIds: unitIdsArray
                })
            });

            const data = await response.json();

            if (response.ok) {
                addEvent(`✅ Removed units ${unitIdsArray.join(', ')} from cart`);
            } else {
                addEvent(`❌ Failed to remove from cart: ${data.message || 'Unknown error'}`);
            }
        } catch (error: any) {
            console.error('Remove from cart error:', error);
            addEvent(`❌ Error removing from cart: ${error.message}`);
        }
    };

    const handleGetCart = async () => {
        if (!customerId) {
            alert('Please enter customer ID');
            return;
        }

        try {
            const response = await fetch(`${apiUrl}/cart?chadcoCustomerId=${customerId}`);
            const data = await response.json();

            if (response.ok) {
                const count = data.data?.packageUnits?.length || 0;
                addEvent(`📊 Current cart: ${count} item${count !== 1 ? 's' : ''}`);
                console.log('Cart data:', data);
            } else {
                addEvent(`❌ Failed to get cart: ${data.message || 'Unknown error'}`);
            }
        } catch (error: any) {
            console.error('Get cart error:', error);
            addEvent(`❌ Error getting cart: ${error.message}`);
        }
    };

    const getStatusColor = () => {
        switch (connectionStatus) {
            case 'connected':
                return 'bg-green-100 text-green-800 border-green-200';
            case 'connecting':
                return 'bg-yellow-100 text-yellow-800 border-yellow-200';
            case 'disconnected':
                return 'bg-gray-100 text-gray-800 border-gray-200';
            case 'error':
                return 'bg-red-100 text-red-800 border-red-200';
            default:
                return 'bg-gray-100 text-gray-800 border-gray-200';
        }
    };

    const getIndicatorColor = () => {
        switch (connectionStatus) {
            case 'connected':
                return 'bg-green-500';
            case 'connecting':
                return 'bg-yellow-500';
            case 'disconnected':
            case 'error':
            default:
                return 'bg-gray-400';
        }
    };

    return (
        <div className={`max-w-4xl mx-auto p-6 ${className}`}>
            <div className="bg-white rounded-lg shadow-lg p-6">
                <h1 className="text-2xl font-bold text-center mb-2">🛒 Cart SSE Test</h1>
                <p className="text-center text-gray-600 mb-6">Real-time cart updates using Server-Sent Events</p>

                {/* Configuration Section */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">API Base URL</label>
                        <input
                            type="text"
                            value={apiUrl}
                            onChange={(e) => setApiUrl(e.target.value)}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm"
                            placeholder="http://localhost:3001/api/v1"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Customer ID</label>
                        <input
                            type="number"
                            value={customerId}
                            onChange={(e) => setCustomerId(e.target.value)}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm"
                            placeholder="Enter customer ID"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Package Unit IDs (comma-separated)</label>
                        <input
                            type="text"
                            value={unitIds}
                            onChange={(e) => setUnitIds(e.target.value)}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm"
                            placeholder="1,2,3"
                        />
                    </div>
                </div>

                {/* Connection Controls */}
                <div className="flex gap-2 mb-6">
                    <Button onClick={handleConnect} disabled={isConnected} className="bg-blue-600 hover:bg-blue-700">
                        Connect SSE
                    </Button>
                    <Button onClick={handleDisconnect} disabled={!isConnected} variant="destructive">
                        Disconnect
                    </Button>
                </div>

                {/* Status Display */}
                <div className={`border rounded-lg p-4 mb-6 ${getStatusColor()}`}>
                    <div className="flex items-center gap-2">
                        <div className={`w-3 h-3 rounded-full ${getIndicatorColor()}`} />
                        <span className="font-medium">{connectionStatus}</span>
                    </div>
                </div>

                {/* Cart Display */}
                <div className="bg-gray-50 rounded-lg p-4 mb-6">
                    <div className="text-center">
                        <div className="text-sm text-gray-600 mb-1">Items in Cart</div>
                        <div className="text-3xl font-bold text-gray-900">{cartCount}</div>
                        <div className="text-xs text-gray-500 mt-1">
                            {isConnected ? `Updated at ${new Date().toLocaleTimeString()}` : 'Not connected'}
                        </div>
                    </div>
                </div>

                {/* Action Buttons */}
                <div className="flex gap-2 mb-6">
                    <Button onClick={handleAddToCart} className="bg-blue-600 hover:bg-blue-700">
                        Add to Cart
                    </Button>
                    <Button onClick={handleRemoveFromCart} variant="outline">
                        Remove from Cart
                    </Button>
                    <Button onClick={handleGetCart} variant="outline">
                        Get Cart
                    </Button>
                </div>

                {/* Header Checker - MOST IMPORTANT */}
                <div className="mb-6">
                    <SSEHeaderChecker apiUrl={apiUrl} />
                </div>

                {/* Network Diagnostic */}
                <div className="mb-6">
                    <SSENetworkDiagnostic
                        apiUrl={apiUrl}
                        customerId={customerId}
                    />
                </div>

                {/* Event Log */}
                <div>
                    <h3 className="text-lg font-semibold mb-3">📡 Event Log</h3>
                    <div className="bg-gray-900 text-green-400 rounded-lg p-4 h-64 overflow-y-auto font-mono text-sm">
                        {events.length === 0 ? (
                            <div className="text-gray-500">📱 Test page loaded. Click "Connect SSE" to start.</div>
                        ) : (
                            events.map((event, index) => (
                                <div key={index} className={`mb-1 ${event.isHeartbeat ? 'text-yellow-400' : ''}`}>
                                    <div className="flex justify-between">
                                        <span>{event.message}</span>
                                        <span className="text-gray-500 text-xs">{event.time}</span>
                                    </div>
                                </div>
                            ))
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}
