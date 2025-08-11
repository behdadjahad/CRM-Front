"use client";
import persian_fa from "react-date-object/locales/persian_fa";
import React, { useRef, useState, useEffect } from "react";
import FullCalendar from "@fullcalendar/react";
import {
  DateSelectArg,
  EventClickArg,
  EventContentArg,
  DatesSetArg,
} from "@fullcalendar/core";
import dayGridPlugin from "@fullcalendar/daygrid";
import timeGridPlugin from "@fullcalendar/timegrid";
import interactionPlugin from "@fullcalendar/interaction";
import listPlugin from "@fullcalendar/list";
import faLocale from "@fullcalendar/core/locales/fa";
import { Button } from "../ui/button";
import { FaArrowLeft, FaArrowRight } from "react-icons/fa";

import moment from "moment";
import "moment/locale/fa";
import "moment-hijri";

import { toJalaali, toGregorian } from "jalaali-js";

type CalendarEvent = {
  id?: string;
  title: string;
  start: string; // ISO string
  end?: string;
  backgroundColor?: string;
  borderColor?: string;
  extendedProps?: Record<string, any>;
};

// Your convertDate function
function convertDate(dateStr: string, targetType: string): string {
  dateStr = dateStr.split("T")[0].replace(/-/g, "/");
  const [year, month, day] = dateStr.split("/").map(Number);

  if (targetType.toLowerCase() === "lunar") {
    const hijriDate = moment([year, month - 1, day]).format("iYYYY/iMM/iDD");
    return hijriDate;
  } else if (targetType.toLowerCase() === "solar") {
    const jalaliDate = toJalaali(year, month, day);
    return `${jalaliDate.jy}/${String(jalaliDate.jm).padStart(2, "0")}/${String(
      jalaliDate.jd
    ).padStart(2, "0")}`;
  } else if (targetType.toLowerCase() === "gregorian") {
    return dateStr;
  } else {
    return "";
  }
}

// Add days helper
function addDaysToDateString(
  dateStr: string,
  targetType: "solar" | "gregorian" | "lunar",
  daysToAdd: number
): string {
  if (targetType === "gregorian") {
    const [year, month, day] = dateStr.split("/").map(Number);
    const gDate = new Date(year, month - 1, day);
    gDate.setDate(gDate.getDate() + daysToAdd);
    return `${gDate.getFullYear()}/${String(gDate.getMonth() + 1).padStart(
      2,
      "0"
    )}/${String(gDate.getDate()).padStart(2, "0")}`;
  } else if (targetType === "solar") {
    const [jy, jm, jd] = dateStr.split("/").map(Number);
    const gDate = toGregorian(jy, jm, jd);
    const gregDate = new Date(gDate.gy, gDate.gm - 1, gDate.gd);
    gregDate.setDate(gregDate.getDate() + daysToAdd);
    const newJalali = toJalaali(
      gregDate.getFullYear(),
      gregDate.getMonth() + 1,
      gregDate.getDate()
    );
    return `${newJalali.jy}/${String(newJalali.jm).padStart(2, "0")}/${String(
      newJalali.jd
    ).padStart(2, "0")}`;
  } else if (targetType === "lunar") {
    const m = moment(dateStr, "iYYYY/iMM/iDD");
    m.add(daysToAdd, "days");
    return m.format("iYYYY/iMM/iDD");
  } else {
    return "";
  }
}

