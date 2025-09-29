import React from 'react';
import { ArrowLeft, ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { CalendarType, getTodayDateInfo } from '@/lib/date-selector-utils';

interface YearPickerProps {
    selectedYear: number;
    visibleStartYear: number;
    calendarType: CalendarType;
    onYearSelect: (year: number) => void;
    onYearRangeChange: (offset: number) => void;
    onCancel: () => void;
    onConfirm: () => void;
}

export const YearPicker: React.FC<YearPickerProps> = ({
    selectedYear,
    visibleStartYear,
    calendarType,
    onYearSelect,
    onYearRangeChange,
    onCancel,
    onConfirm
}) => {
    const years = Array.from({ length: 12 }, (_, i) => visibleStartYear + i);

    const handleQuickSelect = (type: 'today' | 'thisMonth' | 'thisWeek') => {
        const todayInfo = getTodayDateInfo(calendarType);
        onYearSelect(todayInfo.year);
    };

    return (
        <div className="bg-white rounded-lg shadow-sm border">
            {/* Header */}
            <div className="flex items-center justify-between p-4 border-b">
                <div className="text-lg font-semibold">{selectedYear}</div>
                <div className="flex items-center gap-2">
                    <button
                        onClick={() => onYearRangeChange(-12)}
                        className="p-1 hover:bg-gray-100 rounded"
                    >
                        <ArrowLeft className="w-4 h-4" />
                    </button>
                    <button
                        onClick={() => onYearRangeChange(12)}
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
                        onClick={() => onYearSelect(year)}
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
                    variant="transparent"
                    onClick={onCancel}
                    className="bg-[#B6BCC2] text-card text-sm w-44"
                >
                    لغو
                </Button>
                <Button
                    variant="transparent"
                    onClick={onConfirm}
                    className="bg-[#4573FE] text-card text-sm w-44"
                >
                    تایید
                </Button>
            </div>

            {/* Quick Select Options */}
            <div className="p-4 border-t bg-gray-50">
                <div className="flex justify-center gap-4 text-sm">
                    <button
                        onClick={() => handleQuickSelect('thisWeek')}
                        className="text-blue-600 hover:text-blue-800 transition-colors"
                    >
                        این هفته
                    </button>
                    <button
                        onClick={() => handleQuickSelect('thisMonth')}
                        className="text-blue-600 hover:text-blue-800 transition-colors"
                    >
                        این ماه
                    </button>
                    <button
                        onClick={() => handleQuickSelect('today')}
                        className="text-blue-600 hover:text-blue-800 transition-colors"
                    >
                        امروز
                    </button>
                </div>
            </div>
        </div>
    );
};
