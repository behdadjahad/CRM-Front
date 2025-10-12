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
import EventHeaderActionButtons from './lead-action-buttons';
import EventStatusCard from './event-status-card';


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
        <div className={cn("w-full space-y-4 sm:space-y-6 rounded-b-lg border border-[#D5D7DA] max-h-[calc(100vh-300px)] scrollbar-hide overflow-y-auto p-3 sm:p-4 lg:p-6", className)}>
            {/* Event Type Selection */}
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between w-full gap-3 sm:gap-0">

                <EventHeaderActionButtons
                    onSubmit={() => formik.handleSubmit()}
                    onCancel={() => formik.resetForm()}
                    isCompleted={isCompleted}
                    setIsCompleted={setIsCompleted}
                />
                  <label className="text-sm sm:text-base font-bold text-right w-full sm:w-auto">رویدادهای ثبت شده</label>
            </div>



            {/* Event Cards */}
            <div className="flex flex-col gap-3 sm:gap-4 w-full">
                <EventStatusCard type="voice" time="today" status="pending" personName="مینا فرجاد" date="۱۴۰۴/۲/۱۷" />
                <EventStatusCard type="sms" time="past" status="cancel" personName="محمد امیری" date="۱۴۰۴/۲/۱۷" />
                <EventStatusCard type="email" time="future" status="done" personName="محمد امیری" date="۱۴۰۴/۲/۱۷" />
                <EventStatusCard type="meeting" time="future" status="success" personName="محمد امیری" date="۱۴۰۴/۲/۱۷" />
                <EventStatusCard type="voip" time="future" status="success" personName="محمد امیری" date="۱۴۰۴/۲/۱۷" />
            </div>


        </div>
    );
}
