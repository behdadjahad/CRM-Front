import { convertDateWithTimeZone, revertDateWithTimeZone, convertToGregorianYMD } from './calendar';
import dayjs from 'dayjs';
import moment from 'moment-hijri';

/**
 * Calculate week range containing the given date
 * Week starts on Saturday (index 6) for Persian calendar
 */
export function calculateWeekRange(
    dateString: string,
    calendarType: 'jalali' | 'hijri' | 'gregory'
): { start: string; end: string } {

    if (calendarType === 'jalali') {
        const date = dayjs(dateString);
        const dayOfWeek = date.day(); // 0=Sunday, 6=Saturday
        const diffToSaturday = (dayOfWeek + 1) % 7; // Week starts Saturday

        const startOfWeek = date.subtract(diffToSaturday, 'day');
        const endOfWeek = startOfWeek.add(6, 'day');

        return {
            start: startOfWeek.format('YYYY-MM-DD'),
            end: endOfWeek.format('YYYY-MM-DD')
        };
    }

    if (calendarType === 'hijri') {
        const date = moment(dateString);
        const dayOfWeek = date.day();
        const diffToSaturday = (dayOfWeek + 1) % 7;

        const startOfWeek = date.clone().subtract(diffToSaturday, 'days');
        const endOfWeek = startOfWeek.clone().add(6, 'days');

        return {
            start: startOfWeek.format('YYYY-MM-DD'),
            end: endOfWeek.format('YYYY-MM-DD')
        };
    }

    // Gregorian
    const date = dayjs(dateString);
    const dayOfWeek = date.day();
    const diffToSaturday = (dayOfWeek + 1) % 7;

    const startOfWeek = date.subtract(diffToSaturday, 'day');
    const endOfWeek = startOfWeek.add(6, 'day');

    return {
        start: startOfWeek.format('YYYY-MM-DD'),
        end: endOfWeek.format('YYYY-MM-DD')
    };
}

/**
 * Format date for display based on calendar type
 */
export function formatDateForDisplay(
    dateString: string,
    calendarType: 'jalali' | 'hijri' | 'gregory',
    format: 'full' | 'month-year' | 'day' = 'full'
): string {
    const dateInfo = convertDateWithTimeZone(dateString, calendarType);

    switch (format) {
        case 'month-year':
            return `${dateInfo.monthName} ${dateInfo.year}`;
        case 'day':
            return `${dateInfo.day}`;
        default:
            return `${dateInfo.day} ${dateInfo.monthName} ${dateInfo.year}`;
    }
}

/**
 * Get first day of month for given year/month in specified calendar
 */
export function getFirstDayOfMonth(
    year: number,
    month: number,
    calendarType: 'jalali' | 'hijri' | 'gregory'
): string {
    return revertDateWithTimeZone({ year, month, day: 1 }, calendarType);
}

/**
 * Get last day of month for given year/month in specified calendar
 */
export function getLastDayOfMonth(
    year: number,
    month: number,
    calendarType: 'jalali' | 'hijri' | 'gregory'
): string {
    // Get first day of next month, then subtract 1 day
    const nextMonth = month === 12 ? { year: year + 1, month: 1 } : { year, month: month + 1 };
    const firstDayNextMonth = revertDateWithTimeZone({ ...nextMonth, day: 1 }, calendarType);

    // Subtract 1 day to get last day of current month
    const lastDay = dayjs(firstDayNextMonth).subtract(1, 'day').format('YYYY-MM-DD');
    return lastDay;
}

/**
 * Validate if a date selection is valid for the given range type
 */
export function validateDateSelection(
    selectedDate: string,
    rangeType: 'monthly' | 'weekly' | 'daily',
    calendarType: 'jalali' | 'hijri' | 'gregory'
): boolean {
    try {
        const dateInfo = convertDateWithTimeZone(selectedDate, calendarType);
        return !!(dateInfo.year && dateInfo.month && dateInfo.day);
    } catch {
        return false;
    }
}

/**
 * Get display title for modal based on range type and current selection
 */
export function getModalTitle(
    rangeType: 'monthly' | 'weekly' | 'daily',
    calendarType: 'jalali' | 'hijri' | 'gregory',
    currentDate: string
): string {
    const titles = {
        monthly: 'انتخاب ماه',
        weekly: 'انتخاب هفته',
        daily: 'انتخاب روز'
    };

    return titles[rangeType];
}
