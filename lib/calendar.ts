import jalaali from "jalaali-js";
import dayjs from "dayjs";
import moment from "moment-hijri";
export function convertGaregrianToSolarWithTimeZone(currentDate: Date) {
  const date = dayjs(currentDate);

  const gDate = {
    gy: date.year(),
    gm: date.month() + 1, // month() is zero-based
    gd: date.date(),
  };

  const jDate = jalaali.toJalaali(gDate.gy, gDate.gm, gDate.gd);
  return {
    day: jDate.jd,
    month: jDate.jm,
    year: jDate.jy,
  };
}
export function getToday(): Date {
  return new Date();
}
const hijriMonthNames = [
  "محرم", // 1
  "صفر", // 2
  "ربیع‌الاول", // 3
  "ربیع‌الثانی", // 4
  "جمادی‌الاول", // 5
  "جمادی‌الثانی", // 6
  "رجب", // 7
  "شعبان", // 8
  "رمضان", // 9
  "شوال", // 10
  "ذوالقعده", // 11
  "ذوالحجه", // 12
];

const jalaliMonthNames = [
  "فروردین",
  "اردیبهشت",
  "خرداد",
  "تیر",
  "مرداد",
  "شهریور",
  "مهر",
  "آبان",
  "آذر",
  "دی",
  "بهمن",
  "اسفند",
];
export function convertDateWithTimeZone(
  currentDate: Date,
  calendarType: "jalali" | "hijri" | "gregory"
) {
  const date = dayjs(currentDate);

  const gDate = {
    gy: date.year(),
    gm: date.month() + 1, // month() is zero-based
    gd: date.date(),
  };

  if (calendarType === "jalali") {
    const jDate = jalaali.toJalaali(gDate.gy, gDate.gm, gDate.gd);
    return {
      day: jDate.jd,
      month: jDate.jm,
      year: jDate.jy,
      monthName: jalaliMonthNames[jDate.jm - 1] || "",
    };
  }

  if (calendarType === "hijri") {
    const m = moment(currentDate);
    const monthNum = parseInt(m.format("iM"), 10);
    return {
      day: parseInt(m.format("iD"), 10),
      month: monthNum,
      year: parseInt(m.format("iYYYY"), 10),
      monthName: hijriMonthNames[monthNum - 1] || "",
    };
  }
  if (calendarType === "gregory") {
    return {
      day: gDate.gd,
      month: gDate.gm,
      year: gDate.gy,
      monthName: date.format("MMMM"), // full month name in locale
    };
  } else return {};
}

