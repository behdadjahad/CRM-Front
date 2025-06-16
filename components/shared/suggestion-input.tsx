"use client";

import React from "react";
import Creatable from "react-select/creatable";
import { components, SingleValueProps, OptionProps } from "react-select";
import { cn } from "@/lib/utils";
import { FormMakerInterface } from "./form-maker";

type SuggestionInputProps = {
  form: any;
  item: FormMakerInterface["fields"][0];
};

export default function SuggestionInput({ form, item }: SuggestionInputProps) {
  const selectedValue = form.values[item.key];

  // Ensure react-select gets the full { label, value } object
  const value =
    selectedValue && selectedValue !== ""
      ? { label: selectedValue, value: selectedValue }
      : null;

  // Handle typing in input field
  const handleInputChange = (inputValue: string, { action }: any) => {
    if (action === "input-change") {
      form.setFieldValue(item.key, inputValue);
    }
  };

  // Handle when a user selects or creates an option
  const handleChange = (option: any) => {
    const label = option?.label || "";
    form.setFieldValue(item.key, label);
    if (item.onChange) item.onChange(label);
  };

  // Optional custom option with icon
  const CustomOption = (props: OptionProps<any>) => (
    <components.Option {...props}>
      <div className="flex items-center gap-2">
        {props.data.icon && <span>{props.data.icon}</span>}
        <span>{props.label}</span>
      </div>
    </components.Option>
  );

  // Optional custom selected value display
  const CustomSingleValue = (props: SingleValueProps<any>) => (
    <components.SingleValue {...props}>
      <div className="flex items-center gap-2">
        {props.data.icon && <span>{props.data.icon}</span>}
        <span>{props.data.label}</span>
      </div>
    </components.SingleValue>
  );

  return (
    <Creatable
      isClearable
      menuPlacement={item?.menuPlacement ?? "auto"}
      options={item.options}
      placeholder={item.placeholder || item.label}
      inputValue={selectedValue || ""}
      value={value}
      onInputChange={handleInputChange}
      onChange={handleChange}
      getNewOptionData={(inputValue) => ({
        label: inputValue,
        value: inputValue,
      })}
      components={{
        Option: CustomOption,
        SingleValue: CustomSingleValue,
      }}
      classNames={{
        container: () => cn("w-full", item.containerClassName),
        control: () =>
          cn(
            "w-full bg-background text-right border-none focus:outline-none",
            item.controlClassName
          ),
        input: () =>
          cn(
            "w-full text-right placeholder:text-muted-foreground",
            item.inputClassName
          ),
        menuList: () =>
          cn("max-h-96 overflow-auto bg-popover", item.menuClassName),
        valueContainer: () =>
          cn("flex text-subtitle", item.valueContainerClassName),
        dropdownIndicator: () => cn("", item.dropdownIndicatorClassName),
        clearIndicator: () => cn("", item.clearIndicatorClassName),
      }}
    />
  );
}
