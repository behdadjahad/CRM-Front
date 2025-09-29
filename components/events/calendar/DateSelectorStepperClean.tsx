"use client";
import React from 'react';
import PopUp from '@/components/ui/popup';
import { YearPicker } from './pickers/YearPicker';
import { MonthPicker } from './pickers/MonthPicker';
import { DayPicker } from './pickers/DayPicker';
import { useDateSelector } from './hooks/useDateSelector';
import { useDateSelectorResult } from './hooks/useDateSelectorResult';
import { CalendarType, RangeType } from '@/lib/date-selector-utils';

// Required result format for the stepper
export type DateSelectorResult =
    | { type: 'monthly', start: string }                    // start = first day of selected month
    | { type: 'weekly', start: string, end: string }        // week range (both strings)
    | { type: 'daily', start: string }                      // exact day (start of day)

interface DateSelectorStepperProps {
    rangeType: RangeType;
    calendarType: CalendarType;
    currentDate: string | Date | any;
    isOpen?: boolean;
    onCancel: () => void;
    onConfirm: (result: DateSelectorResult) => void;
    setCurrentDate: (date: string | Date | any) => void;
}

export default function DateSelectorStepper({
    currentDate,
    calendarType,
    rangeType,
    onCancel,
    onConfirm,
    isOpen,
    setCurrentDate
}: DateSelectorStepperProps) {
    // Use custom hooks for state management
    const [state, actions] = useDateSelector(currentDate, calendarType, rangeType, isOpen || false);
    const { generateResult } = useDateSelectorResult(calendarType, rangeType);

    // Handle confirmation
    const handleConfirm = () => {
        if (!state.selectedYear || !state.selectedMonth) return;

        const dayToUse = rangeType === 'monthly' ? 1 : (state.selectedDay || 1);
        const result = generateResult(state.selectedYear, state.selectedMonth, dayToUse);

        onConfirm(result);
    };

    // Render current step based on state
    const renderCurrentStep = () => {
        switch (state.step) {
            case 'year':
                return (
                    <YearPicker
                        selectedYear={state.selectedYear}
                        visibleStartYear={state.visibleStartYear}
                        calendarType={calendarType}
                        onYearSelect={actions.handleYearSelect}
                        onYearRangeChange={actions.handleYearRangeChange}
                        onCancel={onCancel}
                        onConfirm={() => actions.setStep('month')}
                    />
                );
            case 'month':
                return (
                    <MonthPicker
                        selectedYear={state.selectedYear}
                        selectedMonth={state.selectedMonth}
                        calendarType={calendarType}
                        rangeType={rangeType}
                        onMonthSelect={actions.handleMonthSelect}
                        onStepChange={actions.setStep}
                        onCancel={onCancel}
                        onConfirm={handleConfirm}
                        onContinue={() => actions.setStep('day')}
                    />
                );
            case 'day':
                return (
                    <DayPicker
                        selectedYear={state.selectedYear}
                        selectedMonth={state.selectedMonth}
                        selectedDay={state.selectedDay}
                        calendarType={calendarType}
                        onDaySelect={actions.handleDaySelect}
                        onMonthNavigate={actions.handleMonthNavigate}
                        onCancel={onCancel}
                        onConfirm={handleConfirm}
                    />
                );
            default:
                return null;
        }
    };

    return (
        <PopUp>
            <div className="w-[545px] py-3 px-6 flex flex-col gap-4">
                <div className="w-full">
                    {renderCurrentStep()}
                </div>
            </div>
        </PopUp>
    );
}
