"use client";

import React from 'react';
import { Dialog, DialogOverlay, DialogContent } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { InvoicePreviewProps } from '@/types/invoice';
import { X, Download, Edit, Eye } from 'lucide-react';
import { cn } from '@/lib/utils';

const InvoicePreviewModal: React.FC<InvoicePreviewProps> = ({
    invoice,
    isOpen,
    onClose,
    onDownload,
    onOpen
}) => {
    const formatPrice = (price: number) => {
        return new Intl.NumberFormat('fa-IR').format(price);
    };

    const formatDate = (dateString: string) => {
        return new Date(dateString).toLocaleDateString('fa-IR');
    };

    const invoiceData = [
        {
            label: 'مهلت پرداخت',
            value: formatDate(invoice.paymentDeadline),
            isHighlighted: true
        },
        {
            label: 'عنوان سفارش کاربر',
            value: invoice.orderTitle
        },
        {
            label: 'شماره سفارش',
            value: invoice.orderNumber
        },
        {
            label: 'ویژگی ها',
            value: invoice.features
        },
        {
            label: 'نوع پکیج',
            value: invoice.packageType
        },
        {
            label: 'قیمت پایه',
            value: `${formatPrice(invoice.basePrice)} ${invoice.currency}`
        },
        {
            label: 'تخفیف',
            value: `${formatPrice(invoice.discount)} ${invoice.currency}`,
            hasDiscountBadge: true,
            discountPercentage: Math.round((invoice.discount / invoice.basePrice) * 100)
        },
        {
            label: 'تخفیف با کد ',
            value: `${formatPrice(invoice.managerDiscount)} ${invoice.currency}`,
            hasManagerDiscountBadge: true,
            managerDiscountPercentage: Math.round((invoice.managerDiscount / invoice.basePrice) * 100)
        },
        {
            label: 'تاریخ سفارش',
            value: formatDate(invoice.orderDate)
        },
        {
            label: 'تاریخ پرداخت',
            value: invoice.paymentDate ? formatDate(invoice.paymentDate) : formatDate(invoice.orderDate)
        },
        {
            label: 'مدت زمان اعتبار',
            value: formatDate(invoice.orderDate)
        },
        {
            label: 'توضیحات سفارش',
            value: invoice.orderDescription
        }
    ];

    return (
        <Dialog>
            {isOpen && (
                <>
                    <DialogOverlay onClick={onClose} />
                    <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto p-0">
                        <div className="bg-white rounded-lg shadow-xl">
                            {/* Header */}
                            <div className="flex items-center justify-between p-4">
                                <h2 className="text-lg font-bold text-gray-900">پیش نمایش</h2>
                                <div className="flex items-center gap-2">
                                  
                                    <Button
                                        variant="outline"
                                        size="sm"
                                        onClick={onClose}
                                        className="flex items-center gap-2 px-4 py-2"
                                    >
                                        <Eye className="w-4 h-4" />
                                        پیش نمایش
                                    </Button>
                                    <Button
                                        variant="ghost"
                                        size="sm"
                                        onClick={onClose}
                                        className="p-2 hover:bg-gray-100 rounded-full"
                                    >
                                        <X className="w-5 h-5" />
                                    </Button>
                                </div>
                            </div>
                            {/* Content */}
                            <div className="px-6 pt-4 pb-0">
                                <div className="border border-dashed border-[#E4E7EC] rounded-lg p-6">
                                    <div className="space-y-6">
                                        {invoiceData.map((item, index) => (
                                            <div key={index}>
                                                {/* Main row with label and value */}
                                                <div className={cn("flex items-start justify-between", item.isHighlighted && "bg-[#FECDCA] rounded-[8px]  py-2 px-3", item?.label === "توضیحات سفارش" ? "flex-col" : "flex-row")}>
                                                    {/* Right side - Label with tag */}
                                                    <div className="flex items-center gap-3">
                                                        <p className={cn("text-[#717680] text-sm font-medium leading-[140%] tracking-normal", item.isHighlighted && "text-[#D92D20]")}>
                                                            {item.label}
                                                        </p>
                                                        {/* Discount badges next to labels */}
                                                        {item.hasDiscountBadge && item.discountPercentage > 0 && (
                                                            <span className="inline-flex items-center px-2 py-1 rounded-lg text-xs font-medium text-blue-800 border border-blue-800">
                                                                {item.discountPercentage}% تخفیف
                                                            </span>
                                                        )}
                                                        {item.hasManagerDiscountBadge && item.managerDiscountPercentage > 0 && (
                                                            <span className="inline-flex items-center px-2 py-1 rounded-lg text-xs font-medium text-[#D92D20] border border-[#D92D20]">
                                                                {item.managerDiscountPercentage}% تخفیف
                                                            </span>
                                                        )}
                                                    </div>

                                                    {/* Left side - Value */}
                                                    <div className=" max-w-md">
                                                        <p className={` text-sm font-medium text-[#414651] text-right ${item.label == "مدت زمان اعتبار" ? 'text-blue-800 font-bold' : 'text-[#414651] '} ${item.isHighlighted ? 'text-[#D92D20] font-bold' : 'text-gray-900'} ${item?.label === "توضیحات سفارش" ? 'text-right text-[#A4A7AE] pt-3 text-sm' : 'text-left'}`}>
                                                            {item.value}
                                                        </p>
                                                    </div>
                                                </div>


                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </div>

                            {/* Footer */}
                            <div className="flex items-start  justify-end  gap-2 px-6 pb-2">
                                <Button
                                    variant={"info"}
                                    onClick={() => onDownload?.(invoice)}
                                    className="px-6 py-2 text-black"
                                >
                                    دانلود
                                    <Download className="w-3 h-3" />
                                </Button>
                                <Button
                                    variant="outline"
                                    onClick={onClose}
                                    className="px-6 py-2 text-black border border-[#D5D7DA]"
                                >
                                    بستن
                                </Button>
                            </div>
                        </div>
                    </DialogContent>
                </>
            )
            }
        </Dialog >
    );
};

export default InvoicePreviewModal;