"use client";

import React, { useState } from "react";
import FullCalendar from "@fullcalendar/react";
import type { CalendarOptions } from "@fullcalendar/core";
import dayGridPlugin from "@fullcalendar/daygrid";
import dayjs from "dayjs";
import jalaliday from "jalaliday";
import utc from "dayjs/plugin/utc";
import { getDayNumber, getMonthInfo, getWeekdayLabel } from "@/lib/calendar";

dayjs.extend(utc);
dayjs.extend(jalaliday);

type Props = {
  currentDate: Date;
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
  console.log(visibleRange);
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
      console.log(arg.date);
      const dayNumber = getDayNumber(arg.date, calendarType);
      return { html: `<div>${dayNumber}</div>` };
    },

    dayHeaderContent: (arg) => {
      return getWeekdayLabel(arg.date, calendarType);
    },
  };
  const handleDatesSet = (arg: any) => {
    // Take middle of visible range to get main month
    const midTimestamp = (arg.start.getTime() + arg.end.getTime()) / 2;
    const midDate = new Date(midTimestamp);

    const { year, month } = getMonthInfo(midDate, calendarType);
    setVisibleMonth({ year, month });
  };

  return (
    <div className="w-full">
      <FullCalendar
        {...calendarOptions}
        datesSet={handleDatesSet}
        dayHeaderClassNames={() => ["my-header-label"]}
        dayCellClassNames={(arg) => {
          const { year: cellYear, month: cellMonth } = getMonthInfo(
            arg.date,
            calendarType
          );
          const { year: currentYear, month: currentMonth } = visibleMonth;
          const isOutOfMonth =
            cellYear !== currentYear || cellMonth !== currentMonth;
          return isOutOfMonth
            ? ["calendar-day", "disabled-day"]
            : ["calendar-day"];
        }}
      />
    </div>
  );
}
