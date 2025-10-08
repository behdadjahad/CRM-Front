'use client'
import { cn } from "@/lib/utils";
import Link from "next/link";
import Image from "next/image";
export interface CalendarInterface {
  className?: string;
}
export default function Calendar({ className }: CalendarInterface) {
  return (
    <Link
      href={"/calendar"}
      className={cn(
        "bg-badge p-2 rounded-lg flex  items-center justify-center  outline-none h-10 w-10",
        className
      )}
    >
      <Image
        src={"/icons/calendar-icon.svg"}
        alt="calendar"
        width={1024}
        height={1024}
        className="w-6 h-6"
      />
    </Link>
  );
}
