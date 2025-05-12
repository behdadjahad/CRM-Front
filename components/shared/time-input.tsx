import React from "react";
import { FormMakerInterface } from "./form-maker";
import { cn } from "@/lib/utils";
import Image from "next/image";
import CustomTimePicker from "./custom-time-picker";
// Your custom time picker

export default function TimeInput({
  form,
  item,
}: {
  form: any;
  item: FormMakerInterface["fields"][0];
}) {
  return (
    <div
      className={cn("relative w-full", { "input-container": item.floating })}
    >
      {/* Input Field for Time */}
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

      {/* Floating Label */}
      {item.floating || form.values[item.key] ? (
        <label className="floating-label">{item.placeholder}</label>
      ) : (
        <></>
      )}

      {/* Time Picker Icon */}
      <div className="absolute left-2.5 top-2.5 cursor-pointer">
        <CustomTimePicker
          value={form.values[item.key]}
          onValueChanged={(val) => form.setFieldValue(item.key, val)}
        >
          <Image
            src="/icons/clock-icon.png"
            alt="pick time"
            width={1024}
            height={1024}
            className="w-4 h-4"
          />
        </CustomTimePicker>
      </div>
    </div>
  );
}
