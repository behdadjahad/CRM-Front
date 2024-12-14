import React, { useState } from "react";
import Image from "next/image";
import { FormMakerInterface } from "./form-maker";
import { cn } from "@/lib/utils";
import { Button } from "../ui/button";


export default function PasswordInput({
  form,
  item,
}: {
  form: any;
    item: FormMakerInterface["fields"][0];
}) {
     
  const [passwordVisible, setPasswordVisible] = useState(false);

  const toggleVisibility = () => {
    setPasswordVisible((prevState) => !prevState);
  };

  return (
    <div className="relative w-full">
     
      <input
        key={item.key}
        type={passwordVisible ? "text" : "password"}
        placeholder={item.floating ? " " : item.placeholder}
        onChange={(e: any) => form.setFieldValue(item.key, e.target.value)}
        className={cn(
        "text-subtitle/80 text-sm h-11 w-full placeholder:text-xs placeholder:text-subtitle/80 outline-none p-3 rounded-lg text-right",
        item.labelClassName,
        {
        'floating-input bg-primary-foreground': item.floating
        },
      
        )}
      />
        {
        item.floating ?
          <label className="floating-label">
            {item.placeholder}
          </label>
          : <></>
         }
      
   
    <Button
      onClick={toggleVisibility}
      className="p-0 bg-transparent border-none cursor-pointer absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700 outline-none w-10 h-7"
    >
      <Image
        src={passwordVisible ? "/images/eye.png":"/images/eye.png" }
        alt="Clickable Image"
        width={200} 
        height={100} 
        className="rounded-md" 
      />
    </Button>
    </div>
  );
};


