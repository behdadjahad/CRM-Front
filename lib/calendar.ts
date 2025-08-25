import jalaali from "jalaali-js";
import dayjs from "dayjs";
import moment from "moment-hijri";

import utc from "dayjs/plugin/utc";
import timezone from "dayjs/plugin/timezone";
export function formatEventDate(dateStr: string): string {
  const date = new Date(dateStr);
  // Ensure consistent ISO format without Z and without milliseconds
  return date.toISOString().slice(0, 19);
}


dayjs.extend(utc);
dayjs.extend(timezone);
const gregoryMonthNames = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
];
export function convertToGregorianYMD(date: Date) {
  return dayjs(date).format("YYYY-MM-DD");
}
export function getTodayInGregorianYMD(): string {
  const date = new Date();
  return dayjs(date).utc().format("YYYY-MM-DD");
}

export function getCalendarInfo(
  dateString: string,
  calendarType: "jalali" | "hijri" | "gregory"
) {
  // Parse safely as Gregorian date
  const date = dayjs(dateString, "YYYY-MM-DD", true);

  if (!date.isValid()) {
    throw new Error(`Invalid date string: ${dateString}`);
  }

  const gDate = {
    gy: date.year(),
    gm: date.month() + 1, // dayjs months are 0-based
    gd: date.date(),
  };

  if (calendarType === "jalali") {
    const jDate = jalaali.toJalaali(gDate.gy, gDate.gm, gDate.gd);
    const monthName = jalaliMonthNames[jDate.jm - 1] || "";
    const endDay = jalaali.jalaaliMonthLength(jDate.jy, jDate.jm);
    return { startDay: 1, endDay, monthName, year: jDate.jy };
  }

  if (calendarType === "hijri") {
    const m = moment(dateString, "YYYY-MM-DD");
    const monthNum = parseInt(m.format("iM"), 10);
    const monthName = hijriMonthNames[monthNum - 1] || "";
    const year = parseInt(m.format("iYYYY"), 10);
    const endDay = parseInt(m.clone().endOf("iMonth").format("iD"), 10);
    return { startDay: 1, endDay, monthName, year };
  }

  if (calendarType === "gregory") {
    const monthName = gregoryMonthNames[gDate.gm - 1];
    const year = gDate.gy;
    const endDay = date.daysInMonth();
    return { startDay: 1, endDay, monthName, year };
  }

  throw new Error("Unsupported calendar type");
}

// export function getCalendarInfo(
//   currentDate: Date,
//   calendarType: "jalali" | "hijri" | "gregory"
// ) {
//   const date = dayjs(currentDate);

//   const gDate = {
//     gy: date.year(),
//     gm: date.month() + 1,
//     gd: date.date(),
//   };

//   if (calendarType === "jalali") {
//     const jDate = jalaali.toJalaali(gDate.gy, gDate.gm, gDate.gd);
//     const monthName = jalaliMonthNames[jDate.jm - 1] || "";
//     const endDay = jalaali.jalaaliMonthLength(jDate.jy, jDate.jm);
//     return { startDay: 1, endDay, monthName, year: jDate.jy };
//   }

//   if (calendarType === "hijri") {
//     const m = moment(currentDate);
//     const monthNum = parseInt(m.format("iM"), 10);
//     const monthName = hijriMonthNames[monthNum - 1] || "";
//     const year = parseInt(m.format("iYYYY"), 10);
//     const endDay = parseInt(m.clone().endOf("iMonth").format("iD"), 10);
//     return { startDay: 1, endDay, monthName, year };
//   }
//   if (calendarType === "gregory") {
//     const monthName = gregoryMonthNames[gDate.gm - 1];
//     const year = gDate.gy;
//     const endDay = date.daysInMonth();
//     return { startDay: 1, endDay, monthName, year };
//   }

