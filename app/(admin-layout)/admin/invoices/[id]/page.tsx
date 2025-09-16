"use client";

import React, { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { Request, RequestStatus } from '@/types/requests';
import { mockRequests, requestStatusOptions } from '@/data/requests-mock-data';
import RequestStatusBadge from '@/components/admin/requests/request-status-badge';
import { Button } from '@/components/ui/button';
import { ArrowLeft, CheckCircle, XCircle, Clock, MoreHorizontal, DollarSign, RefreshCcw } from 'lucide-react';
import { cn } from '@/lib/utils';

const InvoiceDetailPage: React.FC = () => {
    const params = useParams();
    const router = useRouter();
    const invoiceId = params.id as string;

    const [request, setRequest] = useState<Request | null>(null);
    const [loading, setLoading] = useState(true);
    const [isProcessingAction, setIsProcessingAction] = useState(false);

    useEffect(() => {
        setLoading(true);
        // Simulate API call
        const fetchedRequest = mockRequests.find(req => req.invoiceId === invoiceId);
        setTimeout(() => {
            setRequest(fetchedRequest || null);
            setLoading(false);
        }, 500);
    }, [invoiceId]);

    const handleStatusChange = (newStatus: RequestStatus) => {
        if (!request) return;
        setIsProcessingAction(true);
        setTimeout(() => {
            const updatedRequest = {
                ...request,
                status: newStatus,
                updatedAt: new Date().toISOString(),
                invoiceHistory: [
                    ...(request.invoiceHistory || []),
                    { timestamp: new Date().toISOString(), status: newStatus, adminNotes: `Status changed to ${newStatus}` },
                ],
            };
            setRequest(updatedRequest);
            // In a real app, you'd send this to the backend
            console.log(`Request ${request.invoiceId} status updated to ${newStatus}`);
            setIsProcessingAction(false);
        }, 1000);
    };

    const formatDate = (dateString: string) => {
        return new Date(dateString).toLocaleDateString('fa-IR', {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    };

    const formatPrice = (price: number, currency: string) => {
        return `${price.toLocaleString('fa-IR')} ${currency}`;
    };

    if (loading) {
        return <div className="flex justify-center items-center h-screen">در حال بارگذاری...</div>;
    }

    if (!request) {
        return <div className="flex justify-center items-center h-screen text-red-500">درخواست یافت نشد.</div>;
    }

    const currentStatusInfo = requestStatusOptions.find(opt => opt.value === request.status);

    return (
        <div className="container mx-auto py-8 px-4">
            <div className="flex items-center justify-between mb-6">
                <Button variant="outline" onClick={() => router.back()} className="flex items-center gap-2">
                    <ArrowLeft className="w-4 h-4" />
                    بازگشت به لیست درخواست‌ها
                </Button>
                <h1 className="text-2xl font-bold text-gray-900">جزئیات درخواست #{request.invoiceId}</h1>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Main Content */}
                <div className="lg:col-span-2 bg-white rounded-lg border border-gray-200 p-6">
                    {/* Request Details */}
                    <div className="mb-6">
                        <h2 className="text-lg font-semibold text-gray-900 mb-4">اطلاعات درخواست</h2>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">شماره فاکتور</label>
                                <p className="text-sm text-gray-900">{request.invoiceId}</p>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">وضعیت</label>
                                <RequestStatusBadge status={request.status} />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">تاریخ ایجاد</label>
                                <p className="text-sm text-gray-900">{formatDate(request.createdAt)}</p>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">آخرین بروزرسانی</label>
                                <p className="text-sm text-gray-900">{formatDate(request.updatedAt)}</p>
                            </div>
                        </div>
                    </div>

                    {/* User Information */}
                    <div className="mb-6">
                        <h2 className="text-lg font-semibold text-gray-900 mb-4">اطلاعات کاربر</h2>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">نام کاربر</label>
                                <p className="text-sm text-gray-900">{request.userName}</p>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">ایمیل</label>
                                <p className="text-sm text-gray-900">{request.userEmail}</p>
                            </div>
                        </div>
                    </div>

                    {/* Package Information */}
                    <div className="mb-6">
                        <h2 className="text-lg font-semibold text-gray-900 mb-4">اطلاعات پکیج</h2>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">نام پکیج</label>
                                <p className="text-sm text-gray-900">{request.packageName}</p>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">مبلغ</label>
                                <p className="text-sm text-gray-900">{formatPrice(request.packagePrice, request.currency)}</p>
                            </div>
                        </div>
                    </div>

                    {/* Payment Information */}
                    {request.paymentMethod && (
                        <div className="mb-6">
                            <h2 className="text-lg font-semibold text-gray-900 mb-4">اطلاعات پرداخت</h2>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">روش پرداخت</label>
                                    <p className="text-sm text-gray-900">{request.paymentMethod}</p>
                                </div>
                                {request.transactionId && (
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">شناسه تراکنش</label>
                                        <p className="text-sm text-gray-900">{request.transactionId}</p>
                                    </div>
                                )}
                            </div>
                        </div>
                    )}

                    {/* Notes */}
                    {request.notes && (
                        <div className="mb-6">
                            <h2 className="text-lg font-semibold text-gray-900 mb-4">یادداشت‌ها</h2>
                            <div className="bg-gray-50 rounded-lg p-4">
                                <p className="text-sm text-gray-700">{request.notes}</p>
                            </div>
                        </div>
                    )}

                    {/* Invoice History */}
                    {request.invoiceHistory && request.invoiceHistory.length > 0 && (
                        <div>
                            <h2 className="text-lg font-semibold text-gray-900 mb-4">تاریخچه فاکتور</h2>
                            <div className="space-y-3">
                                {request.invoiceHistory.map((history: any, index: number) => (
                                    <div key={index} className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                                        <div className="flex-shrink-0">
                                            <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                                                <Clock className="w-4 h-4 text-blue-600" />
                                            </div>
                                        </div>
                                        <div className="flex-1">
                                            <div className="flex items-center gap-2 mb-1">
                                                <RequestStatusBadge status={history.status} />
                                                <span className="text-xs text-gray-500">{formatDate(history.timestamp)}</span>
                                            </div>
                                            {history.adminNotes && (
                                                <p className="text-xs text-gray-600">{history.adminNotes}</p>
                                            )}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}
                </div>

                {/* Sidebar */}
                <div className="lg:col-span-1 space-y-6">
                    {/* Quick Info Card */}
                    <div className="bg-white rounded-lg border border-gray-200 p-6">
                        <h3 className="text-lg font-semibold text-gray-900 mb-4">خلاصه درخواست</h3>
                        <div className="space-y-3">
                            <div className="flex justify-between">
                                <span className="text-sm text-gray-600">شماره فاکتور:</span>
                                <span className="text-sm font-medium">{request.invoiceId}</span>
                            </div>
                            <div className="flex justify-between">
                                <span className="text-sm text-gray-600">وضعیت:</span>
                                <RequestStatusBadge status={request.status} />
                            </div>
                            <div className="flex justify-between">
                                <span className="text-sm text-gray-600">مبلغ:</span>
                                <span className="text-sm font-medium">{formatPrice(request.packagePrice, request.currency)}</span>
                            </div>
                            <div className="flex justify-between">
                                <span className="text-sm text-gray-600">تاریخ ایجاد:</span>
                                <span className="text-sm font-medium">{formatDate(request.createdAt)}</span>
                            </div>
                        </div>
                    </div>

                    {/* Admin Actions Card */}
                    <div className="bg-white rounded-lg border border-gray-200 p-6">
                        <h3 className="text-lg font-semibold text-gray-900 mb-4">اقدامات مدیر</h3>
                        <div className="flex flex-col gap-3">
                            {request.status === 'pending' && (
                                <>
                                    <Button
                                        variant="default"
                                        className="bg-green-600 hover:bg-green-700 text-white"
                                        onClick={() => handleStatusChange('waiting-for-payment')}
                                        disabled={isProcessingAction}
                                    >
                                        {isProcessingAction ? 'در حال تایید...' : 'تایید و ارسال برای پرداخت'}
                                    </Button>
                                    <Button
                                        variant="destructive"
                                        onClick={() => handleStatusChange('rejected')}
                                        disabled={isProcessingAction}
                                    >
                                        {isProcessingAction ? 'در حال رد کردن...' : 'رد درخواست'}
                                    </Button>
                                </>
                            )}
                            {request.status === 'waiting-for-payment' && (
                                <>
                                    <Button
                                        variant="default"
                                        className="bg-green-600 hover:bg-green-700 text-white"
                                        onClick={() => handleStatusChange('paid')}
                                        disabled={isProcessingAction}
                                    >
                                        {isProcessingAction ? 'در حال ثبت پرداخت...' : 'علامت‌گذاری به عنوان پرداخت شده'}
                                    </Button>
                                    <Button
                                        variant="destructive"
                                        className="bg-red-600 hover:bg-red-700 text-white"
                                        onClick={() => handleStatusChange('not-paid')}
                                        disabled={isProcessingAction}
                                    >
                                        {isProcessingAction ? 'در حال ثبت...' : 'علامت‌گذاری به عنوان پرداخت نشده'}
                                    </Button>
                                    <Button
                                        variant="destructive"
                                        onClick={() => handleStatusChange('rejected')}
                                        disabled={isProcessingAction}
                                    >
                                        {isProcessingAction ? 'در حال رد کردن...' : 'رد درخواست'}
                                    </Button>
                                </>
                            )}
                            {request.status === 'not-paid' && (
                                <>
                                    <Button
                                        variant="default"
                                        className="bg-green-600 hover:bg-green-700 text-white"
                                        onClick={() => handleStatusChange('paid')}
                                        disabled={isProcessingAction}
                                    >
                                        {isProcessingAction ? 'در حال ثبت پرداخت...' : 'علامت‌گذاری به عنوان پرداخت شده'}
                                    </Button>
                                    <Button
                                        variant="outline"
                                        className="border-blue-500 text-blue-600 hover:bg-blue-50"
                                        onClick={() => handleStatusChange('waiting-for-payment')}
                                        disabled={isProcessingAction}
                                    >
                                        {isProcessingAction ? 'در حال بازگرداندن...' : 'بازگرداندن به انتظار پرداخت'}
                                    </Button>
                                </>
                            )}
                            {request.status === 'paid' && (
                                <Button
                                    variant="outline"
                                    className="border-yellow-500 text-yellow-600 hover:bg-yellow-50"
                                    onClick={() => handleStatusChange('waiting-for-payment')}
                                    disabled={isProcessingAction}
                                >
                                    {isProcessingAction ? 'در حال بازگرداندن...' : 'بازگرداندن به انتظار پرداخت'}
                                </Button>
                            )}
                            {request.status === 'rejected' && (
                                <Button
                                    variant="outline"
                                    className="border-blue-500 text-blue-600 hover:bg-blue-50"
                                    onClick={() => handleStatusChange('pending')}
                                    disabled={isProcessingAction}
                                >
                                    {isProcessingAction ? 'در حال بازگرداندن...' : 'بازگرداندن به در انتظار تایید'}
                                </Button>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default InvoiceDetailPage;