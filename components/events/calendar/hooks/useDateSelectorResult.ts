import { useCallback } from 'react';
import { revertDateWithTimeZone, generateWeekVisibleRange } from '@/lib/calendar';
import { CalendarType, RangeType } from '@/lib/date-selector-utils';

export interface DateSelectorResult {
    type: 'monthly' | 'weekly' | 'daily';
    start: string;
    end?: string;
}

export const useDateSelectorResult = (
    calendarType: CalendarType,
    rangeType: RangeType
) => {
    const generateResult = useCallback((
        year: number,
        month: number,
        day: number
    ): DateSelectorResult => {
        console.log('useDateSelectorResult - generateResult called with:', { year, month, day, calendarType, rangeType });
    
        const gregorianDate = revertDateWithTimeZone({
            year,
            month,
            day
        }, calendarType);
        console.log('revertDateWithTimeZone result (Gregorian):', gregorianDate);
        if (rangeType === 'monthly') {
            const startOfMonth = revertDateWithTimeZone({
                year,
                month,
                day: 1
            }, calendarType);

            return { type: 'monthly', start: startOfMonth };
        }

        if (rangeType === 'weekly') {
            console.log('Calculating weekly range for Gregorian date:', gregorianDate);
            const weekRange = generateWeekVisibleRange(gregorianDate, calendarType);
            console.log('Week range calculated:', weekRange);
            console.log('Week start (Gregorian):', weekRange.start);
            console.log('Week end (Gregorian):', weekRange.end);
            console.log('weekRange.start.toISOString():', weekRange.start.toISOString());
            console.log('weekRange.start.toISOString().split(\'T\')[0]:', weekRange.start.toISOString().split('T')[0]);
            console.log('weekRange.start.toLocaleDateString():', weekRange.start.toLocaleDateString());
            return {
                type: 'weekly',
                // start: weekRange.start.toISOString().split('T')[0],
                // end: weekRange.end.toISOString().split('T')[0]
                start: `${weekRange.start.getFullYear()}-${String(weekRange.start.getMonth() + 1).padStart(2, '0')}-${String(weekRange.start.getDate()).padStart(2, '0')}`,
                end: `${weekRange.end.getFullYear()}-${String(weekRange.end.getMonth() + 1).padStart(2, '0')}-${String(weekRange.end.getDate()).padStart(2, '0')}`
            
            };
        }

        // daily
        return { type: 'daily', start: gregorianDate };
    }, [calendarType, rangeType]);

    return { generateResult };
};
