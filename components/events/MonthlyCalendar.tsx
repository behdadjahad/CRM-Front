"use client";

import React, { useState } from "react";
import FullCalendar from "@fullcalendar/react";
import type { CalendarOptions } from "@fullcalendar/core";
import dayGridPlugin from "@fullcalendar/daygrid";
import dayjs from "dayjs";
import jalaliday from "jalaliday";
import utc from "dayjs/plugin/utc";
import {
  convertDateWithTimeZone,
  convertToGregorianYMD,
  getDayNumber,
  getMonthInfo,
  getWeekdayLabel,
} from "@/lib/calendar";

dayjs.extend(utc);
dayjs.extend(jalaliday);

type Props = {
  currentDate: string;
  visibleRange: { start: Date; end: Date };
  calendarType: "jalali" | "hijri" | "gregory";
};
export default function MonthlyCalendar({
  currentDate,
  visibleRange,
  calendarType,
}: Props) {
  const [visibleMonth, setVisibleMonth] = useState(
    getMonthInfo(currentDate, calendarType)
  );

  const calendarOptions: CalendarOptions = {
    plugins: [dayGridPlugin],
    initialView: "customMonth",
    firstDay: 6,
    direction: calendarType === "gregory" ? "ltr" : "rtl",
    headerToolbar: false,
    footerToolbar: false,

    views: {
      customMonth: {
        type: "dayGrid",

        visibleRange: visibleRange,
      },
    },

    events: [{ title: "Test Event", start: new Date() }],

    dayCellContent: (arg) => {
      const {
        year: currentYear,
        month: currentMonth,
        day: currentDay,
      } = convertDateWithTimeZone(currentDate, calendarType);
      const {
        year: cellYear,
        month: cellMonth,
        day: cellDay,
      } = convertDateWithTimeZone(
        convertToGregorianYMD(arg.date),
        calendarType
      );

      const dayNumber = getDayNumber(arg.date, calendarType);
      const isCurrentDay =
        currentYear === cellYear &&
        currentMonth === cellMonth &&
        currentDay === cellDay;

      return {
        html: `<div class=" ${
          isCurrentDay ? "current-day" : ""
        }">${dayNumber}</div>`,
      };
    },

    dayHeaderContent: (arg) => {
      return getWeekdayLabel(arg.date, calendarType);
    },
  };
  const handleDatesSet = (arg: any) => {
    // Take middle of visible range to get main month
    const midTimestamp = (arg.start.getTime() + arg.end.getTime()) / 2;
    const midDate = new Date(midTimestamp);

    const { year, month } = getMonthInfo(currentDate, calendarType);
    console.log(getMonthInfo(currentDate, calendarType));
    setVisibleMonth({ year, month });
  };

  return (
    <div className="w-full">
      <FullCalendar
        {...calendarOptions}
        datesSet={handleDatesSet}
        dayHeaderClassNames={() => ["my-header-label"]}
        dayCellClassNames={(arg) => {
          console.log(arg.date, "dayCellClassNames");
          console.log(convertToGregorianYMD(arg.date));
          console.log(dayjs(arg.date).format("YYYY-MM-DD"));
          const { year: cellYear, month: cellMonth } = getMonthInfo(
            convertToGregorianYMD(arg.date),
            calendarType
          );
          console.log(
            getMonthInfo(convertToGregorianYMD(arg.date), calendarType)
          );
          console.log(getMonthInfo("2025-8-22", calendarType));
          const { year: currentYear, month: currentMonth } = visibleMonth;
          const isOutOfMonth =
            cellYear !== currentYear || cellMonth !== currentMonth;
          const isCurrentDay = true;
          return isOutOfMonth
            ? ["calendar-day", "disabled-day"]
            : isCurrentDay
            ? ["calendar-day", "active-day"]
            : ["calendar-day"];
        }}
      />
    </div>
  );
}
