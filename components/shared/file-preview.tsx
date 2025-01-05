import { FormMakerInterface } from "./form-maker";
import React from "react";
import { FaFilePdf, FaTimes } from "react-icons/fa"; // PDF icon and remove icon (FaTimes) from React Icons

import Image from "next/image";
import { Button } from "../ui/button";

export default function FilePreview({
  form,
  item,
}: {
  form: any;
  item: FormMakerInterface["fields"][0];
}) {
  const handleRemoveFile = (index: number) => {
    if (!item.dependantKey) return;

    const updatedPreviews = form.values[item.dependantKey].filter(
      (item: any, i: number) => i !== index
    );

    form.setFieldValue(item.dependantKey, updatedPreviews);
  };
  const list = form.values[item.dependantKey as string];
  console.log(list);

  return (
    <div className="flex  flex-wrap gap-4 rounded-lg border-dashed border-gray-300 border-2 h-14 mt-2 w-full items-center px-2 flex-row-reverse">
      {form.values[item.dependantKey as string] &&
        form.values[item.dependantKey as string].map(
          (preview: any, index: any) => (
            <div
              key={index}
              className="relative bg-background  w-10 h-10 flex items-center justify-center rounded-full"
            >
              <Button
                type="button"
                onClick={() => handleRemoveFile(index)}
                className="p-1 absolute -right-0.5 -top-0.5 z-20"
              >
                <FaTimes size={6} />
              </Button>
              {preview?.file?.type?.startsWith("image/") ? (
                // For images, show the image preview
                <a href={preview.url} download={preview.file.name}>
                  <Image
                    src={preview.url}
                    alt={`Preview ${index}`}
                    width={36}
                    height={36}
                    className="w-4.5 h-4.5 object-cover rounded border cursor-pointer"
                  />
                </a>
              ) : preview?.file?.type === "application/pdf" ? (
                // For PDFs, show a PDF icon
                <a href={preview.url} download={preview.file.name}>
                  <FaFilePdf size={18} color="red" className="cursor-pointer" />
                </a>
              ) : null}
            </div>
          )
        )}
    </div>
  );
}
