import React, { useState, useEffect } from "react";
import DatePicker from "react-multi-date-picker";
import gregorian from "react-date-object/calendars/gregorian";
import persian from "react-date-object/calendars/persian";
import arabic from "react-date-object/calendars/arabic";
import gregorian_en from "react-date-object/locales/gregorian_en";
import persian_fa from "react-date-object/locales/persian_fa";
import arabic_ar from "react-date-object/locales/arabic_ar";
import { cn } from "@/lib/utils";

type DateCalendar = "arabic" | "persian" | "gregorian";

interface CustomeDatePickerProps {
  placeholder?: string;
  inputStyle?: React.CSSProperties;
  className?: string;
  value?: any;
  onValueChanged?: (date: any) => any;
  idKey: string;
  children?: any;
}

export default function CustomeDatePicker({
  placeholder = "Select a date",
  children,
  className,
  idKey,
  value = new Date(),
  inputStyle = {},
  onValueChanged = (date: any) => {
    console.log({ date });
  }
}: CustomeDatePickerProps) {
  const [calendar, setCalendar] = useState<DateCalendar>("persian");
  const [locale, setLocale] = useState(persian_fa);

  // Calendar options
  const calendars = {
    gregorian: {
      calendar: gregorian,
      locale: gregorian_en,
      label: "میلادی",
    },
    persian: {
      calendar: persian,
      locale: persian_fa,
      label: "شمسی",
    },
    arabic: {
      calendar: arabic,
      locale: arabic_ar,
      label: "قمری",
    },
  };

  const updateButtonStyles = (calendarType: DateCalendar) => {
    const container = document.querySelector(`#${idKey}`)
    if (!container) return
    const buttons = container.querySelectorAll(".calendar-buttons button");
    const calendarKey = calendars[calendarType].label
    const newButtons = []
    buttons.forEach((button: any) => {
      const buttonKey = button.innerText; // Get the button label
      button.className = `px-4 py-2 border-none cursor-pointer flex-1 text-primary text-sm ${calendarKey == buttonKey ? 'bg-primary-muted text-primary-hover font-bold' : ''}`;
      newButtons.push(button)
    });
  };

  const handleCalendarChange = (calendarType: DateCalendar) => {
    setCalendar(calendarType);
    setLocale(calendars[calendarType].locale);

    updateButtonStyles(calendarType);
  };

  useEffect(() => {
    const interval = setInterval(() => {
      const container = document.querySelector(`#${idKey}`)

      if (!container) return
      const wrapper = container.querySelector(".rmdp-wrapper");
      if (wrapper && !wrapper.querySelector(".calendar-buttons")) {
        // Create button container
        const buttonContainer = document.createElement("div");
        buttonContainer.className = "calendar-buttons flex justify-center mt-2 w-full";

        // Create and append buttons to the container
        Object.keys(calendars).forEach((key) => {
          const button = document.createElement("button");
          button.innerText = calendars[key as DateCalendar].label;
          button.onclick = () => {
            handleCalendarChange(key as DateCalendar)
          };
          button.className = `px-4 py-2 border-none cursor-pointer flex-1 text-primary text-sm ${calendar === key ? 'bg-primary-muted text-primary-hover font-bold' : ''}`; // Tailwind classes for styling
          buttonContainer.appendChild(button);
        });

        wrapper.appendChild(buttonContainer);
      }
    }, 100);

    // Clear interval on unmount
    return () => clearInterval(interval);
  }, [calendar]); // Re-run effect when the calendar changes

  return (
    <div className={cn("[&>div]:w-full", className)} id={idKey}>
      <DatePicker
        calendar={calendars[calendar].calendar}
        locale={locale}
        value={value}
        autoFocus={true}
        inputClass="custom-date-input"
        className="[&>.rmdp-input]:hidden" // Hides default input from date picker component
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
