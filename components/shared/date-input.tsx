import React, { useState } from "react";
import { FormMakerInterface } from "./form-maker";
import { cn } from "@/lib/utils";
import Image from "next/image";
import CustomeDatePicker, { DateCalendar } from "./custome-date-picker";

export default function DateInput({
  form,
  item,
}: {
  form: any;
  item: FormMakerInterface["fields"][0];
}) {
  const [calendarType, setCalendarType] = useState<DateCalendar>("Solar");
  const handleCalendarTypeChange = (newCalendarType: DateCalendar) => {
    setCalendarType(newCalendarType);
  };
  return (
    <div
      className={cn("relative w-full", { "input-container": item.floating })}
    >
      <input
        key={item.key}
        placeholder={
          item.floating || form.values[item.key] ? " " : item.placeholder
        }
        value={form.values[item.key]}
        onChange={(e: any) => form.setFieldValue(item.key, e.target.value)}
        className={cn(
          "text-subtitle/80 pl-9 text-sm h-11 w-full placeholder:text-xs placeholder:text-subtitle/80 outline-none p-3 rounded-lg text-right",
          item.labelClassName,
          {
            "floating-input bg-primary-foreground": item.floating,
          }
        )}
      />

      {item.floating || form.values[item.key] ? (
        <label className="floating-label">{item.placeholder}</label>
      ) : (
        <></>
      )}

      <div className="absolute left-2.5 top-2.5 cursor-pointer">
        <CustomeDatePicker
          onCalenderTypeChange={handleCalendarTypeChange}
          value={form.values[item.key]}
          idKey={item.key}
          onValueChanged={(date) => {
            form.setFieldValue(item.key, date);
            form.setFieldValue(item.dependantKey, calendarType);
          }}
        >
          <Image
            src={"/icons/calendar-mute.png"}
            alt="pick date"
            width={24}
            height={24}
          />
        </CustomeDatePicker>
      </div>
    </div>
  );
}
