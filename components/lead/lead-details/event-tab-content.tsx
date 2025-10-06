"use client";

import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { cn } from '@/lib/utils';
import {
    Calendar,
    Clock,
    MapPin,
    Bell,
    Search,
    User,
    X,
    Phone,
    MessageSquare,
    Mail,
    Users,
    Headphones,
    CheckCircle,
    AlertCircle,
    ShieldCloseIcon
} from 'lucide-react';
import { useFormik } from 'formik';
import Tag from '@/components/billing/tag';
import FormMaker, { FieldType } from '@/components/shared/form-maker';
import { FaLocationArrow } from 'react-icons/fa';


interface EventTabContentProps {
    className?: string;
}

export default function EventTabContent({ className }: EventTabContentProps) {
    const [selectedEventType, setSelectedEventType] = useState('meeting');
    const [selectedUsers, setSelectedUsers] = useState(['مینا فرجاد', 'محمد امیری']);
    const [isCompleted, setIsCompleted] = useState(false);

    const formik = useFormik({
        initialValues: {
            startDate: '۱۴۰۴/۲/۱۷',
            startTime: '۱۶:۲۳',
            endDate: '۱۴۰۴/۲/۱۷',
            endTime: '۱۷:۲۳',
            interestLevel: 'داغ',
            description: '',
            reminder: '',
            followUpResponsible: '',
            location: '',
        },
        onSubmit: (values) => {
            console.log('Event data:', values);
        },
    });


    const eventTypes = [
        { value: 'call', label: 'تماس', icon: Phone },
        { value: 'sms', label: 'پیامک', icon: MessageSquare },
        { value: 'email', label: 'ایمیل', icon: Mail },
        { value: 'meeting', label: 'جلسه', icon: Users },
        { value: 'voip', label: 'VoIP', icon: Headphones },
    ];

    const interestLevels = ['سرد', 'گرم', 'داغ'];

    const removeUser = (userToRemove: string) => {
        setSelectedUsers(users => users.filter(user => user !== userToRemove));
    };
    const handleTagClick = (tagId: string) => {
        setSelectedUsers(prev =>
            prev.includes(tagId)
                ? prev.filter(id => id !== tagId)
                : [...prev, tagId]
        );
    };
    const handleTagClose = (tagId: string) => {
        setSelectedUsers(prev => prev.filter(id => id !== tagId));
    };
    const selectedTags = [
        { id: '1', text: 'مینا فرجاد', variant: 'success', icon: <CheckCircle className="w-3 h-3" /> },
        { id: '2', text: 'محمد امیری', variant: 'warning', icon: <AlertCircle className="w-3 h-3" /> },
    ];

    return (
        <div className={cn("w-full space-y-6 p-6", className)}>
            {/* Event Type Selection */}
            <div className="space-y-3">
                <label className="text-sm font-medium">نوع رویداد</label>
                <div className="flex gap-2 flex-wrap">
                    {eventTypes.map((type) => {
                        const Icon = type.icon;
                        return (
                            <Button
                                key={type.value}
                                variant={selectedEventType === type.value ? "default" : "outline"}
                                size="sm"
                                onClick={() => setSelectedEventType(type.value)}
                                className={cn(
                                    "flex items-center gap-2 px-4 py-2 h-auto",
                                    selectedEventType === type.value
                                        ? "bg-blue-600 text-white border-blue-600"
                                        : "bg-white text-gray-700 border-gray-300 hover:bg-gray-50"
                                )}
                            >
                                <Icon className="w-4 h-4" />
                                {type.label}
                            </Button>
                        );
                    })}
                </div>
            </div>

            {/* Form Fields */}
            <FormMaker
                form={formik}
                fields={[
                    {
                        key: "startTime",
                        component: "date-time",
                        placeholder: "زمان شروع",
                        type: "text",
                        floating: true,
                        labelClassName: "w-full",
                        className: "w-full md:w-1/2",
                    },
                    {
                        key: "endDate",
                        component: "date-time",
                        placeholder: "تاریخ پایان",
                        type: "text",
                        floating: true,
                        labelClassName: "w-full",
                        className: "w-full md:w-1/2",
                    },

                    {
                        key: "location",
                        component: "input",
                        placeholder: "مکان",
                        type: "text",
                        floating: true,
                        labelClassName: "w-full",
                        className: "w-full",
                    },
                    {
                        key: "description",
                        component: "textarea",
                        placeholder: "توضیحات",
                        type: "text",
                        floating: true,
                        className: "w-full",
                    },
                    {
                        key: "followUpResponsible",
                        component: "input",
                        placeholder: "مسئول پیگیری",
                        type: "text",
                        floating: true,
                        labelClassName: "w-full",
                        className: "w-full md:w-1/2",
                    },
                    {
                        dependantKey: "reminderPreview",
                        key: "reminder",
                        component: "multi-select",
                        placeholder: "انتخاب کنید",
                        type: "text",
                        floating: true,
                        labelClassName: "w-full",
                        className: "w-full md:w-1/2",
                        options: [
                            {
                                label: "سرد",
                                value: "COLD",
                                className: "bg-static-info-light text-static-info-primary",
                                activeClassName: "border border-static-info-primary",
                            },
                            {
                                label: "گرم",
                                value: "WARM",
                                className: "bg-static-warning-light text-static-warning-primary",
                                activeClassName: "border border-static-warning-border",
                            },
                            {
                                label: "داغ",
                                value: "HOT",
                                className: "bg-static-error-light text-static-error-primary",
                                activeClassName: "border border-static-error-primary",
                            },
                            {
                                label: "داغ",
                                value: "HOT",
                                className: "bg-static-error-light text-static-error-primary",
                                activeClassName: "border border-static-error-primary",
                            },
                        ],
                    },
                    {
                        key: "reminderPreview",
                        dependantKey: "reminder",
                        component: "tag-preview",
                        className: "w-full",
                    }
                ]}
                className="flex flex-row w-full"
            />

            {/* Selected Users Tags */}
            {selectedUsers.length > 0 && (
                <div className="flex flex-wrap gap-2">
                    {selectedTags.map((user) => (
                        <Tag key={user.id} text={user.text} icon={<X className="w-3 h-3 border border-[#717680]  rounded-full mx-1 text-[#717680]" />}
                            closable={selectedTags.includes(user.id as any)}
                            onClose={() => handleTagClose(user.id)}
                            className={selectedTags.includes(user.id as any) ? 'ring-2 ring-[#717680] bg-[#F5F5F5] text-[#717680]' : 'text-[#717680] border bg-[#F5F5F5] border-[#717680]'} />
                    ))}
                </div>
            )}

            {/* Action Buttons and Checkbox */}
            <div className="flex items-center justify-between pt-4">
                {/* Action Buttons */}
                <div className="flex gap-3">
                    <Button
                        onClick={() => formik.handleSubmit()}
                        className="bg-orange-500 hover:bg-orange-600 text-white px-8 py-2"
                    >
                        ثبت تغییرات
                    </Button>
                    <Button variant="outline" className="px-8 py-2">
                        لغو
                    </Button>
                </div>

                {/* Status Toggle */}
                <div className="flex items-center space-x-2 space-x-reverse">
                    <Checkbox
                        id="completed"
                        checked={isCompleted}
                        onCheckedChange={(checked) => setIsCompleted(checked === true)}
                    />
                    <label htmlFor="completed" className="text-sm font-medium">
                        انجام شده
                    </label>
                </div>
            </div>
        </div>
    );
}
