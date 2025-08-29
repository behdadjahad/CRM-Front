"use client";

import React, { useEffect, useRef } from "react";
import dayjs from "dayjs";
import type { CalendarOptions } from "@fullcalendar/core";
import timeGridPlugin from "@fullcalendar/timegrid"; //
import { formatEventDate } from "@/lib/calendar";
import FullCalendar from "@fullcalendar/react";

type Props = {
  currentDate: string;
  events: { title: string; start: string }[];
  onSelectEvent: (id: number) => void;
};

export default function DailyCalendar({
  currentDate,
  events,
  onSelectEvent,
}: Props) {
  const calendarRef = useRef<FullCalendar>(null);

  useEffect(() => {
    // First, get the CalendarApi from the component
    const calendarApi = calendarRef.current?.getApi();

    // Now call gotoDate on the CalendarApi, NOT the component
    if (calendarApi) {
      calendarApi.gotoDate(currentDate);
    }
  }, [currentDate]);

  console.log(currentDate);
  console.log(events);
  const updatedEvents = events.map((event) => ({
    ...event,
    start: formatEventDate(event.start),
  }));
  const calendarOptions: CalendarOptions = {
    plugins: [timeGridPlugin],
    initialView: "customDay",
    initialDate: currentDate,
    firstDay: 6, // week starts on Saturday
    direction: "rtl",
    headerToolbar: false,
    footerToolbar: false,
    slotDuration: "00:30:00",
    allDaySlot: false, /// hourly slots
    slotLabelFormat: {
      hour: "numeric",
      minute: "2-digit",
      hour12: false,
    },
    views: {
      customDay: {
        type: "timeGrid",
        duration: { days: 1 },
      },
    },
    dayHeaders: false,
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

      onSelectEvent(Number(eventId));
    },
    // events: [{ title: "Test Event", start: new Date() }],
    // events: [{ title: "Test Event", start: "2025-08-27T15:30:00" }],
  };

  return <FullCalendar ref={calendarRef} {...calendarOptions} />;
}
