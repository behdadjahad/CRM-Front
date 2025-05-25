"use client";
import React, { useCallback } from "react";
import { cn } from "@/lib/utils";
import SelectInput from "./select-input";
import TextInput from "./text-input";
import PhoneNumberInput from "./phone-input";
import TextAreaInput from "./text-area-input";
import DateInput from "./date-input";
import CheckboxInput from "./checkbox-input";
import RadioInput from "./radio-input";
import SliderInput from "./slider-input";
import VerificationInput from "./verification-input";
import FileInput from "./file-input";
import ToggleInput from "./toggle-input";
import FilePreview from "./file-preview";
import ListPreview from "./list-preview";
import DateTimeInput from "./date-time-input";
import TimeInput from "./time-input";

export interface OptionType {
  label: string;
  value: string;
  [key: string]: any;
}

export interface FieldType {
  component:
    | "input"
    | "Select"
    | "date"
    | "date-time"
    | "phone"
    | "checkbox"
    | "radio"
    | "slider"
    | "textarea"
    | "verification"
    | "file"
    | "toggle"
    | "file-preview"
    | "list-preview"
    | "range-input"
    | "time"
    | "non-field";
  floating?: boolean;
  placeholder?: string;
  labelClassName?: string;
  hideSelect?: boolean;
  label?: string;
  key: string;
  dependantKey?: string;
  type?: string;
  options?: OptionType[];
  className?: string;
  style?: any;
  icon?: string;
  defaultValue?: string | null;
  children?: React.ReactNode;
  range?: { min: number; max: number; step: number };
  size?: number;
  maxLength?: number;
  iconClassName?: string;
  multiple?: boolean;
  toggleVisibility?: () => void;
  onChange?: (checked: boolean) => void;
  readonly?: boolean;
  disabled?: boolean;
  title?: string;
  controlClassName?: string;
  inputClassName?: string;
  valueContainerClassName?: string;
  dropdownIndicatorClassName?: string;
  clearIndicatorClassName?: string;
  containerClassName?: string;
  menuClassName?: string;
  isFormattedNumber?: boolean;
  onClick?: () => void;
}

export interface FormMakerInterface {
  form: any;
  fields: FieldType[];
  className?: string;
}

export default function FormMaker({
  form,
  fields,
  className,
}: FormMakerInterface) {
  const renderField = useCallback(
    (item: FormMakerInterface["fields"][0]) => {
      switch (item.component) {
        case "Select":
          return <SelectInput form={form} item={item} />;
        case "input":
          return <TextInput item={item} form={form} />;
        case "phone":
          return <PhoneNumberInput item={item} form={form} />;
        case "date":
          return <DateInput item={item} form={form} />;
        case "date-time":
          return <DateTimeInput item={item} form={form} />;
        case "time":
          return <TimeInput item={item} form={form} />;

        case "checkbox":
          return <CheckboxInput item={item} form={form} />;
        case "radio":
          return <RadioInput item={item} form={form} />;
        case "slider":
          return <SliderInput item={item} form={form} />;
        case "textarea":
          return <TextAreaInput item={item} form={form} />;
        case "verification":
          return <VerificationInput item={item} form={form} />;
        case "file":
          return <FileInput item={item} form={form} />;
        case "toggle":
          return <ToggleInput item={item} form={form} />;
        case "file-preview":
          return <FilePreview item={item} form={form} />;
        case "list-preview":
          return <ListPreview item={item} form={form} />;
        default:
          return null;
      }
    },
    [form]
  );

  return (
    <form
      className={cn("w-full gap-y-6 flex flex-row flex-wrap", className)}
      onSubmit={(e) => e?.preventDefault()}
    >
      {fields?.map((item) => (
        <div
          key={item.key}
          className={cn(
            "relative outline-none px-2 flex flex-col items-end w-full",
            item.className
          )}
          style={item.style}
        >
          {renderField(item)}

          {item.component !== "non-field" ? (
            <small className=" text-destructive mt-2">
              {form.errors[item.key] || form.touched[item.key]
                ? form.errors[item.key]
                : ""}
            </small>
          ) : (
            item.children
          )}
        </div>
      ))}
    </form>
  );
}