export function generateVisibleRange(
  currentDate: Date,
  calendarType: "jalali" | "hijri" | "gregory"
): { start: Date; end: Date } {
  if (calendarType === "jalali") {
    const date = dayjs(currentDate).calendar("jalali");
    console.log(date);
    const year = date.year();
    const month = date.month(); // 0-based
    console.log(month);
    // Start at 1st day of Jalali month
    let start = dayjs().calendar("jalali").year(year).month(month).date(1);

    // Move backward until Saturday (6)
    while (start.day() !== 6) {
      start = start.subtract(1, "day");
    }

    // End at last day of Jalali month
    let end = dayjs().calendar("jalali").year(year).month(month).endOf("month");

    // Move forward until Friday (5)
    while (end.day() !== 5) {
      end = end.add(1, "day");
    }

    return {
      start: start.calendar("gregory").toDate(),
      end: end.calendar("gregory").toDate(),
    };
  }

  if (calendarType === "hijri") {
    const m = moment(currentDate);
    const year = parseInt(m.format("iYYYY"), 10);
    const month = parseInt(m.format("iM"), 10) - 1; // 0-based for moment

    // Start at first day of Hijri month
    let start = moment().iYear(year).iMonth(month).iDate(1);

    // Move backward until Saturday (6)
    while (start.day() !== 6) {
      start = start.subtract(1, "day");
    }

    // End at last day of Hijri month
    let end = moment().iYear(year).iMonth(month).endOf("iMonth");

    // Move forward until Friday (5)
    while (end.day() !== 5) {
      end = end.add(1, "day");
    }

    return {
      start: start.toDate(),
      end: end.toDate(),
    };
  }
  if (calendarType === "gregory") {
    const date = dayjs(currentDate);
    const year = date.year();
    const month = date.month(); // 0-based

    // Start at 1st day of Gregorian month
    let start = dayjs().year(year).month(month).date(1);

    // Move backward until Saturday (6)
    while (start.day() !== 6) {
      start = start.subtract(1, "day");
    }

    // End at last day of Gregorian month
    let end = dayjs().year(year).month(month).endOf("month");

    // Move forward until Friday (5)
    while (end.day() !== 5) {
      end = end.add(1, "day");
    }
    console.log({
      start: start.toDate(),
      end: end.toDate(),
    });
    return {
      start: start.toDate(),
      end: end.toDate(),
    };
  } else return { start: new Date(), end: new Date() };
}
export function generateWeekVisibleRange(
  date: Date,
  calendarType: "jalali" | "hijri" | "gregory"
) {
  let startOfWeek: Date;
  let endOfWeek: Date;

  if (calendarType === "jalali") {
    const day = dayjs(date).calendar(calendarType);
    const dayOfWeek = day.day(); // Sunday = 0, Saturday = 6
    const diffToSaturday = (dayOfWeek + 1) % 7; // week starts Saturday
    startOfWeek = day.subtract(diffToSaturday, "day").startOf("day").toDate();
    endOfWeek = day
      .subtract(diffToSaturday, "day")
      .add(6, "day")
      .endOf("day")
      .toDate();
  } else if (calendarType === "gregory") {
    const day = dayjs(date);
    const dayOfWeek = day.day(); // Sunday = 0, Saturday = 6
    const diffToSaturday = (dayOfWeek + 1) % 7; // week starts Saturday
    startOfWeek = day.startOf("day").subtract(diffToSaturday, "day").toDate();
    endOfWeek = day
      .startOf("day")
      .subtract(diffToSaturday, "day")
      .add(6, "day")
      .endOf("day")
      .toDate();
  } else if (calendarType === "hijri") {
    const day = moment(date);
    const dayOfWeek = day.day();
    const diffToSaturday = (dayOfWeek + 1) % 7;
    startOfWeek = day
      .clone()
      .subtract(diffToSaturday, "days")
      .startOf("day")
      .toDate();
    endOfWeek = day
      .clone()
      .subtract(diffToSaturday, "days")
      .add(6, "days")
      .endOf("day")
      .toDate();
  } else {
    throw new Error("Unsupported calendar type");
  }
  console.log({ start: startOfWeek, end: endOfWeek });
  return { start: startOfWeek, end: endOfWeek };
}
export function getDayNumber(date: Date, calendarType: string) {
  console.log(date);
  switch (calendarType) {
    case "jalali":
      return dayjs.utc(date).calendar("jalali").date();
    case "hijri":
      console.log(moment(date).format("iD"));
      return moment(date).format("iD");
    // iD gives Hijri day number
    case "gregory":
      return dayjs.utc(date).date();
    default:
      return dayjs.utc(date).date();
  }
}

function getMonthName(date: Date, calendarType: string) {
  switch (calendarType) {
    case "jalali":
      return dayjs.utc(date).calendar("jalali").format("MMMM");
    case "hijri":
      return moment(date).format("iMMMM"); // iMMMM gives Hijri month name
    case "gregory":
    default:
      return dayjs.utc(date).format("MMMM");
  }
}

const weekdaysMap: Record<string, string[]> = {
  jalali: [
    "شنبه",
    "یکشنبه",
    "دوشنبه",
    "سه‌شنبه",
    "چهارشنبه",
    "پنجشنبه",
    "جمعه",
  ],
  hijri: [
    "السبت",
    "الأحد",
    "الاثنين",
    "الثلاثاء",
    "الأربعاء",
    "الخميس",
    "الجمعة",
  ],
  gregory: [
    "Saturday",
    "Sunday",
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
  ],
};

export function getWeekdayLabel(
  date: Date,
  calendarType: "jalali" | "hijri" | "gregory"
) {
  let dayIndex: number;

  switch (calendarType) {
    case "jalali":
      dayIndex = (dayjs(date).day() + 1) % 7; // Saturday = 0
      break;
    case "hijri":
      // Moment-hijri: day() returns 0=Sunday, 6=Saturday
      const hijriDay = moment(date).day();
      // Shift so Saturday = 0
      dayIndex = (hijriDay + 1) % 7;
      break;
    case "gregory":
      const gregDay = dayjs(date).day(); // 0=Sunday, 6=Saturday
      dayIndex = (gregDay + 1) % 7; // Shift so Saturday = 0
      break;
    default:
      dayIndex = dayjs(date).day(); // 0=Sunday
  }

  return weekdaysMap[calendarType][dayIndex];
}
export function getMonthInfo(
  date: Date,
  calendarType: "jalali" | "hijri" | "gregory"
) {
  let year: number;
  let month: number;

  if (calendarType === "jalali") {
    const d = dayjs(date).calendar("jalali");
    year = d.year();
    month = d.month(); // 0-based
  } else if (calendarType === "hijri") {
    const m = moment(date);
    year = m.iYear(); // Hijri year
    month = m.iMonth(); // 0-based
  } else {
    const d = dayjs(date); // Gregorian
    year = d.year();
    month = d.month();
  }

  return { year, month };
}
