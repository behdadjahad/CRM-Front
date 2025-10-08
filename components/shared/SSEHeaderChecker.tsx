import React, { useState } from 'react';
import { Button } from '../ui/button';

interface SSEHeaderCheckerProps {
    apiUrl: string;
    className?: string;
}

export default function SSEHeaderChecker({ apiUrl, className = '' }: SSEHeaderCheckerProps) {
    const [checking, setChecking] = useState(false);
    const [results, setResults] = useState<any>(null);

    const checkHeaders = async () => {
        setChecking(true);
        const sseEndpoint = `${apiUrl}/cart/updates?chadcoCustomerId=1`;

        try {
            // Try a simple fetch first to check headers
            const response = await fetch(sseEndpoint, {
                method: 'GET',
                headers: {
                    'Accept': 'text/event-stream'
                }
            });

            const headers: Record<string, string> = {};
            response.headers.forEach((value, key) => {
                headers[key] = value;
            });

            // Check required SSE headers
            const requiredHeaders = {
                'content-type': headers['content-type'],
                'cache-control': headers['cache-control'],
                'connection': headers['connection'],
                'access-control-allow-origin': headers['access-control-allow-origin'],
                'x-accel-buffering': headers['x-accel-buffering']
            };

            const issues = [];
            const successes = [];

            // Validate headers
            if (!requiredHeaders['content-type']?.includes('text/event-stream')) {
                issues.push({
                    header: 'Content-Type',
                    expected: 'text/event-stream',
                    actual: requiredHeaders['content-type'] || 'missing',
                    severity: 'critical',
                    fix: 'Backend must set: res.setHeader("Content-Type", "text/event-stream")'
                });
            } else {
                successes.push('✅ Content-Type is correct');
            }

            if (!requiredHeaders['cache-control']?.includes('no-cache')) {
                issues.push({
                    header: 'Cache-Control',
                    expected: 'no-cache',
                    actual: requiredHeaders['cache-control'] || 'missing',
                    severity: 'high',
                    fix: 'Backend must set: res.setHeader("Cache-Control", "no-cache")'
                });
            } else {
                successes.push('✅ Cache-Control is correct');
            }

            if (!requiredHeaders['connection']?.includes('keep-alive')) {
                issues.push({
                    header: 'Connection',
                    expected: 'keep-alive',
                    actual: requiredHeaders['connection'] || 'missing',
                    severity: 'high',
                    fix: 'Backend must set: res.setHeader("Connection", "keep-alive")'
                });
            } else {
                successes.push('✅ Connection is correct');
            }

            if (!requiredHeaders['access-control-allow-origin']) {
                issues.push({
                    header: 'Access-Control-Allow-Origin',
                    expected: '* or your-domain.com',
                    actual: 'missing',
                    severity: 'critical',
                    fix: 'Backend must set: res.setHeader("Access-Control-Allow-Origin", "*")'
                });
            } else {
                successes.push('✅ CORS headers present');
            }

            setResults({
                status: response.status,
                statusText: response.statusText,
                allHeaders: headers,
                requiredHeaders,
                issues,
                successes,
                endpoint: sseEndpoint
            });

        } catch (error: any) {
            setResults({
                error: true,
                message: error.message,
                details: 'Failed to connect to SSE endpoint. Possible causes: CORS blocking, server not running, firewall blocking connection.',
                endpoint: sseEndpoint
            });
        }

        setChecking(false);
    };

    return (
        <div className={`bg-white border rounded-lg p-6 ${className}`}>
            <h3 className="text-lg font-bold mb-4">🔍 بررسی هدرهای SSE سرور</h3>

            <div className="mb-4">
                <p className="text-sm text-gray-600 mb-2">
                    این ابزار هدرهای HTTP سرور شما را بررسی می‌کند تا مطمئن شوید SSE به درستی پیکربندی شده است.
                </p>
                <div className="text-xs text-gray-500">
                    Endpoint: <code className="bg-gray-100 px-2 py-1 rounded">{apiUrl}/cart/updates</code>
                </div>
            </div>

            <Button onClick={checkHeaders} disabled={checking} className="mb-4">
                {checking ? 'در حال بررسی...' : '🔍 بررسی هدرها'}
            </Button>

            {results && (
                <div className="space-y-4">
                    {results.error ? (
                        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                            <div className="font-bold text-red-900 mb-2">❌ خطای اتصال</div>
                            <div className="text-sm text-red-800 mb-2">{results.message}</div>
                            <div className="text-xs text-red-700">{results.details}</div>

                            <div className="mt-4 p-3 bg-red-100 rounded">
                                <div className="font-bold mb-2">💡 راه‌حل‌های احتمالی:</div>
                                <ul className="text-xs space-y-1">
                                    <li>• مطمئن شوید سرور روشن است</li>
                                    <li>• آدرس API را بررسی کنید</li>
                                    <li>• فایروال/پروکسی را چک کنید</li>
                                    <li>• از VPN استفاده کنید</li>
                                    <li>• با توسعه‌دهنده بک‌اند تماس بگیرید</li>
                                </ul>
                            </div>
                        </div>
                    ) : (
                        <>
                            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                                <div className="font-bold text-blue-900 mb-2">
                                    📊 وضعیت اتصال: {results.status} {results.statusText}
                                </div>
                                <div className="text-xs text-blue-700">
                                    Endpoint: {results.endpoint}
                                </div>
                            </div>

                            {results.successes && results.successes.length > 0 && (
                                <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                                    <div className="font-bold text-green-900 mb-2">موارد صحیح:</div>
                                    {results.successes.map((success: string, idx: number) => (
                                        <div key={idx} className="text-sm text-green-800">{success}</div>
                                    ))}
                                </div>
                            )}

                            {results.issues && results.issues.length > 0 && (
                                <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                                    <div className="font-bold text-yellow-900 mb-3">⚠️ مشکلات یافت شده:</div>
                                    {results.issues.map((issue: any, idx: number) => (
                                        <div key={idx} className={`mb-3 p-3 rounded ${issue.severity === 'critical' ? 'bg-red-100' : 'bg-yellow-100'
                                            }`}>
                                            <div className="font-medium text-sm mb-1">
                                                {issue.severity === 'critical' ? '🔴' : '🟡'} {issue.header}
                                            </div>
                                            <div className="text-xs space-y-1">
                                                <div>انتظار: <code className="bg-white px-1 rounded">{issue.expected}</code></div>
                                                <div>دریافتی: <code className="bg-white px-1 rounded">{issue.actual}</code></div>
                                                <div className="text-blue-700 mt-2">راه‌حل: {issue.fix}</div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )}

                            <details className="bg-gray-50 border rounded-lg p-4">
                                <summary className="font-bold cursor-pointer">📋 تمام هدرها (برای توسعه‌دهنده بک‌اند)</summary>
                                <pre className="text-xs mt-2 bg-gray-900 text-green-400 p-3 rounded overflow-auto max-h-64">
                                    {JSON.stringify(results.allHeaders, null, 2)}
                                </pre>
                            </details>

                            {results.issues && results.issues.length > 0 && (
                                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                                    <div className="font-bold text-blue-900 mb-2">📨 این را به توسعه‌دهنده بک‌اند بفرستید:</div>
                                    <div className="text-xs bg-white p-3 rounded border">
                                        <p className="mb-2">سلام، برای فعال کردن SSE نیاز است این هدرها را تنظیم کنید:</p>
                                        <pre className="bg-gray-900 text-green-400 p-2 rounded overflow-auto">
                                            {`res.setHeader('Content-Type', 'text/event-stream');
res.setHeader('Cache-Control', 'no-cache');
res.setHeader('Connection', 'keep-alive');
res.setHeader('Access-Control-Allow-Origin', '*');`}
                                        </pre>
                                        <p className="mt-2">فایل راهنمای کامل: <code>docs/SSE_BACKEND_CONFIGURATION.md</code></p>
                                    </div>
                                </div>
                            )}
                        </>
                    )}
                </div>
            )}
        </div>
    );
}
