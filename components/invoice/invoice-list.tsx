"use client";

import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { InvoiceListProps, Invoice, INVOICE_STATUS_CONFIG } from '@/types/invoice';
import InvoicePreviewModal from './invoice-preview-modal';
import { Eye, Download, FileText } from 'lucide-react';
import { cn } from '@/lib/utils';

const InvoiceList: React.FC<InvoiceListProps> = ({
    invoices,
    onPreview,
    onDownload,
    onView
}) => {
    const [selectedInvoice, setSelectedInvoice] = useState<Invoice | null>(null);
    const [isPreviewOpen, setIsPreviewOpen] = useState(false);

    const handlePreview = (invoice: Invoice) => {
        setSelectedInvoice(invoice);
        setIsPreviewOpen(true);
        onPreview(invoice);
    };

    const handleClosePreview = () => {
        setIsPreviewOpen(false);
        setSelectedInvoice(null);
    };

    const handleOpen = () => {
        if (selectedInvoice) {
            onView(selectedInvoice);
        }
    };

    const handleDownload = (invoice: Invoice) => {
        onDownload(invoice);
    };

    const formatPrice = (price: number) => {
        return new Intl.NumberFormat('fa-IR').format(price);
    };

    return (
        <>
            <div className="space-y-4">
                {invoices.map((invoice) => {
                    const statusConfig = INVOICE_STATUS_CONFIG[invoice.status];

                    return (
                        <div
                            key={invoice.id}
                            className="bg-white rounded-lg border border-gray-200 p-6 hover:shadow-md transition-shadow duration-200"
                        >
                            <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
                                {/* Invoice Info */}
                                <div className="flex-1">
                                    <div className="flex items-start justify-between mb-3">
                                        <div>
                                            <h3 className="text-lg font-semibold text-gray-900 mb-1">
                                                {invoice.orderTitle}
                                            </h3>
                                            <p className="text-sm text-gray-600">
                                                شماره سفارش: {invoice.orderNumber}
                                            </p>
                                        </div>
                                        <Badge variant={statusConfig.variant} className="text-sm">
                                            {statusConfig.label}
                                        </Badge>
                                    </div>

                                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 text-sm text-gray-600">
                                        <div>
                                            <span className="font-medium">نوع پکیج:</span>
                                            <span className="mr-2">{invoice.packageType}</span>
                                        </div>
                                        <div>
                                            <span className="font-medium">تاریخ سفارش:</span>
                                            <span className="mr-2">
                                                {new Date(invoice.orderDate).toLocaleDateString('fa-IR')}
                                            </span>
                                        </div>
                                        <div>
                                            <span className="font-medium">مدت اعتبار:</span>
                                            <span className="mr-2">{invoice.validityPeriod}</span>
                                        </div>
                                    </div>
                                </div>

                                {/* Price and Actions */}
                                <div className="flex flex-col sm:flex-row lg:flex-col xl:flex-row items-start sm:items-center lg:items-end xl:items-center gap-4">
                                    {/* Price */}
                                    <div className="text-left">
                                        <div className="text-2xl font-bold text-gray-900">
                                            {formatPrice(invoice.finalPrice)} {invoice.currency}
                                        </div>
                                        {invoice.discount > 0 && (
                                            <div className="text-sm text-gray-500 line-through">
                                                {formatPrice(invoice.basePrice)} {invoice.currency}
                                            </div>
                                        )}
                                    </div>

                                    {/* Action Buttons */}
                                    <div className="flex gap-2">
                                        <Button
                                            variant="outline"
                                            size="sm"
                                            onClick={() => handlePreview(invoice)}
                                            className="flex items-center gap-2"
                                        >
                                            <Eye className="w-4 h-4" />
                                            مشاهده
                                        </Button>
                                        <Button
                                            variant="outline"
                                            size="sm"
                                            onClick={() => handleDownload(invoice)}
                                            className="flex items-center gap-2"
                                        >
                                            <Download className="w-4 h-4" />
                                            دانلود
                                        </Button>
                                    </div>
                                </div>
                            </div>

                            {/* Discount Info */}
                            {(invoice.discount > 0 || invoice.managerDiscount > 0) && (
                                <div className="mt-4 pt-4 border-t border-gray-100">
                                    <div className="flex flex-wrap gap-2">
                                        {invoice.discount > 0 && (
                                            <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                                                {Math.round((invoice.discount / invoice.basePrice) * 100)}% تخفیف
                                            </span>
                                        )}
                                        {invoice.managerDiscount > 0 && (
                                            <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium bg-red-100 text-red-800">
                                                {Math.round((invoice.managerDiscount / invoice.basePrice) * 100)}% تخفیف مدیران
                                            </span>
                                        )}
                                    </div>
                                </div>
                            )}
                        </div>
                    );
                })}
            </div>

            {/* Preview Modal */}
            {selectedInvoice && (
                <InvoicePreviewModal
                    invoice={selectedInvoice}
                    isOpen={isPreviewOpen}
                    onClose={handleClosePreview}
                    onOpen={handleOpen}
                    onDownload={handleDownload}
                />
            )}
        </>
    );
};

export default InvoiceList;
