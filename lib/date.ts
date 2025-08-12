import moment from "moment-hijri";
import { toJalaali, toGregorian } from "jalaali-js";
import MomentTimezone from "moment-timezone";
import momentHijri from "moment-hijri";

//type DateType = "Lunar" | "Solar" | "Gregorian";

export function convertDate(dateStr: string, targetType: string): string {
 
  // Parse the input date in YYYY/MM/DD format
  dateStr=dateStr.split('T')[0].replace(/-/g, '/');
  const [year, month, day] = dateStr.split("/").map(Number);

  // Convert based on the target type
  if (targetType.toLowerCase() === "lunar") {
    // Convert to Hijri (Islamic) date using moment-hijri
    const hijriDate = moment([year, month - 1, day]).format("iYYYY/iMM/iDD");
    return hijriDate;
  } else if (targetType.toLowerCase() === "solar") {
    // Convert to Jalali (Persian) date using jalaali-js
    const jalaliDate = toJalaali(year, month, day);
    return `${jalaliDate.jy}/${String(jalaliDate.jm).padStart(2, "0")}/${String(
      jalaliDate.jd
    ).padStart(2, "0")}`;
  } else if (targetType.toLowerCase() === "gregorian") {
    // Return the Gregorian date as is
    return dateStr;
  } else {
    return ""
  }
}

export function convertDateTime(dateStr: string, targetType: string): string {
  const [datePart, timePartRaw] = dateStr.split("T");
  const timePart = timePartRaw?.substring(0, 5); // '09:41'

  const [year, month, day] = datePart.split("-").map(Number); // use '-' not '/'

  if (targetType.toLowerCase() === "lunar") {
    const hijriDate = moment([year, month - 1, day]).format("iYYYY/iMM/iDD");
    return `${hijriDate}-${timePart}`;
  } else if (targetType.toLowerCase() === "solar") {
    const jalaliDate = toJalaali(year, month, day);
    return `${jalaliDate.jy}/${String(jalaliDate.jm).padStart(2, "0")}/${String(
      jalaliDate.jd
    ).padStart(2, "0")}-${timePart}`;
  } else if (targetType.toLowerCase() === "gregorian") {
    return `${year}/${String(month).padStart(2, "0")}/${String(day).padStart(2, "0")}-${timePart}`;
  } else {
    return "";
  }
}

export function convertToGregorian(
  dateStr: string,
  targetType: string
): string {
  const persianToEnglish = (str: string) => {
    const persianDigits = "۰۱۲۳۴۵۶۷۸۹";
    const englishDigits = "0123456789";
    return str.replace(
      /[۰-۹]/g,
      (char) => englishDigits[persianDigits.indexOf(char)]
    );
  };
  dateStr = persianToEnglish(dateStr);
  const timeZone = "UTC+1:00";
  // Parse the input date in YYYY/MM/DD format
  const [year, month, day] = dateStr.split("/").map(Number);

  let gregorianDate: MomentTimezone.Moment;

  if (targetType.toLowerCase() === "lunar") {
    // Convert from Hijri to Gregorian using moment-hijri
    const gregorian = momentHijri(`${year}-${month}-${day}`, "iYYYY-iMM-iDD");
    gregorianDate = gregorian.tz(timeZone);
  } else if (targetType.toLowerCase() === "solar") {
    // Convert from Jalali (Persian) to Gregorian using jalaali-js
    const greg = toGregorian(year, month, day);
    gregorianDate = MomentTimezone.tz(
      `${greg.gy}-${greg.gm}-${greg.gd}`,
      "YYYY-MM-DD",
      timeZone
    );
  } else if (targetType.toLowerCase() === "gregorian") {
    // If it's already Gregorian, use moment.js and set the timezone
    gregorianDate = MomentTimezone.tz(
      `${year}-${month}-${day}`,
      "YYYY-MM-DD",
      timeZone
    );
  } else {
   return ""
  }
  return gregorianDate.utc().format("YYYY-MM-DDTHH:mm:ss[Z]");
  // Return the formatted date in Gregorian with timezone
  // return gregorianDate
  //   .format("YYYY/MM/DD HH:mm:ss Z")
  //   .replace(/\//g, "-")
  //   .replace(" ", "T")
  //   .replace(/\s+/g, "");
}

