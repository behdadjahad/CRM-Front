import React from "react";
import { Calendar, dateFnsLocalizer } from "react-big-calendar";
import "react-big-calendar/lib/css/react-big-calendar.css";
import jalaali from "jalaali-js";
import { format, parse, startOfWeek, getDay, addDays } from "date-fns";
import { enUS } from "date-fns/locale/en-US";
// Set up date-fns localizer for React Big Calendar
const locales = {
  "en-US": enUS,
};

const localizer = dateFnsLocalizer({
  format,
  parse,
  startOfWeek,
  getDay,
  locales,
});

// Helper: Convert Jalali date (year, month, day) to JS Date (Gregorian)
function jalaliToGregorianDate(jYear: any, jMonth: any, jDay: any) {
  // jMonth is 1-based in jalaali-js
  const { gy, gm, gd } = jalaali.toGregorian(jYear, jMonth, jDay);
  return new Date(gy, gm - 1, gd); // JS Date months are 0-based
}

// Example events with Jalali dates
const jalaliEvents = [
  {
    id: 1,
    title: "رویداد اول",
    start: { jy: 1404, jm: 5, jd: 15 }, // 15 Mordad 1404 Jalali
    end: { jy: 1404, jm: 5, jd: 15 },
  },
  {
    id: 2,
    title: "رویداد دوم",
    start: { jy: 1404, jm: 5, jd: 20 },
    end: { jy: 1404, jm: 5, jd: 21 },
  },
];

export default function MonthlyCalendar() {
  // Convert Jalali events to Gregorian for React Big Calendar
  const events = jalaliEvents.map((evt) => ({
    id: evt.id,
    title: evt.title,
    start: jalaliToGregorianDate(evt.start.jy, evt.start.jm, evt.start.jd),
    end: jalaliToGregorianDate(evt.end.jy, evt.end.jm, evt.end.jd),
  }));
  const persianDayNames = [
    "شنبه", // Saturday (6)
    "یک‌شنبه", // Sunday (0)
    "دوشنبه", // Monday (1)
    "سه‌شنبه", // Tuesday (2)
    "چهارشنبه", // Wednesday (3)
    "پنج‌شنبه", // Thursday (4)
    "جمعه", // Friday (5)
  ];

  function CustomDayHeader({ date }: { date: Date }) {
    const dayIndex = date.getDay();
    console.log(dayIndex); // 0=Sun ... 6=Sat
    const persianIndex = (dayIndex + 1) % 7; // shift by 1 so Sat(6) → 0
    return <span>{persianDayNames[persianIndex]}</span>;
  }
  const localizer = dateFnsLocalizer({
    format,
    parse,
    startOfWeek: () => 6, // Saturday start
    getDay,
    locales,
  });
    function JalaliDateHeader({ date }: { date: Date }) {
  const { jy, jm, jd } = jalaali.toJalaali(date);
  return <span>{jd}</span>; // show just the Jalali day number
}
  return (
    <div style={{ height: 600 }}>
      <Calendar
        localizer={localizer}
        events={events}
        components={{
          month: {
            header: CustomDayHeader,
         
          },
        }}
        startAccessor="start"
        endAccessor="end"
        defaultView="month"
        views={["month"]}
        culture="fa" // this helps with RTL (if your CSS supports it)
        messages={{
          next: "بعدی",
          previous: "قبلی",
          today: "امروز",
          month: "ماه",
          day: "روز",
          week: "هفته",
          agenda: "برنامه",
          date: "تاریخ",
          time: "زمان",
          event: "رویداد",
          noEventsInRange: "هیچ رویدادی در این بازه وجود ندارد",
              }}
              
      />
    </div>
  );
}
