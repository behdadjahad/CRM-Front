import React from 'react';
import { ArrowLeft, ArrowRight } from 'lucide-react';
import { cn } from '@/lib/utils';
import { CalendarType, getDaysInMonth, getMonthNames, getTodayDateInfo } from '@/lib/date-selector-utils';
import { weekdaysMap } from '@/lib/calendar';

interface DayPickerProps {
    selectedYear: number;
    selectedMonth: number;
    selectedDay: number;
    calendarType: CalendarType;
    onDaySelect: (day: number) => void;
    onMonthNavigate: (direction: 'prev' | 'next') => void;
    onCancel: () => void;
    onConfirm: () => void;
}

export const DayPicker: React.FC<DayPickerProps> = ({
    selectedYear,
    selectedMonth,
    selectedDay,
    calendarType,
    onDaySelect,
    onMonthNavigate,
    onCancel,
    onConfirm
}) => {
    const days = getDaysInMonth(selectedYear, selectedMonth, calendarType);
    const monthNames = getMonthNames(selectedYear, calendarType);
    const currentMonthName = selectedMonth ? monthNames[selectedMonth - 1] : '';
    const daysOfWeek = weekdaysMap[calendarType] || weekdaysMap.jalali;

    const handleQuickSelect = (type: 'today' | 'thisMonth' | 'thisWeek') => {
        const todayInfo = getTodayDateInfo(calendarType);
        // Only set the day if user explicitly selects it
        if (type === 'today') {
            onDaySelect(todayInfo.day);
        }
    };

    return (
        <div className="bg-white rounded-lg shadow-sm border">
            {/* Top Navigation */}
            <div className="flex justify-center gap-4 p-4 border-b">
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
            </div>

            {/* Calendar Header */}
            <div className="flex items-center justify-between p-4 border-b">
                <button
                    onClick={() => onMonthNavigate('prev')}
                    className="p-1 hover:bg-gray-100 rounded"
                >
                    <ArrowLeft className="w-4 h-4" />
                </button>
                <div className="text-lg font-semibold">
                    {currentMonthName} {selectedYear}
                </div>
                <button
                    onClick={() => onMonthNavigate('next')}
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
                        onClick={() => onDaySelect(day)}
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
                    onClick={onConfirm}
                    className="px-6 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
                >
                    تایید
                </button>
            </div>

            {/* Bottom Navigation */}
            <div className="flex justify-center gap-4 p-4 border-t bg-gray-50">
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
            </div>
        </div>
    );
};
