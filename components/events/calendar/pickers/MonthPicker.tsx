import React from 'react';
import { ArrowLeft, ArrowRight } from 'lucide-react';
import { cn } from '@/lib/utils';
import { CalendarType, RangeType, getMonthNames, getTodayDateInfo } from '@/lib/date-selector-utils';

interface MonthPickerProps {
    selectedYear: number;
    selectedMonth: number;
    calendarType: CalendarType;
    rangeType: RangeType;
    onMonthSelect: (month: number) => void;
    onStepChange: (step: 'year') => void;
    onCancel: () => void;
    onConfirm: () => void;
    onContinue: () => void;
}

export const MonthPicker: React.FC<MonthPickerProps> = ({
    selectedYear,
    selectedMonth,
    calendarType,
    rangeType,
    onMonthSelect,
    onStepChange,
    onCancel,
    onConfirm,
    onContinue
}) => {
    const monthNames = getMonthNames(selectedYear, calendarType);

    const handleQuickSelect = (type: 'today' | 'thisMonth' | 'thisWeek') => {
        const todayInfo = getTodayDateInfo(calendarType);
        onMonthSelect(todayInfo.month);

        if (rangeType === 'monthly') {
            onConfirm();
        } else {
            onContinue();
        }
    };

    return (
        <div className="bg-white rounded-lg border">
            {/* Header */}
            <div className="flex items-center justify-between p-4 border-b">
                <div className="text-lg font-semibold">{selectedYear}</div>
                <div className="flex items-center gap-2">
                    <button
                        onClick={() => onStepChange('year')}
                        className="p-1 hover:bg-gray-100 rounded text-blue-600"
                    >
                        <ArrowLeft className="w-4 h-4" />
                    </button>
                    <button
                        onClick={() => onStepChange('year')}
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
                        onClick={() => onMonthSelect(index + 1)}
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
                    onClick={rangeType === 'monthly' ? onConfirm : onContinue}
                    className="px-6 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
                >
                    {rangeType === 'monthly' ? 'تایید' : 'ادامه'}
                </button>
            </div>

            {/* Quick Select Options */}
            <div className="p-4 border-t bg-gray-50">
                <div className="flex justify-center gap-4 text-sm">
                    <button
                        onClick={() => handleQuickSelect('today')}
                        className="px-3 py-1 bg-white text-blue-600 rounded-lg hover:bg-blue-50 transition-colors border border-blue-200"
                    >
                        امروز
                    </button>
                    <button
                        onClick={() => handleQuickSelect('thisMonth')}
                        className="px-3 py-1 bg-white text-blue-600 rounded-lg hover:bg-blue-50 transition-colors border border-blue-200"
                    >
                        این ماه
                    </button>
                    <button
                        onClick={() => handleQuickSelect('thisWeek')}
                        className="px-3 py-1 bg-white text-blue-600 rounded-lg hover:bg-blue-50 transition-colors border border-blue-200"
                    >
                        این هفته
                    </button>
                </div>
            </div>
        </div>
    );
};
