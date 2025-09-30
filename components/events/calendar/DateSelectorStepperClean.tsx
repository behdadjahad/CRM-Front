"use client";
import React from 'react';
import { ArrowLeft, ArrowRight, ArrowUpNarrowWide, ChevronLeft, ChevronRight } from 'lucide-react';
import PopUp from '@/components/ui/popup';
import { YearPicker } from './pickers/YearPicker';
import { MonthPicker } from './pickers/MonthPicker';
import { DayPicker } from './pickers/DayPicker';
import { useDateSelector } from './hooks/useDateSelector';
import { useDateSelectorResult } from './hooks/useDateSelectorResult';
import { CalendarType, RangeType, getMonthNames, getTodayDateInfo } from '@/lib/date-selector-utils';

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
    onReset?: () => void;
}

export default function DateSelectorStepper({
    currentDate,
    calendarType,
    rangeType,
    onCancel,
    onConfirm,
    isOpen,
    setCurrentDate,
    onReset
}: DateSelectorStepperProps) {
    // Use custom hooks for state management
    const [state, actions] = useDateSelector(currentDate, calendarType, rangeType, isOpen || false);
    const { generateResult } = useDateSelectorResult(calendarType, rangeType);

    // Handle reset when modal is closed
    React.useEffect(() => {
        if (!isOpen && onReset) {
            onReset();
        }
    }, [isOpen, onReset]);

    // Handle confirmation
    const handleConfirm = () => {
        if (!state.selectedYear || !state.selectedMonth) return;

        const dayToUse = rangeType === 'monthly' ? 1 : (state.selectedDay || 1);

        console.log('DateSelectorStepper - handleConfirm called');
        console.log('State values:', {
            selectedYear: state.selectedYear,
            selectedMonth: state.selectedMonth,
            selectedDay: state.selectedDay,
            rangeType
        });
        console.log('dayToUse for generateResult:', dayToUse);
        const hookResult = generateResult(state.selectedYear, state.selectedMonth, dayToUse);

        // Convert hook result to stepper result format
        let result: DateSelectorResult;

        if (hookResult.type === 'weekly') {
            result = {
                type: 'weekly',
                start: hookResult.start,
                end: hookResult.end || hookResult.start
            };
        } else if (hookResult.type === 'monthly') {
            result = {
                type: 'monthly',
                start: hookResult.start
            };
        } else {
            result = {
                type: 'daily',
                start: hookResult.start
            };
        }

        onConfirm(result);
    };


    const renderNavigationHeader = () => {
        const monthNames = getMonthNames(state.selectedYear, calendarType);
        const currentMonthName = state.selectedMonth ? monthNames[state.selectedMonth - 1] : '';

        switch (state.step) {
            case 'year':
                return (
                    <div className="flex flex-col rounded-t-3xl">
                        <div className="flex items-center px-10 py-2 justify-between">
                            <button
                                onClick={() => actions.handleYearRangeChange(+12)}
                                className="p-1 hover:bg-gray-100 rounded"
                            >
                                <ChevronRight className="w-4 h-4" />
                            </button>
                            <div className="text-lg font-normal text-gray-700">
                               {state.selectedYear}
                            </div>
                            <button
                                onClick={() => actions.handleYearRangeChange(-12)}
                                className="p-1 hover:bg-gray-100 rounded"
                            >
                                <ChevronLeft className="w-4 h-4" />
                            </button>
                        </div>
                        <div className="flex justify-center p-3  bg-white">
                            <button
                                onClick={() => {
                                    const todayInfo = getTodayDateInfo(calendarType);
                                    actions.setSelectedYear(todayInfo.year);
                                    actions.setVisibleStartYear(todayInfo.year - 4);
                                }}
                                className=" text-base font-medium w-full bg-[#F5FBFF] text-[#2949A4] rounded-[6px] hover:bg-blue-50 transition-colors py-2.5  "
                            >
                                این سال
                            </button>
                        </div>
                    </div>
                );
            case 'month':
                return (
                    <div className="flex flex-col rounded-t-3xl">
                        <div className="flex rounded-t-3xl px-10 py-2 items-center justify-between  bg-white">
                            <button
                                onClick={() => actions.handleYearNavigate('next')}

                                className="p-1 hover:bg-gray-100 rounded"
                            >
                                <ChevronRight className="w-4 h-4" />
                            </button>
                            <div className="flex items-center justify-center  bg-white">
                                <button
                                    onClick={() => actions.setStep('year')}
                                    className="text-lg font-normal hover:bg-gray-100 rounded transition-colors"
                                >
                                    {state.selectedYear}
                                </button>
                            </div>
                            <button
                                onClick={() => actions.handleYearNavigate('prev')}
                                className="p-1 hover:bg-gray-100 rounded"
                            >
                                <ChevronLeft className="w-4 h-4" />
                            </button>
                        </div>

                        <div className="flex justify-center p-3  bg-white">
                            <button
                                onClick={() => {
                                    const todayInfo = getTodayDateInfo(calendarType);
                                    actions.setSelectedMonth(todayInfo.month);
                                    actions.setSelectedYear(todayInfo.year);
                                }}
                                className=" text-base font-medium w-full bg-[#F5FBFF] text-[#2949A4] rounded-[6px] hover:bg-blue-50 transition-colors py-2.5  "
                            >
                                این ماه
                            </button>
                        </div>
                    </div>
                );
            case 'day':
                return (
                    <div className="flex flex-col rounded-t-3xl">

                        <div className="flex rounded-t-3xl px-10 py-2 items-center justify-between bg-white">
                            <button
                                onClick={() => actions.handleMonthNavigate('next')}
                                className="p-1 hover:bg-gray-100 rounded"
                            >
                                <ChevronRight className="w-4 h-4" />
                            </button>
                            <div className="text-lg font-normal flex gap-2">
                                {rangeType !== 'monthly' && (
                                    <button
                                        onClick={() => actions.setStep('month')}
                                        className="hover:bg-gray-100 px-2 py-1 rounded transition-colors"
                                    >
                                        {currentMonthName}
                                    </button>
                                )}
                                <button
                                    onClick={() => actions.setStep('year')}
                                    className="hover:bg-gray-100 px-2 py-1 rounded transition-colors"
                                >
                                    {state.selectedYear}
                                </button>
                            </div>
                            <button
                                onClick={() => actions.handleMonthNavigate('prev')}
                                className="p-1 hover:bg-gray-100 rounded"
                            >
                                <ChevronLeft className="w-4 h-4" />
                            </button>
                        </div>
                        <div className="flex justify-center  p-3  bg-white">

                            {rangeType === 'weekly' ? (
                                <button
                                    onClick={() => {
                                        const todayInfo = getTodayDateInfo(calendarType);
                                        actions.setSelectedDay(todayInfo.day);
                                        actions.setSelectedMonth(todayInfo.month);
                                        actions.setSelectedYear(todayInfo.year);
                                    }}
                                    className=" text-base font-medium w-full bg-[#F5FBFF] text-[#2949A4] rounded-[6px] hover:bg-blue-50 transition-colors py-2.5  "
                                >
                                    این هفته
                                </button>
                            ) : (<button
                                onClick={() => {
                                    const todayInfo = getTodayDateInfo(calendarType);
                                    actions.setSelectedDay(todayInfo.day);
                                    actions.setSelectedMonth(todayInfo.month);
                                    actions.setSelectedYear(todayInfo.year);
                                }}
                                className=" text-base font-medium w-full bg-[#F5FBFF] text-[#2949A4] rounded-[6px] hover:bg-blue-50 transition-colors py-2.5  "
                            >
                                امروز
                            </button>)}
                        </div>

                    </div>
                );
            default:
                return null;
        }
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
                        onContinue={rangeType !== 'monthly' ? () => actions.setStep('day') : undefined}
                    />
                );
            case 'day':
                return (
                    <DayPicker
                        rangeType={rangeType}
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
            <div className="w-[376px] p-5   flex flex-col">
                {/* <div className="bg-white custom-shadow rounded-3xl"> */}

                {renderNavigationHeader()}
                <div className="flex-1">
                    {renderCurrentStep()}
                </div>
                </div>
            {/* </div> */}
        </PopUp>
    );
}
