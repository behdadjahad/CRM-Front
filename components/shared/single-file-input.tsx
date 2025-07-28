'use client'

import React, { useRef } from "react";
import { FormMakerInterface } from "./form-maker";
import Image from "next/image";
import { Button } from "../ui/button";
import { cn } from "@/lib/utils";

export default function SingleFileInput({
  form,
  item,
}: {
  form: any;
  item: FormMakerInterface["fields"][0];
}) {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleButtonClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    let preview = null;

    if (file.type.startsWith("image/")) {
      preview = { url: URL.createObjectURL(file), file };
    } else if (file.type === "application/pdf") {
      preview = { url: "", file }; // No preview for PDF
    }

    if (preview) {
      form.setFieldValue(item.key, preview); // only one file stored
    }
  };

  return (
    <div>
      <Button
        onClick={handleButtonClick}
        className={cn(
          "text-subtitle/80 text-sm w-full outline-none rounded-lg text-center items-center flex flex-row gap-2"
        )}
      >
        <span className="text-sm text-aqua-foreground">آپلود فایل</span>
        {item.icon && (
          <Image
            src={"/icons/Vector.png"}
            alt={"تصویر"}
            width={160}
            height={160}
            className="h-5 w-7"
          />
        )}
      </Button>

      <input
        ref={fileInputRef}
        type="file"
        onChange={handleFileChange}
        className="hidden"
        accept="image/*,application/pdf"
      />
    </div>
  );
}