//   throw new Error("Unsupported calendar type");
// }
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
dayjs.extend(utc);
dayjs.extend(timezone);
export function convertDateWithTimeZone(
  dateString: string,
  calendarType: "jalali" | "hijri" | "gregory"
) {
  // Parse strictly in Gregorian YYYY-MM-DD
  const date = dayjs(dateString, "YYYY-MM-DD", true);

  if (!date.isValid()) {
    throw new Error(`Invalid date string: ${dateString}`);
  }

  const gDate = {
    gy: date.year(),
    gm: date.month() + 1, // dayjs months are zero-based
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
    const m = moment(dateString, "YYYY-MM-DD");
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
      monthName: gregoryMonthNames[gDate.gm - 1],
    };
  }

  throw new Error("Unsupported calendar type");
}
export function revertDateWithTimeZone(
  dateObj: { day: number; month: number; year: number },
  calendarType: "jalali" | "hijri" | "gregory"
): string {
  if (calendarType === "jalali") {
    const gDate = jalaali.toGregorian(dateObj.year, dateObj.month, dateObj.day);
    return dayjs(
      `${gDate.gy}-${String(gDate.gm).padStart(2, "0")}-${String(
        gDate.gd
      ).padStart(2, "0")}`,
      "YYYY-MM-DD",
      true
    ).format("YYYY-MM-DD");
  }

  if (calendarType === "hijri") {
    const m = moment(
      `${dateObj.year}-${String(dateObj.month).padStart(2, "0")}-${String(
        dateObj.day
      ).padStart(2, "0")}`,
      "iYYYY-iM-iD"
    );
    return m.format("YYYY-MM-DD"); // convert Hijri to Gregorian
  }

  if (calendarType === "gregory") {
    return `${dateObj.year}-${String(dateObj.month).padStart(2, "0")}-${String(
      dateObj.day
    ).padStart(2, "0")}`;
  }

  throw new Error("Unsupported calendar type");
}

// export function convertDateWithTimeZone(
//   currentDate: Date,
//   calendarType: "jalali" | "hijri" | "gregory"
// ) {
//   const date = dayjs(currentDate);

//   const gDate = {
//     gy: date.year(),
//     gm: date.month() + 1, // month() is zero-based
//     gd: date.date(),
//   };

//   if (calendarType === "jalali") {
//     const jDate = jalaali.toJalaali(gDate.gy, gDate.gm, gDate.gd);
//     return {
//       day: jDate.jd,
//       month: jDate.jm,
//       year: jDate.jy,
//       monthName: jalaliMonthNames[jDate.jm - 1] || "",
//     };
//   }

//   if (calendarType === "hijri") {
//     const m = moment(currentDate);
//     const monthNum = parseInt(m.format("iM"), 10);
//     return {
//       day: parseInt(m.format("iD"), 10),
//       month: monthNum,
//       year: parseInt(m.format("iYYYY"), 10),
//       monthName: hijriMonthNames[monthNum - 1] || "",
//     };
//   }
//   if (calendarType === "gregory") {
//     return {
//       day: gDate.gd,
//       month: gDate.gm,
//       year: gDate.gy,
//       monthName: gregoryMonthNames[gDate.gm - 1], // use array, no locale
//     };
//   } else return {};
// }
export function generateVisibleRange(
  dateString: string,
  calendarType: "jalali" | "hijri" | "gregory"
): { start: Date; end: Date } {
  console.log(dateString);
  // if (calendarType === "jalali") {
  //   const date = dayjs(dateString, "YYYY-MM-DD").calendar("jalali");
  //   const year = date.year();
  //   const month = date.month(); // 0-based
  //   console.log(year,month)
  //   // Start at 1st day of Jalali month
  //   let start = dayjs().calendar("jalali").year(year).month(month).date(1);
  //   console.log(start, "start");
  //   while (start.day() !== 6) {
  //     start = start.subtract(1, "day");
  //   }

  //   // End at last day of Jalali month
  //   let end = dayjs().calendar("jalali").year(year).month(month).endOf("month");
  //   while (end.day() !== 5) {
  //     end = end.add(1, "day");
  //   }

  //   return {
  //     start: start.calendar("gregory").toDate(),
  //     end: end.calendar("gregory").toDate(),
  //   };
  // }
  if (calendarType === "jalali") {
    const input = dayjs(dateString, "YYYY-MM-DD").calendar("jalali");
    const { year: year, month: month } = convertDateWithTimeZone(dateString, calendarType);
    console.log(year,month)
    console.log(input)
    // const year = input.year();
    // const month = input.month();
    // Start at the 1st of this Jalali month
    let start = input
      .clone()
      .calendar("jalali")
      .year(year)
      .month(month-1)
      .date(1);
    // // Go back to Saturday
    while (start.day() !== 6) {
      start = start.subtract(1, "day");
    }
    // // End at the last day of this Jalali month
    let end = input
      .clone()
      .calendar("jalali")
      .year(year)
      .month(month-1)
      .endOf("month");
    // Go forward to Friday
    while (end.day() !== 5) {
      end = end.add(1, "day");
    }
    return {
      start: start.calendar("gregory").toDate(),
      end: end.calendar("gregory").toDate(),
    };
  }

  // You can keep your existing hijri and gregory logic

  // ... keep hijri and gregory cases the same

  if (calendarType === "hijri") {
    const m = moment(dateString, "YYYY-MM-DD");
    const year = parseInt(m.format("iYYYY"), 10);
    const month = parseInt(m.format("iM"), 10) - 1; // 0-based

    // Start at 1st day of Hijri month
    let start = moment().iYear(year).iMonth(month).iDate(1);
    while (start.day() !== 6) {
      start = start.subtract(1, "day");
    }

    // End at last day of Hijri month
    let end = moment().iYear(year).iMonth(month).endOf("iMonth");
    while (end.day() !== 5) {
      end = end.add(1, "day");
    }

    return {
      start: start.toDate(),
      end: end.toDate(),
    };
  }

  if (calendarType === "gregory") {
    const date = dayjs(dateString, "YYYY-MM-DD");
    const year = date.year();
    const month = date.month();

    // Start at 1st day of Gregorian month
    let start = dayjs().year(year).month(month).date(1);
    while (start.day() !== 6) {
      start = start.subtract(1, "day");
    }

    // End at last day of Gregorian month
    let end = dayjs().year(year).month(month).endOf("month");
    while (end.day() !== 5) {
      end = end.add(1, "day");
    }

    return {
      start: start.toDate(),
      end: end.toDate(),
    };
  }

  throw new Error("Unsupported calendar type");
}
// export function generateVisibleRange(
//   currentDate: Date,
//   calendarType: "jalali" | "hijri" | "gregory"
// ): { start: Date; end: Date } {
//   if (calendarType === "jalali") {
//     const date = dayjs(currentDate).calendar("jalali");
//     console.log(date);
//     const year = date.year();
//     const month = date.month(); // 0-based
//     console.log(month);
//     // Start at 1st day of Jalali month
//     let start = dayjs().calendar("jalali").year(year).month(month).date(1);

