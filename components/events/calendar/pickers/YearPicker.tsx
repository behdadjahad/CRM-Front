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
    onCancel,
    onConfirm
}) => {
    const years = Array.from({ length: 12 }, (_, i) => visibleStartYear + i);

    const handleQuickSelect = (type: 'today' | 'thisMonth' | 'thisWeek') => {
        const todayInfo = getTodayDateInfo(calendarType);
        onYearSelect(todayInfo.year);
    };

    return (
        <div className="bg-white  rounded-b-3xl">



          
            <div className="grid grid-cols-3 gap-3 p-4">
                {years.map(year => (
                    <div className="w-full flex justify-center items-center">


                        <button
                            key={year}
                            onClick={() => onYearSelect(year)}
                            className={cn(
                                "py-1 px-4  rounded-full text-sm font-medium transition-colors",
                                year === selectedYear
                                    ? "border-[#2949A4] border text-[#2949A4]"
                                    : "hover:bg-gray-100 "
                            )}
                        >
                            {year}
                        </button>
                    </div>
                ))}
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
                    className="text-sm w-44"
                >
                    تایید
                </Button>
            </div>


        </div>
    );
};
