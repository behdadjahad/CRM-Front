import React from 'react';
import { ArrowLeft, ArrowRight } from 'lucide-react';
import { cn } from '@/lib/utils';
import { CalendarType, getDaysInMonth, getMonthNames, getTodayDateInfo, RangeType, weekdaysMapShort } from '@/lib/date-selector-utils';
import { revertDateWithTimeZone, generateWeekVisibleRange } from '@/lib/calendar';
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
    const daysOfWeek = weekdaysMapShort[calendarType] || weekdaysMapShort.jalali;
    const firstDayDate = new Date(revertDateWithTimeZone({
        year: selectedYear,
        month: selectedMonth,
        day: 1
    }, calendarType));
    const firstDayWeekday = (firstDayDate.getDay() + 1) % 7;




    const handleQuickSelect = (type: 'today' | 'thisMonth' | 'thisWeek') => {
        const todayInfo = getTodayDateInfo(calendarType);

        if (type === 'today') {
            onDaySelect(todayInfo.day);
        }
    };


    const isInSelectedWeek = (day: number) => {
        if (rangeType !== 'weekly' || !selectedDay) return false;

        try {

            const selectedDateStr = revertDateWithTimeZone({
                year: selectedYear,
                month: selectedMonth,
                day: selectedDay
            }, calendarType);


            const selectedWeekRange = generateWeekVisibleRange(selectedDateStr, calendarType);


            const currentDateStr = revertDateWithTimeZone({
                year: selectedYear,
                month: selectedMonth,
                day: day
            }, calendarType);


            const currentDate = new Date(currentDateStr);
            return currentDate >= selectedWeekRange.start && currentDate <= selectedWeekRange.end;
        } catch (error) {
            console.error('Error checking week range:', error);
            return false;
        }
    };

    return (
        <div className="bg-white  rounded-b-3xl">



            <div className="grid grid-cols-7 gap-1 px-4 py-2 ">

                {daysOfWeek.map((day, index) => (
                    <div key={index} className="text-center text-sm font-medium text-static-text-calendar">
                        {day}
                    </div>
                ))}
            </div>


            <div className="grid grid-cols-7 gap-1 p-4">

                {(() => {
                    const totalCells = 42;
                    const cells = [];


                    for (let i = 0; i < firstDayWeekday; i++) {
                        cells.push(
                            <div key={`empty-${i}`} className="w-8 h-8"></div>
                        );
                    }


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
                                        ? "border-static-primary-blue-dark border text-static-primary-blue-dark"
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

        </div>
    );
};