//     // Move backward until Saturday (6)
//     while (start.day() !== 6) {
//       start = start.subtract(1, "day");
//     }

//     // End at last day of Jalali month
//     let end = dayjs().calendar("jalali").year(year).month(month).endOf("month");

//     // Move forward until Friday (5)
//     while (end.day() !== 5) {
//       end = end.add(1, "day");
//     }

//     return {
//       start: start.calendar("gregory").toDate(),
//       end: end.calendar("gregory").toDate(),
//     };
//   }

//   if (calendarType === "hijri") {
//     const m = moment(currentDate);
//     const year = parseInt(m.format("iYYYY"), 10);
//     const month = parseInt(m.format("iM"), 10) - 1; // 0-based for moment

//     // Start at first day of Hijri month
//     let start = moment().iYear(year).iMonth(month).iDate(1);

//     // Move backward until Saturday (6)
//     while (start.day() !== 6) {
//       start = start.subtract(1, "day");
//     }

//     // End at last day of Hijri month
//     let end = moment().iYear(year).iMonth(month).endOf("iMonth");

//     // Move forward until Friday (5)
//     while (end.day() !== 5) {
//       end = end.add(1, "day");
//     }

//     return {
//       start: start.toDate(),
//       end: end.toDate(),
//     };
//   }
//   if (calendarType === "gregory") {
//     const date = dayjs(currentDate);
//     const year = date.year();
//     const month = date.month(); // 0-based

//     // Start at 1st day of Gregorian month
//     let start = dayjs().year(year).month(month).date(1);

//     // Move backward until Saturday (6)
//     while (start.day() !== 6) {
//       start = start.subtract(1, "day");
//     }

//     // End at last day of Gregorian month
//     let end = dayjs().year(year).month(month).endOf("month");

//     // Move forward until Friday (5)
//     while (end.day() !== 5) {
//       end = end.add(1, "day");
//     }

