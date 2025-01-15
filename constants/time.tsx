import moment from "moment-timezone";
import jMoment from "jalali-moment";

export function convertGregorianToSolarWithTimeZone(gregorianDate: string) {
  const timeZone = "Asia/Tehran";
  const timeZoneAdjusted = moment
    .tz(gregorianDate, timeZone)
    .format("YYYY-MM-DD HH:mm:ss");

  const solarDate = jMoment(timeZoneAdjusted, "YYYY-MM-DD HH:mm:ss")
    .locale("fa")
    .format("jYYYY/jMM/jDD HH:mm:ss");

  return solarDate;
}
export const convertToTimezone = (dateString: string) => {
  const persianToEnglish = (str: string) => {
    const persianDigits = "۰۱۲۳۴۵۶۷۸۹";
    const englishDigits = "0123456789";
    return str.replace(
      /[۰-۹]/g,
      (char) => englishDigits[persianDigits.indexOf(char)]
    );
  };
  const normalizedDate = persianToEnglish(dateString);

  const dateParts = normalizedDate.split("/");

  const [year, month, day] = dateParts.map(Number);

  const date = new Date(Date.UTC(year, month - 1, day));

  return date.toISOString();
};
