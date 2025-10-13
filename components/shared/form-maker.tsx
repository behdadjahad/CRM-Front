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
import SuggestionInput from "./suggestion-input";
import MultiSelectInput from "./multi-select-input";
import MultiAddedTextInput from "./multi-added-text-input";
import SingleFileInput from "./single-file-input";
import SingleFilePreview from "./single-file-preview";
import TagPreview from "./tag-preview";
import SelectableTagInput from "../form/inputs/SelectableTagInput";
import TextEditorInput from "./input/TextEditorInput - Copy";
import LocationInput from "./location-input";

export interface OptionType {
  label: string;
  value: string;
  [key: string]: any;
}

export interface FieldType {
  outerIcon?: React.ReactNode;

  component:
    | "input"
    | "multi-added-input"
    | "Select"
    | "multi-select"
    | "tag-preview"
    | "SuggestionInput"
    | "date"
    | "date-time"
    | "phone"
    | "checkbox"
    | "radio"
    | "slider"
    | "textarea"
    | "text-editor"
    | "verification"
    | "file"
    | "single-file"
    | "toggle"
    | "file-preview"
    | "single-file-preview"
    | "list-preview"
    | "range-input"
    | "time"
    | "selectable-tag-input"
    | "location-input"
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
  formatted?: boolean;
  menuPlacement?: "top" | "bottom" | "auto";
  hasReset?: boolean;
  resetFunction?: () => void;
  isValidNewOption?: boolean;
  sendValue?: (value: string) => void;
}

export interface FormMakerInterface {
  form: any;
  fields: FieldType[];
  className?: string;
  hasAccess?: boolean;
}

export default function FormMaker({
  form,

  fields,
  className,
  hasAccess = true,
}: FormMakerInterface) {
  const renderField = useCallback(
    (item: FormMakerInterface["fields"][0]) => {
      // Use disabled from item first, then fallback to form-level disabled
      // const isDisabled = item?.disabled !== undefined ? item?.disabled : disabled;

      switch (item.component) {
        case "Select":
          return (
            <SelectInput disabled={!hasAccess} form={form} item={{ ...item }} />
          );
        case "multi-select":
          return (
            <MultiSelectInput disabled={!hasAccess} form={form} item={item} />
          );
        case "tag-preview":
          return <TagPreview form={form} item={item} />;
        case "SuggestionInput":
          return (
            <SuggestionInput
              disabled={!hasAccess}
              form={form}
              item={{ ...item }}
            />
          );
        case "input":
          return <TextInput disabled={!hasAccess} item={item} form={form} />;
        case "multi-added-input":
          return <MultiAddedTextInput item={{ ...item }} form={form} />;
        case "phone":
          return <PhoneNumberInput item={{ ...item }} form={form} />;
        case "date":
          return <DateInput item={{ ...item }} form={form} />;
        case "date-time":
          return <DateTimeInput item={{ ...item }} form={form} />;
        case "time":
          return <TimeInput item={{ ...item }} form={form} />;
        case "selectable-tag-input":
          return <SelectableTagInput item={{ ...item }} form={form} />;

        case "checkbox":
          return <CheckboxInput item={{ ...item }} form={form} />;
        case "radio":
          return <RadioInput item={{ ...item }} form={form} />;
        case "slider":
          return <SliderInput item={{ ...item }} form={form} />;
        case "textarea":
          return <TextAreaInput item={{ ...item }} form={form} />;
        case "text-editor":
          return <TextEditorInput item={{ ...item }} form={form} />;
        case "verification":
          return <VerificationInput item={{ ...item }} form={form} />;
        case "file":
          return <FileInput item={{ ...item }} form={form} />;
        case "single-file":
          return <SingleFileInput item={{ ...item }} form={form} />;
        case "toggle":
          return <ToggleInput item={{ ...item }} form={form} />;
        case "file-preview":
          return <FilePreview item={item} form={form} />;
        case "single-file-preview":
          return <SingleFilePreview item={item} form={form} />;
        case "list-preview":
          return <ListPreview item={item} form={form} />;
        case "location-input":
          return <LocationInput item={item} form={form} />;

        default:
          return null;
      }
    },
    [form, hasAccess]
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
          {item.outerIcon ? (
            <div className=" flex w-full items-center justify-center gap-3">
              {item.outerIcon}
              {renderField(item)}
            </div>
          ) : (
            renderField(item)
          )}
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
