"use client";

import React from "react";

export interface ExpertInfoInterface {
  list: {
    label?: string;
    value?: string;
    children?: React.ReactNode;
  }[];
}

export default function ExpertInfoContainer({ list }: ExpertInfoInterface) {
  return (
    <div className="w-full bg-city bg-no-repeat bg-cover flex flex-col gap-4 md:gap-8 items-center  md:flex-row text-card rounded-tl-xl rounded-tr-xl min-h-30 px-6">
      {list.map((item, index) =>
        item.children ? (
          <div
            key={index}
            className="-translate-y-10 md:-translate-y-10 rounded-full overflow-hidden w-25 h-25"
          >
            {item.children}
          </div>
        ) : (
          <div
            key={item.label}
            className="flex flex-row md:flex-col items-start gap-2.5 justify-between w-full md:w-fit mx-8"
          >
            <span className="text-sm font-normal">{item.label}</span>
            <span className="font-bold text-sm">{item.value}</span>
          </div>
        )
      )}
    </div>
  );
}
