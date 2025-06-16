"use client";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { cn } from "@/lib/utils";
import { set } from "lodash";

import Image from "next/image";
import { useState } from "react";
import { FaEllipsisH } from "react-icons/fa";
export interface NotificationDropDown {
  list: {
    label: string;
    value: string;
  }[];
}
export default function NotificationDropDown({ list }: NotificationDropDown) {
  const [activeItem, setActiveItem] = useState<string>();
  return (
    <DropdownMenu>
      <DropdownMenuTrigger
        className={cn(
          "bg-card rounded-lg flex flex-row items-center gap-3 outline-none"
        )}
      >
        <div className="flex flex-row items-center gap-2 text-sm">
          <FaEllipsisH />
        </div>
      </DropdownMenuTrigger>

      <DropdownMenuContent>
        {list &&
          list.map((item, index) => (
            <div
              key={`${item.label}-${index}`}
              className={`text-xs cursor-pointer hover:bg-[#D5D7DA] w-full text-right rounded-sm  p-2 ${
                activeItem === item.value ? "" : ""
              }`}
              onClick={() => {
                setActiveItem(item.value);
              }}
            >
              {item.label}
              {activeItem === item.value}
            </div>
          ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
