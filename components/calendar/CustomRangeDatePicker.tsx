"use client";

import { Button } from "../ui/button";
import Popup from "../ui/popup";
import React, { useState } from "react";

import { Calendar } from "react-multi-date-picker";
import gregorian from "react-date-object/calendars/gregorian";
import persian from "react-date-object/calendars/persian";
import arabic from "react-date-object/calendars/arabic";
import gregorian_en from "react-date-object/locales/gregorian_en";
import persian_fa from "react-date-object/locales/persian_fa";
import arabic_ar from "react-date-object/locales/arabic_ar";
import "@/styles/range-date-picker.css";
import { convertToGregorianYMD } from "@/lib/calendar";
export interface CustomRangeDatePickerInterface {
  onClose: () => void;
  calendarType: CalenderType;
  onSendDateRange: (dates: any) => void;
}
export type CalenderType = "gregory" | "jalali" | "hijri";

export default function CustomRangeDatePicker({
  onClose,
  onSendDateRange,
  calendarType,
}: CustomRangeDatePickerInterface) {
  const getCalendar = () => {
    switch (calendarType) {
      case "jalali":
        return persian;
      case "hijri":
        return arabic;
      case "gregory":
      default:
        return gregorian;
    }
  };
  const getLocale = () => {
    switch (calendarType) {
      case "jalali":
        return persian_fa;
      case "hijri":
        return arabic_ar;
      case "gregory":
        return gregorian_en;
      default:
        return gregorian_en;
    }
  };
  const [dates, setDates] = useState<[any, any]>([null, null]);
  const [switchRange, setSwitchRange] = useState<string>();
  function submitDateRange() {
    const updatedDatesObj = dates.map((date) => date.toDate());
    const updatedDatesStr = updatedDatesObj.map((date) =>
      convertToGregorianYMD(date)
    );
    console.log(updatedDatesObj);
    console.log(updatedDatesStr);
    onSendDateRange({
      start: updatedDatesStr?.[0],
      end: updatedDatesStr?.[1],
    });
    console.log("hiiiiii")
  }
  return (
    <Popup>
      <div className="w-[376px] h-[472px] py-3 px-6 flex flex-col justify-between gap-4">
        <div className="flex justify-between items-center">
          <div className="flex flex-col gap-2 items-start">
            <span className="text-[#2949A4] text-sm font-primary-medium">
              شروع
            </span>
            <span className="text-[#545973]">
              {" "}
              {dates[0] ? dates[0].format("YYYY/MM/DD") : "-"}
            </span>
          </div>
          <div className="flex flex-col gap-2 items-start">
            <span className="text-[#2949A4] text-sm font-primary-medium">
              پایان
            </span>
            <span className="text-[#545973]">
              {" "}
              {dates[1] ? dates[1].format("YYYY/MM/DD") : "-"}
            </span>
          </div>
        </div>
        <div>
          <div className="flex items-center gap-4 justify-around w-full text-sm text-[#414651]">
            <div className="cursor-pointer">امروز</div>
            <div className="cursor-pointer">این ماه</div>
            <div className="cursor-pointer"> این هفته</div>
          </div>
        </div>
        <div className="w-full">
          <Calendar
            value={dates}
            onChange={(value) => setDates([value[0] ?? null, value[1] ?? null])}
            locale={getLocale()}
            range
            calendar={getCalendar()}
            className="!w-full !shadow-none !rounded-none !border-none !p-0"
          />
        </div>
        <div className="flex items-center justify-center w-full gap-4">
          <Button
            variant={"info"}
            className="text-sm w-40"
            onClick={() => {
              submitDateRange();
              onClose();
            }}
          >
            تایید
          </Button>
          <Button
            variant={"foreground"}
            className="text-sm w-40"
            onClick={() => {
              onClose();
            }}
          >
            لغو
          </Button>
        </div>
      </div>
    </Popup>
  );
}
