"use client";
import { useState } from "react";
import { Button } from "../ui/button";
import { FaChevronDown, FaChevronUp } from "react-icons/fa";
import Image from "next/image";
import { cn } from "@/lib/utils";

export interface ClientInfoCardInterface {
  data: {
    label: string;
    value: string;
  }[];
  action: {
    label?: string;
    icon: {
      src: string;
      className?: string;
    };
    click: () => any;
  }[];
  clientServices: {
    label?: string;
    icon: string;
    iconClassName?: string;
  }[];
}

export default function ClientInfoCard({
  data,
  action,
  clientServices,
}: ClientInfoCardInterface) {
  const [isCollapsed, setIsCollapsed] = useState<boolean>(true);
  return (
    <div className="flex flex-col rounded-lg overflow-hidden  items-start border border-border/20  border-r-primary border-r-[6px]">
      <div
        className={`flex w-full p-2 overflow-hidden ${
          isCollapsed ? "h-[150px]" : "h-[75px]"
        } transition-all duration-300 ease-in-out`}
      >
        <div className="w-4/5 flex flex-col gap-1">
          {data.map((item) => (
            <div key={item.label} className="flex flex-row">
              <span className="text-subtitle/80 text-xs  w-1/2">
                {item.label}
              </span>
              <span className="text-xs  w-1/2">{item.value}</span>
            </div>
          ))}
        </div>

        <div className="w-1/5 flex flex-col gap-2">
          <div className="flex items-center justify-center gap-0.5">
            {action.map((item) => (
              <Button
                key={item.icon.src}
                variant={"transparent"}
                className="p-0"
              >
                <Image
                  src={item.icon.src}
                  alt=""
                  width={1024}
                  height={1024}
                  className={cn("object-cover", item.icon.className)}
                />
              </Button>
            ))}
          </div>
          <div className="bg-background rounded-md flex flex-col py-2 items-center gap-1 h-full overflow-hidden">
            {clientServices.map((item) => (
              <div
                key={item.icon}
                className="w-7 h-7 bg-background-active flex items-center justify-center"
              >
                <Image
                  src={item.icon}
                  alt=""
                  width={1024}
                  height={1024}
                  className={cn("object-cover w-3.5 h-4", item.iconClassName)}
                />
              </div>
            ))}
          </div>
        </div>
      </div>

      <Button
        variant={"transparent"}
        onClick={() => setIsCollapsed(!isCollapsed)}
      >
        <span className="text-xs text-foreground">
          {" "}
          {isCollapsed ? "کمتر" : "بیشتر"}
        </span>

        {isCollapsed ? <FaChevronDown size={8} /> : <FaChevronUp size={8} />}
      </Button>
    </div>
  );
}
