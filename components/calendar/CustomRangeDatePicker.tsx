import { Button } from "../ui/button";
import Popup from "../ui/popup";
import React from "react";

import { Calendar } from "react-multi-date-picker";
import gregorian from "react-date-object/calendars/gregorian";
import persian from "react-date-object/calendars/persian";
import arabic from "react-date-object/calendars/arabic";
import gregorian_en from "react-date-object/locales/gregorian_en";
import persian_fa from "react-date-object/locales/persian_fa";
import arabic_ar from "react-date-object/locales/arabic_ar";
import "@/styles/range-date-picker.css";
export interface CustomRangeDatePickerInterface {
  onClose: () => void;
  calendarType: CalenderType;
}
export type CalenderType = "gregory" | "jalali" | "hijri";

export default function CustomRangeDatePicker({
  onClose,
  calendarType,
}: CustomRangeDatePickerInterface) {
  console.log(calendarType);
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
  return (
    <Popup>
      <div className="w-[545px] py-3 px-6 flex flex-col gap-4">
        <div className="flex justify-between items-center">
          <div className="flex flex-col gap-2">
            <span className="text-[#4573FE] text-sm">شروع</span>
            <span className="text-[#545973]">1404/05/11</span>
          </div>
          <div className="flex flex-col gap-2">
            <span className="text-[#4573FE] text-sm">پایان</span>
            <span className="text-[#545973]">1404/05/11</span>
          </div>
        </div>

        <div className="w-full">
          <Calendar
            // value={dates}
            // onChange={(value) => setDates([value[0] ?? null, value[1] ?? null])}
            locale={getLocale()}
            range
            calendar={getCalendar()}
            className="!w-full !shadow-none !rounded-none !border-none !p-0"
          />
        </div>
        <div className="flex items-center justify-center w-full gap-4">
          <Button
            variant={"transparent"}
            className="bg-[#4573FE] text-card text-sm w-44"
          >
            تایید
          </Button>
          <Button
            variant={"transparent"}
            className="bg-[#B6BCC2] text-card text-sm w-44"
          >
            لغو
          </Button>
        </div>
      </div>
    </Popup>
  );
}
