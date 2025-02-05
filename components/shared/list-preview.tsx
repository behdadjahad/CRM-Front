import { FormMakerInterface } from "./form-maker";
import React from "react";

export default function ListPreview({
  form,
  item,
}: {
  form: any;
  item: FormMakerInterface["fields"][0];
}) {
  return (
    <div className="flex flex-row items-center  w-full gap-4">
    <div className="">{item.title}</div>
    
    {/* Apply gap to the inner flex container as well */}
    <div className="flex flex-row gap-4 flex-1 justify-between">
      {item.options &&
        item.options.map((optItem) => (
          <div
            key={optItem.value}
            onClick={() => {
              console.log(Number(optItem.value), item.key);
            }}
            className="cursor-pointer"
          >
            {optItem.label}
          </div>
        ))}
    </div>
  </div>
  
  );
}
