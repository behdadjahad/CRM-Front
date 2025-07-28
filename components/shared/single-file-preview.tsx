import { FormMakerInterface } from "./form-maker";
import React from "react";
import { FaFilePdf, FaTimes } from "react-icons/fa";
import Image from "next/image";
import { Button } from "../ui/button";

export default function SingleFilePreview({
  form,
  item,
}: {
  form: any;
  item: FormMakerInterface["fields"][0];
}) {
  const preview = form.values[item.dependantKey as string];

  const handleRemoveFile = () => {
    form.setFieldValue(item.dependantKey, null);
  };

  if (!preview) return null;

  return (
   
      <div className="relative bg-background w-10 h-10 flex items-center justify-center rounded-full">
        <Button
          type="button"
          onClick={handleRemoveFile}
          className="p-1 absolute -right-0.5 -top-0.5 z-20"
        >
          <FaTimes size={6} />
        </Button>

        {preview?.file?.type?.startsWith("image/") ? (
          <a href={preview.url} download={preview.file.name}>
            <Image
              src={preview.url}
              alt={`Preview`}
              width={36}
              height={36}
              className="w-4.5 h-4.5 object-cover rounded border cursor-pointer"
            />
          </a>
        ) : preview?.file?.type === "application/pdf" ? (
          <a href={preview.url || "#"} download={preview.file.name}>
            <FaFilePdf size={18} color="red" className="cursor-pointer" />
          </a>
        ) : null}
      </div>
   
  );
}
