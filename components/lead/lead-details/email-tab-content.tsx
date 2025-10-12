import TextInput from '@/components/shared/text-input'
import Image from 'next/image'
import React, { useState } from 'react'
import { Button } from '@/components/ui/button'
import FormMaker from '@/components/shared/form-maker'
import * as Yup from "yup";
import { useFormik } from 'formik'
export default function EmailTabContent() {
    const features = [
        'مشاهده و ارسال ایمیل‌ها مستقیم از داخل CRM',
        'ذخیره خودکار پیام‌های دریافتی و ارسالی در پروفایل درخواست',
        'یکپارچه‌سازی ارتباطات تیم فروش در یک جا',
        'صرفه‌جویی در زمان و افزایش شفافیت تیم'
    ]



    // implement form using formmaker
    const formik = useFormik({
        initialValues: {
            twEmail: ''
        },
        validationSchema: Yup.object().shape({
            twEmail: Yup.string().email('ایمیل معتبر وارد کنید').required('ایمیل الزامی است'),
        }),
        onSubmit: (values) => {
            console.log('Email submitted:', values.twEmail)
            // Add your email connection logic here
        }
    })



    return (
        <div className='bg-[#F8FAFF] flex flex-col items-end gap-4 rounded-lg p-3 md:p-4'>
            {/* Title - responsive text size */}
            <p className='text-base md:text-lg font-semibold text-[#181D27] text-right w-full'>
                صندوق ایمیل خود را به CRM متصل کنید
            </p>

            {/* Description - responsive text size and width */}
            <p className='text-xs md:text-sm text-[#637381] max-w-full xl:max-w-[550px] text-right leading-relaxed'>
                با اتصال ایمیل خود به سیستم، تمام مکاتبات با درخواست‌ها به‌صورت خودکار در CRM ذخیره می‌شود. هیچ پیام مهمی را از دست ندهید و پیگیری‌ها را هوشمندانه‌تر انجام دهید.
            </p>

            {/* Features List - responsive gap and layout */}
            <div className='flex flex-col gap-3 md:gap-4 w-full'>
                {features.map((feature, index) => (
                    <div key={index} className='flex items-center justify-end gap-2'>
                        <p className="mr-2 text-xs md:text-sm text-right flex-1">
                            {feature}
                        </p>
                        <div className="flex-shrink-0">
                            <div
                                className={`w-5 h-5 md:w-6 md:h-6 rounded-full bg-[#0B509B] flex items-center justify-center text-white text-sm font-bold`}
                            >
                                <Image
                                    src={"/icons/tick-icon.png"}
                                    alt="tick"
                                    width={1024}
                                    height={1024}
                                    className="w-2.5 h-2.5 md:w-3 md:h-3"
                                />
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            {/* Action Section - responsive layout */}
            <div className='flex flex-col sm:flex-row items-stretch sm:items-center justify-end gap-2 md:gap-3 w-full'>
                {/* Email Input - responsive width */}
                <div className="w-full sm:flex-1 xl:w-80">
                    <TextInput
                        form={formik}
                        item={{
                            className: 'text-xs md:text-sm',
                            key: 'twEmail',
                            component: 'input',
                            type: 'email',
                            placeholder: 'ایمیل خود را وارد کنید',
                            labelClassName: 'w-full xl:w-80'
                        }}
                    />
                </div>

                {/* Button - responsive sizing */}
                <Button
                    variant={'info'}
                    onClick={() => formik.handleSubmit()}
                    disabled={!formik.values.twEmail || !!formik.errors.twEmail}
                    className="w-full sm:w-auto px-3 md:px-6 py-2 text-xs md:text-sm font-medium whitespace-nowrap"
                >
                    اتصال صندوق ایمیل
                </Button>
            </div>

        </div>
    )
}