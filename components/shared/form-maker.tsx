"use client";
import React, { useCallback } from "react";
import { cn } from "@/lib/utils";
import SelectInput from "./select-input";
import TextInput from "./text-input";
import PhoneNumberInput from "./phone-input";
import TextAreaInput from "./text-area-input";

export interface OptionType {
  label: string;
  value: string;
}

export interface FormMakerInterface {
  form: any;
  fields: {
    component: "input" | "Select" | "phone" | "textarea" | "non-field";
    floating?: boolean;
    placeholder?: string;
    labelClassName?: string;
    hideSelect?: boolean;
    label?: string;
    key: string;
    type?: string;
    options?: OptionType[];
    className?: string;
    style?: any;
    icon?: string;
    defaultValue?: string | null;
    children?: React.ReactNode;
  }[];
  className?: string;
}

export default function FormMaker({
  form,
  fields,
  className,
}: FormMakerInterface) {

  const renderField = useCallback(
    (item: any) => {
      switch (item.component) {
        case "Select":
          return (
            <SelectInput
              form={form}
              item={item}
            />
          );
        case "input":
          return (
            <TextInput
              item={item}
              form={form} />
          );
        case "phone":
          return (
            <PhoneNumberInput
              item={item}
              form={form} />
          );
        case "textarea":
          return (
            <TextAreaInput
              item={item}
              form={form} />
          );
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
      {fields.map((item) => (
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
