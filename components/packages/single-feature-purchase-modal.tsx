"use client";

import React, { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { Button } from '@/components/ui/button';
import { X, CheckCircle } from 'lucide-react';
import { Unit } from '@/types/packages';
import { SingleFeatureUnit } from '@/data/single-features-mock-data';

interface SingleFeaturePurchaseModalProps {
    isOpen: boolean;
    onClose: () => void;
    onComplete: (description: string) => void;
    unit: SingleFeatureUnit;
    status: "error" | "success" | "loading" | "order-details";
}

type ModalStep = 'order-details' | 'loading' | 'success' | 'error';

const SingleFeaturePurchaseModal: React.FC<SingleFeaturePurchaseModalProps> = ({
    isOpen,
    onClose,
    unit,
    onComplete,
    status
}) => {
    const [currentStep, setCurrentStep] = useState<ModalStep>('order-details');
    const [description, setDescription] = useState('');
    const [isMobile, setIsMobile] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);

    // Update currentStep based on status prop
    useEffect(() => {
        console.log('🔄 Single Feature Modal: Status changed to:', status);
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

    // Check if device is mobile
    useEffect(() => {
        const checkIsMobile = () => {
            const mobile = window.innerWidth < 768; // md breakpoint
            setIsMobile(mobile);
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
    };

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
            <div className="flex gap-3 justify-center">
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
                    درخواست خرید فیچر
                </h2>
                <Button
                    variant="transparent"
                    onClick={handleClose}
                >
                    <X className="w-5 h-5" />
                </Button>
            </div>

            {/* Feature Info */}
            <div className="bg-gray-50 rounded-lg p-4 mb-6">
                <h3 className="font-semibold text-gray-900 mb-2">{unit.name}</h3>
                {unit.description && (
                    <p className="text-sm text-gray-600 mb-2">{unit.description}</p>
                )}
                {unit.category && (
                    <p className="text-xs text-gray-500">دسته‌بندی: {unit.category.name}</p>
                )}
                <div className="mt-2 pt-2 border-t border-gray-200">
                    <div className="flex justify-between items-center">
                        <span className="text-sm text-gray-600">قیمت:</span>
                        <span className="font-semibold text-gray-900">
                            {unit.price === 0 ? 'رایگان' : `${unit.price?.toLocaleString('fa-IR')} ${unit.currency?.name || 'تومان'}`}
                        </span>
                    </div>
                    {unit.unitModel && (
                        <div className="flex justify-between items-center mt-1">
                            <span className="text-sm text-gray-600">نوع:</span>
                            <span className="text-sm text-gray-700">
                                {unit.unitModel === 'flat' ? 'خرید یکباره' :
                                    unit.unitModel === 'perDuration' ? 'اجاره زمانی' :
                                        unit.unitModel === 'perCount' ? 'بر اساس تعداد' : unit.unitModel}
                            </span>
                        </div>
                    )}
                </div>
            </div>

            {/* Description Input */}
            <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                    توضیحات درخواست
                </label>
                <textarea
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    placeholder="لطفا دلیل درخواست خود برای این فیچر را شرح دهید..."
                    className="w-full h-32 p-3 border border-gray-300 rounded-lg resize-none focus:outline-none focus:ring-2 focus:ring-blue-500 text-right"
                    dir="rtl"
                />
            </div>

            {/* Action Buttons */}
            <div className="flex gap-3 justify-end">
                <Button
                    variant="outline"
                    onClick={handleClose}
                    className="px-6 py-2"
                >
                    لغو
                </Button>
                <Button
                    variant="info"
                    onClick={handleOrderSubmit}
                    className="px-6 py-2"
                    disabled={isSubmitting || !description.trim()}
                >
                    {isSubmitting ? 'در حال ارسال...' : 'ارسال درخواست'}
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
                <Button variant="transparent" onClick={handleSuccessComplete}>
                    <X className="w-5 h-5" />
                </Button>
            </div>

            {/* Content */}
            <div className="flex flex-col items-center text-center mb-6">
                <CheckCircle className="w-16 h-16 text-green-500 mb-4" />
                <p className="text-gray-600 leading-relaxed">
                    درخواست خرید فیچر &quot;{unit.name}&quot; با موفقیت ثبت شد.
                    ادمین در اسرع وقت درخواست شما را بررسی خواهد کرد.
                </p>
            </div>

            {/* Action Button */}
            <div className="flex justify-center">
                <Button
                    variant="info"
                    onClick={handleSuccessComplete}
                    className="px-8 py-2"
                >
                    متوجه شدم
                </Button>
            </div>
        </>
    );

    // Mobile Modal
    if (isMobile) {
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
                            className="fixed left-1/2 top-1/2 w-full max-w-lg bg-white rounded-lg p-6 shadow-lg"
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

export default SingleFeaturePurchaseModal;
