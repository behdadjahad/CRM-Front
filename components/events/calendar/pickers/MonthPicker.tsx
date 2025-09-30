import React from 'react';
import { ArrowLeft, ArrowRight } from 'lucide-react';
import { cn } from '@/lib/utils';
import { CalendarType, RangeType, getMonthNames, getTodayDateInfo } from '@/lib/date-selector-utils';
import { Button } from '@/components/ui/button';

interface MonthPickerProps {
    selectedYear: number;
    selectedMonth: number;
    calendarType: CalendarType;
    rangeType: RangeType;
    onMonthSelect: (month: number) => void;
    onStepChange: (step: 'year') => void;
    onCancel: () => void;
    onConfirm: () => void;
    onContinue?: () => void;
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
        } else if (onContinue) {
            onContinue();
        }
    };

    return (
        <div className="bg-white  rounded-b-3xl">

            {/* Month Grid */}
            <div className="grid grid-cols-3 gap-3 p-4">
                {monthNames.map((name, index) => (
                    <div className="w-full flex justify-center items-center">
                        
                    <button
                        key={index}
                        onClick={() => onMonthSelect(index + 1)}
                        className={cn(
                            "py-1 px-4 rounded-full text-sm font-medium transition-colors",
                            index + 1 === selectedMonth
                                ? "border-[#2949A4] border text-[#2949A4]"
                                : "bg-white text-gray-800 hover:bg-gray-50"
                        )}
                    >
                        {name}
                    </button>
                    </div>
                ))}
            </div>

            {/* Action Buttons */}
            <div className="flex justify-center gap-3 px-4 pt-8 ">
                <Button
                    variant="foreground"
                    onClick={onCancel}
                    className="text-sm w-44"
                >
                    لغو
                </Button>
                <Button
                    variant="info"
                    onClick={rangeType === 'monthly' ? onConfirm : (onContinue || onConfirm)}
                    className=" text-sm w-44"
                >
                    تایید
                </Button>
            </div>

            {/* Quick Select Options */}

        </div>
    );
};