export function convertDateTimeToGregorian(
  dateTimeStr: string,
  targetType: string
): string {
  const persianToEnglish = (str: string) => {
    const persianDigits = "۰۱۲۳۴۵۶۷۸۹";
    const englishDigits = "0123456789";
    return str.replace(/[۰-۹]/g, (char) => englishDigits[persianDigits.indexOf(char)]);
  };

  // Convert Persian digits to English
  dateTimeStr = persianToEnglish(dateTimeStr);

  // Separate date and time
  const [datePart, timePart = "00:00"] = dateTimeStr.split("-");
  const [year, month, day] = datePart.split("/").map(Number);
  const [hour, minute] = timePart.split(":").map(Number);

  let gregorianDate: MomentTimezone.Moment;

  if (targetType.toLowerCase() === "lunar") {
    const hijriDate = momentHijri(`${year}-${month}-${day}`, "iYYYY-iMM-iDD");
    gregorianDate = hijriDate.utc().hour(hour).minute(minute).second(0);
  } else if (targetType.toLowerCase() === "solar") {
    const greg = toGregorian(year, month, day); // Convert Jalali to Gregorian
    gregorianDate = MomentTimezone.utc(
      `${greg.gy}-${greg.gm}-${greg.gd} ${hour}:${minute}`,
      "YYYY-M-D HH:mm"
    );
  } else if (targetType.toLowerCase() === "gregorian") {
    gregorianDate = MomentTimezone.utc(
      `${year}-${month}-${day} ${hour}:${minute}`,
      "YYYY-MM-DD HH:mm"
    );
  } else {
    return "";
  }

  // Format as UTC string
  return gregorianDate.format("YYYY-MM-DDTHH:mm:ss[Z]");
}
const solarMonthNames = [
  "فروردین", "اردیبهشت", "خرداد", "تیر", "مرداد", "شهریور",
  "مهر", "آبان", "آذر", "دی", "بهمن", "اسفند"
];

export function splitRangeBySolarMonths(startUTC: string, endUTC: string) {
  const result = [];

  let [startYear, startMonth] = convertDate(startUTC, "Solar").split("/").map(Number);
  const [endYear, endMonth] = convertDate(endUTC, "Solar").split("/").map(Number);

  while (
    startYear < endYear || (startYear === endYear && startMonth <= endMonth)
  ) {
    const currentMonthStr = `${startYear.toString().padStart(4, "0")}/${startMonth
      .toString()
      .padStart(2, "0")}/01`;

    const nextMonth = startMonth === 12 ? 1 : startMonth + 1;
    const nextYear = startMonth === 12 ? startYear + 1 : startYear;

    const nextMonthStr = `${nextYear.toString().padStart(4, "0")}/${nextMonth
      .toString()
      .padStart(2, "0")}/01`;

    const monthStartUTC = convertToGregorian(currentMonthStr, "Solar");
    const monthEndUTC = convertToGregorian(nextMonthStr, "Solar");

    const clampedStart = new Date(
      Math.max(new Date(monthStartUTC).getTime(), new Date(startUTC).getTime())
    ).toISOString();

    const clampedEnd = new Date(
      Math.min(new Date(monthEndUTC).getTime() - 1, new Date(endUTC).getTime())
    ).toISOString();

    result.push({
      name: solarMonthNames[startMonth - 1],
      start: clampedStart,
      end: clampedEnd,
    });

    if (startMonth === 12) {
      startYear += 1;
      startMonth = 1;
    } else {
      startMonth += 1;
    }
  }

  return result;
}
