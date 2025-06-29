"use client";

import React from "react";
import Image from "next/image";
export interface PersonInfoInterface {
  list: {
    label?: string;
    value?: string;
    image?: string;
  }[];
}

export default function PersonInfoContainer({ list }: PersonInfoInterface) {
  return (
    <div className="w-full bg-city bg-no-repeat bg-cover flex flex-col gap-1 md:gap-8 md:flex-row md:flex-wrap text-card rounded-tl-xl rounded-tr-xl  p-3 md:p-6">
      {list?.map((item, index) =>
        item.image ? (
          <div
            key={index}
            className="-translate-y-8 md:-translate-y-10 rounded-full overflow-hidden w-16 h-16 md:w-25 md:h-25"
          >
            <Image
              src={item?.image ? item?.image : ""}
              alt={"تصویر"}
              width={107}
              height={107}
              className="h-full w-full border-4 border-primary-foreground rounded-full"
            />
          </div>
        ) : (
          <div
            key={item.label}
            className="flex flex-row md:flex-col justify-between w-full md:w-fit md:mx-8 md:justify-center"
          >
            <span className="text-sm font-normal">{item.label}</span>
            <span className="font-bold text-sm">{item.value}</span>
          </div>
        )
      )}
    </div>
  );
}
