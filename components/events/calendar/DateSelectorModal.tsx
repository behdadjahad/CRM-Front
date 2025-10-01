"use client";

import React, { useState, useEffect } from "react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { FaArrowLeft, FaArrowRight } from "react-icons/fa";
import { convertDateWithTimeZone, revertDateWithTimeZone } from "@/lib/calendar";
import DateObject from "react-date-object";
import gregorian from "react-date-object/calendars/gregorian";
import persian from "react-date-object/calendars/persian";
import arabic from "react-date-object/calendars/arabic";
import gregorian_en from "react-date-object/locales/gregorian_en";
import persian_fa from "react-date-object/locales/persian_fa";
import arabic_ar from "react-date-object/locales/arabic_ar";
import { CloudCog } from "lucide-react";

interface DateSelectorModalProps {
    isOpen: boolean;
    onClose: () => void;
    onConfirm: (selectedDate: string) => void;
    currentDate: string;
    calendarType: 'jalali' | 'hijri' | 'gregory';
    rangeType: 'monthly' | 'weekly' | 'daily';
}

type ModalStep = 'year' | 'month' | 'day';

export default function DateSelectorModal({
    isOpen,
    onClose,
    onConfirm,
    currentDate,
    calendarType,
    rangeType
}: DateSelectorModalProps) {
    const [step, setStep] = useState<ModalStep>('month');
    const [selectedYear, setSelectedYear] = useState<number>();
    const [selectedMonth, setSelectedMonth] = useState<number>();
    const [selectedDay, setSelectedDay] = useState<number>();

    // Calendar configuration mapping
    const calendarConfig = {
        jalali: { calendar: persian, locale: persian_fa },
        hijri: { calendar: arabic, locale: arabic_ar },
        gregory: { calendar: gregorian, locale: gregorian_en }
    };

    const config = calendarConfig[calendarType];

    useEffect(() => {
        if (isOpen) {
            // Initialize with current date
            const currentDateObj = convertDateWithTimeZone(currentDate, calendarType);
            console.log('Modal initializing with:', {
                currentDate,
                calendarType,
                rangeType,
                parsedDate: currentDateObj
            });

            setSelectedYear(currentDateObj.year);
            setSelectedMonth(currentDateObj.month);
            setSelectedDay(currentDateObj.day);

            // Set initial step based on range type
            if (rangeType === 'monthly') {
                setStep('month');
            } else {
                // Both weekly and daily start with day selection
                setStep('day');
            }
        }
    }, [isOpen, currentDate, calendarType, rangeType]);

    const getMonthNames = () => {
        const monthNames: string[] = [];
        for (let i = 1; i <= 12; i++) {
            const dateObj = new DateObject({
                calendar: config.calendar,
                locale: config.locale,
                year: selectedYear || 1400,
                month: i,
                day: 1
            });
            monthNames.push(dateObj.format("MMMM"));
        }
        return monthNames;
    };

    const getDaysInCurrentMonth = () => {
        if (!selectedYear || !selectedMonth) return [];

        // Create DateObject for first day of month
        const firstDay = new DateObject({
            calendar: config.calendar,
            locale: config.locale,
            year: selectedYear,
            month: selectedMonth,
            day: 1
        });

        // Create DateObject for last day of month by going to next month and subtracting 1 day
        const nextMonth = firstDay.add(1, 'month').subtract(1, 'day');
        const daysInMonth = nextMonth.day;

        return Array.from({ length: daysInMonth }, (_, i) => i + 1);
    };

    const handleYearSelect = (year: number) => {
        setSelectedYear(year);
        setStep('month');
    };

    const handleMonthSelect = (month: number) => {
        setSelectedMonth(month);
        if (rangeType === 'monthly') {
            // For monthly selection, immediately confirm with the selected month
            handleConfirmWithValues(selectedYear!, month, 1);
        } else {
            setStep('day');
        }
    };

    // Helper function to confirm with specific values (handles async state issue)
    const handleConfirmWithValues = (year: number, month: number, day: number) => {
        console.log('Modal confirming with values:', { year, month, day, calendarType, rangeType });

        // Convert back to Gregorian YYYY-MM-DD format
        const selectedDateString = revertDateWithTimeZone({
            year: year,
            month: month,
            day: day
        }, calendarType);

        console.log('Modal result date:', selectedDateString);

        onConfirm(selectedDateString);
        onClose();
    };

    const handleDaySelect = (day: number) => {
        setSelectedDay(day);
        // Use the helper function to avoid async state issues
        handleConfirmWithValues(selectedYear!, selectedMonth!, day);
    };

    const handleConfirm = () => {
        if (!selectedYear || !selectedMonth) return;

        const dayToUse = rangeType === 'monthly' ? 1 : (selectedDay || 1);

        // Convert back to Gregorian YYYY-MM-DD format
        const selectedDateString = revertDateWithTimeZone({
            year: selectedYear,
            month: selectedMonth,
            day: dayToUse
        }, calendarType);

        console.log('Modal confirming date:', { year: selectedYear, month: selectedMonth, day: dayToUse, calendarType, resultDate: selectedDateString });

        onConfirm(selectedDateString);
        onClose();
    };

    const renderYearPicker = () => {
        const currentYear = selectedYear || convertDateWithTimeZone(currentDate, calendarType).year;
        const years = Array.from({ length: 21 }, (_, i) => currentYear - 10 + i);

        return (
            <div className="grid grid-cols-3 gap-2 p-4">
                {years.map(year => (
                    <button
                        key={year}
                        onClick={() => handleYearSelect(year)}
                        className={cn(
                            "p-2 rounded-lg border hover:bg-blue-50 transition-colors",
                            year === selectedYear ? "bg-blue-500 text-white" : "bg-white"
                        )}
                    >
                        {year}
                    </button>
                ))}
            </div>
        );
    };

    const renderMonthPicker = () => {
        const monthNames = getMonthNames();

        return (
            <div className="grid grid-cols-3 gap-2 p-4">
                {monthNames.map((monthName, index) => (
                    <button
                        key={index}
                        onClick={() => handleMonthSelect(index + 1)}
                        className={cn(
                            "p-2 rounded-lg border hover:bg-blue-50 transition-colors",
                            (index + 1) === selectedMonth ? "bg-blue-500 text-white" : "bg-white"
                        )}
                    >
                        {monthName}
                    </button>
                ))}
            </div>
        );
    };

    const renderDayPicker = () => {
        const days = getDaysInCurrentMonth();

        return (
            <div className="grid grid-cols-7 gap-1 p-4">
                {days.map(day => (
                    <button
                        key={day}
                        onClick={() => handleDaySelect(day)}
                        className={cn(
                            "p-2 rounded-lg border hover:bg-blue-50 transition-colors aspect-square",
                            day === selectedDay ? "bg-blue-500 text-white" : "bg-white"
                        )}
                    >
                        {day}
                    </button>
                ))}
            </div>
        );
    };

    const getHeaderTitle = () => {
        if (step === 'year') return `انتخاب سال - فعلی: ${selectedYear}`;
        if (step === 'month') {
            const monthNames = getMonthNames();
            const currentMonthName = selectedMonth ? monthNames[selectedMonth - 1] : '';
            return `${selectedYear} - ${currentMonthName || 'انتخاب ماه'}`;
        }
        const monthNames = getMonthNames();
        const currentMonthName = selectedMonth ? monthNames[selectedMonth - 1] : '';
        return `${currentMonthName} ${selectedYear} - انتخاب روز`;
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg shadow-xl max-w-md w-full mx-4" dir="rtl">
                {/* Header */}
                <div className="flex items-center justify-between p-4 border-b">
                    <button onClick={() => setStep('year')} className="hover:bg-gray-100 px-2 py-1 rounded cursor-pointer transition-colors">
                        سال
                    </button>
                    <h2
                        onClick={() => setStep('month')}
                        className="text-lg font-medium hover:bg-gray-100 px-2 py-1 rounded cursor-pointer transition-colors"
                    >
                        {getHeaderTitle()}
                    </h2>
                    <button onClick={() => setStep('month')} className="hover:bg-gray-100 px-2 py-1 rounded cursor-pointer transition-colors">
                        ماه
                    </button>
                </div>

                {/* Content */}
                <div className="min-h-[300px]">
                    {step === 'year' && renderYearPicker()}
                    {step === 'month' && renderMonthPicker()}
                    {step === 'day' && renderDayPicker()}
                </div>

                {/* Footer */}
                <div className="flex gap-2 p-4 border-t">
                    <Button variant="outline" onClick={onClose} className="flex-1">
                        لغو
                    </Button>
                    <Button onClick={handleConfirm} className="flex-1">
                        تایید
                    </Button>
                </div>
            </div>
        </div>
    );
}
