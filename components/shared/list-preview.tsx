import { cn } from "@/lib/utils";
import { FormMakerInterface } from "./form-maker";
import React, { useEffect, useState } from "react";

export default function ListPreview({
  form,
  item,
}: {
  form: any;
  item: FormMakerInterface["fields"][0];
}) {
  const [activeItem, setActiveItem] = useState<any>();
  useEffect(() => {
    if (item?.options) {
      setActiveItem(
        item?.options?.find((opt) => opt.value == form.values[item.key])
      );
    }
  }, [form.values[item.key],item?.options]);
  return (
    <div className="flex flex-col md:flex-row items-center  w-full  gap-8">
      <div className="">{item.title}</div>

      {/* Apply gap to the inner flex container as well */}
      <div className="flex flex-row flex-wrap gap-8">
        {item.options &&
          item.options.map((optItem) => (
            <div
              key={optItem.value}
              onClick={() => {
                if (activeItem && activeItem.value === optItem.value) {
                  setActiveItem(null);
                  form.setFieldValue(item.key, null);
                } else {
                  setActiveItem(optItem);
                  form.setFieldValue(item.key, Number(optItem.value));
                }
              }}
              className={cn(
                "cursor-pointer text-sm font-semibold border h-9 rounded-md flex items-center justify-center text-subtitle/80 py-4 px-8 bg-gray-50",
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
