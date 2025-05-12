"use client";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { cn } from "@/lib/utils";

import Image from "next/image";
import { OptionType } from "./form-maker";
export default function SortDropDown({
  list,
  onSortHandler,
}: {
  list: OptionType[];
  onSortHandler: any;
}) {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger
        className={cn(
          "bg-badge p-2 rounded-lg flex flex-row items-center gap-3 outline-none h-10"
        )}
      >
        <div className="flex flex-row items-center gap-2">
          <Image
            src={"/icons/sort-ascending.png"}
            alt="Sort"
            width={24}
            height={24}
          />

          <div> مرتب سازی بر اساس</div>
        </div>
      </DropdownMenuTrigger>

      <DropdownMenuContent className="flex flex-col gap-4">
        {list &&
          list.map((item) => (
            <div
              key={`${item.value}-${item.type}`}
              className="text-sm cursor-pointer hover:bg-foreground-mute w-full p-2 text-center rounded-sm hover:text-card"
              onClick={() => {
                onSortHandler(item.value, item.type);
              }}
            >
              {item.label}
            </div>
          ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
