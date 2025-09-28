"use client";

import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import CustomeDatePicker, { DateCalendar } from "@/components/shared/custome-date-picker";
import { convertDateWithTimeZone, revertDateWithTimeZone } from "@/lib/calendar";
import { calculateWeekRange, getLastDayOfMonth } from "@/lib/calendar-modal-utils";
import DateObject from "react-date-object";
import gregorian from "react-date-object/calendars/gregorian";
import persian from "react-date-object/calendars/persian";
import arabic from "react-date-object/calendars/arabic";
import gregorian_en from "react-date-object/locales/gregorian_en";
import persian_fa from "react-date-object/locales/persian_fa";
import arabic_ar from "react-date-object/locales/arabic_ar";

interface DateSelectorProps {
    currentDate: string; // Gregorian YYYY-MM-DD format
    calendarType: 'jalali' | 'hijri' | 'gregory';
    rangeType: 'monthly' | 'weekly' | 'daily';
    onDateSelect: (selectedDate: string, rangeType: 'monthly' | 'weekly' | 'daily') => void;
    onCancel?: () => void;
    className?: string;
}

type NavigationStep = 'year' | 'month' | 'day';

export default function DateSelector({
    currentDate,
    calendarType,
    rangeType,
    onDateSelect,
    onCancel,
    className = ""
}: DateSelectorProps) {
    const [internalSelectedDate, setInternalSelectedDate] = useState<string>("");
    const [internalCalendarType, setInternalCalendarType] = useState<DateCalendar>(
        calendarType === 'jalali' ? 'Solar' : calendarType === 'hijri' ? 'Lunar' : 'Gregorian'
    );
    const [navigationStep, setNavigationStep] = useState<NavigationStep>('day');
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

    // Initialize internal state with current date
    useEffect(() => {
        console.log('DateSelector initializing with currentDate:', currentDate);

        try {
            // Parse the current date (should be in Gregorian YYYY-MM-DD format)
            const dateParts = currentDate.split('-');
            if (dateParts.length === 3) {
                const [yearStr, monthStr, dayStr] = dateParts;
                const year = parseInt(yearStr, 10);
                const month = parseInt(monthStr, 10);
                const day = parseInt(dayStr, 10);

                console.log('Parsed current date:', { year, month, day });

                // Create DateObject in Gregorian format first
                const gregorianDateObj = new DateObject({
                    year,
                    month,
                    day,
                    calendar: gregorian,
                    locale: gregorian_en
                });

                // Convert to the user's preferred calendar type for display
                const targetCalendar = calendarType === 'jalali' ? persian :
                    calendarType === 'hijri' ? arabic : gregorian;
                const targetLocale = calendarType === 'jalali' ? persian_fa :
                    calendarType === 'hijri' ? arabic_ar : gregorian_en;

                const convertedDate = gregorianDateObj.convert(targetCalendar);
                convertedDate.locale = targetLocale;

                // Format for CustomeDatePicker (YYYY/MM/DD) - in user's preferred calendar
                const formattedDate = convertedDate.format('YYYY/MM/DD');

                console.log('Date conversion for CustomeDatePicker:', {
                    originalGregorian: `${year}-${month}-${day}`,
                    targetCalendarType: calendarType,
                    convertedDate: convertedDate.format('YYYY/MM/DD'),
                    formattedDate
                });

                setInternalSelectedDate(formattedDate);
                setSelectedYear(Number(convertedDate.year));
                setSelectedMonth(Number(convertedDate.month));
                setSelectedDay(Number(convertedDate.day));
            }
        } catch (error) {
            console.error('Error initializing DateSelector:', error, { currentDate, calendarType });

            // Fallback: use the old method
            const currentDateObj = convertDateWithTimeZone(currentDate, 'gregory');
            const formattedDate = `${currentDateObj.year}/${currentDateObj.month.toString().padStart(2, '0')}/${currentDateObj.day.toString().padStart(2, '0')}`;

            setInternalSelectedDate(formattedDate);
            setSelectedYear(currentDateObj.year);
            setSelectedMonth(currentDateObj.month);
            setSelectedDay(currentDateObj.day);
        }

        // Set the initial calendar type for the picker based on user preference
        setInternalCalendarType(
            calendarType === 'jalali' ? 'Solar' : calendarType === 'hijri' ? 'Lunar' : 'Gregorian'
        );

        // Set initial navigation step based on range type - as per requirements
        if (rangeType === 'monthly') {
            setNavigationStep('month'); // Start with month selection for monthly view
        } else {
            setNavigationStep('day'); // Start with day selection for weekly/daily views
        }
    }, [currentDate, calendarType, rangeType]);

    const handleDateChange = (date: string) => {
        console.log('DateSelector date changed (from CustomeDatePicker):', date, 'Step:', navigationStep, 'Current calendar type:', internalCalendarType);
        setInternalSelectedDate(date);

        // Parse the date from CustomeDatePicker format (YYYY/MM/DD)
        // Note: The date comes from CustomeDatePicker in the format of whatever calendar type is currently active
        const dateParts = date.split('/');
        if (dateParts.length === 3) {
            const [year, month, day] = dateParts.map(Number);

            console.log('Parsed date parts:', { year, month, day, fromCalendarType: internalCalendarType });

            setSelectedYear(year);
            setSelectedMonth(month);
            setSelectedDay(day);

            // Handle automatic progression based on current step and range type
            if (navigationStep === 'year') {
                // After selecting year, go to month
                setNavigationStep('month');
            } else if (navigationStep === 'month') {
                if (rangeType === 'monthly') {
                    // For monthly, we're done after month selection
                    handleConfirmSelection(year, month, 1);
                } else {
                    // For weekly/daily, go to day selection
                    setNavigationStep('day');
                }
            } else if (navigationStep === 'day') {
                // For weekly/daily, we're done after day selection
                handleConfirmSelection(year, month, day);
            }
        }
    };

    const handleCalendarTypeChange = (newCalendarType: DateCalendar) => {
        console.log('DateSelector calendar type changed:', newCalendarType);
        setInternalCalendarType(newCalendarType);
    };

    const handleConfirmSelection = (year: number, month: number, day: number) => {
        console.log('Confirming selection:', { year, month, day, internalCalendarType, rangeType });

        try {
            // Create a DateObject in the selected calendar type to ensure proper conversion
            const dateInSelectedCalendar = new DateObject({
                year,
                month,
                day,
                calendar: config.calendar,
                locale: config.locale
            });

            // Convert to Gregorian calendar
            const gregorianDate = dateInSelectedCalendar.convert(gregorian);
            const confirmedGregorianDate = gregorianDate.format('YYYY-MM-DD');

            console.log('Conversion details:', {
                originalDate: { year, month, day, calendar: internalCalendarType },
                dateInSelectedCalendar: dateInSelectedCalendar.format('YYYY/MM/DD'),
                gregorianConversion: gregorianDate.format('YYYY/MM/DD'),
                finalResult: confirmedGregorianDate
            });

            console.log('Final confirmed Gregorian date:', confirmedGregorianDate);
            onDateSelect(confirmedGregorianDate, rangeType);
        } catch (error) {
            console.error('Error processing date selection:', error, { year, month, day, internalCalendarType });

            // Fallback: if conversion fails, try to use revertDateWithTimeZone as backup
            try {
                const dateObj = { year, month, day };
                const fallbackResult = revertDateWithTimeZone(dateObj,
                    internalCalendarType === 'Solar' ? 'jalali' :
                        internalCalendarType === 'Lunar' ? 'hijri' : 'gregory'
                );
                console.log('Fallback conversion result:', fallbackResult);
                onDateSelect(fallbackResult, rangeType);
            } catch (fallbackError) {
                console.error('Fallback conversion also failed:', fallbackError);
            }
        }
    };

    const handleManualConfirm = () => {
        if (selectedYear && selectedMonth) {
            const dayToUse = rangeType === 'monthly' ? 1 : (selectedDay || 1);
            handleConfirmSelection(selectedYear, selectedMonth, dayToUse);
        }
    };

    // Get view mode props for CustomeDatePicker based on current step
    const getViewModeProps = () => {
        console.log('Setting view mode for step:', navigationStep);
        switch (navigationStep) {
            case 'year':
                return { onlyYearPicker: true, onlyMonthPicker: false };
            case 'month':
                return { onlyMonthPicker: true, onlyYearPicker: false };
            default: // day
                return { onlyMonthPicker: false, onlyYearPicker: false };
        }
    };

    const viewModeProps = getViewModeProps();

    const getRangeTypeLabel = () => {
        switch (rangeType) {
            case 'monthly': return 'انتخاب ماه';
            case 'weekly': return 'انتخاب هفته';
            case 'daily': return 'انتخاب روز';
            default: return 'انتخاب تاریخ';
        }
    };

    const getInstructions = () => {
        switch (rangeType) {
            case 'monthly':
                return 'ماه مورد نظر را انتخاب کنید';
            case 'weekly':
                return 'روز مورد نظر را انتخاب کنید (هفته شامل آن روز محاسبه خواهد شد)';
            case 'daily':
                return 'روز مورد نظر را انتخاب کنید';
            default:
                return 'تاریخ مورد نظر را انتخاب کنید';
        }
    };

    const getHeaderTitle = () => {
        if (!selectedYear) return 'انتخاب تاریخ';

        if (navigationStep === 'year') {
            return `انتخاب سال - فعلی: ${selectedYear}`;
        } else if (navigationStep === 'month') {
            return `${selectedYear} - انتخاب ماه`;
        } else {
            // For day selection, show month and year
            const monthObj = new DateObject({
                calendar: config.calendar,
                locale: config.locale,
                year: selectedYear,
                month: selectedMonth || 1,
                day: 1
            });
            const monthName = monthObj.format("MMMM");
            return `${monthName} ${selectedYear}`;
        }
    };

    const initialDateCalendar: DateCalendar =
        calendarType === 'jalali' ? 'Solar' : calendarType === 'hijri' ? 'Lunar' : 'Gregorian';

    return (
        <div className={`flex flex-col w-full ${className}`} dir="rtl">
            {/* Context Info */}
            <div className="mb-4 p-3 bg-gray-50 rounded-lg">
                <h3 className="text-lg font-bold mb-2">{getRangeTypeLabel()}</h3>
                <p className="text-sm text-gray-600">{getInstructions()}</p>
            </div>

            {/* Navigation Header - Month and Year clickable as per requirements */}
            <div className="flex items-center justify-between p-4 border-b bg-gray-50 rounded-t-lg">
                <button
                    onClick={() => setNavigationStep('year')}
                    className={cn(
                        "hover:bg-gray-200 px-3 py-1 rounded cursor-pointer transition-colors font-medium",
                        navigationStep === 'year' ? "bg-blue-500 text-white" : "text-blue-600"
                    )}
                >
                    سال
                </button>

                <h2 className="text-lg font-medium text-gray-800">
                    {getHeaderTitle()}
                </h2>

                <button
                    onClick={() => setNavigationStep('month')}
                    className={cn(
                        "hover:bg-gray-200 px-3 py-1 rounded cursor-pointer transition-colors font-medium",
                        navigationStep === 'month' ? "bg-blue-500 text-white" : "text-blue-600"
                    )}
                >
                    ماه
                </button>
            </div>

            {/* Date Picker with dynamic view mode */}
            <div className="border border-t-0 rounded-b-lg bg-white">
                <CustomeDatePicker
                    idKey="enhanced-date-selector-picker"
                    value={internalSelectedDate}
                    onValueChanged={handleDateChange}
                    onCalenderTypeChange={handleCalendarTypeChange}
                    initialCalendarType={initialDateCalendar}
                    onlyMonthPicker={viewModeProps.onlyMonthPicker}
                    onlyYearPicker={viewModeProps.onlyYearPicker}
                >
                    {/* This creates the calendar display area */}
                    <div className="min-h-[300px] w-full p-4 flex items-center justify-center">
                        <span className="text-gray-500">
                            {navigationStep === 'year' && 'سال مورد نظر را انتخاب کنید'}
                            {navigationStep === 'month' && 'ماه مورد نظر را انتخاب کنید'}
                            {navigationStep === 'day' && 'روز مورد نظر را انتخاب کنید'}
                        </span>
                    </div>
                </CustomeDatePicker>
            </div>

            {/* Action Buttons */}
            <div className="flex gap-2 p-4 bg-gray-50 rounded-b-lg mt-2">
                {onCancel && (
                    <Button variant="outline" onClick={onCancel} className="flex-1">
                        لغو
                    </Button>
                )}
                <Button
                    variant="default"
                    onClick={handleManualConfirm}
                    className="flex-1"
                    disabled={!selectedYear || !selectedMonth}
                >
                    تایید
                </Button>
            </div>

            {/* Debug Info */}
            <div className="mt-2 p-2 bg-gray-100 rounded text-xs text-gray-600">
                <div>Step: {navigationStep} | Year: {selectedYear} | Month: {selectedMonth} | Day: {selectedDay}</div>
                <div>Range Type: {rangeType} | User Calendar: {internalCalendarType} | Interface: Gregorian</div>
                <div>View Mode: {viewModeProps.onlyYearPicker ? 'Year Picker' : viewModeProps.onlyMonthPicker ? 'Month Picker' : 'Day Picker'}</div>
                <div>📝 Note: Values shown are in {internalCalendarType} format, but output is always Gregorian</div>
            </div>
        </div>
    );
}