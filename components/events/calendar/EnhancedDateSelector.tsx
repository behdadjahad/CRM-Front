"use client";

import React, { useState, useEffect } from "react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { convertDateWithTimeZone, revertDateWithTimeZone } from "@/lib/calendar";
import { calculateWeekRange } from "@/lib/calendar-modal-utils";
import DateObject from "react-date-object";
import gregorian from "react-date-object/calendars/gregorian";
import persian from "react-date-object/calendars/persian";
import arabic from "react-date-object/calendars/arabic";
import gregorian_en from "react-date-object/locales/gregorian_en";
import persian_fa from "react-date-object/locales/persian_fa";
import arabic_ar from "react-date-object/locales/arabic_ar";

interface EnhancedDateSelectorProps {
    currentDate: string; // Gregorian YYYY-MM-DD format
    calendarType: 'jalali' | 'hijri' | 'gregory';
    rangeType: 'monthly' | 'weekly' | 'daily';
    onDateSelect: (selectedDate: string, rangeType: 'monthly' | 'weekly' | 'daily') => void;
    onCancel?: () => void;
    className?: string;
}

type NavigationStep = 'year' | 'month' | 'day';

export default function EnhancedDateSelector({
    currentDate,
    calendarType,
    rangeType,
    onDateSelect,
    onCancel,
    className = ""
}: EnhancedDateSelectorProps) {
    const [step, setStep] = useState<NavigationStep>('month');
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

    // Initialize with current date and set appropriate step based on range type
    useEffect(() => {
        const currentDateObj = convertDateWithTimeZone(currentDate, calendarType);
        console.log('EnhancedDateSelector initializing:', {
            currentDate,
            calendarType,
            rangeType,
            parsedDate: currentDateObj
        });

        setSelectedYear(currentDateObj.year);
        setSelectedMonth(currentDateObj.month);
        setSelectedDay(currentDateObj.day);

        // Set initial step based on range type - as per requirements
        if (rangeType === 'monthly') {
            setStep('month'); // Start with month selection for monthly view
        } else {
            setStep('day'); // Start with day selection for weekly/daily views
        }
    }, [currentDate, calendarType, rangeType]);

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

        const firstDay = new DateObject({
            calendar: config.calendar,
            locale: config.locale,
            year: selectedYear,
            month: selectedMonth,
            day: 1
        });

        const nextMonth = firstDay.add(1, 'month').subtract(1, 'day');
        const daysInMonth = nextMonth.day;

        return Array.from({ length: daysInMonth }, (_, i) => i + 1);
    };

    const handleYearSelect = (year: number) => {
        console.log('Year selected:', year);
        setSelectedYear(year);
        setStep('month'); // Always go to month selection after year
    };

    const handleMonthSelect = (month: number) => {
        console.log('Month selected:', month);
        setSelectedMonth(month);

        if (rangeType === 'monthly') {
            // For monthly selection, confirm immediately after month selection
            handleConfirmWithValues(selectedYear!, month, 1);
        } else {
            // For weekly/daily, show days of the selected month
            setStep('day');
        }
    };

    const handleDaySelect = (day: number) => {
        console.log('Day selected:', day);
        setSelectedDay(day);
        // Confirm selection immediately after day selection
        handleConfirmWithValues(selectedYear!, selectedMonth!, day);
    };

    // Helper function to confirm with specific values (handles async state issue)
    const handleConfirmWithValues = (year: number, month: number, day: number) => {
        console.log('Confirming selection with values:', { year, month, day, calendarType, rangeType });

        // Convert back to Gregorian YYYY-MM-DD format
        const selectedDateString = revertDateWithTimeZone({
            year: year,
            month: month,
            day: day
        }, calendarType);

        console.log('Final selected date:', selectedDateString);
        onDateSelect(selectedDateString, rangeType);
    };

    const getHeaderTitle = () => {
        const monthNames = getMonthNames();

        if (step === 'year') {
            return `انتخاب سال - سال فعلی: ${selectedYear}`;
        } else if (step === 'month') {
            return `${selectedYear} - انتخاب ماه`;
        } else { // day
            const currentMonthName = selectedMonth ? monthNames[selectedMonth - 1] : '';
            return `${currentMonthName} ${selectedYear}`;
        }
    };

    const getContextualInfo = () => {
        if (rangeType === 'monthly') {
            return "ماه مورد نظر را انتخاب کنید";
        } else if (rangeType === 'weekly') {
            return "روز مورد نظر را انتخاب کنید (هفته شامل این روز محاسبه خواهد شد)";
        } else {
            return "روز مورد نظر برای نمایش 24 ساعته را انتخاب کنید";
        }
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
                            "p-3 rounded-lg border hover:bg-blue-50 transition-colors text-center",
                            year === selectedYear ? "bg-blue-500 text-white border-blue-500" : "bg-white border-gray-200"
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
                            "p-3 rounded-lg border hover:bg-blue-50 transition-colors text-center",
                            (index + 1) === selectedMonth ? "bg-blue-500 text-white border-blue-500" : "bg-white border-gray-200"
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
                            "p-2 rounded-lg border hover:bg-blue-50 transition-colors aspect-square text-center",
                            day === selectedDay ? "bg-blue-500 text-white border-blue-500" : "bg-white border-gray-200"
                        )}
                    >
                        {day}
                    </button>
                ))}
            </div>
        );
    };

    return (
        <div className={`flex flex-col w-full ${className}`} dir="rtl">
            {/* Context Info */}
            <div className="mb-4 p-3 bg-gray-50 rounded-lg">
                <p className="text-sm text-gray-700">{getContextualInfo()}</p>
            </div>

            {/* Navigation Header - Month and Year clickable as per requirements */}
            <div className="flex items-center justify-between p-4 border-b bg-gray-50">
                <button
                    onClick={() => setStep('year')}
                    className="hover:bg-gray-200 px-3 py-1 rounded cursor-pointer transition-colors text-blue-600 font-medium"
                >
                    سال
                </button>

                <h2 className="text-lg font-medium text-gray-800">
                    {getHeaderTitle()}
                </h2>

                <button
                    onClick={() => setStep('month')}
                    className="hover:bg-gray-200 px-3 py-1 rounded cursor-pointer transition-colors text-blue-600 font-medium"
                >
                    ماه
                </button>
            </div>

            {/* Content Area */}
            <div className="min-h-[350px] bg-white">
                {step === 'year' && renderYearPicker()}
                {step === 'month' && renderMonthPicker()}
                {step === 'day' && renderDayPicker()}
            </div>

            {/* Action Buttons */}
            <div className="flex gap-2 p-4 border-t bg-gray-50">
                {onCancel && (
                    <Button variant="outline" onClick={onCancel} className="flex-1">
                        لغو
                    </Button>
                )}
                <Button
                    variant="default"
                    onClick={() => {
                        // Manual confirm button (though auto-selection also works)
                        if (selectedYear && selectedMonth) {
                            const dayToUse = rangeType === 'monthly' ? 1 : (selectedDay || 1);
                            handleConfirmWithValues(selectedYear, selectedMonth, dayToUse);
                        }
                    }}
                    className="flex-1"
                    disabled={!selectedYear || !selectedMonth}
                >
                    تایید
                </Button>
            </div>

            {/* Debug Info */}
            <div className="mt-2 p-2 bg-gray-100 rounded text-xs text-gray-600">
                <div>Step: {step} | Year: {selectedYear} | Month: {selectedMonth} | Day: {selectedDay}</div>
                <div>Range Type: {rangeType} | Calendar: {calendarType}</div>
            </div>
        </div>
    );
}
