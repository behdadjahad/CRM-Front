import jMoment from "jalali-moment";
import moment from "moment";
import "moment-timezone";
import "moment-hijri";
import "moment-jalaali";

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

export function convertDate(
  date: string,
  inputType: string,
  outputType: string
) {
  // Step 1: Parse the input date with timezone handling
  const dateWithTimezone = moment.tz(date); // Parse date with timezone info

  // Step 2: Convert input to Gregorian if it's not already
  let formattedDate: any = dateWithTimezone;

  if (inputType === "Lunar") {
    // Lunar (Hijri) to Gregorian conversion
    formattedDate = moment(date, "iYYYY-iMM-iDD", "en")
      .tz(dateWithTimezone.zoneName(), true)
      .format("YYYY-MM-DD");
  } else if (inputType === "Solar") {
    // Solar (Jalali) to Gregorian conversion
    formattedDate = moment(date, "jYYYY-jMM-jDD")
      .tz(dateWithTimezone.zoneName(), true)
      .format("YYYY-MM-DD");
  }

  // Step 3: Convert the Gregorian date to the desired output type

  if (outputType === "Gregorian") {
    // If we want the Gregorian date
    return moment(formattedDate).format("DD/MM/YYYY");
  } else if (outputType === "Lunar") {
    // If we want the Lunar (Hijri) date
    return moment(formattedDate).format("iDD/iMM/iYYYY");
  } else if (outputType === "Solar") {
    // If we want the Solar (Jalali) date
    return moment(formattedDate).format("jDD/jMM/jYYYY");
  } else {
    throw new Error("Invalid output type");
  }
}