export default function Calendar({
  initialEvents = [],
}: {
  initialEvents?: CalendarEvent[];
}) {
  const calendarRef = useRef<FullCalendar | null>(null);

  // Events state
  const [events, setEvents] = useState<CalendarEvent[]>([
    {
      id: "e1",
      title: "Product demo",
      start: new Date().toISOString().slice(0, 10) + "T10:00:00",
      backgroundColor: "#C7F9CC",
    },
    ...initialEvents,
  ]);

  // Solar (Jalali) date state in YYYY/MM/DD format
  const [currentSolarDate, setCurrentSolarDate] = useState(() => {
    const now = new Date();
    return convertDate(now.toISOString(), "solar");
  });

  useEffect(() => {
    const [jy, jm, jd] = currentSolarDate.split("/").map(Number);
    const gDate = toGregorian(jy, jm, jd);
    calendarRef.current
      ?.getApi()
      .gotoDate(new Date(gDate.gy, gDate.gm - 1, gDate.gd));
  }, []);

  const handleDateSelect = (selectInfo: DateSelectArg) => {
    const title = prompt("Event title") || "New event";
    const calendarApi = selectInfo.view.calendar;
    calendarApi.unselect();
    const newEvent: CalendarEvent = {
      id: String(Date.now()),
      title,
      start: selectInfo.startStr,
      end: selectInfo.endStr ?? undefined,
      backgroundColor: "#EDE9FE",
    };
    setEvents((prev) => [...prev, newEvent]);
  };

  // Handle event click
  const handleEventClick = (clickInfo: EventClickArg) => {
    if (confirm(`Delete event '${clickInfo.event.title}'?`)) {
      setEvents((prev) => prev.filter((e) => e.id !== clickInfo.event.id));
    }
  };

  // Update currentSolarDate when calendar view changes
  const handleDatesSet = (arg: DatesSetArg) => {
    console.log(arg);
  };

  // Navigation handlers
  const goPrev = () => {
    const newSolar = addDaysToDateString(currentSolarDate, "solar", -1);
    setCurrentSolarDate(newSolar);

    const [jy, jm, jd] = newSolar.split("/").map(Number);
    const gDate = toGregorian(jy, jm, jd);
    calendarRef.current
      ?.getApi()
      .gotoDate(new Date(gDate.gy, gDate.gm - 1, gDate.gd));
  };

  const goNext = () => {
    const newSolar = addDaysToDateString(currentSolarDate, "solar", 1);
    setCurrentSolarDate(newSolar);

    const [jy, jm, jd] = newSolar.split("/").map(Number);
    const gDate = toGregorian(jy, jm, jd);
    calendarRef.current
      ?.getApi()
      .gotoDate(new Date(gDate.gy, gDate.gm - 1, gDate.gd));
  };

  const goToday = () => {
    const now = new Date();
    const solarNow = convertDate(now.toISOString(), "solar");
    setCurrentSolarDate(solarNow);

    const [jy, jm, jd] = solarNow.split("/").map(Number);
    const gDate = toGregorian(jy, jm, jd);
    calendarRef.current
      ?.getApi()
      .gotoDate(new Date(gDate.gy, gDate.gm - 1, gDate.gd));
  };

  // Format solar date string to display like "16 مرداد 1404"
  // We'll map month number to Persian month names:
  const solarMonths = [
    "فروردین",
    "اردیبهشت",
    "خرداد",
    "تیر",
    "مرداد",
    "شهریور",
    "مهر",
    "آبان",
    "آذر",
    "دی",
    "بهمن",
    "اسفند",
  ];

  const [jy, jm, jd] = currentSolarDate.split("/").map(Number);
  function getVisibleRangeForJalaliMonth(jy: number, jm: number) {
    // First day of Jalali month
    const startG = toGregorian(jy, jm, 1);
    const startDate = new Date(startG.gy, startG.gm - 1, startG.gd);

    // Move back until we hit Saturday (JS: getDay() === 6)
    while (startDate.getDay() !== 6) {
      startDate.setDate(startDate.getDate() - 1);
    }

    // Last day of Jalali month
    let lastDay = 30;
    if (jm <= 6) lastDay = 31;
    else if (jm === 12) lastDay = 29; // ignoring leap year for simplicity

    const endG = toGregorian(jy, jm, lastDay);
    const endDate = new Date(endG.gy, endG.gm - 1, endG.gd);

    // Move forward until we hit Friday (JS: getDay() === 5)
    while (endDate.getDay() !== 5) {
      endDate.setDate(endDate.getDate() + 1);
    }

    return { startDate, endDate };
  }

  const solarDisplay = `${jd} ${solarMonths[jm - 1]} ${jy}`;
  const { startDate, endDate } = getVisibleRangeForJalaliMonth(jy, jm);
  console.log(startDate);
  console.log(endDate);
  return (
    <div className="bg-white rounded-lg shadow p-4">
      {/* Header with arrows and solar date */}
      <div className="flex items-center justify-center gap-4 mb-4">
        <Button onClick={goPrev} className="border rounded px-3 py-1 outline-none">
          <FaArrowRight />
        </Button>

        <div className="px-4 py-1 border rounded text-lg font-semibold">
          {solarDisplay}
        </div>

        <Button onClick={goNext} className="border rounded px-3 py-1 outline-none">
          <FaArrowLeft />
        </Button>

        <Button onClick={goToday} className="border rounded px-3 py-1 outline-none">
          امروز
        </Button>
      </div>

      {/* FullCalendar */}
      <FullCalendar
        ref={calendarRef}
        plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin, listPlugin]}
        initialView="dayGridMonth"
        initialDate={startDate}
        // Gregorian start date of Jalali month view
        visibleRange={{
          start: startDate,
          end: endDate,
        }}
        events={events}
        selectable={true}
        selectMirror={true}
        select={handleDateSelect}
        eventClick={handleEventClick}
        dayMaxEventRows={3}
        headerToolbar={false}
        datesSet={handleDatesSet}
        locales={[faLocale]}
        locale="fa"
        direction="rtl"
      />
    </div>
  );
}
