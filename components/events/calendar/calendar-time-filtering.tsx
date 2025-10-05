import { Button } from "@/components/ui/button";

interface CalendarTimeFilteringInterface {
  list: {
    label: string;
    value: CalendarRangeTimeType;
  }[];
  onActiveTime: (value: CalendarRangeTimeType) => void;
  calendarRangeType: CalendarRangeTimeType;
}
export type CalendarRangeTimeType = "weekly" | "monthly" | "daily" | "custom-range-day";

export default function CalendarTimeFiltering({
  list,
  onActiveTime,
  calendarRangeType,
}: CalendarTimeFilteringInterface) {
  return (
    <div className="flex items-center justify-center border border-static-border-neutral rounded-lg">
      {list.map((item, index) => (
        <Button
          key={item.value}
          className={`text-static-secondary-gray-dark border border-static-border-neutral rounded-none border-none ${index === 0 ? "rounded-r-lg" : ""
            } ${index === list.length - 1 ? "rounded-l-lg" : ""} ${item.value === calendarRangeType
              ? "bg-static-background-neutral text-static-text-secondary"
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
