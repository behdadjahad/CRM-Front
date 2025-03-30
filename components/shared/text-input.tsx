import React, { useState } from "react";
import { FormMakerInterface } from "./form-maker";
import { cn,  } from "@/lib/utils";
import Image from "next/image";
import { Button } from "../ui/button";

export default function TextInput({
  form,
  item,
}: {
  form: any;
  item: FormMakerInterface["fields"][0];
}) {
  const [passwordVisible, setPasswordVisible] = useState(false);
  // const [inputValue, setInputValue] = useState(
  //   item.defaultValue ? item.defaultValue : form.values[item.key]
  // );
  const toggleVisibility = () => {
    setPasswordVisible((prev) => !prev);
  };
  // const handleInputChange = (e: any) => {
  //   const value = e.target.value;

  //   // Remove commas for the raw value
  //   const rawValue = value.replace(/,/g, "");

  //   // Update the form value with the raw value (without commas)
  //   form.setFieldValue(item.key, rawValue);

  //   // Format the value with commas and update the displayed value
  //   const formattedValue = formatPrice(rawValue);

  //   // Set the formatted value in the local state for the input field
  //   setInputValue(formattedValue);
  // };
  return (
    <div
      className={cn("relative w-full", { "input-container": item.floating })}
    >
      <input
        key={item.key}
        placeholder={item.floating ? " " : item.placeholder}
        value={item.defaultValue ? item.defaultValue : form.values[item.key]}
        //value={inputValue}
        type={passwordVisible ? "text" : item.type}
        multiple={true}
        // onChange={handleInputChange}
        onChange={(e: any) => form.setFieldValue(item.key, e.target.value)}
        className={cn(
          "text-sm h-11 w-full placeholder:text-xs placeholder:text-subtitle/80 outline-none p-3 rounded-lg text-right",
          //item.className,
          item.labelClassName,
          {
            "floating-input bg-primary-foreground": item.floating,
          },
          {
            "pr-9": item.icon,
          }
        )}
        readOnly={item.readonly}
        disabled={item.disabled ? item.disabled : false}
      />

      {item.floating ? (
        <label className="floating-label">{item.placeholder}</label>
      ) : (
        <></>
      )}

      {item.icon ? (
        <Image
          src={item.icon}
          alt={item.key}
          width={20}
          height={20}
          className="absolute right-3 top-3"
        />
      ) : (
        <></>
      )}
      {item.type == "password" ? (
        <Button
          className="p-0 bg-transparent border-none cursor-pointer absolute left-3 top-1/2 transform -translate-y-1/2 text-tertiary-background hover:text-subtitle outline-none w-10 h-7"
          onClick={toggleVisibility}
        >
          <Image
            src={passwordVisible ? "/images/x-eye.png" : "/images/eye.png"}
            alt={item.key}
            width={40}
            height={40}
            className="w-full h-full object-cover"
          />
        </Button>
      ) : (
        <></>
      )}
    </div>
  );
}
