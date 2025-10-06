"use client";

import dynamic from "next/dynamic";
import "react-quill/dist/quill.snow.css";
import { FormMakerInterface } from "../form-maker";
import { cn } from "@/lib/utils";

const ReactQuill = dynamic(() => import("react-quill"), { ssr: false });
export default function TextEditorInput({
  form,
  item,
}: {
  form: any;
  item: FormMakerInterface["fields"][0];
}) {
  const modules = {
    toolbar: [
      [{ header: [1, 2, 3, false] }],
      ["bold", "italic", "underline", "strike"],
      [{ list: "ordered" }, { list: "bullet" }],
      ["link", "image"],
      [{ direction: "rtl" }],
      ["clean"],
    ],
  };
  return (
    <ReactQuill
 
      theme="snow"
      value={form.values[item.key]}
      onChange={(value) => {
        form.setFieldValue(item.key, value);
      }}
      modules={modules}
      className={cn("w-full flex flex-col min-h-[222px] mt-6", item.className)}
    />
  );
}
