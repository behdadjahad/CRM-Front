"use client";
import React, { useEffect, useState } from 'react'
import { ArrowLeft, ArrowRight } from 'lucide-react';
import {
    convertDateWithTimeZone,
    revertDateWithTimeZone,
    getCalendarInfo,
    weekdaysMap,
    getTodayInGregorianYMD,
    generateWeekVisibleRange
} from '@/lib/calendar';

import { cn } from '@/lib/utils';
import PopUp from '@/components/ui/popup';
import { Button } from '@/components/ui/button';
// Required result format for the stepper
export type DateSelectorResult =
    | { type: 'monthly', start: string }                    // start = first day of selected month
    | { type: 'weekly', start: string, end: string }        // week range (both strings)
    | { type: 'daily', start: string }                      // exact day (start of day)

interface DateSelectorStepperProps {
    rangeType: "weekly" | "monthly" | "daily";
    calendarType: "jalali" | "hijri" | "gregory";
    currentDate: string | Date | any; // Allow more flexible types to handle parent passing objects
    isOpen?: boolean; // optional; parent can mount/unmount instead
    onCancel: () => void;
    onConfirm: (result: DateSelectorResult) => void;
    setCurrentDate: (date: string | Date | any) => void;
}

type selectorSteps = "year" | "month" | "day";


