import {
    calculateWeekRange,
    formatDateForDisplay,
    getFirstDayOfMonth,
    validateDateSelection
} from '../lib/calendar-modal-utils';

describe('Calendar Modal Utilities', () => {
    describe('calculateWeekRange', () => {
        test('should calculate week range for Jalali calendar', () => {
            // Test with a known date - 1403-07-06 (6 Mehr 1403)
            const result = calculateWeekRange('2024-09-27', 'jalali'); // Equivalent Gregorian

            expect(result).toHaveProperty('start');
            expect(result).toHaveProperty('end');
            expect(result.start).toMatch(/\d{4}-\d{2}-\d{2}/);
            expect(result.end).toMatch(/\d{4}-\d{2}-\d{2}/);
        });

        test('should calculate week range for Gregorian calendar', () => {
            const result = calculateWeekRange('2024-09-27', 'gregory');

            expect(result).toHaveProperty('start');
            expect(result).toHaveProperty('end');
            // Week should be 7 days
            const startDate = new Date(result.start);
            const endDate = new Date(result.end);
            const diffInDays = (endDate.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24);
            expect(diffInDays).toBe(6); // 7 days total (start + 6)
        });

        test('should calculate week range for Hijri calendar', () => {
            const result = calculateWeekRange('2024-09-27', 'hijri');

            expect(result).toHaveProperty('start');
            expect(result).toHaveProperty('end');
            expect(result.start).toMatch(/\d{4}-\d{2}-\d{2}/);
        });
    });

    describe('formatDateForDisplay', () => {
        test('should format date for display in different formats', () => {
            const testDate = '2024-09-27';

            const fullFormat = formatDateForDisplay(testDate, 'gregory', 'full');
            const monthYearFormat = formatDateForDisplay(testDate, 'gregory', 'month-year');
            const dayFormat = formatDateForDisplay(testDate, 'gregory', 'day');

            expect(fullFormat).toContain('27');
            expect(monthYearFormat).toContain('2024');
            expect(dayFormat).toBe('27');
        });
    });

    describe('getFirstDayOfMonth', () => {
        test('should return first day of month in YYYY-MM-DD format', () => {
            const result = getFirstDayOfMonth(1403, 7, 'jalali');

            expect(result).toMatch(/\d{4}-\d{2}-01/);
        });

        test('should handle different calendar types', () => {
            const jalaliResult = getFirstDayOfMonth(1403, 7, 'jalali');
            const gregoryResult = getFirstDayOfMonth(2024, 9, 'gregory');
            const hijriResult = getFirstDayOfMonth(1446, 3, 'hijri');

            expect(jalaliResult).toMatch(/\d{4}-\d{2}-01/);
            expect(gregoryResult).toMatch(/\d{4}-\d{2}-01/);
            expect(hijriResult).toMatch(/\d{4}-\d{2}-01/);
        });
    });

    describe('validateDateSelection', () => {
        test('should validate correct date formats', () => {
            expect(validateDateSelection('2024-09-27', 'monthly', 'gregory')).toBe(true);
            expect(validateDateSelection('2024-09-27', 'weekly', 'jalali')).toBe(true);
            expect(validateDateSelection('2024-09-27', 'daily', 'hijri')).toBe(true);
        });

        test('should reject invalid date formats', () => {
            expect(validateDateSelection('invalid-date', 'monthly', 'gregory')).toBe(false);
            expect(validateDateSelection('', 'weekly', 'jalali')).toBe(false);
            expect(validateDateSelection('2024-13-45', 'daily', 'hijri')).toBe(false);
        });
    });

    describe('Edge Cases', () => {
        test('should handle leap years correctly', () => {
            // Test with Persian leap year
            const leapYearResult = getFirstDayOfMonth(1403, 12, 'jalali'); // Esfand in leap year
            expect(leapYearResult).toBeTruthy();
        });

        test('should handle month boundaries', () => {
            // Test end of year transitions
            const endOfYear = calculateWeekRange('2024-12-31', 'gregory');
            expect(endOfYear.start).toBeTruthy();
            expect(endOfYear.end).toBeTruthy();
        });

        test('should handle different weekend starts', () => {
            // Persian calendar starts week on Saturday
            const saturdayWeek = calculateWeekRange('2024-09-28', 'jalali'); // A Saturday
            expect(saturdayWeek.start).toBeTruthy();
        });
    });
});
