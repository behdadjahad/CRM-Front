"use client";
import React, { useCallback } from "react";
import { cn } from "@/lib/utils";
import SelectInput from "./select-input";
import TextInput from "./text-input";

export interface OptionType {
  label: string;
  value: string;
}

export interface FormMakerInterface {
  form: any;
  fields: {
    component: "input" | "Select" | "textarea" | "non-field";
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
        case "textarea":
          return (
            <textarea
              key={item.key}
              placeholder={item.label}
              onChange={(e: any) => form.setFieldValue(item.key, e.target.value)}
              rows={5}
              className={cn("text-subtitle", item.labelClassName)}
            />
          );
        default:
          return null;
      }
    },
    [form]
  );

  return (
    <div className={cn("w-full", className)}>
      <form
        className="w-full gap-x-4 gap-y-6 grid grid-cols-12"
        onSubmit={(e) => e?.preventDefault()}
      >
        {fields.map((item) => (
          <div
            key={item.key}
            className={cn(
              "relative outline-none w-full",
              item.className
            )}
            style={item.style}
          >
            {renderField(item)}

            {item.component !== "non-field" ? (
              <small className="absolute text-destructive -bottom-2">
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
    </div>
  );
}
