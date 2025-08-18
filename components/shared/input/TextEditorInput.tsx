"use client";

// import React from "react";
// import { useEditor, EditorContent } from "@tiptap/react";
// import StarterKit from "@tiptap/starter-kit";
// import Image from "@tiptap/extension-image";
// import Emoji from "@tiptap/extension-emoji";

// interface TextEditorInputInterface {
//   value?: string;
//   onChange?: (content: string) => void;
// }

// const TextEditorInput: React.FC<TextEditorInputInterface> = ({
//   value,
//   onChange,
// }) => {
//   const editor = useEditor({
//     extensions: [StarterKit, Image, Emoji],
//     content: value || "",
//     editorProps: {
//       attributes: { class: "border rounded p-2 min-h-[150px]" },
//     },
//     immediatelyRender: false, // S
//     onUpdate: ({ editor }) => {
//       if (onChange) onChange(editor.getHTML());
//     },
//   });

//   return <EditorContent editor={editor} />;
// };
"use client";

import dynamic from "next/dynamic";


// Dynamically import ReactQuill so it only renders on client
const ReactQuill = dynamic(() => import("react-quill"), { ssr: false });


import "react-quill/dist/quill.snow.css";


interface QuillEditorProps {
  value: string;
  onChange: (value: string) => void;
}

export default function QuillEditor({ value, onChange }: QuillEditorProps) {
  const modules = {
    toolbar: [
      [{ header: [1, 2, 3, false] }],
      ["bold", "italic", "underline", "strike"],
      [{ list: "ordered" }, { list: "bullet" }],
      ["link", "image"],
      ["clean"],
    ],
  };

  return (
    <ReactQuill
      theme="snow"
      value={value}
      onChange={onChange}
      modules={modules}
    />
  );
}

