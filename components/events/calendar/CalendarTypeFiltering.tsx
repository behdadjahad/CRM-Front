import { Button } from "@/components/ui/button";

interface CalendarTypeFilteringInterface {
  list: {
    label: string;
    value: CalendarType;
  }[];
  onActive: (value: CalendarType) => void;
  calendarType: CalendarType;
}
export type CalendarType = "jalali" | "gregory" | "hijri";

export default function CalendarTypeFiltering({
  list,
  onActive,
  calendarType,
}: CalendarTypeFilteringInterface) {
  return (
    <div className="flex items-center justify-center border border-[#D5D7DA] rounded-lg">
      {list.map((item, index) => (
        <Button
          key={item.value}
          className={`text-[#414651] border border-[#D5D7DA] rounded-none border-none ${
            index === 0 ? "rounded-r-lg" : ""
          } ${index === list.length - 1 ? "rounded-l-lg" : ""} ${
            item.value === calendarType
              ? "bg-[#FAFAFA] text-[#252B37]"
              : ""
          }`}
          variant="ghost"
          size="sm"
          onClick={() => {
            onActive(item.value);
          }}
        >
          {item.label}
        </Button>
      ))}
    </div>
  );
}
