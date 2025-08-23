import React from "react";
import { FormMakerInterface } from "./form-maker";
import { cn } from "@/lib/utils";

export default function ToggleInput({
  form,
  item,
}: {
  form: any;
  item: FormMakerInterface["fields"][0];
}) {
  return (
    <div className="flex items-center justify-start cursor-pointer gap-4 w-full">
      <div
        className={cn(
          "w-10 h-5 transition-all duration-200 bg-subtitle rounded-full relative",
          {
            "bg-primary": form.values[item.key],
          }
        )}
        onClick={() => form.setFieldValue(item.key, !form.values[item.key])}
      >
        <div
          className={cn(
            "absolute w-6 h-6 bg-background-active rounded-full -top-0.5 shadow-md transition-all duration-200",
            {
              "-right-0.5": form.values[item.key],
              "-left-0.5": !form.values[item.key],
            }
          )}
        />
      </div>
      <span className="text-foreground">{item.label}</span>
    </div>
  );
}
