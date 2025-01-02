"use client";

import React, { useState, useRef, ChangeEvent, KeyboardEvent, ClipboardEvent } from "react";
import { FormMakerInterface } from "./form-maker";

export default function VerificationInput({
  form,
  item,
}: {
  form: any;
  item: FormMakerInterface["fields"][0];
}) {

  const maxLength = item.maxLength ?? 0

  const [code, setCode] = useState<string[]>(Array(maxLength).fill(""));


  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);


  const handleChange = (value: string, index: number): void => {
    if (!/^[0-9]?$/.test(value)) return;

    const newCode = [...code];
    newCode[index] = value;
    setCode(newCode);
    form.setFieldValue(item.key, newCode);
    if (value && index < maxLength - 1) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handleKeyDown = (
    e: KeyboardEvent<HTMLInputElement>,
    index: number
  ): void => {
    if (e.key === "Backspace" && !code[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    } else if (e.key === "ArrowLeft" && index > 0) {
      inputRefs.current[index - 1]?.focus();
    } else if (e.key === "ArrowRight" && index < maxLength - 1) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handlePaste = (e: ClipboardEvent<HTMLDivElement>): void => {
    e.preventDefault();

    const pasteData = e.clipboardData
      .getData("text")
      .slice(0, maxLength)
      .replace(/[^0-9]/g, "");
    const newCode = pasteData
      .split("")
      .concat(Array(maxLength - pasteData.length).fill(""))
      .slice(0, maxLength);

    setCode(newCode);
    newCode.forEach((digit, idx) => {
      if (digit && inputRefs.current[idx]) {
        (inputRefs.current[idx] as HTMLInputElement).value = digit;
      }
    });
    if (inputRefs.current[pasteData.length - 1]) {
      inputRefs.current[pasteData.length - 1]?.focus();
    }
  };

  return (
    <div
      onPaste={handlePaste}
      className="w-full flex items-center justify-center gap-2.5"
      dir="ltr"
    >
      {code.map((digit, index) => (
        <input
          key={index}
          type="text"
          maxLength={1}
          value={digit}
          onChange={(e: ChangeEvent<HTMLInputElement>) =>
            handleChange(e.target.value, index)
          }
          onKeyDown={(e: KeyboardEvent<HTMLInputElement>) =>
            handleKeyDown(e, index)
          }
          ref={(el) => {
            inputRefs.current[index] = el; // Assigning ref dynamically
          }}
          className="w-[40px] h-[40px] text-center text-[18px] border border-[#ccc] rounded-[4px] outline-none"
        />
      ))}
    </div>
  );
}
