import { cn } from "@/lib/utils";
import { FormMakerInterface, OptionType } from "./form-maker";
import React, { useState } from "react";

export default function ListPreview({
  form,
  item,
}: {
  form: any;
  item: FormMakerInterface["fields"][0];
  }) {
  console.log(item.options)
  const [activeItem, setActiveItem] = useState<OptionType>(null);
  return (
    <div className="flex flex-col md:flex-row items-center  w-full justify-between gap-4">
      <div className="">{item.title}</div>

      {/* Apply gap to the inner flex container as well */}
      <div className="flex flex-row gap-8 flex-wrap ">
        {item.options &&
          item.options.map((optItem) => (
            <div
              key={optItem.value}
              onClick={() =>  {
                if (activeItem && activeItem.value === optItem.value) {
                  setActiveItem(null);
                  form.setFieldValue(item.key, null);
                } else {
                  setActiveItem(optItem);
                  form.setFieldValue(item.key, Number(optItem.value));
                }
               
              }}
              className={cn(
                "cursor-pointer text-sm font-semibold border  rounded-md h-9 w-18 flex items-center justify-center text-subtitle/80",
                {
                  "border-aqua-mute text-aqua-active":
                    activeItem && activeItem.value === optItem.value,
                }
              )}
            >
              {optItem.label}
            </div>
          ))}
      </div>
    </div>
  );
}
