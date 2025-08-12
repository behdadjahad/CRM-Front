"use client";

import React
  from "react";
import FullCalendar from "@fullcalendar/react";
import type { CalendarOptions } from "@fullcalendar/core";

import dayjs from "dayjs";
import jalaliday from "jalaliday";
import utc from "dayjs/plugin/utc";

import timeGridPlugin from "@fullcalendar/timegrid"; //
dayjs.extend(utc);
dayjs.extend(jalaliday);

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
  currentDate: Date;
  onDateChange?: (date: Date) => void;
};

export default function JalaliWeeklyCalendar({ currentDate }: Props) {
  console.log(currentDate);

  const calendarOptions: CalendarOptions = {
    plugins: [timeGridPlugin],
    initialView: "jalaliWeek",
    firstDay: 6, // week starts on Saturday
    direction: "rtl",
    headerToolbar: false,
    footerToolbar: false,
    slotDuration: "00:30:00", // hourly slots
    slotLabelFormat: {
      hour: "numeric",
      minute: "2-digit",
      hour12: false,
    },
    views: {
      jalaliWeek: {
        type: "timeGrid",
        visibleRange: () => {
          console.log(currentDate);

          const date = dayjs.utc(currentDate);
          const dayOfWeek = date.day();
          console.log(dayOfWeek); // Sunday=0,...Saturday=6
          const diffToSaturday = (dayOfWeek + 1) % 7;
          const weekStart = date.subtract(diffToSaturday, "day");
          const weekEnd = weekStart.add(6, "day");
          console.log({
            start: weekStart.format("YYYY-MM-DD"),
            end: weekEnd.add(1, "day").format("YYYY-MM-DD"),
          });
          return {
            start: weekStart.format("YYYY-MM-DD"),
            end: weekEnd.add(1, "day").format("YYYY-MM-DD"),
          };
        },
      },
    },

    events: [{ title: "Test Event", start: new Date() }],
    dayHeaderContent: (arg) => {
      const dayjsDate = dayjs.utc(arg.date).calendar("jalali");
      const weekdayIndex = (dayjsDate.day() + 1) % 7;
      const dayNumber = dayjsDate.date();
      return { html: `${persianWeekdays[weekdayIndex]} ${dayNumber}` };
    },
  };

  return <FullCalendar {...calendarOptions} />;
}