//     return {
//       start: start.toDate(),
//       end: end.toDate(),
//     };
//   } else return { start: new Date(), end: new Date() };
// }
export function generateWeekVisibleRange(
  dateStr: string, // "YYYY-MM-DD"
  calendarType: "jalali" | "hijri" | "gregory"
) {
  let startOfWeek: Date;
  let endOfWeek: Date;

  if (calendarType === "jalali") {
    const day = dayjs(dateStr, "YYYY-MM-DD").calendar("jalali");
    const dayOfWeek = day.day(); // Sunday = 0, Saturday = 6
    const diffToSaturday = (dayOfWeek + 1) % 7; // week starts Saturday
    startOfWeek = day.subtract(diffToSaturday, "day").startOf("day").toDate();
    endOfWeek = day
      .subtract(diffToSaturday, "day")
      .add(6, "day")
      .endOf("day")
      .toDate();
  } else if (calendarType === "gregory") {
    const day = dayjs(dateStr, "YYYY-MM-DD");
    const dayOfWeek = day.day();
    const diffToSaturday = (dayOfWeek + 1) % 7;
    startOfWeek = day.startOf("day").subtract(diffToSaturday, "day").toDate();
    endOfWeek = day
      .startOf("day")
      .subtract(diffToSaturday, "day")
      .add(6, "day")
      .endOf("day")
      .toDate();
  } else if (calendarType === "hijri") {
    const day = moment(dateStr, "YYYY-MM-DD");
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

  return { start: startOfWeek, end: endOfWeek };
}
// export function generateWeekVisibleRange(
//   date: Date,
//   calendarType: "jalali" | "hijri" | "gregory"
// ) {
//   let startOfWeek: Date;
//   let endOfWeek: Date;

//   if (calendarType === "jalali") {
//     const day = dayjs(date).calendar(calendarType);
//     const dayOfWeek = day.day(); // Sunday = 0, Saturday = 6
//     const diffToSaturday = (dayOfWeek + 1) % 7; // week starts Saturday
//     startOfWeek = day.subtract(diffToSaturday, "day").startOf("day").toDate();
//     endOfWeek = day
//       .subtract(diffToSaturday, "day")
//       .add(6, "day")
//       .endOf("day")
//       .toDate();
//   } else if (calendarType === "gregory") {
//     const day = dayjs(date);
//     const dayOfWeek = day.day(); // Sunday = 0, Saturday = 6
//     const diffToSaturday = (dayOfWeek + 1) % 7; // week starts Saturday
//     startOfWeek = day.startOf("day").subtract(diffToSaturday, "day").toDate();
//     endOfWeek = day
//       .startOf("day")
//       .subtract(diffToSaturday, "day")
//       .add(6, "day")
//       .endOf("day")
//       .toDate();
//   } else if (calendarType === "hijri") {
//     const day = moment(date);
//     const dayOfWeek = day.day();
//     const diffToSaturday = (dayOfWeek + 1) % 7;
//     startOfWeek = day
//       .clone()
//       .subtract(diffToSaturday, "days")
//       .startOf("day")
//       .toDate();
//     endOfWeek = day
//       .clone()
//       .subtract(diffToSaturday, "days")
//       .add(6, "days")
//       .endOf("day")
//       .toDate();
//   } else {
//     throw new Error("Unsupported calendar type");
//   }
//   console.log({ start: startOfWeek, end: endOfWeek });
//   return { start: startOfWeek, end: endOfWeek };
// }
export function getDayNumber(date: Date, calendarType: string) {
  console.log(date, "gregory");

  switch (calendarType) {
    case "jalali":
      return dayjs.utc(date).calendar("jalali").date();
    case "hijri":
      console.log(moment(date).format("iD"));
      return moment(date).format("iD");
    // iD gives Hijri day number
    case "gregory":

    default: {
      const startOfDay = dayjs.utc(date).startOf("day");
      const adjusted = dayjs.utc(date).isAfter(startOfDay)
        ? dayjs.utc(date).add(1, "day")
        : dayjs.utc(date);
      return adjusted.date();
    }
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
  dateString: string,
  calendarType: "jalali" | "hijri" | "gregory"
): { year: number; month: number } {
  const [gy, gm, gd] = dateString.split("-").map(Number); // YYYY-MM-DD

  if (calendarType === "jalali") {
    const { jy, jm } = jalaali.toJalaali(gy, gm, gd);
    return { year: jy, month: jm }; // 1-based month
  }

  if (calendarType === "hijri") {
    const m = moment(dateString, "YYYY-MM-DD");
    return { year: m.iYear(), month: m.iMonth() + 1 };
  }

  // Gregorian
  return { year: gy, month: gm };
}
// export function getMonthInfo(
//   dateString: string,
//   calendarType: "jalali" | "hijri" | "gregory"
// ): { year: number; month: number } {
//   if (calendarType === "jalali") {
//     const d = dayjs(dateString, "YYYY-MM-DD").calendar("jalali");
//     return {
//       year: d.year(),
//       month: d.month() + 1, // convert from 0-based to 1-based
//     };
//   }

//   if (calendarType === "hijri") {
//     const m = moment(dateString, "YYYY-MM-DD");
//     return {
//       year: m.iYear(),
//       month: m.iMonth() + 1, // convert from 0-based to 1-based
//     };
//   }

// Gregorian
//   const g = dayjs(dateString, "YYYY-MM-DD");
//   return {
//     year: g.year(),
//     month: g.month() + 1, // convert from 0-based to 1-based
//   };
// }
// export function getMonthInfo(
//   date: Date,
//   calendarType: "jalali" | "hijri" | "gregory"
// ) {
//   let year: number;
//   let month: number;

//   if (calendarType === "jalali") {
//     const d = dayjs(date).calendar("jalali");
//     year = d.year();
//     month = d.month(); // 0-based
//   } else if (calendarType === "hijri") {
//     const m = moment(date);
//     year = m.iYear(); // Hijri year
//     month = m.iMonth(); // 0-based
//   } else {
//     const d = dayjs(date); // Gregorian
//     year = d.year();
//     month = d.month();
//   }

//   return { year, month };
// }
