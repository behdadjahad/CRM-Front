import { credentialData } from "@/constants/credentials";
import { cn } from "@/lib/utils";
import Image from "next/image";
import Link from "next/link";
import React from "react";

export interface OrganizationInformationInterface {
  className?: string;
}

export default function OrganizationInformation({
  className,
}: OrganizationInformationInterface) {
  return (
    <div className={cn("w-full relative", className)}>
      <Image
        src="/images/banner.png"
        alt="Logo"
        width={680}
        height={900}
        className="object-cover h-full w-full absolute bottom-0 left-0 top-0"
      />
      <h1 className="absolute left-10 top-1/4 text-primary-foreground text-5xl">
        {credentialData.login.label}
      </h1>

      <span className="absolute left-36 bottom-10 text-white flex gap-2 text-lg">
        شماره تماس:{" "}
        <Link href={credentialData.phoneNumber.link}>
          {credentialData.phoneNumber.label}
        </Link>
      </span>
    </div>
  );
}
