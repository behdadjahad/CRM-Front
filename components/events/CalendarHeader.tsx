import { FaArrowLeft, FaArrowRight } from "react-icons/fa";
import { Button } from "../ui/button";
import CalendarTimeFiltering, {
  CalendarRangeTimeType,
} from "./calendar/calendar-time-filtering";
export interface CalendarHeaderInterface {
  date: {
    day: number;
    monthName: string;
    year: number;
    month: number;
  };
  selectedDaysRangeStr: string;
  onPrev: () => void;
  onNext: () => void;
  onToday: () => void;
  onActiveTime: (value: CalendarRangeTimeType) => void;
  calendarRangeType: CalendarRangeTimeType;
}
const CalendarTimeFilteringList = [
  { label: "ماهانه", value: "monthly" },
  { label: "هفتگی", value: "weekly" },
  { label: "روزانه", value: "daily" },
];
export default function CalendarHeader({
  date,
  selectedDaysRangeStr,
  onPrev,
  onNext,
  onToday,
  onActiveTime,
  calendarRangeType,
}: CalendarHeaderInterface) {
  return (
    <div className="bg-card p-6 rounded-lg flex justify-between items-center">
      <div className="flex items-stretch gap-4">
        <div className="h-16 w-16 border rounded-lg flex flex-col items-center justify-between">
          <span className="bg-[#FCFCFD] text-xs w-full text-center p-1 rounded-t-lg text-[#717680]">
            {date.monthName}
          </span>
          <span className="flex items-center justify-center flex-1 text-[#1C68DA] font-primary-bold">
            {date.day}
          </span>
        </div>

        <div className="flex flex-col">
          <div className="flex">
            {" "}
            <span className=" text-[#181D27] font-primary-bold">{date.monthName}</span>
            <span className=" text-[#181D27] font-primary-bold">{date.year}</span>
          </div>
        </div>
      </div>
      <CalendarTimeFiltering
        list={CalendarTimeFilteringList}
        onActiveTime={onActiveTime}
        calendarRangeType={calendarRangeType}
      />

      <div className="flex items-stretch justify-center gap-4 text-[#414651]">
        <div className="flex items-stretch justify-center">
          <Button onClick={onPrev} className="border rounded" variant={"ghost"}>
            <FaArrowRight />
          </Button>

          <div className="px-4 py-1 border rounded text-sm text-[#414651] flex items-center justify-center">
            {selectedDaysRangeStr}
          </div>

          <Button onClick={onNext} className="border rounded" variant={"ghost"}>
            <FaArrowLeft />
          </Button>
        </div>
        <Button
          onClick={onToday}
          className="border rounded px-3 py-1"
          variant={"ghost"}
        >
          امروز
        </Button>
      </div>
    </div>
  );
}
