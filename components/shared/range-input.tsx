import React from "react";
import { FormMakerInterface } from "./form-maker";
import { cn } from "@/lib/utils";

export default function RangeInput({
  form,
  item,
  hasAccess=true
}: {
  form: any;
  item: FormMakerInterface["fields"][0];
  hasAccess?:boolean
}) {
  return (
    <div className={cn("relative w-full")}>
      <input
      disabled={!hasAccess}
        key={item.key}
        type="range"
        min="0"
        max="10"
        onChange={(e: any) => form.setFieldValue(item.key, e.target.value)}
        className={cn(
          "text-subtitle/80 text-sm h-11 w-full placeholder:text-xs placeholder:text-subtitle/80 outline-none p-3 rounded-lg text-right"
        )}
      />
    </div>
  );
}
