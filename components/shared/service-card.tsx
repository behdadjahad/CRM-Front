"use client";

import { cn } from "@/lib/utils";
import Image from "next/image";
import React from "react";

export interface ServiceCardInterface {
  title: string;
  isActive?: boolean;
  clickFunction?: any;
  className?: string;
  imageClassName?: string;
  isSelected?: boolean;
  image: string;
  selectedImage?: string;
  activeImage?: string;
  children?: any;
}

export default function ServiceCard({
  image,
  title,
  isActive,
  clickFunction,
  className,
  imageClassName,
  isSelected,
  selectedImage,
  activeImage,
}: ServiceCardInterface) {
  return (
    <div
      className={cn(
        "flex flex-col items-center justify-between text-xs text-right p-2 gap-2 border rounded-lg flex-1 min-w-24 h-32 bg-card",
        className
      )}
      onClick={clickFunction}
    >
      <Image
        src={
          isSelected && selectedImage
            ? selectedImage
            : isActive && activeImage
            ? activeImage
            : image
        }
        alt={title}
        width={1080}
        height={1080}
        id="service-image"
        className={cn(
          "min-w-21 rounded-lg h-21 border border-border/20 object-cover w-full",
          { "border-success": isActive },
          { "border-primary": isSelected },
          imageClassName
        )}
      />

      <span className="">{title}</span>
    </div>
  );
}
