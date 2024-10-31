import React, { useEffect, useCallback, useState } from "react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";
import { FormMakerInterface } from "./form-maker";
import { cn } from "@/lib/utils";

const SelectInput = React.memo(function SelectInput({
  form,
  item,
}: {
  form: any;
    item: FormMakerInterface["fields"][0];
}) {
  const [isSelected, setIsSelected] = useState(false)
  const handleValueChange = useCallback(
    (value: string) => {
      form.setFieldValue(item.key, value);
    },
    [item.key, form]
  );

  useEffect(() => {
    if (
      item.defaultValue &&
      item.defaultValue !== "worldwide" &&
      (!form.values[item.key] || form.values[item.key] === "worldwide")
    ) {
      form.setFieldValue(item.key, item.defaultValue);
    }
  }, [item.defaultValue, form, item.key, form.values[item.key]]);

  return (
    <div className="relative w-full group">
      <Select onValueChange={handleValueChange}>
        <SelectTrigger
          inputMode="search"
          className={cn(
            "text-subtitle border border-border/20 group bg-transparent text-base h-11 w-full outline-none p-2 rounded-lg text-right",
            {
              "border-foreground": isSelected && !form.values[item.key]
            },
            item.labelClassName,
          )}
          onClick={() => setIsSelected(true)}
          onBlur={() => setIsSelected(false)}
        >
          <SelectValue />

          {item.floating && (
            <label
              className={cn(
                "absolute right-3 top-[10px] bg-background-active transition-all duration-200 text-muted px-2",
                {
                  "-top-3 text-foreground-mute": form.values[item.key] || isSelected,
                }
              )}
            >
              {item.placeholder}
            </label>
          )}
        </SelectTrigger>
        <SelectContent>
          {item.options?.map((opt) => (
            <SelectItem key={opt.value} value={opt.value}>
              {opt.label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
});

export default SelectInput;
