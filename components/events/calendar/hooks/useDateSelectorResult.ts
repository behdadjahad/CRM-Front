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
        const gregorianDate = revertDateWithTimeZone({
            year,
            month,
            day
        }, calendarType);

        if (rangeType === 'monthly') {
            const startOfMonth = revertDateWithTimeZone({
                year,
                month,
                day: 1
            }, calendarType);

            return { type: 'monthly', start: startOfMonth };
        }

        if (rangeType === 'weekly') {
            const weekRange = generateWeekVisibleRange(gregorianDate, calendarType);

            return {
                type: 'weekly',
                start: weekRange.start.toISOString().split('T')[0],
                end: weekRange.end.toISOString().split('T')[0]
            };
        }

        // daily
        return { type: 'daily', start: gregorianDate };
    }, [calendarType, rangeType]);

    return { generateResult };
};
