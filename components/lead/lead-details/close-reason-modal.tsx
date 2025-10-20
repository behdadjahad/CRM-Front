"use client";

import React, { useState } from 'react';
import { X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import FormMaker from '@/components/shared/form-maker';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { Checkbox } from '@/components/ui/checkbox';

interface CloseReasonModalProps {
    isOpen: boolean;
    onClose: () => void;
    onConfirm: (selectedReasons: string[], otherReason?: string) => void;
}

const CLOSE_REASONS = [
    "بودجه ناکافی",
    "انتخاب رقیب دیگر",
    "عدم نیاز واقعی",
    "زمان بندی نامناسب",
    "پاسخ گو نبودن شخص درخواست دهنده",
    "درخواست دهنده اصلی در دسترس نبود",
    "پروسه تصمیم گیری به تعویق افتاد",
    "دموی ارائه شده قانع کننده نبود",
    "مشکل در اعتماد",
    "مشکل در پشتیبانی یا خدمات جانبی",
    "به دلیل مسائل داخلی سازمان",
    "نیاز به سفارشی سازی زیاد داشت که ارائه نشد",
    "سایر"
];

export default function CloseReasonModal({
    isOpen,
    onClose,
    onConfirm
}: CloseReasonModalProps) {
    // Formik form for checkbox reasons and other reason input
    const formik = useFormik({
        initialValues: {
            selectedReasons: [] as string[],
            otherReason: ''
        },
        validationSchema: Yup.object().shape({
            selectedReasons: Yup.array().min(1, 'حداقل یک دلیل باید انتخاب شود'),
            otherReason: Yup.string().when('selectedReasons', {
                is: (selectedReasons: string[]) => selectedReasons?.includes('سایر'),
                then: (schema) => schema.required('دلیل باید مشخص شود'),
                otherwise: (schema) => schema.notRequired()
            })
        }),
        onSubmit: (values) => {
            const finalOtherReason = values.selectedReasons.includes("سایر") ? values.otherReason : undefined;
            onConfirm(values.selectedReasons, finalOtherReason);
            handleClose();
        }
    });

    const handleClose = () => {
        formik.resetForm();
        onClose();
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
            {/* Backdrop */}
            <div
                className="fixed inset-0 bg-black/50"
                onClick={handleClose}
            />

            {/* Modal */}
            <div className="relative bg-white rounded-lg shadow-lg w-full max-w-md mx-4">
                {/* Header */}
                <div className="flex items-center justify-end p-6 pb-4">

                    <button
                        onClick={handleClose}
                        className="p-1 hover:bg-gray-100 rounded-full transition-colors"
                    >
                        <X className="w-6 h-6 text-gray-500" />
                    </button>
                </div>

                {/* Content */}
                <div className="px-6 pb-6">
                    <h2 className="text-xl text-center mb-4 font-bold text-gray-900">
                        علت بستن درخواست
                    </h2>
                    {/* Instruction Text */}
                    <p className="text-base text-[#637381] mb-6 text-center leading-relaxed">
                        کاربر گرامی لطفا برای پیگیری بهتر درخواستها در آینده علت بستن درخواست را مشخص نمایید.
                    </p>

                    {/* Reasons List */}
                    <div className="mb-6">
                        <div className="space-y-3">
                            {CLOSE_REASONS.map((reason, index) => (
                                <div key={index} className="flex items-center justify-between space-x-3 space-x-reverse">

                                    <Checkbox
                                        id={`reason-${index}`}
                                        checked={formik.values.selectedReasons.includes(reason)}
                                        onCheckedChange={(checked) => {
                                            const previousList = formik.values.selectedReasons;
                                            if (checked) {
                                                formik.setFieldValue('selectedReasons', [...previousList, reason]);
                                            } else {
                                                const newList = previousList.filter((item: string) => item !== reason);
                                                formik.setFieldValue('selectedReasons', newList);
                                            }
                                        }}
                                    />
                                    <label
                                        htmlFor={`reason-${index}`}
                                        className="text-base text-[#1E1E1E] cursor-pointer leading-relaxed flex-1 text-right"
                                    >
                                        {reason}
                                    </label>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Other Reason Input */}
                    {formik.values.selectedReasons.includes("سایر") && (
                        <div className="mb-6">
                            <FormMaker
                                form={formik}
                                fields={[
                                    {
                                        key: "otherReason",
                                        component: "input",
                                        type: "text",
                                        placeholder: "دلیل خود را بنویسید....",
                                        className: "w-full",
                                        labelClassName: "w-full"
                                    }
                                ]}
                                className="flex flex-col w-full"
                            />
                        </div>
                    )}

                    {/* Action Buttons */}
                    <div className="flex justify-between space-x-3 space-x-reverse">

                        <Button
                            variant={"info"}
                            onClick={() => formik.handleSubmit()}
                            disabled={formik.values.selectedReasons.length === 0 || (formik.values.selectedReasons.includes("سایر") && !formik.values.otherReason.trim())}
                            className="px-6 w-full text-black border-0"
                        >
                            بله مطمئنم
                        </Button>
                        <Button
                            variant="foreground"
                            size="sm"
                            onClick={handleClose}
                            className="px-6 w-full"
                        >
                            لغو
                        </Button>
                    </div>
                </div>
            </div>
        </div>
    );
}
