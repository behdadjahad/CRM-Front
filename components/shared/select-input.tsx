import React, { useEffect, useCallback } from "react";
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
  const handleValueChange = useCallback(
    (value: string) => {
      form.setFieldValue(item.key, value);
    },
    [item.key]
  );

  useEffect(() => {
    if (
      item.defaultValue &&
      item.defaultValue !== "worldwide" &&
      (!form.values[item.key] || form.values[item.key] === "worldwide")
    ) {
      form.setFieldValue(item.key, item.defaultValue);
    }
  }, [item.defaultValue, form.values[item.key], item.key, form]);

  return (
    <Select onValueChange={handleValueChange}>
      <SelectTrigger
        inputMode="search"
        className={cn(
          "text-subtitle",
          { "[&>svg]:hidden": item.hideSelect },
          item.labelClassName
        )}
      >
        <SelectValue
          placeholder={
            item.options?.find(
              (optItem) => optItem.value === form.values[item.key]
            )?.label || item.placeholder
          }
        />
      </SelectTrigger>
      <SelectContent>
        {item.options?.map((opt) => (
          <SelectItem key={opt.value} value={opt.value}>
            {opt.label}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
});

export default SelectInput;
