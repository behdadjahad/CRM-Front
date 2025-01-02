import React, { useRef, useState } from "react";
import { FaFilePdf, FaTimes } from "react-icons/fa"; // PDF icon and remove icon (FaTimes) from React Icons
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
  const [previews, setPreviews] = useState<{ url: string; file: File }[]>([]);
  const [files, setFiles] = useState<File[]>([]);

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

    setPreviews((prevPreviews) => [...prevPreviews, ...updatedPreviews]); // Append new previews to existing ones
    setFiles((prevFiles) => [...prevFiles, ...newFiles]); // Store the actual files
  };

  // Handle file removal
  const handleRemoveFile = (index: number) => {
    const updatedPreviews = previews.filter((item, i) => i !== index);
    const updatedFiles = files.filter((item, i) => i !== index);

    setPreviews(updatedPreviews);
    setFiles(updatedFiles);
  };

  return (
    <div className="w-full flex flex-row flex-wrap">
      {/* Custom button with upload icon */}
      <div className="w-full">
        <Button
          variant={"foreground"}
          onClick={handleButtonClick}
          className={cn(
            "text-subtitle/80 text-sm h-11 w-full  outline-none p-3 rounded-lg text-right"
          )}
        >
          {item.icon && (
            <Image
              src={item.icon}
              alt={"تصویر"}
              width={160}
              height={160}
              className="h-5 w-6"
            />
          )}
          آپلود فایل
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
      {/* Display selected files as previews */}
      <div className="flex  flex-wrap gap-4 rounded-lg border-dashed border-gray-300 border-2 h-14 mt-2 w-full items-center px-2 flex-row-reverse">
        {previews.map((preview, index) => (
          <div
            key={index}
            className="relative bg-background  w-10 h-10 flex items-center justify-center rounded-full"
          >
            {/* Remove button */}
            <Button
              type="button"
              onClick={() => handleRemoveFile(index)}
              className="p-1 absolute -right-0.5 -top-0.5 z-20"
            >
              <FaTimes size={6} />
            </Button>

            {preview.file.type.startsWith("image/") ? (
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
            ) : preview.file.type === "application/pdf" ? (
              // For PDFs, show a PDF icon
              <a href={preview.url} download={preview.file.name}>
                <FaFilePdf size={18} color="red" className="cursor-pointer" />
              </a>
            ) : null}
          </div>
        ))}
      </div>
    </div>
  );
}
