"use client";

import { cn } from "@/lib/utils";
import Image from "next/image";
import React from "react";

export interface ServiceCardInterface {
  id: number | string;
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
  name?: string;
  form?: any;
  disable?: boolean;
  disableImage?: string;
  hasAccess?: boolean
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
  disable,
  disableImage,
  hasAccess
}: ServiceCardInterface) {
  return (
    <div
      className={cn(
        `flex flex-col items-center justify-between text-xs text-right p-2 gap-2 border rounded-lg w-28 h-36 bg-card `,className
      )}
      onClick={clickFunction}
    >
      <Image
        src={  hasAccess
      ? isSelected && selectedImage
        ? selectedImage
        : isActive && activeImage
        ? activeImage
        : disable && disableImage
        ? disableImage
        : image
      : !hasAccess && !disable ? disableImage! : disableImage! //to-do
        }
        alt={title}
        width={1080}
        height={1080}
        id="service-image"
        className={cn(
          "w-24 rounded-lg h-24 border border-border/20",
          { "border-success": isActive },
          { "border-primary": isSelected },
          imageClassName
        )}
      />

      <span className="">{title}</span>
    </div>
  );
}
