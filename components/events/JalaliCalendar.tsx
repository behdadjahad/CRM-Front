"use client";

import React, { useState } from "react";
import FullCalendar from "@fullcalendar/react";
import type { CalendarOptions } from "@fullcalendar/core";
import dayGridPlugin from "@fullcalendar/daygrid";
import dayjs from "dayjs";
import jalaliday from "jalaliday";
import utc from "dayjs/plugin/utc";
dayjs.extend(utc);
dayjs.extend(jalaliday);

// Persian day names starting Saturday
const persianWeekdays = [
  "شنبه", // Saturday
  "یکشنبه", // Sunday
  "دوشنبه", // Monday
  "سه‌شنبه", // Tuesday
  "چهارشنبه", // Wednesday
  "پنجشنبه", // Thursday
  "جمعه", // Friday
];
type Props = {
  setCurrentJalaliMonth: React.Dispatch<
    React.SetStateAction<{ year: number; month: number } | null>
  >;
  currentJalaliMonth: any;
  currentDate: Date;
  onDateChange: (date: Date) => void;
};
export default function JalaliCalendar({
  setCurrentJalaliMonth,
  currentJalaliMonth,
  currentDate,
  onDateChange,
}: Props) {
  const calendarOptions: CalendarOptions = {
    plugins: [dayGridPlugin],
    initialView: "jalaliMonth",
    firstDay: 6, // start on Saturday
    direction: "rtl",
    headerToolbar: false, // <-- disable default header
    footerToolbar: false,
    views: {
      jalaliMonth: {
        type: "dayGrid",
        visibleRange: () => {
          const jalaliCurrent = dayjs(currentDate).calendar("jalali");
          const year = jalaliCurrent.year();
          const month = jalaliCurrent.month(); // 0-based

          // Start at 1st day of the Jalali month
          let start = dayjs()
            .calendar("jalali")
            .year(year)
            .month(month)
            .date(1);

          // Move backward *including* the current day until it's Saturday (6)
          while (start.day() !== 6) {
            start = start.subtract(1, "day");
          }

          // End at last day of the Jalali month
          let end = dayjs()
            .calendar("jalali")
            .year(year)
            .month(month)
            .endOf("month");

          // Move forward *including* current day until Friday (5)
          while (end.day() !== 5) {
            end = end.add(1, "day");
          }

          // Return Gregorian dates for FullCalendar
          return {
            start: start.calendar("gregory").toDate(),
            end: end.calendar("gregory").toDate(),
          };
        },
      },
    },

    events: [{ title: "Test Event", start: new Date() }],

    // Jalali day numbers in grid
    dayCellContent: (arg) => {
      // Parse arg.date as UTC date

      const jalaliDay = dayjs.utc(arg.date).calendar("jalali").date();
      return { html: `<div>${jalaliDay}</div>` };
    },

    // Jalali month/year in header
    titleFormat: (arg) => {
      const startJ = dayjs(new Date(arg.start as unknown as Date)).calendar(
        "jalali"
      );
      const endJ = dayjs(new Date(arg.end as unknown as Date))
        .calendar("jalali")
        .subtract(1, "day");

      if (startJ.month() === endJ.month()) {
        return `${startJ.year()} ${startJ.format("MMMM")}`;
      }
      return `${startJ.format("MMMM YYYY")} - ${endJ.format("MMMM YYYY")}`;
    },

    // Persian weekday headers
    dayHeaderContent: (arg) => {
      const weekdayIndex =
        (dayjs(new Date(arg.date as unknown as Date)).day() + 1) % 7;
      return persianWeekdays[weekdayIndex];
    },
  };
  const handleDatesSet = (arg: any) => {
    const midTimestamp = (arg.start.getTime() + arg.end.getTime()) / 2;
    const midDate = new Date(midTimestamp);

    const midJalali = dayjs(midDate).calendar("jalali");

    setCurrentJalaliMonth((prev) => {
      if (
        prev?.year === midJalali.year() &&
        prev?.month === midJalali.month()
      ) {
        return prev; // no change
      }
      return { year: midJalali.year(), month: midJalali.month() };
    });
  };
  return (
    <div>
      <FullCalendar
        {...calendarOptions}
        datesSet={handleDatesSet}
        dayHeaderClassNames={() => ["my-header-label"]}
        dayCellClassNames={(arg) => {
          if (!currentJalaliMonth) return [];

          const dateJ = dayjs.utc(arg.date).calendar("jalali");
          const isOutOfMonth =
            dateJ.year() !== currentJalaliMonth.year ||
            dateJ.month() !== currentJalaliMonth.month;

          return isOutOfMonth
            ? ["calendar-day disabled-day"]
            : ["calendar-day"];
        }}
      />
    </div>
  );
}
