import React, { useRef } from "react";
import { FormMakerInterface } from "./form-maker";
import Image from "next/image";
import { Button } from "../ui/button";
import { cn } from "@/lib/utils";

export default function FileInput({
  form,
  item,
}: {
  form: any;
  item: FormMakerInterface["fields"][0];
}) {
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Trigger the file input when the button is clicked
  const handleButtonClick = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click(); // Trigger the file input click event
    }
  };

  // Handle file change (images and PDFs)
  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const newFiles = Array.from(event.target.files || []);

    // Filter out image and PDF files, and generate preview URLs for images
    const updatedPreviews = newFiles
      .map((file) => {
        if (file.type.startsWith("image/")) {
          return { url: URL.createObjectURL(file), file }; // Create preview for images
        } else if (file.type === "application/pdf") {
          return { url: "", file }; // For PDF, no preview, just a download link
        }
        return null; // Return null for non-image, non-PDF files
      })
      .filter((preview) => preview !== null) as { url: string; file: File }[]; // Remove any null entries and assert correct type

    form.setFieldValue(item.key, [
      ...(form.values[item.key] ?? []),
      ...updatedPreviews,
    ]);
  };

  return (
    <div className="w-full flex flex-row flex-wrap">
      {/* Custom button with upload icon */}
      <div className="w-full h-34">
        <Button
          variant={"foreground"}
          onClick={handleButtonClick}
          className={cn(
            "text-subtitle/80 text-sm  w-full  outline-none rounded-lg text-center items-center min-h-36 flex flex-col gap-2 border-dashed border-slate border-2"
          )}
        >
          {item.icon && (
            <Image
              src={item.icon}
              alt={"تصویر"}
              width={160}
              height={160}
              className="h-5 w-7"
            />
          )}
          <div className="flex flex-col gap-2">
            <span className="text-sm text-aqua-foreground">لطفاً فایل خود را بارگذاری کنید</span>
            <span> (حداکثر اندازه 10 مگابایت)PNG، JPG یا GIF</span>
            </div>
        </Button>

        {/* Hidden file input */}
        <input
          ref={fileInputRef}
          type="file"
          onChange={handleFileChange}
          className="hidden" // Hide the default file input
          accept="image/*,application/pdf" // Allow both images and PDFs
          multiple // Allow multiple file selection
        />
      </div>
    </div>
  );
}
