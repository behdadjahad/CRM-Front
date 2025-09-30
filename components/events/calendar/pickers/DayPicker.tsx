import React from 'react';
import { ArrowLeft, ArrowRight } from 'lucide-react';
import { cn } from '@/lib/utils';
import { CalendarType, getDaysInMonth, getMonthNames, getTodayDateInfo, RangeType } from '@/lib/date-selector-utils';
import { revertDateWithTimeZone, weekdaysMap, generateWeekVisibleRange } from '@/lib/calendar';
import { Button } from '@/components/ui/button';

interface DayPickerProps {
    selectedYear: number;
    selectedMonth: number;
    selectedDay: number;
    calendarType: CalendarType;
    onDaySelect: (day: number) => void;
    onMonthNavigate: (direction: 'prev' | 'next') => void;
    onCancel: () => void;
    onConfirm: () => void;
    rangeType: RangeType;
}

export const DayPicker: React.FC<DayPickerProps> = ({
    selectedYear,
    selectedMonth,
    selectedDay,
    calendarType,
    onDaySelect,
    onMonthNavigate,
    onCancel,
    rangeType,
    onConfirm
}) => {
    const days = getDaysInMonth(selectedYear, selectedMonth, calendarType);
    const monthNames = getMonthNames(selectedYear, calendarType);
    const currentMonthName = selectedMonth ? monthNames[selectedMonth - 1] : '';
    const daysOfWeek = weekdaysMap[calendarType] || weekdaysMap.jalali;
    const firstDayDate = new Date(revertDateWithTimeZone({
        year: selectedYear,
        month: selectedMonth,
        day: 1
    }, calendarType));
    const firstDayWeekday = (firstDayDate.getDay() + 1) % 7; // Adjust for your header order

    // ADD THIS DEBUGGING:
    console.log('Date conversion debug:');
    console.log('Jalali date:', selectedYear, selectedMonth, selectedDay);
    console.log('Gregorian conversion result:', revertDateWithTimeZone({
        year: selectedYear,
        month: selectedMonth,
        day: selectedDay
    }, calendarType));
    console.log('Date object created:', firstDayDate);
    console.log('Weekday index:', firstDayWeekday);
    console.log('Expected weekday name:', ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'][firstDayWeekday]);



    const handleQuickSelect = (type: 'today' | 'thisMonth' | 'thisWeek') => {
        const todayInfo = getTodayDateInfo(calendarType);
        // Only set the day if user explicitly selects it
        if (type === 'today') {
            onDaySelect(todayInfo.day);
        }
    };

    // Function to check if a day is in the same week as selected day
    const isInSelectedWeek = (day: number) => {
        if (rangeType !== 'weekly' || !selectedDay) return false;

        try {
            // Create date string for the selected day
            const selectedDateStr = revertDateWithTimeZone({
                year: selectedYear,
                month: selectedMonth,
                day: selectedDay
            }, calendarType);

            // Get the week range for the selected day
            const selectedWeekRange = generateWeekVisibleRange(selectedDateStr, calendarType);

            // Create date string for the current day we're checking
            const currentDateStr = revertDateWithTimeZone({
                year: selectedYear,
                month: selectedMonth,
                day: day
            }, calendarType);

            // Check if the current day falls within the selected day's week range
            const currentDate = new Date(currentDateStr);
            return currentDate >= selectedWeekRange.start && currentDate <= selectedWeekRange.end;
        } catch (error) {
            console.error('Error checking week range:', error);
            return false;
        }
    };

    return (
        <div className="bg-white  rounded-b-3xl">
            {/* Top Navigation */}
            {/* <div className="flex justify-center gap-4 p-4 border-b">
                <button
                    onClick={() => handleQuickSelect('today')}
                    className="px-3 py-1 text-sm bg-blue-500 text-white rounded-lg"
                >
                    امروز
                </button>
                <button
                    onClick={() => {
                        // Navigate to current month but don't change selected day
                        const todayInfo = getTodayDateInfo(calendarType);
                        // This would need to be handled by parent component
                        // For now, just select today's day
                        onDaySelect(todayInfo.day);
                    }}
                    className="px-3 py-1 text-sm text-gray-600 hover:bg-gray-100 rounded-lg"
                >
                    این ماه
                </button>
                <button
                    onClick={() => {
                        // Navigate to current week but don't change selected day
                        const todayInfo = getTodayDateInfo(calendarType);
                        // This would need to be handled by parent component
                        // For now, just select today's day
                        onDaySelect(todayInfo.day);
                    }}
                    className="px-3 py-1 text-sm text-gray-600 hover:bg-gray-100 rounded-lg"
                >
                    این هفته
                </button>
            </div> */}


            {/* Days of Week Header */}
            <div className="grid grid-cols-7 gap-1 px-4 py-2 ">

                {daysOfWeek.map((day, index) => (
                    <div key={index} className="text-center text-sm font-medium text-[#72777C]">
                        {day}
                    </div>
                ))}
            </div>

            {/* Day Grid */}
            <div className="grid grid-cols-7 gap-1 p-4">
                {/* Create a complete grid with empty cells and days */}
                {(() => {
                    const totalCells = 42; // 6 rows × 7 days
                    const cells = [];

                    // Add empty cells before the first day
                    for (let i = 0; i < firstDayWeekday; i++) {
                        cells.push(
                            <div key={`empty-${i}`} className="w-8 h-8"></div>
                        );
                    }

                    // Add the actual days
                    days.forEach(day => {
                        const isSelected = day === selectedDay;
                        const isInWeek = isInSelectedWeek(day);

                        cells.push(
                            <button
                                key={day}
                                onClick={() => onDaySelect(day)}
                                className={cn(
                                    "w-8 h-8 rounded-full text-sm font-medium transition-colors",
                                    isSelected
                                        ? "border-[#2949A4] border text-[#2949A4]"
                                        : isInWeek
                                            ? "bg-blue-100 text-blue-700 "
                                            : "hover:bg-gray-100"
                                )}
                            >
                                {day}
                            </button>
                        );
                    });

                    return cells;
                })()}
            </div>

            {/* Action Buttons */}

            <div className="flex justify-center gap-3 px-4 pt-8 ">
                <Button
                    variant="foreground"
                    onClick={onCancel}
                    className=" text-sm w-44"
                >
                    لغو
                </Button>
                <Button
                    variant="info"
                    onClick={onConfirm}
                    className=" text-sm w-44"
                >
                    تایید
                </Button>
            </div>

            {/* Bottom Navigation */}
            {/* <div className="flex justify-center gap-4 p-4 border-t bg-gray-50">
                <button
                    onClick={() => handleQuickSelect('today')}
                    className="px-3 py-1 text-sm text-gray-600 hover:bg-gray-100 rounded-lg"
                >
                    امروز
                </button>
                <button
                    onClick={() => {
                        // Navigate to current month but don't change selected day
                        const todayInfo = getTodayDateInfo(calendarType);
                        // This would need to be handled by parent component
                        // For now, just select today's day
                        onDaySelect(todayInfo.day);
                    }}
                    className="px-3 py-1 text-sm bg-blue-500 text-white rounded-lg"
                >
                    این ماه
                </button>
                <button
                    onClick={() => {
                        // Navigate to current week but don't change selected day
                        const todayInfo = getTodayDateInfo(calendarType);
                        // This would need to be handled by parent component
                        // For now, just select today's day
                        onDaySelect(todayInfo.day);
                    }}
                    className="px-3 py-1 text-sm text-gray-600 hover:bg-gray-100 rounded-lg"
                >
                    این هفته
                </button>
            </div> */}
        </div>
    );
};
