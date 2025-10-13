"use client";

import React, { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { Button } from '@/components/ui/button';
import { Sheet, SheetOverlay, SheetContent } from '@/components/ui/sheet';
import { Dialog, DialogOverlay, DialogContent } from '@/components/ui/dialog';
import { X, CheckCircle, FileText } from 'lucide-react';
import { Package } from '@/types/packages';
import { useRouter } from 'next/navigation';

interface PurchaseFlowModalProps {
    isOpen: boolean;
    onClose: () => void;
    onComplete: (description: string) => void;
    packageName?: string;
    data: Package;
    status: "error" | "success" | "loading" | "order-details";
}

type ModalStep = 'order-details' | 'loading' | 'success' | 'error';

const PurchaseFlowModal: React.FC<PurchaseFlowModalProps> = ({
    isOpen,
    onClose,
    data,
    onComplete,

    status
}) => {
    const router = useRouter();
    const [currentStep, setCurrentStep] = useState<ModalStep>('order-details');
    const [description, setDescription] = useState('');
    const [isMobile, setIsMobile] = useState(false);

    // Update currentStep based on status prop
    useEffect(() => {
        console.log('🔄 Modal: Status changed to:', status);
        if (status === 'loading') {
            setCurrentStep('loading');
        } else if (status === 'success') {
            setCurrentStep('success');
        } else if (status === 'error') {
            setCurrentStep('error');
        } else {
            setCurrentStep('order-details');
        }
    }, [status]);
    const [isSubmitting, setIsSubmitting] = useState(false);

    // Check if device is mobile
    useEffect(() => {
        console.log('Purchase Flow Modal data:', data);
        const checkIsMobile = () => {
            const mobile = window.innerWidth < 768; // md breakpoint
            setIsMobile(mobile);
            console.log('Mobile detection:', mobile, 'Width:', window.innerWidth);
        };

        checkIsMobile();
        window.addEventListener('resize', checkIsMobile);

        return () => window.removeEventListener('resize', checkIsMobile);
    }, []);


    const handleOrderSubmit = async () => {

        if (isSubmitting) return; // Prevent multiple calls

        setIsSubmitting(true);
        await onComplete(description);
        setIsSubmitting(false);
    }


    // Prevent body scroll when modal is open
    useEffect(() => {
        if (isOpen) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = '';
        }

        return () => {
            document.body.style.overflow = '';
        };
    }, [isOpen]);

    const handleClose = () => {

        console.log('Purchase Flow Modal data:', data);
        setDescription('');
        setCurrentStep('order-details');
        onClose();
    };



    const handleSuccessComplete = () => {
        setDescription('');
        setCurrentStep('order-details');
        onClose();
    };
    const renderLoadingStep = () => (
        <>
            <div className="flex items-center justify-between mb-6">
                <h2 className="text-lg font-bold text-gray-900">
                    در حال ارسال درخواست...
                </h2>
            </div>
            <div className="flex flex-col items-center text-center mb-6">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mb-4"></div>
                <p className="text-gray-600">لطفا صبر کنید...</p>
            </div>
        </>
    );
    const renderErrorStep = () => (
        <>
            <div className="flex items-center justify-center mb-6">
                <h2 className="text-base font-bold text-red-600">
                    خطا در ارسال درخواست
                </h2>
            </div>
            <div className="flex flex-col items-center text-center mb-6">
                <X className="w-16 h-16 text-red-500 mb-4" />
                <p className="text-gray-600">
                    متاسفانه خطایی رخ داد. لطفا دوباره تلاش کنید.
                </p>
            </div>
            <div className="flex gap-3  justify-center">
                <Button onClick={() => setCurrentStep('order-details')}>
                    تلاش مجدد
                </Button>
                <Button variant="outline" className='text-black border-black px-7' onClick={handleClose}>
                    بستن
                </Button>
            </div>
        </>
    );


    const renderOrderDetailsStep = () => (
        <>
            {/* Header */}
            <div className="flex items-center justify-between mb-6">
                <h2 className="text-lg font-bold text-gray-900">
                    توضیحات سفارش
                </h2>
                <Button
                    variant={"transparent"}
                    onClick={handleClose}
                    className=""
                >
                    <X className="w-5 h-5" />
                </Button>
            </div>

            {/* Content */}
            <div className="mb-6">
                <textarea
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    placeholder="لطفا متن توضیحات خود را تایپ کنید....."
                    className="w-full h-32 p-3 border border-gray-300 rounded-lg resize-none focus:outline-none focus:ring-2t text-right"
                    dir="rtl"
                />
            </div>

            {/* Action Buttons */}
            <div className="flex gap-3 justify-end">
                <Button
                    variant="info"
                    onClick={handleClose}
                    className="px-6 py-2"
                >
                    لغو
                </Button>
                <Button
                    variant={"info"}
                    onClick={handleOrderSubmit}
                    className="px-6 py-2"
                    disabled={isSubmitting}
                >
                    {isSubmitting ? 'در حال ارسال...' : 'ارسال'}
                </Button>
            </div>
        </>
    );

    const renderSuccessStep = () => (
        <>
            {/* Header */}
            <div className="flex items-center justify-between mb-6">
                <h2 className="text-lg font-bold text-gray-900">
                    درخواست شما با موفقیت ثبت شد
                </h2>
                <Button variant={"transparent"}
                    onClick={handleSuccessComplete}

                >
                    <X className="w-5 h-5" />
                </Button>
            </div>

            {/* Content */}
            <div className="flex flex-col items-center text-center mb-6">
                <CheckCircle className="w-16 h-16 text-green-500 mb-4" />
                <p className="text-gray-600 leading-relaxed mb-4">
                    درخواست شما با موفقیت ثبت شد و فاکتور شما ایجاد شده است.
                </p>
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-4">
                    <div className="flex items-center justify-center gap-2 mb-2">
                        <FileText className="w-5 h-5 text-blue-600" />
                        <span className="text-sm font-medium text-blue-800">فاکتور ایجاد شد</span>
                    </div>
                    <p className="text-xs text-blue-700">
                        می‌توانید فاکتور خود را در صفحه فاکتورها مشاهده کنید
                    </p>
                </div>
            </div>

            {/* Action Buttons */}
            <div className="flex gap-3 justify-center">
                <Button
                    variant="outline"
                    onClick={handleSuccessComplete}
                    className="px-6 py-2 border-gray-300 text-gray-700"
                >
                    بستن
                </Button>
                <Button
                    variant={"info"}
                    onClick={() => {
                        router.push('/invoice');
                        handleSuccessComplete();
                    }}
                    className="px-6 py-2"
                >
                    مشاهده فاکتور
                </Button>
            </div>
        </>
    );

    // Mobile Modal (same as desktop)
    if (isMobile) {
        console.log('Rendering mobile modal, isOpen:', isOpen);
        if (typeof window !== 'undefined') {
            return createPortal(
                <>
                    {/* Only render when open */}
                    {isOpen && (
                        <div className="fixed inset-0 z-50 md:hidden">
                            {/* Backdrop - covers entire screen */}
                            <div
                                className="fixed inset-0 bg-black/50"
                                onClick={handleClose}
                            />

                            {/* Modal Content - centered like desktop */}
                            <div
                                className="fixed left-1/2 top-1/2 w-full max-w-md bg-white rounded-lg p-6 shadow-lg mx-4"
                                style={{
                                    transform: 'translate(-50%, -50%)',
                                    zIndex: 51,
                                    position: 'fixed',
                                    left: '50%',
                                    top: '50%',
                                }}
                            >
                                {currentStep === 'order-details' && renderOrderDetailsStep()}
                                {currentStep === 'loading' && renderLoadingStep()}
                                {currentStep === 'error' && renderErrorStep()}
                                {currentStep === 'success' && renderSuccessStep()}
                            </div>
                        </div>
                    )}
                </>,
                document.body
            );
        }
        return null;
    }

    // Desktop Modal
    if (typeof window !== 'undefined') {
        return createPortal(
            <>
                {/* Only render when open */}
                {isOpen && (
                    <div className="fixed inset-0 z-50 hidden md:block">
                        {/* Backdrop */}
                        <div
                            className="fixed inset-0 bg-black/50"
                            onClick={handleClose}
                        />
                        <div
                            className="fixed left-1/2 top-1/2 w-full max-w-md bg-white rounded-lg p-6 shadow-lg"
                            style={{
                                transform: 'translate(-50%, -50%)',
                                zIndex: 51,
                                position: 'fixed',
                                left: '50%',
                                top: '50%',
                            }}
                        >
                            {currentStep === 'order-details' && renderOrderDetailsStep()}
                            {currentStep === 'loading' && renderLoadingStep()}
                            {currentStep === 'error' && renderErrorStep()}
                            {currentStep === 'success' && renderSuccessStep()}
                        </div>
                    </div>
                )}
            </>,
            document.body
        );
    }

    return null;
};

export default PurchaseFlowModal;
