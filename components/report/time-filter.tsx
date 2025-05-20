import React from "react";
import { Button } from "../ui/button";
import { cn } from "@/lib/utils";
import CustomeDatePicker from "../shared/custome-date-picker";
import Image from "next/image";

export interface TimeFilterInterface {
  activeTime: any;
  setActiveTime: (data: any) => any;
  className?: string;
}

export default function TimeFilter({
  activeTime,
  setActiveTime,
  className,
}: TimeFilterInterface) {
  const filters = [
    {
      label: "امروز",
      value: "today",
    },
    {
      label: "1 ماه",
      value: "1-months",
    },
    {
      label: "3 ماه",
      value: "3-months",
    },
    {
      label: "6 ماه",
      value: "6-months",
    },
    {
      label: "9 ماه",
      value: "9-months",
    },
    {
      label: "12 ماه",
      value: "12-months",
    },
  ];
  return (
    <div
      className={cn(
        "w-full flex flex-row flex-nowrap overflow-auto",
        className
      )}
    >
      {filters.map((item,index) => (
        <Button
          key={item.label}
          variant={activeTime == item.value ? "activeForeground" : "deactiveForeground"}
          onClick={() => setActiveTime(item.value)}
          // className="flex-1 px-5 py-1 md:px-10 md:py-2"
          className={`border border-slate-foreground custom-shadow rounded-none ${index === 0 ? "rounded-tr-lg rounded-br-lg" : ""} `}
        >
          {item.label}
        </Button>
      ))}

      {/* <CustomeDatePicker
        idKey={"startDate"}
        // className="flex-1"
        className=""
      >
        <Button
          // variant={activeTime["startDate"] ? "activeForeground" : "default"}
          variant={activeTime["startDate"] ? "activeForeground" : "deactiveForeground"}
          onClick={() =>
            setActiveTime((prev: any) =>
              prev.endDate ? { ...prev, startDate: true } : { startDate: true }
            )
          }
          className="flex flex-row  w-full border border-slate-foreground custom-shadow rounded-none"
        >
          <span>از تاریخ</span>

          <Image
            src={"/icons/calendar-mute.png"}
            alt="pick date"
            width={24}
            height={24}
          />
        </Button>
      </CustomeDatePicker>

      <CustomeDatePicker idKey={"endDate"}
        // className="flex-1"
      >
        <Button
          variant={activeTime["endDate"] ? "activeForeground" : "deactiveForeground"}
          onClick={() =>
            setActiveTime((prev: any) =>
              prev.startDate ? { ...prev, endDate: true } : { endDate: true }
            )
          }
          className="flex flex-row  w-full border border-slate-foreground custom-shadow rounded-none rounded-tl-lg rounded-bl-lg"
      
        >
          <span>تا تاریخ</span>

          <Image
            src={"/icons/calendar-mute.png"}
            alt="pick date"
            width={24}
            height={24}
          />
        </Button>
      </CustomeDatePicker> */}
      
    </div>
  );
}
