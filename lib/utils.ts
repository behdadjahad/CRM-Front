import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"
import moment from "moment";
import "moment-jalaali";
import "moment-hijri";

export const REQUIRED_TEXT = "این فیلد ضروری است"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function formatPrice(priceString: any) {
  const price = priceString.toString();
  return price.replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}

export const convertJalaliToGregorian = (jalaliDate: string): string => {
  // Parse the Jalali date using moment-jalaali and convert to Gregorian
  const gregorianDate = moment(jalaliDate, "jYYYY/jMM/jDD").startOf("day");

  // Format the date in Gregorian and apply the desired time zone offset
  const formattedDate = gregorianDate
    .utcOffset("+01:00", true) // Apply fixed offset without altering the time
    .format("YYYY-MM-DD[T]HH:mm:ssZ");

  return formattedDate;
};


export const convertHijriToGregorian = (hijriDate: string): string => {
  // Parse the Hijri date using moment-hijri and convert to Gregorian
  const gregorianDate = moment(hijriDate, "iYYYY/iMM/iDD").startOf("day");

  // Format the date in Gregorian and apply the desired time zone offset
  const formattedDate = gregorianDate
    .utcOffset("+01:00", true) // Apply fixed offset without altering the time
    .format("YYYY-MM-DD[T]HH:mm:ssZ");

  return formattedDate;
};



