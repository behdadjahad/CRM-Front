"use client";

import React, { useState, useEffect } from "react";
import DateSelector from "./DateSelector";
import { calculateWeekRange } from "@/lib/calendar-modal-utils";
import { convertDateWithTimeZone } from "@/lib/calendar";
import DateObject from "react-date-object";
import gregorian from "react-date-object/calendars/gregorian";
import persian from "react-date-object/calendars/persian";
import arabic from "react-date-object/calendars/arabic";
import gregorian_en from "react-date-object/locales/gregorian_en";
import persian_fa from "react-date-object/locales/persian_fa";
import arabic_ar from "react-date-object/locales/arabic_ar";

export default function DateSelectorExample() {
    const [selectedDate, setSelectedDate] = useState<string>("");
    const [rangeType, setRangeType] = useState<'monthly' | 'weekly' | 'daily'>('monthly');
    const [calendarType, setCalendarType] = useState<'jalali' | 'hijri' | 'gregory'>('jalali');
    const [showDateSelector, setShowDateSelector] = useState<boolean>(false);
    const [currentDate, setCurrentDate] = useState<string>("");

    // Get today's date in YYYY-MM-DD format  
    const today = new Date().toISOString().split('T')[0];

    // Function to convert Gregorian date to user's selected calendar format for display
    const formatDateForDisplay = (gregorianDate: string, targetCalendarType: 'jalali' | 'hijri' | 'gregory') => {
        try {
            // Parse Gregorian date (YYYY-MM-DD)
            const dateParts = gregorianDate.split('-');
            if (dateParts.length !== 3) return gregorianDate;

            const [year, month, day] = dateParts.map(Number);

            // Create Gregorian DateObject
            const gregorianDateObj = new DateObject({
                year,
                month,
                day,
                calendar: gregorian,
                locale: gregorian_en
            });

            // Convert to target calendar
            let convertedDate;
            if (targetCalendarType === 'jalali') {
                convertedDate = gregorianDateObj.convert(persian);
                convertedDate.locale = persian_fa;
                return convertedDate.format('DD MMMM YYYY'); // e.g., "15 مهر 1403"
            } else if (targetCalendarType === 'hijri') {
                convertedDate = gregorianDateObj.convert(arabic);
                convertedDate.locale = arabic_ar;
                return convertedDate.format('DD MMMM YYYY'); // e.g., "15 ربیع الثانی 1446"
            } else { // gregory
                return gregorianDateObj.format('DD MMMM YYYY'); // e.g., "15 October 2024"
            }
        } catch (error) {
            console.error('Error formatting date for display:', error);
            return gregorianDate; // fallback to original date
        }
    };

    // Initialize current date on component mount
    useEffect(() => {
        setCurrentDate(today);
    }, [today]);

    // Automatically show date selector when range type changes
    useEffect(() => {
        console.log('Range type changed to:', rangeType);
        setShowDateSelector(true);
        // Reset currentDate to today when switching views
        setCurrentDate(today);
    }, [rangeType, today]);

    const handleDateSelect = (date: string, selectedRangeType: 'monthly' | 'weekly' | 'daily') => {
        console.log('Date selected (Gregorian):', { date, selectedRangeType, calendarType });

        if (selectedRangeType === 'weekly') {
            // Calculate week range that contains the selected day (dates are in Gregorian)
            const weekRange = calculateWeekRange(date, calendarType);
            console.log('Week range calculated:', weekRange);

            // Format both start and end dates for display in user's calendar
            const startDateDisplay = formatDateForDisplay(weekRange.start, calendarType);
            const endDateDisplay = formatDateForDisplay(weekRange.end, calendarType);

            setSelectedDate(`📅 هفته: ${startDateDisplay} تا ${endDateDisplay}`);
            setCurrentDate(date); // Update current date to selected date
        } else if (selectedRangeType === 'monthly') {
            console.log('Selected month for date:', date);

            // Format the selected month for display in user's calendar
            const monthDisplay = formatDateForDisplay(date, calendarType);
            console.log('Month display:', monthDisplay);

            setSelectedDate(`📅 ماه انتخاب شده: ${monthDisplay}`);
            setCurrentDate(date); // Update current date to selected month
        } else {
            console.log('Selected day:', date);

            // Format the selected day for display in user's calendar
            const dayDisplay = formatDateForDisplay(date, calendarType);

            setSelectedDate(`📅 روز انتخاب شده: ${dayDisplay} (نمایش 24 ساعته)`);
            setCurrentDate(date); // Update current date to selected day
        }

        // Hide the date selector after selection
        setShowDateSelector(false);
    };

    const handleCancel = () => {
        console.log('Selection cancelled');
        setShowDateSelector(false);
    };

    const handleRangeTypeChange = (newRangeType: 'monthly' | 'weekly' | 'daily') => {
        setRangeType(newRangeType);
        // The useEffect above will automatically trigger showDateSelector
    };

    const getRangeTypeLabel = () => {
        switch (rangeType) {
            case 'monthly': return 'ماهانه';
            case 'weekly': return 'هفتگی';
            case 'daily': return 'روزانه';
            default: return 'نامشخص';
        }
    };

    return (
        <div className="max-w-2xl mx-auto p-6" dir="rtl">
            <h1 className="text-2xl font-bold mb-6">آزمایش انتخاب‌گر تاریخ</h1>

            {/* Controls */}
            <div className="mb-6 p-4 border rounded-lg bg-gray-50">
                <div className="flex flex-col gap-4">
                    <div>
                        <label className="block text-sm font-medium mb-2">نوع نمایش:</label>
                        <select
                            value={rangeType}
                            onChange={(e) => handleRangeTypeChange(e.target.value as any)}
                            className="border rounded px-3 py-2"
                        >
                            <option value="monthly">ماهانه</option>
                            <option value="weekly">هفتگی</option>
                            <option value="daily">روزانه</option>
                        </select>
                    </div>

                    <div>
                        <label className="block text-sm font-medium mb-2">نوع تقویم:</label>
                        <select
                            value={calendarType}
                            onChange={(e) => setCalendarType(e.target.value as any)}
                            className="border rounded px-3 py-2"
                        >
                            <option value="jalali">شمسی (جلالی)</option>
                            <option value="hijri">قمری (هجری)</option>
                            <option value="gregory">میلادی (گرگوریان)</option>
                        </select>
                    </div>
                </div>
            </div>

            {/* Current View Info */}
            <div className="mb-6 p-4 border rounded-lg bg-blue-50 border-blue-200">
                <div className="flex justify-between items-center">
                    <div>
                        <h3 className="font-medium text-blue-800">نمایش فعلی: {getRangeTypeLabel()}</h3>
                        <p className="text-sm text-blue-600">
                            تاریخ فعلی: {currentDate ? formatDateForDisplay(currentDate, calendarType) : ''}
                        </p>
                        <p className="text-xs text-blue-500">
                            (میلادی: {currentDate})
                        </p>
                    </div>
                    <div className="flex items-center gap-3">
                        <button
                            onClick={() => setShowDateSelector(true)}
                            className="px-3 py-1 text-sm bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors"
                            disabled={showDateSelector}
                        >
                            📅 انتخاب تاریخ
                        </button>
                        <div className="text-sm text-blue-600">
                            {showDateSelector ? "🔄 در انتظار انتخاب..." : "✅ آماده"}
                        </div>
                    </div>
                </div>
            </div>

            {/* Date Selector - Only show when triggered */}
            {showDateSelector && (
                <div className="border rounded-lg p-4 mb-6 bg-white shadow-lg border-orange-200">
                    <div className="mb-3 p-2 bg-orange-50 rounded border-l-4 border-orange-400">
                        <h4 className="font-medium text-orange-800">انتخاب تاریخ برای نمایش {getRangeTypeLabel()}</h4>
                        <p className="text-sm text-orange-600">
                            {rangeType === 'monthly' && "ماه مورد نظر را انتخاب کنید"}
                            {rangeType === 'weekly' && "روز مورد نظر را انتخاب کنید (هفته محاسبه خواهد شد)"}
                            {rangeType === 'daily' && "روز مورد نظر برای نمایش 24 ساعته را انتخاب کنید"}
                        </p>
                    </div>
                    <DateSelector
                        currentDate={currentDate || today}
                        calendarType={calendarType}
                        rangeType={rangeType}
                        onDateSelect={handleDateSelect}
                        onCancel={handleCancel}
                    />
                </div>
            )}

            {/* Result */}
            {selectedDate && (
                <div className="p-4 bg-green-50 border border-green-200 rounded-lg">
                    <h3 className="font-medium text-green-800 mb-2">نتیجه انتخاب:</h3>
                    <p className="text-green-700">{selectedDate}</p>
                </div>
            )}
        </div>
    );
}
