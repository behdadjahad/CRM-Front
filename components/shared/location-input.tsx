'use client'
import { cn } from "@/lib/utils";
import { FormMakerInterface } from "./form-maker";
import Image from "next/image";
import { useState } from "react";

import dynamic from "next/dynamic";

const Map = dynamic(() => import("./map"), {
  ssr: false,
});
export default function LocationInput({
  form,
  item,
  disabled = false,
}: {
  form: any;
  item: FormMakerInterface["fields"][0];
  disabled?: boolean;
}) {
  function handleChange() {}
  const [viewMap, setViewMap] = useState<boolean>(false);
  return (
    <div
      className={cn("relative w-full flex flex-col gap-2", {
        "input-container": item.floating,
      })}
    >
      <input
        key={item.key}
        placeholder={item.floating ? " " : item.placeholder}
        // value={item.defaultValue ? item.defaultValue : form.values[item.key]}
        value={""}
        type={"text"}
        multiple={true}
        onChange={handleChange}
        // onChange={(e: any) => form.setFieldValue(item.key, e.target.value)}
        className={cn(
          "text-sm h-11 w-full placeholder:text-xs placeholder:text-subtitle/80 outline-none p-3 rounded-lg text-right border",
          //item.className,
          item.labelClassName,
          {
            "floating-input bg-primary-foreground": item.floating,
          },
          {
            "pr-9": item.icon,
          }
        )}
        readOnly={item.readonly}
        disabled={(item?.disabled || disabled) ?? false}
      />
      <Image
        src={"/icons/search.png"}
        alt={item.key}
        width={20}
        height={20}
        className={cn(
          "absolute right-3 top-3 cursor-pointer",
          item.iconClassName
        )}
        onClick={() => {
          setViewMap((prev) => !prev);
        }}
      />
      <Map
        onSelectLocation={(lat, lng) => {
          console.log("Selected:", lat, lng);
          form.setFieldValue(item.key, `${lat},${lng}`);
        }}
      />
    </div>
  );
}
