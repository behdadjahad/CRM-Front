import { cn } from "@/lib/utils";
import Image from "next/image";
import React from "react";

export interface LogoInterface {
  label: string;
  labelClassName?: string;
  className?: string;
}

export default function Logo({
  label,
  labelClassName,
  className,
}: LogoInterface) {
  return (
    <div
      className={cn(
        "w-full flex flex-row items-center gap-2",
        className
      )}
    >
      <Image
        src="/images/logo.png"
        width="1080"
        height="1080"
        alt={label}
        loading="eager"
        //className="w-9.5 h-9.5 object-contain"
        className={cn(
          "w-9.5 h-9.5 object-contain",
          className
        )}
      />
      <span
        className={cn(
          "font-primary-bold text-base line-clamp-1",
          labelClassName
        )}
      >
        {label}
      </span>
    </div>
  );
}
