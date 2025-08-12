"use client";

import React from "react";
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import moment from "moment-hijri";
import type { CalendarOptions } from "@fullcalendar/core";
const arabicWeekdays = [
  "السبت",
  "الأحد", // Sunday
  "الإثنين", // Monday
  "الثلاثاء",
  "الأربعاء",
  "الخميس",
  "الجمعة",
  // Saturday
];

type Props = {
  setCurrentHijriMonth: React.Dispatch<
    React.SetStateAction<{ year: number; month: number } | null>
  >;
  currentHijriMonth: { year: number; month: number } | null;
  currentDate: Date;
  onDateChange: (date: Date) => void;
};

export default function HijriCalendar({
  setCurrentHijriMonth,
  currentHijriMonth,
  currentDate,
  onDateChange,
}: Props) {
  const calendarOptions: CalendarOptions = {
    plugins: [dayGridPlugin],
    initialView: "hijriMonth",
    firstDay: 0, // start Sunday
    direction: "rtl",
    headerToolbar: false,
    footerToolbar: false,

    views: {
      hijriMonth: {
        type: "dayGrid",
        visibleRange: () => {
          // Convert current date to Hijri
          const hijriDate = moment(currentDate).format("iYYYY/iM/iD");
          const [hYear, hMonth] = hijriDate.split("/").map(Number);

          // Start at first day of Hijri month
          const start = moment()
            .iYear(hYear)
            .iMonth(hMonth - 1)
            .startOf("iMonth");

          // Move to Sunday
          while (start.day() !== 0) {
            start.subtract(1, "day");
          }

          // End at last day of Hijri month
          const end = moment()
            .iYear(hYear)
            .iMonth(hMonth - 1)
            .endOf("iMonth");

          // Move to Saturday
          while (end.day() !== 6) {
            end.add(1, "day");
          }

          return { start: start.toDate(), end: end.toDate() };
        },
      },
    },

    events: [{ title: "Test Event", start: new Date() }],

    // Hijri day numbers
    dayCellContent: (arg: any) => {
      const hijriDay = moment(arg.date).format("iD");
      return { html: `<div>${hijriDay}</div>` };
    },

    // Hijri month/year title
    titleFormat: (arg: any) => {
      const startH = moment(arg.start).format("iMMMM iYYYY");
      const endH = moment(arg.end).subtract(1, "day").format("iMMMM iYYYY");

      return startH === endH ? startH : `${startH} - ${endH}`;
    },

    // Arabic weekday headers
    dayHeaderContent: (arg: any) => arabicWeekdays[moment(arg.date).day()],
  };

  const handleDatesSet = (arg: any) => {
    const midTimestamp = (arg.start.getTime() + arg.end.getTime()) / 2;
    const midDate = new Date(midTimestamp);

    const midHijriYear = parseInt(moment(midDate).format("iYYYY"), 10);
    const midHijriMonth = parseInt(moment(midDate).format("iM"), 10) - 1;

    setCurrentHijriMonth((prev) => {
      if (prev?.year === midHijriYear && prev?.month === midHijriMonth) {
        return prev;
      }
      return { year: midHijriYear, month: midHijriMonth };
    });
  };

  return (
    <div>
      <FullCalendar
        {...calendarOptions}
        datesSet={handleDatesSet}
        dayHeaderClassNames={() => ["my-header-label"]}
        dayCellClassNames={(arg: any) => {
          if (!currentHijriMonth) return [];

          const dateHYear = parseInt(moment(arg.date).format("iYYYY"), 10);
          const dateHMonth = parseInt(moment(arg.date).format("iM"), 10) - 1;

          const isOutOfMonth =
            dateHYear !== currentHijriMonth.year ||
            dateHMonth !== currentHijriMonth.month;

          return isOutOfMonth
            ? ["calendar-day disabled-day"]
            : ["calendar-day"];
        }}
      />
    </div>
  );
}
