import React, { useState } from "react";

import dayjs from "dayjs";
import jalaliday from "jalaliday";
import "dayjs/locale/fa"; // Persian locale
import localizedFormat from "dayjs/plugin/localizedFormat";
import utc from "dayjs/plugin/utc";
import timezone from "dayjs/plugin/timezone";
import { Button } from "../ui/button";
import { FaArrowLeft, FaArrowRight } from "react-icons/fa";

import {
  convertDateWithTimeZone,
  generateVisibleRange,
  generateWeekVisibleRange,
  getToday,
} from "@/lib/calendar";
import MonthlyCalendar from "./MonthlyCalendar";
import WeeklyCalendar from "./WeeklyCalendar";
import DailyCalendar from "./DailyCalendar";

dayjs.extend(utc);
dayjs.extend(localizedFormat);
dayjs.extend(jalaliday);
dayjs.locale("fa"); // Set

dayjs.extend(timezone);

export default function CalendarContainer() {
  const today = getToday();
  const calendarType = "hijri"; // "jalali" | "hijri" | "gregory"
  const [calendarRangeType, setCalendarRangeType] = useState<
    "daily" | "weekly" | "monthly"
  >("daily");
  const [currentDate, setCurrentDate] = useState(today);

  const { date, fullDayName, visibleRange, weeklyVisibleRange } = getData();

  const goToNextDay = () => {
    setCurrentDate((prevDate) => {
      const nextDay = dayjs(prevDate).add(1, "day").calendar("jalali");

      return nextDay.toDate();
    });
  };
  const goToPrevDay = () => {
    setCurrentDate((prev) => dayjs(prev).subtract(1, "day").toDate());
  };

  const goToToday = () => {
    setCurrentDate(today);
  };

  return (
    <div className="bg-card border border-[#DEEBFB] rounded-xl custom-shadow p-6">
      <div className="border border-[#E9EAEB] rounded-lg flex flex-col gap-4">
        <div className="bg-card p-6 rounded-lg flex justify-between items-center">
          <div className="h-16 w-16 border rounded-lg flex flex-col items-center justify-between">
            <span className="bg-[#FCFCFD] text-xs w-full text-center p-1 rounded-t-lg text-[#717680]">
              {date.monthName}
            </span>
            <span className="flex items-center justify-center flex-1 text-[#1C68DA] font-primary-bold">
              {date.day}
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
        </div>
        {calendarRangeType === "monthly" ? (
          <MonthlyCalendar
            currentDate={currentDate}
            visibleRange={visibleRange}
            calendarType={calendarType}
          />
        ) : calendarRangeType === "weekly" ? (
          <WeeklyCalendar
            currentDate={currentDate}
            visibleRange={weeklyVisibleRange}
            calendarType={calendarType}
          />
        ) : calendarRangeType === "daily" ? (
          <DailyCalendar currentDate={currentDate} />
        ) : (
          <></>
        )}
      </div>
    </div>
  );

  function getData() {
    const date = convertDateWithTimeZone(currentDate, calendarType);

    const fullDayName = `${date.day} ${date.monthName} ${date.year}`;
    const visibleRange = generateVisibleRange(currentDate, calendarType);
    const weeklyVisibleRange = generateWeekVisibleRange(
      currentDate,
      calendarType
    );
    return { date, fullDayName, visibleRange, weeklyVisibleRange };
  }
}
