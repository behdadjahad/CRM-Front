import { useState, useEffect } from 'react';
import { convertDateWithTimeZone,} from '@/lib/calendar';
import {
    CalendarType,
    RangeType,
    Step,
    DateInfo,
    safeCurrentDateString,
    getTodayYear,
    navigateMonth,
    navigateYear
} from '@/lib/date-selector-utils';

export interface DateSelectorState {
    step: Step;
    selectedDay: number;
    selectedMonth: number;
    selectedYear: number;
    visibleStartYear: number;
}

export interface DateSelectorActions {
    setStep: (step: Step) => void;
    setSelectedDay: (day: number) => void;
    setSelectedMonth: (month: number) => void;
    setSelectedYear: (year: number) => void;
    setVisibleStartYear: (year: number) => void;
    handleYearSelect: (year: number) => void;
    handleMonthSelect: (month: number) => void;
    handleDaySelect: (day: number) => void;
    handleMonthNavigate: (direction: 'prev' | 'next') => void;
    handleYearNavigate: (direction: 'prev' | 'next') => void;
    handleYearRangeChange: (offset: number) => void;
    resetToCurrentDate: () => void;
}

export const useDateSelector = (
    currentDate: string | Date | any,
    calendarType: CalendarType,
    rangeType: RangeType,
    isOpen: boolean
): [DateSelectorState, DateSelectorActions] => {
    const todayYear = getTodayYear(calendarType);

    const [step, setStep] = useState<Step>('month');
    const [selectedDay, setSelectedDay] = useState<number>();
    const [selectedMonth, setSelectedMonth] = useState<number>();
    const [selectedYear, setSelectedYear] = useState<number>();
    const [visibleStartYear, setVisibleStartYear] = useState(todayYear - 4);

    // Initialize state when modal opens
    useEffect(() => {
        if (isOpen) {
            try {
                const safeDateString = safeCurrentDateString(currentDate);
                const currentDateInfo = convertDateWithTimeZone(safeDateString, calendarType);

                setSelectedDay(currentDateInfo.day);
                setSelectedMonth(currentDateInfo.month);
                setSelectedYear(currentDateInfo.year);

                setStep(rangeType === 'monthly' ? 'month' : 'day');
            } catch (error) {
                console.error('Error initializing date selector:', error);
            }
        }
    }, [isOpen, calendarType, currentDate, rangeType]);

    // Reset state when calendar type changes
    useEffect(() => {
        try {
            const safeDateString = safeCurrentDateString(currentDate);
            const currentDateInfo = convertDateWithTimeZone(safeDateString, calendarType);

            setSelectedYear(currentDateInfo.year);
            setSelectedMonth(currentDateInfo.month);
            setSelectedDay(currentDateInfo.day);
            setVisibleStartYear(currentDateInfo.year - 4);
        } catch (error) {
            console.error('Error resetting date selector:', error);
        }
    }, [calendarType]);

    const handleYearSelect = (year: number) => {
        setSelectedYear(year);
        setStep('month');
    };

    const handleMonthSelect = (month: number) => {
        setSelectedMonth(month);
        if (rangeType !== 'monthly') {
            setStep('day');
        }
    };

    const handleDaySelect = (day: number) => {
        console.log('handleDaySelect input day:', day)
        setSelectedDay(day);
        console.log('setSelectedDay called with:', day)
    };
    useEffect(() => {
        console.log('selectedDay state actually changed to:', selectedDay);
    }, [selectedDay]);

    const handleMonthNavigate = (direction: 'prev' | 'next') => {
        if (!selectedYear || !selectedMonth) return;

        const newDateInfo = navigateMonth(
            selectedYear,
            selectedMonth,
            direction,
            calendarType
        );

        setSelectedYear(newDateInfo.year);
        setSelectedMonth(newDateInfo.month);
        setSelectedDay(newDateInfo.day);
    };
    const handleYearNavigate = (direction: 'prev' | 'next') => {
        if (!selectedYear) return;
        const newDateInfo = navigateYear(selectedYear, selectedMonth!, direction, calendarType);
        setSelectedYear(newDateInfo.year);
        setSelectedMonth(newDateInfo.month);
        setSelectedDay(newDateInfo.day);
    };

    const handleYearRangeChange = (offset: number) => {
        setVisibleStartYear(prev => prev + offset);
    };

    const resetToCurrentDate = () => {
        try {
            const safeDateString = safeCurrentDateString(currentDate);
            const currentDateInfo = convertDateWithTimeZone(safeDateString, calendarType);

            setSelectedYear(currentDateInfo.year);
            setSelectedMonth(currentDateInfo.month);
            setSelectedDay(currentDateInfo.day);
        } catch (error) {
            console.error('Error resetting to current date:', error);
        }
    };

    const state: DateSelectorState = {
        step,
        selectedDay: selectedDay || 0,
        selectedMonth: selectedMonth || 0,
        selectedYear: selectedYear || 0,
        visibleStartYear
    };

    const actions: DateSelectorActions = {
        setStep,
        setSelectedDay,
        setSelectedMonth,
        setSelectedYear,
        setVisibleStartYear,
        handleYearSelect,
        handleMonthSelect,
        handleDaySelect,
        handleMonthNavigate,
        handleYearNavigate,
        handleYearRangeChange,
        resetToCurrentDate
    };

    return [state, actions];
};
