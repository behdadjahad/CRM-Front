import { Button } from "../ui/button";
import Popup from "../ui/popup";

import React, { useState, useEffect } from "react";
import DatePicker from "react-multi-date-picker";
import gregorian from "react-date-object/calendars/gregorian";
import persian from "react-date-object/calendars/persian";
import arabic from "react-date-object/calendars/arabic";
import gregorian_en from "react-date-object/locales/gregorian_en";
import persian_fa from "react-date-object/locales/persian_fa";
import arabic_ar from "react-date-object/locales/arabic_ar";
export interface CustomRangeDatePickerInterface {
  onClose: () => void;
}

export default function CustomRangeDatePicker({
  onClose,
}: CustomRangeDatePickerInterface) {
  const [calendarType, setCalendarType] = useState<
    "gregorian" | "persian" | "islamic"
  >("islamic");
  const [date, setDate] = useState(null);
  const getCalendar = () => {
    switch (calendarType) {
      case "persian":
        return persian;
      case "islamic":
        return arabic;
      default:
        return gregorian;
    }
  };

  const getLocale = () => {
    switch (calendarType) {
      case "persian":
        return persian_fa;
      case "islamic":
        return arabic_ar;
      default:
        return gregorian_en;
    }
  };
  return (
    <Popup>
      <div className="flex flex-col gap-4 p-3 items-center">
        <DatePicker
          value={date}
          onChange={() => {
            setDate();
          }}
          calendar={getCalendar()}
                  locale={getLocale()}
                  className="bg-red-300"
        />
        <div className="flex items-center gap-2">
          <Button className="" variant={"info"}>
            تایید
          </Button>
          <Button className="" variant={"foreground"}>
            لغو
          </Button>
        </div>
      </div>
    </Popup>
  );
}
