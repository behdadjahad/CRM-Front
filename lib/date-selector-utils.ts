import { convertDateWithTimeZone, revertDateWithTimeZone, getCalendarInfo, getTodayInGregorianYMD } from './calendar';

/**
 * Utility functions for DateSelectorStepper component
 */

// Constants
export const CALENDAR_TYPES = {
    JALALI: 'jalali',
    HIJRI: 'hijri',
    GREGORY: 'gregory'
} as const;

export const RANGE_TYPES = {
    MONTHLY: 'monthly',
    WEEKLY: 'weekly',
    DAILY: 'daily'
} as const;

export const STEPS = {
    YEAR: 'year',
    MONTH: 'month',
    DAY: 'day'
} as const;

// Types
export type CalendarType = typeof CALENDAR_TYPES[keyof typeof CALENDAR_TYPES];
export type RangeType = typeof RANGE_TYPES[keyof typeof RANGE_TYPES];
export type Step = typeof STEPS[keyof typeof STEPS];

export interface DateInfo {
    year: number;
    month: number;
    day: number;
    monthName?: string;
}

/**
 * Convert Persian/Arabic numerals to English numerals
 */
export const convertPersianToEnglish = (str: string): string => {
    const persianNumbers = ['۰', '۱', '۲', '۳', '۴', '۵', '۶', '۷', '۸', '۹'];
    const arabicNumbers = ['٠', '١', '٢', '٣', '٤', '٥', '٦', '٧', '٨', '٩'];
    const englishNumbers = ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9'];

    let result = str;

    // Convert Persian numerals
    persianNumbers.forEach((persian, index) => {
        result = result.replace(new RegExp(persian, 'g'), englishNumbers[index]);
    });

    // Convert Arabic numerals
    arabicNumbers.forEach((arabic, index) => {
        result = result.replace(new RegExp(arabic, 'g'), englishNumbers[index]);
    });

    return result;
};

/**
 * Safely convert currentDate to string format
 */
export const safeCurrentDateString = (currentDate: string | Date | any): string => {
    try {
        let dateString = '';

        if (typeof currentDate === 'string') {
            dateString = currentDate;
        } else if (currentDate instanceof Date) {
            dateString = currentDate.toISOString().split('T')[0];
        } else if (currentDate && typeof currentDate === 'object' && currentDate.toString) {
            dateString = currentDate.toString();
        } else {
            dateString = new Date().toISOString().split('T')[0];
        }

        return convertPersianToEnglish(dateString);
    } catch {
        return new Date().toISOString().split('T')[0];
    }
};

/**
 * Get today's year in the specified calendar type
 */
export const getTodayYear = (calendarType: CalendarType): number => {
    try {
        const todayStr = getTodayInGregorianYMD();
        return convertDateWithTimeZone(todayStr, calendarType).year;
    } catch {
        return new Date().getFullYear();
    }
};

/**
 * Get month names for the specified year and calendar type
 */
export const getMonthNames = (year: number, calendarType: CalendarType): string[] => {
    const monthNames: string[] = [];

    for (let i = 1; i <= 12; i++) {
        const dateStr = revertDateWithTimeZone({
            year,
            month: i,
            day: 1
        }, calendarType);

        const calendarInfo = getCalendarInfo(dateStr, calendarType);
        monthNames.push(calendarInfo.monthName);
    }

    return monthNames;
};

/**
 * Get days in the specified month
 */
export const getDaysInMonth = (year: number, month: number, calendarType: CalendarType): number[] => {
    const dateStr = revertDateWithTimeZone({
        year,
        month,
        day: 1
    }, calendarType);

    const calendarInfo = getCalendarInfo(dateStr, calendarType);
    const daysInMonth = calendarInfo.endDay;

    return Array.from({ length: daysInMonth }, (_, i) => i + 1);
};

/**
 * Navigate to previous/next month with proper calendar handling
 * Resets to current day of the new month
 */
export const navigateMonth = (
    year: number,
    month: number,
    direction: 'prev' | 'next',
    calendarType: CalendarType
): DateInfo => {
    let newYear = year;
    let newMonth = month;

    if (direction === 'prev') {
        if (newMonth === 1) {
            newYear = year - 1;
            newMonth = 12;
        } else {
            newMonth = month - 1;
        }
    } else {
        if (newMonth === 12) {
            newYear = year + 1;
            newMonth = 1;
        } else {
            newMonth = month + 1;
        }
    }

    // Get current day of the new month (today's day in the new month/year)
    const todayInfo = getTodayDateInfo(calendarType);

    // If we're navigating to the current month/year, use today's day
    // Otherwise, use day 1 as default
    let newDay = 1;
    if (newYear === todayInfo.year && newMonth === todayInfo.month) {
        newDay = todayInfo.day;
    }

    // Check if the day exists in the new month
    const newDateStr = revertDateWithTimeZone({
        year: newYear,
        month: newMonth,
        day: newDay
    }, calendarType);

    const calendarInfo = getCalendarInfo(newDateStr, calendarType);

    // If the calculated day doesn't exist in the new month, use the last day of the month
    if (newDay > calendarInfo.endDay) {
        newDay = calendarInfo.endDay;
    }

    return {
        year: newYear,
        month: newMonth,
        day: newDay
    };
};

/**
 * Get today's date info in the specified calendar type
 */
export const getTodayDateInfo = (calendarType: CalendarType): DateInfo => {
    const todayStr = getTodayInGregorianYMD();
    return convertDateWithTimeZone(todayStr, calendarType);
};
