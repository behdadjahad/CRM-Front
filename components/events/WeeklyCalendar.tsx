"use client";

import React from "react";
import FullCalendar from "@fullcalendar/react";
import type { CalendarOptions } from "@fullcalendar/core";
import interactionPlugin from "@fullcalendar/interaction";
import dayjs from "dayjs";
import jalaliday from "jalaliday";
import utc from "dayjs/plugin/utc";

import timeGridPlugin from "@fullcalendar/timegrid"; //
import {
  convertDateWithTimeZone,
  convertToGregorianYMD,
  formatEventDate,
  getDayNumber,
  getWeekdayLabel,
} from "@/lib/calendar";
import { cond } from "lodash";
dayjs.extend(utc);
dayjs.extend(jalaliday);

type Props = {
  currentDate: string;

  visibleRange: { start: Date; end: Date };
  calendarType: any;
  events: { title: string; start: string }[];
  onSelectDate: (date: string) => void;
  onSelectEvent: (id: number) => void;
};

export default function WeeklyCalendar({
  currentDate,
  visibleRange,
  calendarType,
  events,
  onSelectDate,
  onSelectEvent,
}: Props) {
  console.log(currentDate);
  console.log(visibleRange);
  console.log(events);

  const updatedEvents = events.map((event) => ({
    ...event,
    start: formatEventDate(event.start),
    end: formatEventDate(event.start),
    allDay: false,
  }));
  console.log(updatedEvents);
  const calendarOptions: CalendarOptions = {
    plugins: [timeGridPlugin, interactionPlugin],
    initialView: "customWeek",
    firstDay: 6, // week starts on Saturday
    direction: calendarType === "gregory" ? "ltr" : "rtl",
    headerToolbar: false,
    footerToolbar: false,
    slotDuration: "00:30:00",
    allDaySlot: false, // hourly slots
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

    events: updatedEvents,
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
    eventClick: (arg) => {
      const eventId = arg.event.id; // <-- your event id
      console.log("Clicked event id:", eventId);

      onSelectEvent(Number(eventId));
    },
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
    selectable: true,
    select: (arg) => {
      console.log(convertToGregorianYMD(arg.start));
      onSelectDate(convertToGregorianYMD(arg.start));
    },
    dayHeaderDidMount: () => {
      const cornerCell = document.querySelector(
        ".fc-timegrid .fc-col-header thead .fc-scrollgrid-shrink > th:first-child"
      );
      console.log(cornerCell);
      if (cornerCell) {
        console.log(cornerCell);
        // clear previous content
        cornerCell.innerHTML = "";

        // create Next.js Image element
        const img = document.createElement("img");
        img.src = "/icons/calendar-time.png";
        img.width = 24;
        img.height = 24;
        img.style.display = "block";
        img.style.margin = "4px auto";
        cornerCell.appendChild(img);
      }
    },
    // dayHeaderDidMount:(arg) => {
    //   const cornerCell = document.querySelector(
    //     ".fc-timegrid .fc-col-header thead .fc-scrollgrid-shrink > th:first-child"
    //   );
    //   if (cornerCell) {
    //     cornerCell.innerHTML = `<div class="flex justify-center items-center">
    //       <i class="lucide lucide-calendar w-4 h-4 text-gray-600"></i>
    //     </div>`;
    //   }
    // }
  };

  return (
    <FullCalendar
      {...calendarOptions}
      dayHeaderClassNames={() => ["my-header-label"]}
    />
  );
}
