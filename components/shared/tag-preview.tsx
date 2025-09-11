import { FormMakerInterface } from "./form-maker";
import React from "react";
import { FaTimes } from "react-icons/fa"; // PDF icon and remove icon (FaTimes) from React Icons

import { Button } from "../ui/button";

export default function TagPreview({
  form,
  item,
}: {
  form: any;
  item: FormMakerInterface["fields"][0];
}) {
  console.log(form.values[item.key as string])
  const handleRemove = (tag: string) => {
    if (!item.key) return;

    const updatedTags = form.values[item.key].filter(
      (item: string) => item !== tag
    );

    form.setFieldValue(item.key, updatedTags);
  };

  return (
    <div className="flex flex-wrap gap-2  w-full items-center">
      {form.values[item.key as string] &&
        form.values[item.key as string].map((tag: any) => (
          <div
            className="bg-gray-50 px-2 text-gray-500 border rounded-full text-right w-fit relative h-8 flex items-center justify-between text-xs min-w-18 gap-2"
            key={tag}
          >
            <div className="text-right">{tag.label}</div>
            <Button
              variant={"transparent"}
              onClick={() => {
                handleRemove(tag);
              }}
              className="flex items-center justify-center p-1 z-2 border border-gray-300 text-gray-500 rounded-full bg-card"
            >
              <FaTimes size={8} />
            </Button>
          </div>
        ))}
    </div>
  );
}
