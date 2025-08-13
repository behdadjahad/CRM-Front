"use client";

import React from "react";
import FullCalendar from "@fullcalendar/react";
import type { CalendarOptions } from "@fullcalendar/core";
import timeGridPlugin from "@fullcalendar/timegrid"; //

type Props = {
    currentDate: Date;
    
};

export default function DailyCalendar({ currentDate }: Props) {
  console.log(currentDate);

  const calendarOptions: CalendarOptions = {
    plugins: [timeGridPlugin],
    initialView: "customDay",
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
      customDay: {
        type: "timeGrid",
        duration: { days: 1 },
      },
    },
    dayHeaders: false,
    events: [{ title: "Test Event", start: currentDate }],
  };

  return <FullCalendar {...calendarOptions} />;
}
