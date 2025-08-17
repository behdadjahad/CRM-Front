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
  generateVisibleRange,
  generateWeekVisibleRange,
  getMonthInfo,
  getToday,
} from "@/lib/calendar";
import MonthlyCalendar from "./MonthlyCalendar";
import WeeklyCalendar from "./WeeklyCalendar";
import DailyCalendar from "./DailyCalendar";

import CalendarHeader from "./CalendarHeader";

import { CalendarRangeTimeType } from "./calendar/calendar-time-filtering";

dayjs.extend(utc);
dayjs.extend(localizedFormat);
dayjs.extend(jalaliday);
dayjs.locale("fa"); // Set

dayjs.extend(timezone);

export default function CalendarContainer() {
  const today = getToday();
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
  const toda = new Date();
  const yyyy = toda.getFullYear();
  const mm = String(toda.getMonth() + 1).padStart(2, "0"); // months are 0-based
  const dd = String(toda.getDate()).padStart(2, "0");

  const todayDate = `${yyyy}-${mm}-${dd}`;
  console.log(todayDate);
  const goToNext = () => {
    setCurrentDate((prevDate) => {
      switch (calendarRangeType) {
        case "daily":
          return dayjs(prevDate).add(1, "day").toDate();
        case "weekly":
          return dayjs(prevDate).add(1, "week").toDate();
        case "monthly": {
          const { year, month } = getMonthInfo(prevDate, calendarType);

          if (calendarType === "jalali") {
            const d = dayjs(prevDate).calendar("jalali");
            const dayOfMonth = d.date();
            const target = dayjs()
              .calendar("jalali")
              .year(year)
              .month(month + 1)
              .date(1);
            const lastDay = target.daysInMonth();
            return target
              .date(Math.min(dayOfMonth, lastDay))
              .calendar("gregory")
              .toDate();
          }

          if (calendarType === "hijri") {
            const m = moment(prevDate);
            const dayOfMonth = m.iDate();
            const target = moment()
              .iYear(year)
              .iMonth(month + 1)
              .iDate(1);
            const lastDay = target.endOf("iMonth").iDate();
            return target.iDate(Math.min(dayOfMonth, lastDay)).toDate();
          }

          // Gregorian
          return dayjs(prevDate).add(1, "month").toDate();
        }
        default:
          return prevDate;
      }
    });
  };

  const goToPrev = () => {
    setCurrentDate((prevDate) => {
      switch (calendarRangeType) {
        case "daily":
          return dayjs(prevDate).subtract(1, "day").toDate();
        case "weekly":
          return dayjs(prevDate).subtract(1, "week").toDate();
        case "monthly": {
          const { year, month } = getMonthInfo(prevDate, calendarType);

          if (calendarType === "jalali") {
            const d = dayjs(prevDate).calendar("jalali");
            const dayOfMonth = d.date();
            const target = dayjs()
              .calendar("jalali")
              .year(year)
              .month(month - 1)
              .date(1);
            const lastDay = target.daysInMonth();
            return target
              .date(Math.min(dayOfMonth, lastDay))
              .calendar("gregory")
              .toDate();
          }

          if (calendarType === "hijri") {
            const m = moment(prevDate);
            const dayOfMonth = m.iDate();
            const target = moment()
              .iYear(year)
              .iMonth(month - 1)
              .iDate(1);
            const lastDay = target.endOf("iMonth").iDate();
            return target.iDate(Math.min(dayOfMonth, lastDay)).toDate();
          }

          // Gregorian
          return dayjs(prevDate).subtract(1, "month").toDate();
        }
        default:
          return prevDate;
      }
    });
  };

  const goToToday = () => {
    setCurrentDate(today);
  };

  return (
    <div className="bg-card border border-[#DEEBFB] rounded-xl custom-shadow p-6 w-full">
      <div className="border border-[#E9EAEB] rounded-lg flex flex-col gap-4 w-full">
        <CalendarHeader
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
    switch (calendarRangeType) {
      case "monthly":
        calendarData = {
          date: date,
          visibleRange: generateVisibleRange(currentDate, calendarType),
          selectedDaysRangeStr: `${date.day} ${date.monthName} ${date.year}`,
        };
        return { calendarData };
      case "weekly":
        const weeklyVisibleRange = generateWeekVisibleRange(
          currentDate,
          calendarType
        );
        const selectedDateRange = {
          start: convertDateWithTimeZone(
            weeklyVisibleRange.start,
            calendarType
          ),
          end: convertDateWithTimeZone(weeklyVisibleRange.end, calendarType),
        };

        calendarData = {
          date: date,
          visibleRange: weeklyVisibleRange,
          selectedDaysRangeStr: `${selectedDateRange.start.day} ${selectedDateRange.start.monthName} ${selectedDateRange.start.year} - ${selectedDateRange.end.day} ${selectedDateRange.end.monthName} ${selectedDateRange.end.year}`,
        };
        return { calendarData };

      case "daily":
        calendarData = {
          date: date,
          selectedDaysRangeStr: `${date.day} ${date.monthName} ${date.year}`,
        };
        return { calendarData };
      default:
        calendarData = {
          date: date,
          visibleRange: generateVisibleRange(currentDate, calendarType),
          selectedDaysRangeStr: `${date.day} ${date.monthName} ${date.year}`,
        };
        return { calendarData };
    }
  }
}
