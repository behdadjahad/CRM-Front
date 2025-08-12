import React, { useState } from "react";
import JalaliCalendar from "./JalaliCalendar";
import dayjs from "dayjs";
import jalaliday from "jalaliday";
import "dayjs/locale/fa"; // Persian locale
import localizedFormat from "dayjs/plugin/localizedFormat";
import utc from "dayjs/plugin/utc";
import timezone from "dayjs/plugin/timezone";
import { Button } from "../ui/button";
import { FaArrowLeft, FaArrowRight } from "react-icons/fa";

import convertGaregrianToSolarWithTimeZone from "@/lib/calendar";
import WeeklyJalaliCalendar from "./WeeklyJalaliCalendar";
import HijriCalendar from "./HijriCalendar";
dayjs.extend(utc);
dayjs.extend(localizedFormat);
dayjs.extend(jalaliday);
dayjs.locale("fa"); // Set

dayjs.extend(timezone);

export default function MonthlyCalendarContainer() {
  const { toDay } = getToday();
  const [currentDate, setCurrentDate] = useState(toDay);
  const { day, monthName, year, fullDayName } = getData();

  const goToNextDay = () => {
    setCurrentDate((prevDate) => {
      // Convert previous date to dayjs Jalali object
      const nextDay = dayjs(prevDate).add(1, "day").calendar("jalali");
      // Convert back to JavaScript Date
      return nextDay.toDate();
    });
  };

  const [currentJalaliMonth, setCurrentJalaliMonth] = useState<{
    year: number;
    month: number;
  } | null>(null);

  const goToPrevDay = () => {
    setCurrentDate((prev) => dayjs(prev).subtract(1, "day").toDate());
  };

  const goToToday = () => {
    setCurrentDate(dayjs().calendar("jalali").toDate());
  };
  return (
    <div className="bg-card border border-[#DEEBFB] rounded-xl custom-shadow p-6">
      <div className="border border-[#E9EAEB] rounded-lg flex flex-col gap-4">
        <div className="bg-card p-6 rounded-lg flex justify-between items-center">
          <div className="h-16 w-16 border rounded-lg flex flex-col items-center justify-between">
            <span className="bg-[#FCFCFD] text-xs w-full text-center p-1 rounded-t-lg text-[#717680]">
              {monthName}
            </span>
            <span className="flex items-center justify-center flex-1 text-[#1C68DA] font-primary-bold">
              {day}
            </span>
          </div>
          <div className="flex items-center justify-center gap-4 mb-4">
            <Button onClick={goToPrevDay} className="border rounded px-3 py-1">
              <FaArrowRight />
            </Button>

            <div className="px-4 py-1 border rounded text-lg font-semibold">
              {fullDayName}
            </div>

            <Button onClick={goToNextDay} className="border rounded px-3 py-1">
              <FaArrowLeft />
            </Button>

            <Button onClick={goToToday} className="border rounded px-3 py-1">
              امروز
            </Button>
          </div>
        </div>{" "}
        {/* <JalaliCalendar
          currentJalaliMonth={currentJalaliMonth}
          setCurrentJalaliMonth={setCurrentJalaliMonth}
          currentDate={currentDate}
          onDateChange={setCurrentDate}
        /> */}
        {/* <WeeklyJalaliCalendar currentDate={currentDate} /> */}
        <HijriCalendar
          currentHijriMonth={currentJalaliMonth}
          setCurrentHijriMonth={setCurrentJalaliMonth}
          currentDate={currentDate}
          onDateChange={setCurrentDate}
        />
      </div>
    </div>
  );
  function getToday() {
    const toDay = dayjs().calendar("jalali").toDate();
    console.log(toDay);
    return { toDay };
  }
  function getData() {
    const date = convertGaregrianToSolarWithTimeZone(currentDate);
    const day = date.day;
    const monthName = date
      ? dayjs()
          .calendar("jalali")
          .year(date.year)
          .month(date.month - 1) // date.month is 1-based
          .format("MMMM")
      : "";
    const year = date.year;
    const fullDayName = `${day} ${monthName} ${year}`;
    return { day, monthName, year, fullDayName };
  }
}
