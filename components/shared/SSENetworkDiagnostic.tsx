import React, { useState } from 'react';
import { Button } from '../ui/button';

interface SSENetworkDiagnosticProps {
    apiUrl: string;
    customerId: string;
    className?: string;
}

export default function SSENetworkDiagnostic({
    apiUrl,
    customerId,
    className = ''
}: SSENetworkDiagnosticProps) {
    const [diagnosticResults, setDiagnosticResults] = useState<any[]>([]);
    const [isRunning, setIsRunning] = useState(false);

    const addResult = (test: string, status: 'success' | 'error' | 'warning', message: string, details?: any) => {
        setDiagnosticResults(prev => [...prev, {
            test,
            status,
            message,
            details,
            timestamp: new Date().toLocaleTimeString()
        }]);
    };

    const runDiagnostics = async () => {
        setIsRunning(true);
        setDiagnosticResults([]);

        // Test 1: Basic connectivity
        try {
            addResult('Basic Connectivity', 'warning', 'Testing basic HTTP connectivity...');
            const response = await fetch(`${apiUrl}/cart?chadcoCustomerId=${customerId}`, {
                method: 'GET',
                headers: {
                    'Accept': 'application/json',
                }
            });

            if (response.ok) {
                addResult('Basic Connectivity', 'success', 'HTTP requests work fine');
            } else {
                addResult('Basic Connectivity', 'error', `HTTP request failed: ${response.status} ${response.statusText}`);
            }
        } catch (error: any) {
            addResult('Basic Connectivity', 'error', `Network error: ${error.message}`);
        }

        // Test 2: CORS headers
        try {
            addResult('CORS Headers', 'warning', 'Testing CORS configuration...');
            const response = await fetch(`${apiUrl}/cart?chadcoCustomerId=${customerId}`, {
                method: 'OPTIONS',
                headers: {
                    'Access-Control-Request-Method': 'GET',
                    'Access-Control-Request-Headers': 'Content-Type',
                }
            });

            const corsHeaders = {
                'Access-Control-Allow-Origin': response.headers.get('Access-Control-Allow-Origin'),
                'Access-Control-Allow-Methods': response.headers.get('Access-Control-Allow-Methods'),
                'Access-Control-Allow-Headers': response.headers.get('Access-Control-Allow-Headers'),
            };

            if (corsHeaders['Access-Control-Allow-Origin']) {
                addResult('CORS Headers', 'success', 'CORS headers present', corsHeaders);
            } else {
                addResult('CORS Headers', 'warning', 'CORS headers missing or incomplete', corsHeaders);
            }
        } catch (error: any) {
            addResult('CORS Headers', 'error', `CORS test failed: ${error.message}`);
        }

        // Test 3: SSE endpoint accessibility
        try {
            addResult('SSE Endpoint', 'warning', 'Testing SSE endpoint accessibility...');

            // Try to create EventSource and see what happens
            const sseUrl = `${apiUrl}/cart/updates?chadcoCustomerId=${customerId}`;
            const eventSource = new EventSource(sseUrl);

            const timeout = setTimeout(() => {
                eventSource.close();
                addResult('SSE Endpoint', 'error', 'SSE connection timeout - possible firewall/proxy blocking');
            }, 5000);

            eventSource.onopen = () => {
                clearTimeout(timeout);
                eventSource.close();
                addResult('SSE Endpoint', 'success', 'SSE connection successful');
            };

            eventSource.onerror = (error) => {
                clearTimeout(timeout);
                eventSource.close();
                addResult('SSE Endpoint', 'error', `SSE connection failed: ${error.type}`, {
                    readyState: eventSource.readyState,
                    url: sseUrl
                });
            };

        } catch (error: any) {
            addResult('SSE Endpoint', 'error', `SSE test failed: ${error.message}`);
        }

        // Test 4: Network environment
        const networkInfo = {
            userAgent: navigator.userAgent,
            online: navigator.onLine,
            connection: (navigator as any).connection ? {
                effectiveType: (navigator as any).connection.effectiveType,
                downlink: (navigator as any).connection.downlink,
                rtt: (navigator as any).connection.rtt
            } : 'Not available',
            protocol: window.location.protocol,
            hostname: window.location.hostname
        };

        addResult('Network Environment', 'success', 'Network environment detected', networkInfo);

        // Test 5: Server response headers
        try {
            addResult('Server Headers', 'warning', 'Checking server response headers...');
            const response = await fetch(`${apiUrl}/cart?chadcoCustomerId=${customerId}`);
            const headers: Record<string, string> = {};

            response.headers.forEach((value, key) => {
                headers[key] = value;
            });

            const importantHeaders = {
                'content-type': headers['content-type'],
                'cache-control': headers['cache-control'],
                'connection': headers['connection'],
                'server': headers['server'],
                'x-powered-by': headers['x-powered-by']
            };

            addResult('Server Headers', 'success', 'Server headers retrieved', importantHeaders);
        } catch (error: any) {
            addResult('Server Headers', 'error', `Header check failed: ${error.message}`);
        }

        setIsRunning(false);
    };

    const getStatusColor = (status: string) => {
        switch (status) {
            case 'success':
                return 'text-green-600 bg-green-100 border-green-200';
            case 'error':
                return 'text-red-600 bg-red-100 border-red-200';
            case 'warning':
                return 'text-yellow-600 bg-yellow-100 border-yellow-200';
            default:
                return 'text-gray-600 bg-gray-100 border-gray-200';
        }
    };

    const getStatusIcon = (status: string) => {
        switch (status) {
            case 'success':
                return '✅';
            case 'error':
                return '❌';
            case 'warning':
                return '⚠️';
            default:
                return 'ℹ️';
        }
    };

    return (
        <div className={`bg-white rounded-lg border p-6 ${className}`}>
            <h3 className="text-lg font-semibold mb-4">🔍 SSE Network Diagnostic</h3>

            <div className="mb-4">
                <p className="text-sm text-gray-600 mb-2">
                    This diagnostic will test various network conditions that might affect SSE connections.
                </p>
                <div className="text-xs text-gray-500">
                    <div>API URL: {apiUrl}</div>
                    <div>Customer ID: {customerId}</div>
                </div>
            </div>

            <Button
                onClick={runDiagnostics}
                disabled={isRunning}
                className="mb-4"
            >
                {isRunning ? 'Running Diagnostics...' : 'Run Network Diagnostics'}
            </Button>

            {diagnosticResults.length > 0 && (
                <div className="space-y-3">
                    <h4 className="font-medium">Diagnostic Results:</h4>
                    {diagnosticResults.map((result, index) => (
                        <div key={index} className={`border rounded-lg p-3 ${getStatusColor(result.status)}`}>
                            <div className="flex items-center gap-2 mb-1">
                                <span>{getStatusIcon(result.status)}</span>
                                <span className="font-medium">{result.test}</span>
                                <span className="text-xs opacity-75">({result.timestamp})</span>
                            </div>
                            <div className="text-sm">{result.message}</div>
                            {result.details && (
                                <details className="mt-2">
                                    <summary className="text-xs cursor-pointer">Show Details</summary>
                                    <pre className="text-xs mt-1 bg-black bg-opacity-10 p-2 rounded overflow-auto">
                                        {JSON.stringify(result.details, null, 2)}
                                    </pre>
                                </details>
                            )}
                        </div>
                    ))}
                </div>
            )}

            <div className="mt-6 p-4 bg-blue-50 rounded-lg">
                <h4 className="font-medium text-blue-900 mb-2">Common Solutions:</h4>
                <ul className="text-sm text-blue-800 space-y-1">
                    <li>• Check if your server supports SSE (Server-Sent Events)</li>
                    <li>• Verify CORS headers allow your domain</li>
                    <li>• Check firewall/proxy settings for long-lived connections</li>
                    <li>• Ensure server has proper SSE headers (text/event-stream)</li>
                    <li>• Test from different network (mobile hotspot, different location)</li>
                </ul>
            </div>
        </div>
    );
}
