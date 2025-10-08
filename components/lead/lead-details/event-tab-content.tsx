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
    ShieldCloseIcon,
    SettingsIcon,
    PersonStanding,
    PersonStandingIcon,
    User2,
    MenuIcon
} from 'lucide-react';
import { useFormik } from 'formik';

import FormMaker, { FieldType } from '@/components/shared/form-maker';
import { FaLocationArrow, FaMapMarkerAlt, FaSnapchatGhost, FaTag, FaTags, FaThLarge, FaUser, FaUserAlt, FaUserAltSlash } from 'react-icons/fa';
import LeadActionButtons from './lead-action-buttons';
import { MdLocationCity } from 'react-icons/md';


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
                        dependantKey: "startTimeType",
                        outerIcon: <Clock className="w-5 h-5 text-[#B6BCC2]" />,
                        key: "startTime",
                        component: "date-time",
                        placeholder: "تاریخ و زمان شروع",
                        type: "text",
                        floating: true,
                        labelClassName: "w-full",
                        className: "w-full md:w-1/2",
                    },
                    {
                        dependantKey: "endDateType",
                        key: "endDate",
                        component: "date-time",
                        placeholder: "تاریخ و زمان پایان",
                        type: "text",
                        floating: true,
                        labelClassName: "w-full",
                        className: "w-full pl-5  md:w-1/2",
                    },
                    {
                        outerIcon: <FaTag stroke="white" className="w-5 h-5 text-[#B6BCC2]" />,
                        key: "temparetureInput",
                        dependantKey: "temparetureType",
                        component: "Select",
                        placeholder: "میزان علاقه‌مندی",
                        type: "text",
                        floating: true,
                        labelClassName: "w-full",
                        className: "w-full",
                        options: interestLevels.map(level => ({
                            label: level,
                            value: level,
                        })),
                    },
                    {
                        outerIcon: <FaMapMarkerAlt className="w-5 h-5 text-[#B6BCC2]" />,
                        key: "location",
                        component: "input",
                        placeholder: "مکان",
                        type: "text",
                        floating: true,
                        labelClassName: "w-full",
                        className: "w-full",
                    },
                    {
                        outerIcon: <MenuIcon className="w-5 h-5 self-start text-[#B6BCC2]" />,
                        key: "description",
                        component: "textarea",
                        placeholder: "متن توضیحات ",
                        type: "text",
                        floating: true,
                        className: "w-full ",
                    },
                    {
                        outerIcon: <User2 className="w-5 h-5 text-[#B6BCC2]" />,
                        key: "followUpResponsible",
                        component: "input",
                        placeholder: "مسئول پیگیری",
                        type: "text",
                        floating: true,
                        labelClassName: "w-full",
                        className: "w-full",
                    },
                    {
                        dependantKey: "personSearchPreview",
                        key: "personSearch",
                        component: "multi-select",
                        placeholder: "جستجوی شخص",
                        type: "text",
                        floating: true,
                        labelClassName: "w-full",
                        className: "w-full mr-8",
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
                        key: "personSearchPreview",
                        dependantKey: "person",
                        component: "tag-preview",
                        className: "w-full",
                    },

                ]}
                className="flex flex-row-reverse w-full"
            />

            <LeadActionButtons
                onSubmit={() => formik.handleSubmit()}
                onCancel={() => formik.resetForm()}
                isCompleted={isCompleted}
                setIsCompleted={setIsCompleted}
            />


        </div>
    );
}
