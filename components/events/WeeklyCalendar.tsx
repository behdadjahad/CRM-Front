"use client";

import React from "react";
import FullCalendar from "@fullcalendar/react";
import type { CalendarOptions } from "@fullcalendar/core";

import dayjs from "dayjs";
import jalaliday from "jalaliday";
import utc from "dayjs/plugin/utc";

import timeGridPlugin from "@fullcalendar/timegrid"; //
import { getDayNumber, getWeekdayLabel } from "@/lib/calendar";
dayjs.extend(utc);
dayjs.extend(jalaliday);

type Props = {
  currentDate: Date;

  visibleRange: any;
  calendarType: any;
};

export default function WeeklyCalendar({
  currentDate,
  visibleRange,
  calendarType,
}: Props) {
  console.log(currentDate);
  console.log(visibleRange);
  const calendarOptions: CalendarOptions = {
    plugins: [timeGridPlugin],
    initialView: "customWeek",
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
      customWeek: {
        type: "timeGrid",
        visibleRange: visibleRange,
      },
    },

    events: [{ title: "Test Event", start: new Date() }],
    dayHeaderContent: (arg) => {
      console.log(arg.date);
      const dayNumber = getDayNumber(arg.date, calendarType);
      const weekdayLabel = getWeekdayLabel(arg.date, calendarType);
      return { html: `${weekdayLabel} ${dayNumber}` };
    },
  };

  return <FullCalendar {...calendarOptions} />;
}
