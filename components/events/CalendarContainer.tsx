import React, { useState } from "react";

import dayjs from "dayjs";
import jalaliday from "jalaliday";
import "dayjs/locale/fa"; // Persian locale
import localizedFormat from "dayjs/plugin/localizedFormat";
import utc from "dayjs/plugin/utc";
import timezone from "dayjs/plugin/timezone";
import moment from "moment-hijri";

import {
  convertDateWithTimeZone,
  convertToGregorianYMD,
  generateVisibleRange,
  generateWeekVisibleRange,
  getCalendarInfo,
  getMonthInfo,
  getToday,
  getTodayInGregorianYMD,
} from "@/lib/calendar";
import MonthlyCalendar from "./MonthlyCalendar";
import WeeklyCalendar from "./WeeklyCalendar";
import DailyCalendar from "./DailyCalendar";

import CalendarHeader from "./CalendarHeader";

import { CalendarRangeTimeType } from "./calendar/calendar-time-filtering";
import { CalendarType } from "./calendar/CalendarTypeFiltering";

dayjs.extend(utc);
dayjs.extend(localizedFormat);
dayjs.extend(jalaliday);
dayjs.locale("fa"); // Set

dayjs.extend(timezone);

export default function CalendarContainer() {
  // const today = getToday();
  const today = getTodayInGregorianYMD();
  console.log(today);
  const [currentDate, setCurrentDate] = useState(today);
  const [calendarRangeType, setCalendarRangeType] =
    useState<CalendarRangeTimeType>("monthly");
  const [calendarType, setCalendarType] = useState<
    "jalali" | "hijri" | "gregory"
  >("jalali");

  const { calendarData } = generateCalendarData(
    calendarRangeType,
    calendarType
  );

  // Go to previous day/week/month
  const goToNext = () => {
    setCurrentDate((prevDate) => {
      // prevDate is string like "2025-08-18"
      switch (calendarRangeType) {
        case "daily":
          return dayjs(prevDate, "YYYY-MM-DD")
            .add(1, "day")
            .format("YYYY-MM-DD");

        case "weekly":
          return dayjs(prevDate, "YYYY-MM-DD")
            .add(1, "week")
            .format("YYYY-MM-DD");

        case "monthly": {
          if (calendarType === "jalali") {
            const d = dayjs(prevDate, "YYYY-MM-DD").calendar("jalali");
            const dayOfMonth = d.date();

            // anchor on prevDate instead of dayjs()
            const target = d.clone().add(1, "month").date(1);

            const lastDay = target.daysInMonth();
            return target
              .date(Math.min(dayOfMonth, lastDay))
              .calendar("gregory")
              .format("YYYY-MM-DD");
          }

          if (calendarType === "hijri") {
            const m = moment(prevDate, "YYYY-MM-DD");
            const dayOfMonth = m.iDate();

            // also anchor on prevDate
            const target = m.clone().add(1, "iMonth").iDate(1);
            const lastDay = target.clone().endOf("iMonth").iDate();

            return target
              .iDate(Math.min(dayOfMonth, lastDay))
              .format("YYYY-MM-DD");
          }

          // Gregorian
          return dayjs(prevDate, "YYYY-MM-DD")
            .add(1, "month")
            .format("YYYY-MM-DD");
        }
        default:
          return prevDate;
      }
    });
  };
  // const goToNext = () => {
  //   setCurrentDate((prevDate) => {

  //     switch (calendarRangeType) {
  //       case "daily":
  //         return dayjs(prevDate).add(1, "day").toDate();
  //       case "weekly":
  //         return dayjs(prevDate).add(1, "week").toDate();
  //       case "monthly": {
  //         const { year, month } = getMonthInfo(prevDate, calendarType);

  //         if (calendarType === "jalali") {
  //           const d = dayjs(prevDate).calendar("jalali");
  //           const dayOfMonth = d.date();
  //           const target = dayjs()
  //             .calendar("jalali")
  //             .year(year)
  //             .month(month + 1)
  //             .date(1);
  //           const lastDay = target.daysInMonth();
  //           return target
  //             .date(Math.min(dayOfMonth, lastDay))
  //             .calendar("gregory")
  //             .toDate();
  //         }

  //         if (calendarType === "hijri") {
  //           const m = moment(prevDate);
  //           const dayOfMonth = m.iDate();
  //           const target = moment()
  //             .iYear(year)
  //             .iMonth(month + 1)
  //             .iDate(1);
  //           const lastDay = target.endOf("iMonth").iDate();
  //           return target.iDate(Math.min(dayOfMonth, lastDay)).toDate();
  //         }

  //         // Gregorian
  //         return dayjs(prevDate).add(1, "month").toDate();
  //       }
  //       default:
  //         return prevDate;
  //     }
  //   });
  // };
  const goToPrev = () => {
    setCurrentDate((prevDateStr) => {
      const FMT = "YYYY-MM-DD";

      switch (calendarRangeType) {
        case "daily":
          return dayjs(prevDateStr, FMT).subtract(1, "day").format(FMT);

        case "weekly":
          return dayjs(prevDateStr, FMT).subtract(1, "week").format(FMT);

        case "monthly": {
          // --- Jalali ---
          // if (calendarType === "jalali") {
          //   const dJ = dayjs(prevDateStr, FMT).calendar("jalali");
          //   const dayOfMonth = dJ.date();

          //   // anchor to prevDate (NOT dayjs())
          //   const targetJ = dJ
          //     .calendar("jalali")
          //     .date(1) // go to first of current Jalali month
          //     .month(dJ.month() - 1); // previous Jalali month

          //   const lastDay = targetJ.daysInMonth();

          //   return targetJ
          //     .date(Math.min(dayOfMonth, lastDay))
          //     .calendar("gregory")
          //     .format(FMT);
          // }
          if (calendarType === "jalali") {
            const dJ = dayjs(prevDateStr, FMT).calendar("jalali");
            const dayOfMonth = dJ.date();

            const targetJ = dJ
              .calendar("jalali")
              .date(1) // go to first of current Jalali month
              .subtract(1, "month"); // safe way to go to previous Jalali month

            const lastDay = targetJ.daysInMonth();

            return targetJ
              .date(Math.min(dayOfMonth, lastDay))
              .calendar("gregory")
              .format(FMT);
          }
          // --- Hijri ---
          if (calendarType === "hijri") {
            const m = moment(prevDateStr, FMT);
            const dayOfMonth = m.iDate();

            // anchor to prevDate (NOT moment())
            const target = m.clone().iDate(1).subtract(1, "iMonth");
            const lastDay = target.clone().endOf("iMonth").iDate();

            return target.iDate(Math.min(dayOfMonth, lastDay)).format(FMT);
          }

          // --- Gregorian ---
          return dayjs(prevDateStr, FMT).subtract(1, "month").format(FMT);
        }

        default:
          return prevDateStr;
      }
    });
  };
  // const goToPrev = () => {
  //   setCurrentDate((prevDate) => {
  //     switch (calendarRangeType) {
  //       case "daily":
  //         return dayjs(prevDate).subtract(1, "day").toDate();
  //       case "weekly":
  //         return dayjs(prevDate).subtract(1, "week").toDate();
  //       case "monthly": {
  //         const { year, month } = getMonthInfo(prevDate, calendarType);

  //         if (calendarType === "jalali") {
  //           const d = dayjs(prevDate).calendar("jalali");
  //           const dayOfMonth = d.date();
  //           const target = dayjs()
  //             .calendar("jalali")
  //             .year(year)
  //             .month(month - 1)
  //             .date(1);
  //           const lastDay = target.daysInMonth();
  //           return target
  //             .date(Math.min(dayOfMonth, lastDay))
  //             .calendar("gregory")
  //             .toDate();
  //         }

  //         if (calendarType === "hijri") {
  //           const m = moment(prevDate);
  //           const dayOfMonth = m.iDate();
  //           const target = moment()
  //             .iYear(year)
  //             .iMonth(month - 1)
  //             .iDate(1);
  //           const lastDay = target.endOf("iMonth").iDate();
  //           return target.iDate(Math.min(dayOfMonth, lastDay)).toDate();
  //         }

  //         // Gregorian
  //         return dayjs(prevDate).subtract(1, "month").toDate();
  //       }
  //       default:
  //         return prevDate;
  //     }
  //   });
  // };

  const goToToday = () => {
    setCurrentDate(today);
  };
  console.log(getCalendarInfo(currentDate, calendarType));
  return (
    <div className="bg-card border border-[#DEEBFB] rounded-xl custom-shadow p-6 w-full">
      <div className="border border-[#E9EAEB] rounded-lg flex flex-col gap-4 w-full">
        <CalendarHeader
          onActiveCalendarType={(value) => setCalendarType(value)}
          calendarType={calendarType}
          {...calendarData}
          onPrev={goToPrev}
          onNext={goToNext}
          onToday={goToToday}
          onActiveTime={(value) => setCalendarRangeType(value)}
          calendarRangeType={calendarRangeType}
        />
        <div className="w-full">
          {calendarRangeType === "monthly" ? (
            <MonthlyCalendar
              currentDate={currentDate}
              visibleRange={calendarData.visibleRange}
              calendarType={calendarType}
            />
          ) : calendarRangeType === "weekly" ? (
            <WeeklyCalendar
              currentDate={currentDate}
              visibleRange={calendarData.visibleRange}
              calendarType={calendarType}
            />
          ) : calendarRangeType === "daily" ? (
            <DailyCalendar currentDate={currentDate} />
          ) : (
            <></>
          )}
        </div>
      </div>
    </div>
  );

  function generateCalendarData(
    calendarRangeType: string,
    calendarType: "jalali" | "hijri" | "gregory"
  ) {
    let calendarData;
    const date = convertDateWithTimeZone(currentDate, calendarType);
    console.log(date);
    switch (calendarRangeType) {
      case "monthly":
        const calendarInfo = getCalendarInfo(currentDate, calendarType);
        console.log(generateVisibleRange(currentDate, calendarType));
        calendarData = {
          date: date,
          visibleRange: generateVisibleRange(currentDate, calendarType),
          selectedDaysRange: [
            {
              day: date.day,
              monthName: date.monthName,
              year: date.year,
            },
          ],

          fullRange: [
            {
              day: calendarInfo.startDay,
              monthName: calendarInfo.monthName,
              year: calendarInfo.year,
            },
            {
              day: calendarInfo.endDay,
              monthName: calendarInfo.monthName,
              year: calendarInfo.year,
            },
          ],
        };
        return { calendarData };
      case "weekly":
        const weeklyVisibleRange = generateWeekVisibleRange(
          currentDate,
          calendarType
        );
        const selectedDateRange = {
          start: convertDateWithTimeZone(
            convertToGregorianYMD(weeklyVisibleRange.start),
            calendarType
          ),
          end: convertDateWithTimeZone(
            convertToGregorianYMD(weeklyVisibleRange.end),
            calendarType
          ),
        };

        calendarData = {
          date: date,
          visibleRange: weeklyVisibleRange,
          selectedDaysRange: [
            {
              day: selectedDateRange.start.day,
              monthName: selectedDateRange.start.monthName,
              year: selectedDateRange.start.year,
            },
            {
              day: selectedDateRange.end.day,
              monthName: selectedDateRange.end.monthName,
              year: selectedDateRange.end.year,
            },
          ],

          fullRange: [
            {
              day: selectedDateRange.start.day,
              monthName: selectedDateRange.start.monthName,
              year: selectedDateRange.start.year,
            },
            {
              day: selectedDateRange.end.day,
              monthName: selectedDateRange.end.monthName,
              year: selectedDateRange.end.year,
            },
          ],
        };
        return { calendarData };

      case "daily":
        calendarData = {
          date: date,
          selectedDaysRange: [
            {
              day: date.day,
              monthName: date.monthName,
              year: date.year,
            },
          ],
          visibleRange: {
            start: new Date(currentDate),
            end: new Date(currentDate),
          },

          fullRange: [
            {
              day: date.day,
              monthName: date.monthName,
              year: date.year,
            },
          ],
        };
        return { calendarData };
      default:
        calendarData = {
          date: date,
          visibleRange: generateVisibleRange(currentDate, calendarType),
          selectedDaysRange: [
            {
              day: date.day,
              monthName: date.monthName,
              year: date.year,
            },
          ],
          fullRange: [
            {
              day: date.day,
              monthName: date.monthName,
              year: date.year,
            },
          ],
        };
        return { calendarData };
    }
  }
}
