import React, { useState } from "react";
import { FormMakerInterface } from "./form-maker";
import { cn } from "@/lib/utils";
import { FaPlus, FaTimes, FaUndo } from "react-icons/fa";
import { Button } from "../ui/button";

export default function MultiAddedTextInput({
  form,
  item,
  hasAccess=true
}: {
  form: any;
  item: FormMakerInterface["fields"][0];
  hasAccess?:boolean
}) {
  const [inputValue, setInputValue] = useState("");
  const [items, setItems] = useState<string[]>(
  Array.isArray(form.values[item.key]) ? form.values[item.key] : []
);

  const handleAdd = () => {
    const trimmed = inputValue.trim();
    if (trimmed) {
      setItems((prev) => [...prev, trimmed]);
      setInputValue("");
      form.setFieldValue(item.key, [...items, trimmed]);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInputValue(e.target.value);
  };
const handleRemove = (index: number) => {
  const updatedItems = items.filter((_, i) => i !== index);
  setItems(updatedItems);
  form.setFieldValue(item.key, updatedItems);
  };
  console.log(items)
  return (
    <div className="w-full">
      <div
        className={cn("relative w-full", { "input-container": item.floating })}
      >
        <input
          key={item.key}
          placeholder={item.floating ? " " : item.placeholder}
          value={inputValue}
          type="text"
          onChange={handleChange}
          className={cn(
            "text-sm h-11 w-full placeholder:text-xs placeholder:text-subtitle/80 outline-none p-3 rounded-lg text-right",
            item.labelClassName,
            {
              "floating-input bg-primary-foreground": item.floating,
            }
          )}
          readOnly={item.readonly}
          disabled={(item.disabled || !hasAccess) ?? false}
        />

        {/* Floating Label */}
        {item.floating && (
          <label className="floating-label">{item.placeholder}</label>
        )}

        {/* Plus Icon */}
        <Button
          type="button"
          className="absolute left-2 top-1/2 transform -translate-y-1/2  text-white    w-7 h-7  rounded-full flex items-center justify-center p-0 bg-aqua"
          onClick={handleAdd}
        >
          <FaPlus />
        </Button>
      </div>

      {/* Display added items below */}
      {items.length > 0 && (
        <div className="mt-4 text-sm flex flex-row flex-wrap items-center gap-2">
          {items.map((value, idx) => (
            <div
              key={idx}
              className="bg-gray-50 text-aqua-active border p-2 rounded text-right w-fit relative"
            >
              <span>{value}</span>
              <Button
                type="button"
                onClick={() => {handleRemove(idx)}}
                className="p-1 absolute -right-0.5 -top-0.5 z-20"
              >
                <FaTimes size={6} />
              </Button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
