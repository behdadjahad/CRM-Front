"use client";

import React from "react";
import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Image from "@tiptap/extension-image";
import Emoji from "@tiptap/extension-emoji";

interface TextEditorInputInterface {
  value?: string;
  onChange?: (content: string) => void;
}

const TextEditorInput: React.FC<TextEditorInputInterface> = ({
  value,
  onChange,
}) => {
  const editor = useEditor({
    extensions: [StarterKit, Image, Emoji],
    content: value || "",
    editorProps: {
      attributes: { class: "border rounded p-2 min-h-[150px]" },
    },
    immediatelyRender: false, // S
    onUpdate: ({ editor }) => {
      if (onChange) onChange(editor.getHTML());
    },
  });

  return <EditorContent editor={editor} />;
};

export default TextEditorInput;