export default function DateSelectorStepper({ currentDate, calendarType, rangeType, onCancel, onConfirm, isOpen, setCurrentDate }: DateSelectorStepperProps) {
    // Debug log to see what currentDate contains
    console.log("DateSelectorStepper received currentDate:", currentDate, "type:", typeof currentDate, "calendarType:", calendarType);

    // Helper function to convert Persian numerals to English
    const convertPersianToEnglish = (str: string) => {
        const persianNumbers = ['۰', '۱', '۲', '۳', '۴', '۵', '۶', '۷', '۸', '۹'];
        const arabicNumbers = ['٠', '١', '٢', '٣', '٤', '٥', '٦', '٧', '٨', '٩'];
        const englishNumbers = ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9'];

        let result = str;

        // Convert Persian numerals
        persianNumbers.forEach((persian, index) => {
            result = result.replace(new RegExp(persian, 'g'), englishNumbers[index]);
        });

        // Convert Arabic numerals
        arabicNumbers.forEach((arabic, index) => {
            result = result.replace(new RegExp(arabic, 'g'), englishNumbers[index]);
        });

        return result;
    };

    // Helper function to safely convert currentDate to string format
    const safeCurrentDateString = () => {
        try {
            let dateString = '';

            if (typeof currentDate === 'string') {
                dateString = currentDate;
            } else if (currentDate instanceof Date) {
                dateString = currentDate.toISOString().split('T')[0]; // YYYY-MM-DD format
            } else if (currentDate && typeof currentDate === 'object' && currentDate.toString) {
                dateString = currentDate.toString();
            } else {
                // Fallback to today if currentDate is invalid
                dateString = new Date().toISOString().split('T')[0];
            }

            // Convert any Persian/Arabic numerals to English numerals
            return convertPersianToEnglish(dateString);
        } catch {
            return new Date().toISOString().split('T')[0];
        }
    };

    const [step, setStep] = useState<selectorSteps>("month");
    const [selectedDay, setSelectedDay] = useState<number>();
    const [selectedMonth, setSelectedMonth] = useState<number>();
    const [selectedYear, setSelectedYear] = useState<number>();

    // Safe conversion for today's year using calendar.ts
    const getTodayYear = () => {
        try {
            const todayStr = getTodayInGregorianYMD();
            return convertDateWithTimeZone(todayStr, calendarType).year;
        } catch {
            return new Date().getFullYear(); // fallback to current year
        }
    };
    const todayYear = getTodayYear();
    const [visibleStartYear, setVisibleStartYear] = useState(todayYear - 4); // وسط 12 سالی که نشون میدی

    // Removed calendarConfig as it's no longer needed with calendar.ts functions



    useEffect(() => {
        if (isOpen) {
            try {
                const safeDateString = safeCurrentDateString();
                console.log("isOpen useEffect - safe date string:", safeDateString);
                const currentDateInfo = convertDateWithTimeZone(safeDateString, calendarType);
                console.log("initial current date", currentDateInfo);
                setSelectedDay(currentDateInfo.day);
                setSelectedMonth(currentDateInfo.month);
                setSelectedYear(currentDateInfo.year);
                // setCurrentDate(currentDateInfo);
                if (rangeType === "monthly") {
                    setStep("month")
                } else {
                    setStep("day")
                }
            } catch (error) {
                console.error("Error in isOpen useEffect:", error);
                console.error("Original currentDate:", currentDate);
                console.error("Safe date string:", safeCurrentDateString());
            }
        }
    }, [isOpen, calendarType, currentDate, rangeType]);

    const getMonthNames = () => {
        const monthNames = [];
        for (let i = 1; i <= 12; i++) {
            // Create a date string for the first day of each month
            const dateStr = revertDateWithTimeZone({
                year: selectedYear || 1400,
                month: i,
                day: 1
            }, calendarType);

            // Get month name using calendar.ts function
            const calendarInfo = getCalendarInfo(dateStr, calendarType);
            monthNames.push(calendarInfo.monthName);
        }
        return monthNames;
    }

    useEffect(() => {
        console.log("Calendar type changed, currentDate:", currentDate, "type:", typeof currentDate);

        try {
            const safeDateString = safeCurrentDateString();
            console.log("Safe date string:", safeDateString);
            const currentDateInfo = convertDateWithTimeZone(safeDateString, calendarType);
            setSelectedYear(currentDateInfo.year);
            setSelectedMonth(currentDateInfo.month);
            setSelectedDay(currentDateInfo.day);

            // Update visible year range to center around the new calendar's current year
            setVisibleStartYear(currentDateInfo.year - 4);

            console.log("Successfully converted date:", currentDateInfo);
            console.log("Updated visibleStartYear to:", currentDateInfo.year - 4);
        } catch (error) {
            console.error("Error converting date:", error);
            console.error("Original currentDate:", currentDate);
            console.error("Safe date string:", safeCurrentDateString());
        }
    }, [calendarType]);

    const getDaysInCurrentMonth = () => {
        if (!selectedYear || !selectedMonth) return [];

        // Create a date string for the first day of the current month
        const dateStr = revertDateWithTimeZone({
            year: selectedYear,
            month: selectedMonth,
            day: 1
        }, calendarType);

        // Get calendar info using calendar.ts function
        const calendarInfo = getCalendarInfo(dateStr, calendarType);
        const daysInMonth = calendarInfo.endDay;

        // Create array from 1 to daysInMonth
        return Array.from({ length: daysInMonth }, (_, i) => i + 1);
    }

    const handleSelectYear = (year: number) => {
        setSelectedYear(year);
        //next step
        setStep("month")
    }
    const handleSelectMonth = (month: number) => {
        setSelectedMonth(month);
        if (rangeType === "monthly") {

        } else {
            // For weekly/daily, proceed to day selection
            setStep("day");
        }
    }

    const handleConfirmValues = (year: number, month: number, day: number) => {
        // Convert to Gregory/ISO format for consistent return
        const gregorianDate = revertDateWithTimeZone({
            year: year,
            month: month,
            day: day
        }, calendarType);

        console.log("final selected date - year:", year, "month:", month, "day:", day, "gregorian:", gregorianDate);

        // Return appropriate result based on rangeType
        let result: DateSelectorResult;

        if (rangeType === 'monthly') {
            // Return start of month
            const startOfMonth = revertDateWithTimeZone({
                year: year,
                month: month,
                day: 1
            }, calendarType);
            result = { type: 'monthly', start: startOfMonth };

        } else if (rangeType === 'weekly') {
            // For weekly range, we need to calculate the proper week range
            // Use the calendar.ts function to get the week range
            const weekRange = generateWeekVisibleRange(gregorianDate, calendarType);

            result = {
                type: 'weekly',
                start: weekRange.start.toISOString().split('T')[0],
                end: weekRange.end.toISOString().split('T')[0]
            };

        } else { // daily
            result = { type: 'daily', start: gregorianDate };
        }
        console.log("result", result);

        onConfirm(result);
        // Modal will be closed by the parent component after handling the result
    }




    const handleSelectDay = (day: number) => {
        setSelectedDay(day);
        console.log("Selected day:", day, "selectedYear:", selectedYear, "selectedMonth:", selectedMonth);
        // Don't auto-confirm, let user see the selection and manually confirm
    }

    // Simplified month navigation using calendar.ts functions
    const navigateMonth = (direction: 'prev' | 'next') => {
        if (!selectedYear || !selectedMonth) return;

        // Calculate new month and year
        let newYear = selectedYear;
        let newMonth = selectedMonth;
        let newDay = selectedDay || 1;

        if (direction === 'prev') {
            if (newMonth === 1) {
                newYear = selectedYear - 1;
                newMonth = 12;
            } else {
                newMonth = selectedMonth - 1;
            }
        } else {
            if (newMonth === 12) {
                newYear = selectedYear + 1;
                newMonth = 1;
            } else {
                newMonth = selectedMonth + 1;
            }
        }

        // Convert to Gregorian to check if the day exists in the new month
        const newDateStr = revertDateWithTimeZone({
            year: newYear,
            month: newMonth,
            day: newDay
        }, calendarType);

        // Get calendar info to check if the day exists
        const calendarInfo = getCalendarInfo(newDateStr, calendarType);

        // If the selected day doesn't exist in the new month, use the last day of the month
        if (newDay > calendarInfo.endDay) {
            newDay = calendarInfo.endDay;
        }

        // Update the selected values
        setSelectedYear(newYear);
        setSelectedMonth(newMonth);
        setSelectedDay(newDay);
    };

    const handleConfirm = () => {
        if (!selectedYear || !selectedMonth) return;

        const dayToUse = rangeType === 'monthly' ? 1 : (selectedDay || 1);
        console.log("handleConfirm", selectedYear, selectedMonth, dayToUse);
        handleConfirmValues(selectedYear, selectedMonth, dayToUse);
    };




    const handleChangeYear = (offset: number) => {
        setVisibleStartYear((prev) => prev + offset); // فقط بازه رو عوض کن
    }
    const renderYearsPicker = () => {
        const currentYear = selectedYear || getTodayYear();
        console.log("Year picker - currentYear:", selectedYear, "calendarType:", calendarType);
        const years = Array.from({ length: 12 }, (_, i) => visibleStartYear + i);
        console.log("Year picker - visibleStartYear:", visibleStartYear, "years range:", years);

        return (
            <div className="bg-white rounded-lg shadow-sm border">
                {/* Header */}
                <div className="flex items-center justify-between p-4 border-b">
                    <div className="text-lg font-semibold">{selectedYear}</div>
                    <div className="flex items-center gap-2">
                        <button
                            onClick={() => handleChangeYear(-12)}
                            className="p-1 hover:bg-gray-100 rounded"
                        >
                            <ArrowLeft className="w-4 h-4" />
                        </button>
                        <button
                            onClick={() => handleChangeYear(12)}
                            className="p-1 hover:bg-gray-100 rounded"
                        >
                            <ArrowRight className="w-4 h-4" />
                        </button>
                    </div>
                </div>

                {/* Year Grid */}
                <div className="grid grid-cols-3 gap-2 p-4">
                    {years.map(year => (
                        <button
                            key={year}
                            onClick={() => handleSelectYear(year)}
                            className={cn(
                                "p-3 rounded-lg text-sm font-medium transition-colors",
                                year === selectedYear
                                    ? "bg-blue-500 text-white"
                                    : "hover:bg-gray-100 border border-gray-200"
                            )}
                        >
                            {year}
                        </button>
                    ))}
                </div>


                {/* Action Buttons */}
                <div className="flex justify-center gap-3 p-4 border-t">
                    <Button
                        variant={"transparent"}
                        onClick={onCancel}
                        className="bg-[#B6BCC2] text-card text-sm w-44"

                    >
                        لغو
                    </Button>
                    <Button
                        variant={"transparent"}
                        onClick={() => {
                            // Confirm year selection and move to month picker
                            setStep("month");
                        }}
                        className="bg-[#4573FE] text-card text-sm w-44"
                    >
                        تایید
                    </Button>
                </div>

                {/* Quick Select Options */}
                <div className="p-4 border-t bg-gray-50">
                    <div className="flex justify-center gap-4 text-sm">
                        <button
                            onClick={() => {
                                // Set to this week
                                const todayStr = getTodayInGregorianYMD();
                                const todayInfo = convertDateWithTimeZone(todayStr, calendarType);
                                setSelectedYear(todayInfo.year);
                                setSelectedMonth(todayInfo.month);
                                setSelectedDay(todayInfo.day);
                                setStep("month");
                            }}
                            className="text-blue-600 hover:text-blue-800 transition-colors"
                        >
                            این هفته
                        </button>
                        <button
                            onClick={() => {
                                // Set to this month
                                const todayStr = getTodayInGregorianYMD();
                                const todayInfo = convertDateWithTimeZone(todayStr, calendarType);
                                setSelectedYear(todayInfo.year);
                                setSelectedMonth(todayInfo.month);
                                setStep("month");
                            }}
                            className="text-blue-600 hover:text-blue-800 transition-colors"
                        >
                            این ماه
                        </button>
                        <button
                            onClick={() => {
                                // Set to today
                                const todayStr = getTodayInGregorianYMD();
                                const todayInfo = convertDateWithTimeZone(todayStr, calendarType);
                                setSelectedYear(todayInfo.year);
                                setSelectedMonth(todayInfo.month);
                                setSelectedDay(todayInfo.day);
                                setStep("month");
                            }}
                            className="text-blue-600 hover:text-blue-800 transition-colors"
                        >
                            امروز
                        </button>
                    </div>
                </div>
            </div>
        );
    }
    // _____________________________________________________
    const handlerenderMonthsPicker = () => {
        const monthNames = getMonthNames();

        return (
            <div className="bg-white rounded-lg  border">
                {/* Header */}
                <div className="flex items-center justify-between p-4 border-b">
                    <div className="text-lg font-semibold">{selectedYear}</div>
                    <div className="flex items-center gap-2">
                        <button
                            onClick={() => setStep('year')}
                            className="p-1 hover:bg-gray-100 rounded text-blue-600"
                        >
                            <ArrowLeft className="w-4 h-4" />
                        </button>
                        <button
                            onClick={() => setStep('year')}
                            className="p-1 hover:bg-gray-100 rounded text-blue-600"
                        >
                            <ArrowRight className="w-4 h-4" />
                        </button>
                    </div>
                </div>

                {/* Month Grid */}
                <div className="grid grid-cols-3 gap-2 p-4">
                    {monthNames.map((name, index) => (
                        <button
                            key={index}
                            onClick={() => handleSelectMonth(index + 1)}
                            className={cn(
                                "px-3 py-2 rounded-full text-sm font-medium transition-colors",
                                index + 1 === selectedMonth
                                    ? "bg-blue-500 text-white"
                                    : "bg-white text-gray-800 border border-gray-200 hover:bg-gray-50"
                            )}
                        >
                            {name}
                        </button>
                    ))}
                </div>

                {/* Action Buttons */}
                <div className="flex justify-center gap-3 p-4 border-t">
                    <button
                        onClick={onCancel}
                        className="px-4 py-2 bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300 transition-colors"
                    >
                        لغو
                    </button>
                    <button
                        onClick={() => {
                            if (rangeType === "monthly") {
                                handleConfirm();
                            } else {
                                setStep("day");
                            }
                        }}
                        className="px-6 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
                    >
                        {rangeType === "monthly" ? "تایید" : "ادامه"}
                    </button>
                </div>

                {/* Quick Select Options */}
                <div className="p-4 border-t bg-gray-50">
                    <div className="flex justify-center gap-4 text-sm">
                        <button
                            onClick={() => {
                                // Set to today
                                const todayStr = getTodayInGregorianYMD();
                                const todayInfo = convertDateWithTimeZone(todayStr, calendarType);
                                setSelectedYear(todayInfo.year);
                                setSelectedMonth(todayInfo.month);
                                setSelectedDay(todayInfo.day);
                                if (rangeType === "monthly") {
                                    handleConfirm();
                                } else {
                                    setStep("day");
                                }
                            }}
                            className="px-3 py-1 bg-white text-blue-600 rounded-lg hover:bg-blue-50 transition-colors border border-blue-200"
                        >
                            امروز
                        </button>
                        <button
                            onClick={() => {
                                // Set to this month
                                const todayStr = getTodayInGregorianYMD();
                                const todayInfo = convertDateWithTimeZone(todayStr, calendarType);
                                setSelectedYear(todayInfo.year);
                                setSelectedMonth(todayInfo.month);
                                if (rangeType === "monthly") {
                                    handleConfirm();
                                } else {
                                    setStep("day");
                                }
                            }}
                            className="px-3 py-1 bg-white text-blue-600 rounded-lg hover:bg-blue-50 transition-colors border border-blue-200"
                        >
                            این ماه
                        </button>
                        <button
                            onClick={() => {
                                // Set to this week
                                const todayStr = getTodayInGregorianYMD();
                                const todayInfo = convertDateWithTimeZone(todayStr, calendarType);
                                setSelectedYear(todayInfo.year);
                                setSelectedMonth(todayInfo.month);
                                setSelectedDay(todayInfo.day);
                                if (rangeType === "monthly") {
                                    handleConfirm();
                                } else {
                                    setStep("day");
                                }
                            }}
                            className="px-3 py-1 bg-white text-blue-600 rounded-lg hover:bg-blue-50 transition-colors border border-blue-200"
                        >
                            این هفته
                        </button>
                    </div>
                </div>
            </div>
        );
    }
    // Get days of the week for the current calendar type using calendar.ts
    const getDaysOfWeek = () => {
        return weekdaysMap[calendarType] || weekdaysMap.jalali;
    };

    // Get month name in current calendar
    const getCurrentMonthName = () => {
        const monthNames = getMonthNames();
        return selectedMonth ? monthNames[selectedMonth - 1] : '';
    };

    // ____________________________________
    const renderDayPicker = () => {
        const days = getDaysInCurrentMonth();
        const monthNames = getMonthNames();
        const currentMonthName = getCurrentMonthName();
        const daysOfWeek = getDaysOfWeek();

        return (
            <div className="bg-white rounded-lg shadow-sm border">
                {/* Top Navigation */}
                <div className="flex justify-center gap-4 p-4 border-b">
                    <button
                        onClick={() => {
                            const todayStr = getTodayInGregorianYMD();
                            const todayInfo = convertDateWithTimeZone(todayStr, calendarType);
                            setSelectedYear(todayInfo.year);
                            setSelectedMonth(todayInfo.month);
                            setSelectedDay(todayInfo.day);
                        }}
                        className="px-3 py-1 text-sm bg-blue-500 text-white rounded-lg"
                    >
                        امروز
                    </button>
                    <button
                        onClick={() => {
                            const todayStr = getTodayInGregorianYMD();
                            const todayInfo = convertDateWithTimeZone(todayStr, calendarType);
                            setSelectedYear(todayInfo.year);
                            setSelectedMonth(todayInfo.month);
                        }}
                        className="px-3 py-1 text-sm text-gray-600 hover:bg-gray-100 rounded-lg"
                    >
                        این ماه
                    </button>
                    <button
                        onClick={() => {
                            const todayStr = getTodayInGregorianYMD();
                            const todayInfo = convertDateWithTimeZone(todayStr, calendarType);
                            setSelectedYear(todayInfo.year);
                            setSelectedMonth(todayInfo.month);
                            setSelectedDay(todayInfo.day);
                        }}
                        className="px-3 py-1 text-sm text-gray-600 hover:bg-gray-100 rounded-lg"
                    >
                        این هفته
                    </button>
                </div>

                {/* Calendar Header */}
                <div className="flex items-center justify-between p-4 border-b">
                    <button
                        onClick={() => navigateMonth('prev')}
                        className="p-1 hover:bg-gray-100 rounded"
                    >
                        <ArrowLeft className="w-4 h-4" />
                    </button>
                    <div className="text-lg font-semibold">
                        {currentMonthName} {selectedYear}
                    </div>
                    <button
                        onClick={() => navigateMonth('next')}
                        className="p-1 hover:bg-gray-100 rounded"
                    >
                        <ArrowRight className="w-4 h-4" />
                    </button>
                </div>

                {/* Days of Week Header */}
                <div className="grid grid-cols-7 gap-1 px-4 py-2 border-b">
                    {daysOfWeek.map((day, index) => (
                        <div key={index} className="text-center text-sm font-medium text-gray-600">
                            {day}
                        </div>
                    ))}
                </div>

                {/* Day Grid */}
                <div className="grid grid-cols-7 gap-1 p-4">
                    {days.map(day => (
                        <button
                            key={day}
                            onClick={() => handleSelectDay(day)}
                            className={cn(
                                "w-8 h-8 rounded-full text-sm font-medium transition-colors",
                                day === selectedDay ? "bg-blue-500 text-white" : "hover:bg-gray-100"
                            )}
                        >
                            {day}
                        </button>
                    ))}
                </div>

                {/* Action Buttons */}
                <div className="flex justify-center gap-3 p-4 border-t">
                    <button
                        onClick={onCancel}
                        className="px-4 py-2 bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300 transition-colors"
                    >
                        لغو
                    </button>
                    <button
                        onClick={handleConfirm}
                        className="px-6 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
                    >
                        تایید
                    </button>
                </div>

                {/* Bottom Navigation */}
                <div className="flex justify-center gap-4 p-4 border-t bg-gray-50">
                    <button
                        onClick={() => {
                            const todayStr = getTodayInGregorianYMD();
                            const todayInfo = convertDateWithTimeZone(todayStr, calendarType);
                            setSelectedYear(todayInfo.year);
                            setSelectedMonth(todayInfo.month);
                            setSelectedDay(todayInfo.day);
                        }}
                        className="px-3 py-1 text-sm text-gray-600 hover:bg-gray-100 rounded-lg"
                    >
                        امروز
                    </button>
                    <button
                        onClick={() => {
                            const todayStr = getTodayInGregorianYMD();
                            const todayInfo = convertDateWithTimeZone(todayStr, calendarType);
                            setSelectedYear(todayInfo.year);
                            setSelectedMonth(todayInfo.month);
                        }}
                        className="px-3 py-1 text-sm bg-blue-500 text-white rounded-lg"
                    >
                        این ماه
                    </button>
                    <button
                        onClick={() => {
                            const todayStr = getTodayInGregorianYMD();
                            const todayInfo = convertDateWithTimeZone(todayStr, calendarType);
                            setSelectedYear(todayInfo.year);
                            setSelectedMonth(todayInfo.month);
                            setSelectedDay(todayInfo.day);
                        }}
                        className="px-3 py-1 text-sm text-gray-600 hover:bg-gray-100 rounded-lg"
                    >
                        این هفته
                    </button>
                </div>
            </div>
        );
    };


    const renderCurrentStep = () => {
        switch (step) {
            case "year":
                return renderYearsPicker();
            case "month":
                return handlerenderMonthsPicker();
            case "day":
                return renderDayPicker();
            default:
                return handlerenderMonthsPicker();
        }
    };

    return (
        <PopUp>

            <div className="w-[545px] py-3 px-6 flex flex-col gap-4">
                <div className="w-full bg-red-400 border-2 border-red-500">


                    {renderCurrentStep()}
                </div>
            </div>
        </PopUp>
    )
}