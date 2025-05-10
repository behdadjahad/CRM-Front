import React, { useState, useEffect } from "react";
import DatePicker from "react-multi-date-picker";
import gregorian from "react-date-object/calendars/gregorian";
import persian from "react-date-object/calendars/persian";
import arabic from "react-date-object/calendars/arabic";
import gregorian_en from "react-date-object/locales/gregorian_en";
import persian_fa from "react-date-object/locales/persian_fa";
import arabic_ar from "react-date-object/locales/arabic_ar";
import { cn } from "@/lib/utils";

import DateObject from "react-date-object";
export type DateCalendar = "Lunar" | "Solar" | "Gregorian";

interface CustomeDatePickerProps {
  placeholder?: string;
  inputStyle?: React.CSSProperties;
  className?: string;
  value?: any;
  onValueChanged?: (date: any) => any;
  onCalenderTypeChange?: (calenderType: DateCalendar) => any;
  idKey: string;
  children?: React.ReactNode;
}

export default function CustomeDateTimePicker({
  placeholder = "Select a date",
  children,
  className,
  idKey,
  value = new Date(),
  inputStyle = {},
  onValueChanged = (date: any) => console.log(date),
  onCalenderTypeChange = (calendarType: string) => console.log(calendarType),
}: CustomeDatePickerProps) {
  // const uniqueId = useId(); // generates a unique id per component
  // const internalId = `${idKey}-${uniqueId}`; // scoped internal DOM id
  const [internalId] = useState(
    () => `${idKey}-${Math.random().toString(36).substring(2, 9)}`
  );

  const [calendar, setCalendar] = useState<DateCalendar>("Solar");
  const [locale, setLocale] = useState(persian_fa);

  const calendars = {
    Gregorian: {
      calendar: gregorian,
      locale: gregorian_en,
      label: "میلادی",
    },
    Solar: {
      calendar: persian,
      locale: persian_fa,
      label: "شمسی",
    },
    Lunar: {
      calendar: arabic,
      locale: arabic_ar,
      label: "قمری",
    },
  };

  const updateButtonStyles = (calendarType: DateCalendar) => {
    const container = document.querySelector(`#${internalId}`);
    if (!container) return;
    const buttons = container.querySelectorAll(".calendar-buttons button");
    const calendarLabel = calendars[calendarType].label;
    buttons.forEach((button: any) => {
      const isActive = button.innerText === calendarLabel;
      button.className = `px-4 py-2 border-none cursor-pointer flex-1 text-primary text-sm ${
        isActive ? "bg-primary-muted text-primary-hover font-bold" : ""
      }`;
    });
  };

  // const handleCalendarChange = (calendarType: DateCalendar) => {
  //   onCalenderTypeChange(calendarType);
  //   setCalendar(calendarType);
  //   setLocale(calendars[calendarType].locale);
  //   updateButtonStyles(calendarType);
  //   const newDate = new DateObject({
  //     date: value,
  //     calendar: calendars[calendarType].calendar,
  //     locale: calendars[calendarType].locale,
  //   });

  //   onValueChanged(newDate.format("YYYY/MM/DD-HH:mm"));
  // };

  const handleCalendarChange = (calendarType: DateCalendar) => {
    // Step 1: Parse the current date value in the *current* calendar
    const oldDate = new DateObject({
      date: value,
      calendar: calendars[calendar].calendar,
      locale: calendars[calendar].locale,
    });

    // Step 2: Convert to new calendar while preserving absolute time
    const newDate = oldDate.convert(calendars[calendarType].calendar);
    newDate.locale = calendars[calendarType].locale;

    // Step 3: Apply changes
    onCalenderTypeChange(calendarType);
    setCalendar(calendarType);
    setLocale(calendars[calendarType].locale);
    updateButtonStyles(calendarType);
    onValueChanged(newDate.format("YYYY/MM/DD"));
  };
  useEffect(() => {
    const interval = setInterval(() => {
      const container = document.querySelector(`#${internalId}`);
      if (!container) return;
      const wrapper = container.querySelector(".rmdp-wrapper");
      if (wrapper && !wrapper.querySelector(".calendar-buttons")) {
        const buttonContainer = document.createElement("div");
        buttonContainer.className =
          "calendar-buttons flex justify-center mt-2 w-full";

        Object.keys(calendars).forEach((key) => {
          const button = document.createElement("button");
          button.innerText = calendars[key as DateCalendar].label;
          button.onclick = () => handleCalendarChange(key as DateCalendar);
          button.className = `px-4 py-2 border-none cursor-pointer flex-1 text-primary text-sm ${
            calendar === key
              ? "bg-primary-muted text-primary-hover font-bold"
              : ""
          }`;
          buttonContainer.appendChild(button);
        });

        wrapper.appendChild(buttonContainer);
      }
    }, 100);

    return () => clearInterval(interval);
  }, [calendar, internalId]);

  return (
    <div className={cn("[&>div]:w-full", className)} id={internalId}>
      <DatePicker
        calendar={calendars[calendar].calendar}
        locale={locale}
        value={value}
        autoFocus={true}
        inputClass="custom-date-input"
        className="[&>.rmdp-input]:hidden"
        onChange={(date: any) => onValueChanged(date.format())}
        render={(value, openCalendar) => (
          <div className="w-full">
            <div className="w-full h-full z-0" onClick={openCalendar}>
              {children}
            </div>
            <input
              type="text"
              placeholder={placeholder}
              onFocus={openCalendar}
              readOnly
              value={value}
              style={inputStyle}
              className="hidden z-50 w-full h-full"
            />
          </div>
        )}
      />
    </div>
  );
}
