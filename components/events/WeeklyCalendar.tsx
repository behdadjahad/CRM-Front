"use client";

import React from "react";
import FullCalendar from "@fullcalendar/react";
import type { CalendarOptions } from "@fullcalendar/core";

import dayjs from "dayjs";
import jalaliday from "jalaliday";
import utc from "dayjs/plugin/utc";

import timeGridPlugin from "@fullcalendar/timegrid"; //
import {
  convertDateWithTimeZone,
  convertToGregorianYMD,
  getDayNumber,
  getWeekdayLabel,
} from "@/lib/calendar";
dayjs.extend(utc);
dayjs.extend(jalaliday);

type Props = {
  currentDate: string;

  visibleRange: { start: Date; end: Date };
  calendarType: any;
    events:{title:string,start:string}[]
};

export default function WeeklyCalendar({
  currentDate,
  visibleRange,
  calendarType,
  events
}: Props) {
  console.log(currentDate);
  console.log(visibleRange);

  const calendarOptions: CalendarOptions = {
    plugins: [timeGridPlugin],
    initialView: "customWeek",
    firstDay: 6, // week starts on Saturday
    direction: calendarType === "gregory" ? "ltr" : "rtl",
    headerToolbar: false,
    footerToolbar: false,
    slotDuration: "00:30:00",
    allDaySlot: false,// hourly slots
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

    events: [    { title: "Test Event", start: "2025-08-20T23:50:30" ,   end: "2025-08-20T23:59:59",    allDay: false,},],
    dayHeaderContent: (arg) => {
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

      const isCurrentDay =
        currentYear === cellYear &&
        currentMonth === cellMonth &&
        currentDay === cellDay;

      const weekdayLabel = getWeekdayLabel(arg.date, calendarType);

      return {
        html: `<div class="flex-container"><span class=" ${
          isCurrentDay ? "current-day" : ""
        }">${cellDay}</span> <span>${weekdayLabel}</span></div>`,
      };
    },
  };

  return (
    <FullCalendar
      {...calendarOptions}
      dayHeaderClassNames={() => ["my-header-label"]}
    />
  );
}
