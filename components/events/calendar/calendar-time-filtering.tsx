import { Button } from "@/components/ui/button";
import { useState } from "react";
interface CalendarTimeFilteringInterface {
  list: {
    label: string;
    value: CalendarRangeTimeType;
  }[];
  onActiveTime: (value: CalendarRangeTimeType) => void;
  calendarRangeType: CalendarRangeTimeType;
}
export type CalendarRangeTimeType = "weekly" | "monthly" | "daily";

export default function CalendarTimeFiltering({
  list,
  onActiveTime,
  calendarRangeType,
}: CalendarTimeFilteringInterface) {
  return (
    <div className="flex items-center justify-center border border-[#D5D7DA] rounded-lg">
      {list.map((item, index) => (
        <Button
          key={item.value}
          className={`text-[#414651] border border-[#D5D7DA] rounded-none border-none ${
            index === 0 ? "rounded-r-lg" : ""
          } ${index === list.length - 1 ? "rounded-l-lg" : ""} ${
            item.value === calendarRangeType
              ? "bg-[#FAFAFA] text-[#252B37]"
              : ""
          }`}
          variant="ghost"
          size="sm"
          onClick={() => {
            onActiveTime(item.value);
          }}
        >
          {item.label}
        </Button>
      ))}
    </div>
  );
}
