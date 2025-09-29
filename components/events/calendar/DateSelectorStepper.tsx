// import { locale, months } from 'moment';

"use client";
import React, { useEffect, useState } from 'react'
import gregorian_en from "react-date-object/locales/gregorian_en";
import persian_fa from "react-date-object/locales/persian_fa";
import arabic_ar from "react-date-object/locales/arabic_ar";
import gregorian from "react-date-object/calendars/gregorian";
import persian from "react-date-object/calendars/persian";
import arabic from "react-date-object/calendars/arabic";
import { ArrowBigRight, ArrowLeft, ArrowRight, CalendarRange } from 'lucide-react';
import { convertDateWithTimeZone, revertDateWithTimeZone } from '@/lib/calendar';
import DateObject from 'react-date-object';

import { cn } from '@/lib/utils';
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
}

type selectorSteps = "year" | "month" | "day";



export default function DateSelectorStepper({ currentDate, calendarType, rangeType, onCancel, onConfirm, isOpen }: DateSelectorStepperProps) {
  // Debug log to see what currentDate contains
  console.log("DateSelectorStepper received currentDate:", currentDate, "type:", typeof currentDate, "calendarType:", calendarType);

  // Helper function to safely convert currentDate to string format
  const safeCurrentDateString = () => {
    try {
      if (typeof currentDate === 'string') {
        return currentDate;
      }
      if (currentDate instanceof Date) {
        return currentDate.toISOString().split('T')[0]; // YYYY-MM-DD format
      }
      if (currentDate && typeof currentDate === 'object' && currentDate.toString) {
        return currentDate.toString();
      }
      // Fallback to today if currentDate is invalid
      return new Date().toISOString().split('T')[0];
    } catch {
      return new Date().toISOString().split('T')[0];
    }
  };

  const [step, setStep] = useState<selectorSteps>("month");
  const [selectedDay, setSelectedDay] = useState<number>();
  const [selectedMonth, setSelectedMonth] = useState<number>();
  const [selectedYear, setSelectedYear] = useState<number>();

  // Safe conversion for today's year
  const getTodayYear = () => {
    try {
      return convertDateWithTimeZone(safeCurrentDateString(), calendarType).year;
    } catch {
      return new Date().getFullYear(); // fallback to current year
    }
  };
  const todayYear = getTodayYear();
  const [visibleStartYear, setVisibleStartYear] = useState(todayYear - 4); // وسط 12 سالی که نشون میدی

  const calendarConfig = {
    jalali: { calendar: persian, locale: persian_fa }
    , hijri: { calendar: arabic, locale: arabic_ar }
    , gregory: { calendar: gregorian, locale: gregorian_en }
  }
  const currentCalendarConfig = calendarConfig[calendarType];



  useEffect(() => {
    if (isOpen) {
      try {
        const currentDateInfo = convertDateWithTimeZone(safeCurrentDateString(), calendarType);
        console.log("initial current date", currentDateInfo);
        setSelectedDay(currentDateInfo.day);
        setSelectedMonth(currentDateInfo.month);
        setSelectedYear(currentDateInfo.year);
        if (rangeType === "monthly") {
          setStep("month")
        } else {
          setStep("day")
        }
      } catch (error) {
        console.error("Error in isOpen useEffect:", error);
      }
    }
  }, [isOpen, calendarType, currentDate, rangeType]);

  const getMonthNames = () => {
    const monthNames = [];
    for (let i = 1; i <= 12; i++) {
      const dateInfo = new DateObject({
        calendar: currentCalendarConfig.calendar,
        locale: currentCalendarConfig.locale,
        year: selectedYear || 1400,
        month: i,
        day: 1
      })
      monthNames.push(dateInfo.format("MMMM"));
    }
    return monthNames;
  }

  useEffect(() => {
    console.log("Calendar type changed, currentDate:", currentDate, "type:", typeof currentDate);

    try {
      const currentDateInfo = convertDateWithTimeZone(safeCurrentDateString(), calendarType);
      setSelectedYear(currentDateInfo.year);
      setSelectedMonth(currentDateInfo.month);
      setSelectedDay(currentDateInfo.day);

      // Update visible year range to center around the new calendar's current year
      setVisibleStartYear(currentDateInfo.year - 4);

      console.log("Successfully converted date:", currentDateInfo);
      console.log("Updated visibleStartYear to:", currentDateInfo.year - 4);
    } catch (error) {
      console.error("Error converting date:", error);
    }
  }, [calendarType]);

  const getDaysInCurrentMonth = () => {
    if (!selectedYear || !selectedMonth) return [];

    //object of first date in current month
    const firstDay = new DateObject({
      calendar: currentCalendarConfig.calendar,
      locale: currentCalendarConfig.locale,
      year: selectedYear || 1400,
      month: selectedMonth || 1,
      day: 1
    })
    //create lst day object
    const lastDayOfMonth = firstDay.add(1, "month").subtract(1, "day");
    console.log("firstDay", firstDay, "lastDayOfMonth", lastDayOfMonth);
    const daysInMonth = lastDayOfMonth.day

    //create array from 1 nto daysInMonth
    return Array.from({ length: daysInMonth }, (_, i) => i + 1)
  }

  const handleSelectYear = (year: number) => {
    setSelectedYear(year);
    //next step
    setStep("month")
  }
  const handleSelectMonth = (month: number) => {
    setSelectedMonth(month);
    if (rangeType === "monthly") {
      // For monthly, just select the month, don't auto-confirm
      // Let user confirm with the button
      console.log("Month selected for monthly range:", month);
    } else {
      // For weekly/daily, proceed to day selection
      setStep("day");
    }
  }

  const handleConfirmValues = (year: number, month: number, day: number) => {
    const selectedDate = new DateObject({
      calendar: currentCalendarConfig.calendar,
      locale: currentCalendarConfig.locale,
      year: year,
      month: month,
      day: day
    });

    // Convert to Gregory/ISO format for consistent return
    const gregorianDate = revertDateWithTimeZone({
      year: year,
      month: month,
      day: day
    }, calendarType);

    console.log("final selected date", selectedDate, "gregorian:", gregorianDate);

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
      // Calculate week range - assume Monday is week start (can be configurable)
      const dayOfWeek = selectedDate.weekDay; // Get numeric weekday
      const dayOfWeekNumber = typeof dayOfWeek === 'number' ? dayOfWeek : parseInt(dayOfWeek.toString());

      // For most calendar systems: 0=Saturday, 1=Sunday, 2=Monday, 3=Tuesday...
      // Calculate days to subtract to get to Monday (weekday 2)
      let mondayOffset = 0;
      if (dayOfWeekNumber === 0) mondayOffset = -5; // Saturday -> Monday
      else if (dayOfWeekNumber === 1) mondayOffset = -6; // Sunday -> Monday  
      else mondayOffset = -(dayOfWeekNumber - 2); // Any other day -> Monday

      const weekStart = selectedDate.add(mondayOffset, 'day');
      const weekEnd = weekStart.add(6, 'day');

      result = {
        type: 'weekly',
        start: weekStart.format('YYYY-MM-DD'),
        end: weekEnd.format('YYYY-MM-DD')
      };

    } else { // daily
      result = { type: 'daily', start: gregorianDate };
    }

    onConfirm(result);
    onCancel(); // Use onCancel to close instead of onClose
  }
  const handleSelectDay = (day: number) => {
    setSelectedDay(day);
    console.log("Selected day:", day);
    // Don't auto-confirm, let user see the selection and manually confirm
  }

  const handleConfirm = () => {
    if (!selectedYear || !selectedMonth) return;

    const dayToUse = rangeType === 'monthly' ? 1 : (selectedDay || 1);
    handleConfirmValues(selectedYear, selectedMonth, dayToUse);
  };


  //when calendar type or current date changes update selected year
  // useEffect(() => {
  //   const currentDateInfo = convertDateWithTimeZone(currentDate, calendarType);
  //   setSelectedYear(currentDateInfo.year);
  // }, [calendarType, currentDate]);



  const handleChangeYear = (offset: number) => {
    setVisibleStartYear((prev) => prev + offset); // فقط بازه رو عوض کن
  }
  const renderYearsPicker = () => {
    const currentYear = selectedYear || getTodayYear();
    // const years = Array.from({ length: 12 }, (_, i) => currentYear - 10 + i);
    console.log("Year picker - currentYear:", selectedYear, "calendarType:", calendarType);
    const years = Array.from({ length: 12 }, (_, i) => visibleStartYear + i);
    console.log("Year picker - visibleStartYear:", visibleStartYear, "years range:", years);
    return (

      <div className='flex flex-col  w-full'>
        <div className='flex items-center w-full  justify-between'>
          <ArrowRight className='cursor-pointer' onClick={() => handleChangeYear(12)} />
          <ArrowLeft className='cursor-pointer' onClick={() => handleChangeYear(-12)} />
        </div>
        <div className='w-full grid grid-cols-3 bg-danger gap-2 p-4'>
          {years.map(year => (
            <button
              key={year}
              onClick={() => handleSelectYear(year)}
              className={cn(
                "p-2 rounded-lg border hover:bg-blue-50 transition-colors",
                year === selectedYear ? "bg-blue-500 text-white" : "bg-white"
              )}
            >
              {year}
            </button>
          ))}
        </div>

      </div>
    )

  }
  // _____________________________________________________
  const handlerenderMonthsPicker = () => {
    const monthNames = getMonthNames();
    return (
      <div className="space-y-4">
        <div className='w-full grid grid-cols-3 gap-2 p-4'>
          {monthNames.map((name, index) => (
            <button
              key={index}
              onClick={() => handleSelectMonth(index + 1)}
              className={cn(
                "p-2 rounded-lg border hover:bg-blue-50 transition-colors",
                index + 1 === selectedMonth ? "bg-blue-500 text-white" : "bg-white"
              )}
            >
              {name}
            </button>
          ))}
        </div>

        {/* Confirm button appears when a month is selected (for monthly range type) */}
        {selectedMonth && rangeType === "monthly" && (
          <div className="border-t bg-gray-50 p-4">
            <div className="flex justify-center gap-3">
              <button
                onClick={onCancel}
                className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-100 transition-colors font-medium"
              >
                لغو
              </button>
              <button
                onClick={handleConfirm}
                className="px-6 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors font-medium shadow-sm"
              >
                تأیید ماه
              </button>
            </div>
          </div>
        )}
      </div>
    )

  }
  // ____________________________________
  const renderDayPicker = () => {
    const days = getDaysInCurrentMonth();

    return (
      <div className="space-y-4">
        <div className="grid grid-cols-7 gap-1 p-4">
          {days.map(day => (
            <button
              key={day}
              onClick={() => handleSelectDay(day)}
              className={cn(
                "p-2 rounded-lg border hover:bg-blue-50 transition-colors aspect-square",
                day === selectedDay ? "bg-blue-500 text-white" : "bg-white"
              )}
            >
              {day}
            </button>
          ))}
        </div>

        {/* Confirm button appears when a day is selected */}
        {selectedDay && (
          <div className="border-t bg-gray-50 p-4">
            <div className="flex justify-center gap-3">
              <button
                onClick={onCancel}
                className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-100 transition-colors font-medium"
              >
                لغو
              </button>
              <button
                onClick={handleConfirm}
                className="px-6 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors font-medium shadow-sm"
              >
                تأیید {rangeType === 'weekly' ? 'هفته' : 'روز'}
              </button>
            </div>
          </div>
        )}
      </div>
    );
  };

  const renderClickableHeader = () => {
    const monthNames = getMonthNames();
    const currentMonthName = selectedMonth ? monthNames[selectedMonth - 1] : '';

    if (step === 'year') {
      return (
        <div className="mb-4 text-center font-semibold">
          انتخاب سال - فعلی: {selectedYear}
        </div>
      );
    }

    if (step === 'month') {
      return (
        <div className="mb-4 text-center font-semibold">
          <div className="flex items-center justify-center gap-2">
            <button
              onClick={() => setStep('year')}
              className="hover:text-blue-500 underline cursor-pointer"
            >
              {selectedYear}
            </button>
            <span> - {currentMonthName || 'انتخاب ماه'}</span>
          </div>
          {selectedMonth && rangeType === 'monthly' && (
            <div className="text-sm text-gray-600 mt-1">
              ماه انتخاب شده: {currentMonthName} {selectedYear}
            </div>
          )}
        </div>
      );
    }

    // day step
    return (
      <div className="mb-4 text-center font-semibold">
        <div className="flex items-center justify-center gap-2">
          <button
            onClick={() => setStep('month')}
            className="hover:text-blue-500 underline cursor-pointer"
          >
            {currentMonthName}
          </button>
          <button
            onClick={() => setStep('year')}
            className="hover:text-blue-500 underline cursor-pointer"
          >
            {selectedYear}
          </button>
          <span> - انتخاب روز</span>
        </div>
        {selectedDay && (
          <div className="text-sm text-gray-600 mt-1">
            {rangeType === 'weekly' ? 'هفته شامل' : 'روز انتخاب شده'}: {selectedDay} {currentMonthName} {selectedYear}
          </div>
        )}
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
    <div>
      {renderClickableHeader()}
      {renderCurrentStep()}
    </div>
  )
}