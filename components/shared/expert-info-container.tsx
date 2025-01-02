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
    <div className="bg-city   min-h-fit   rounded-xl">
      <div className="bg-banner opacity-90 p-8 text-primary-foreground flex flex-row justify-between items-center">
        <div className="flex flex-col gap-12 items-center justify-between align-middle md:flex-row w-full md:w-fit">
          {list.map((item, index) =>
            item.children ? (
              <div
                key={index}
                className="-translate-x-5 -translate-y-15 rounded-full overflow-hidden w-25 h-25"
              >
                {item.children}
              </div>
            ) : (
              <div
                key={item.label}
                className="flex flex-row md:flex-col items-start gap-2.5 justify-between w-full md:w-fit"
              >
                <span className="text-sm font-normal">{item.label}</span>
                <span className="font-bold text-sm">{item.value}</span>
              </div>
            )
          )}
        </div>
      </div>
    </div>
  );
}
