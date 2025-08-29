"use client";

import React, { useState } from "react";
import FullCalendar from "@fullcalendar/react";
import type { CalendarOptions } from "@fullcalendar/core";
import dayGridPlugin from "@fullcalendar/daygrid";
import dayjs from "dayjs";
import jalaliday from "jalaliday";
import utc from "dayjs/plugin/utc";
import interactionPlugin from "@fullcalendar/interaction";
import {
  convertDateWithTimeZone,
  convertToGregorianYMD,
  formatEventDate,
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
  events: { title: string; start: string }[];
  onSelectDate: (date: string) => void;
  onSelectEvent:(id:number)=>void;
};
export default function MonthlyCalendar({
  currentDate,
  visibleRange,
  calendarType,
  events,
  onSelectDate,
  onSelectEvent
}: Props) {
  const [visibleMonth, setVisibleMonth] = useState(
    getMonthInfo(currentDate, calendarType)
  );

  const updatedEvents = events.map((event) => ({
    ...event,
    start: formatEventDate(event.start),
    end: formatEventDate(event.start),
    allDay: false,
  }));
  console.log(updatedEvents);
  const calendarOptions: CalendarOptions = {
    plugins: [dayGridPlugin, interactionPlugin],
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
    selectable: true,
    select: (arg) => {
      onSelectDate(convertToGregorianYMD(arg.start));
    },
    // events: [
    //   { title: "Test Event", start: "2025-08-20T23:50:30" ,   end: "2025-08-20T23:59:59",    allDay: false,},
    // ],
    events: updatedEvents,
    eventContent: (arg) => {
      // Extract time using dayjs or built-in formatter

      const timeLabel = dayjs(arg.event.start).format("HH:mm");

      return {
        html: `
        <div class="event-container">
        <div class="event-time">${timeLabel}</div>
           <div class="event-text">${arg.event.title}</div>
           </div>`,
      };
    },
    eventClick: (arg) => {
      const eventId = arg.event.id; // <-- your event id
      console.log("Clicked event id:", eventId);

      onSelectEvent(Number(eventId))
    },
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

      const isCurrentDay =
        currentYear === cellYear &&
        currentMonth === cellMonth &&
        currentDay === cellDay;

      return {
        html: `<div class=" ${
          isCurrentDay ? "current-day" : ""
        }">${cellDay}</div>`,
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
            convertToGregorianYMD(arg.date),
            calendarType
          );

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
