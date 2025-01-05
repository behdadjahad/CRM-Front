import React, { useState } from "react";
import { FormMakerInterface } from "./form-maker";
import { cn } from "@/lib/utils";

export default function ToggleInput({
  form,
  item,
}: {
  form: any;
  item: FormMakerInterface["fields"][0];
}) {
  const [isToggled, setIsToggled] = useState(false);

  return (
    <div className="flex items-center justify-start cursor-pointer gap-4 w-full">
      <span className="text-gray-700">{item.label}</span>
      <input
        type="checkbox"
        checked={isToggled}
        onChange={() => setIsToggled(!isToggled)}
        className="sr-only peer"
      />

      <div
        className={cn("w-10 h-5 bg-gray-300 rounded-full relative", {
          "transition duration-300 bg-blue-600": isToggled,
        })}
      >
        <div
          className={cn(
            "absolute w-6 h-6 bg-white rounded-full -top-0.5  shadow-md  transition duration-300",
            {
              "-right-0.5": isToggled,
              "-left-0.5": !isToggled,
            }
          )}
        />
      </div>
    </div>
  );
}
