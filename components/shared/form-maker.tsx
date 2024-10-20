"use client";
import React, { useCallback } from "react";
import { cn } from "@/lib/utils";
import SelectInput from "./select-input";
import _ from "lodash";

export interface OptionType {
  label: string;
  value: string;
}

export interface FormMakerInterface {
  form: any;
  fields: {
    component: "input" | "Select" | "textarea" | "non-field";
    placeholder?: string;
    labelClassName?: string;
    hideSelect?: boolean;
    label?: string;
    key: string;
    type?: string;
    options?: OptionType[];
    className?: string;
    style?: any;
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
  const setFieldValue = (key: string, value: string) => {
    form.setFieldValue(key, value);
  };

  // eslint-disable-next-line react-hooks/exhaustive-deps
  const setTextFieldValue = useCallback(
    _.debounce((key: string, value: string) => {
      form.setFieldValue(key, value);
    }, 300),
    [form]
  );

  const renderField = useCallback(
    (item: any) => {
      switch (item.component) {
        case "Select":
          return (
            <SelectInput
              form={form}
              item={item}
              setFieldValue={setFieldValue}
            />
          );
        case "input":
          return (
            <input
              key={item.key}
              placeholder={
                form.values[item.key] || item.placeholder || item.label
              }
              type={item.type}
              defaultValue={item.defaultValue || ""}
              onChange={(e: any) => setTextFieldValue(item.key, e.target.value)}
              className={cn(
                "text-subtitle text-sm h-10 placeholder:text-sm placeholder:text-subtitle",
                item.labelClassName
              )}
            />
          );
        case "textarea":
          return (
            <textarea
              key={item.key}
              placeholder={item.label}
              onChange={(e: any) => setFieldValue(item.key, e.target.value)}
              rows={5}
              className={cn("text-subtitle", item.labelClassName)}
            />
          );
        default:
          return null;
      }
    },
    [form, setFieldValue]
  );

  return (
    <div className={cn("w-full", className)}>
      <form
        className="flex flex-wrap w-full items-start justify-between"
        onSubmit={(e) => e?.preventDefault()}
      >
        {fields.map((item) => (
          <div
            key={item.key}
            className={cn(
              "relative outline-none px-2 w-full flex flex-col",
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
