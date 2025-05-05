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

  // Return the formatted date in Gregorian with timezone
  return gregorianDate
    .format("YYYY/MM/DD HH:mm:ss Z")
    .replace(/\//g, "-")
    .replace(" ", "T")
    .replace(/\s+/g, "");
}
