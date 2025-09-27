export function convertDaysToMonths(days: number) {
    if (typeof days !== "number" || isNaN(days)) return null;

    // Less than 30 days - return just days
    if (days < 30) {
        return `${days} روز`;
    }

    const months = Math.floor(days / 30);
    const remainingDays = days % 30;

    // Exactly divisible by 30 - return just months
    if (remainingDays === 0) {
        return `${months} ماه`;
    }

    // Has both months and remaining days
    return `${months} ماه و ${remainingDays} روز`;
}
