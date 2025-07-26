import { credentialData } from "@/constants/credentials";
import { cn } from "@/lib/utils";
import Image from "next/image";
import React from "react";
import { LogoInterface } from "./logo";


export default function CompanyLogo({ labelClassName, className }: LogoInterface) {
  return (
    <div className={cn("w-full flex flex-row items-center gap-2", className)}>
      <Image
        src="/images/chadco-logo.png"
        width="1080"
        height="1080"
        alt={credentialData.name}
        loading="eager"

        className={cn("w-28 h-12 object-contain")}
      />
      <span
        className={cn(
          "font-primary-bold text-base line-clamp-1",
          labelClassName
        )}
      >
        {credentialData.name}
      </span>
    </div>
  );
}
