import { FaArrowLeft, FaArrowRight } from "react-icons/fa";
import { Button } from "../ui/button";
import CalendarTimeFiltering, {
  CalendarRangeTimeType,
} from "./calendar/calendar-time-filtering";
import CalendarTypeFiltering, {
  CalendarType,
} from "./calendar/CalendarTypeFiltering";

export interface CalendarHeaderInterface {
  date: {
    day?: number;
    monthName?: string;
    year?: number;
    month?: number;
  };
  selectedDaysRange: any[];
  onPrev: () => void;
  onNext: () => void;
  onToday: () => void;
  onActiveTime: (value: CalendarRangeTimeType) => void;
  calendarRangeType: CalendarRangeTimeType;
  fullRange?: any[];
  onActiveCalendarType: (value: CalendarType) => void;
  calendarType: CalendarType;
}
const CalendarTimeFilteringList: {
  label: string;
  value: CalendarRangeTimeType;
}[] = [
  { label: "ماهانه", value: "monthly" },
  { label: "هفتگی", value: "weekly" },
  { label: "روزانه", value: "daily" },
];
const CalendarTypeFilteringList: {
  label: string;
  value: CalendarType;
}[] = [
  { label: "شمسی", value: "jalali" },
  { label: "قمری", value: "hijri" },
  { label: "میلادی", value: "gregory" },
];
export default function CalendarHeader({
  date,
  selectedDaysRange,
  fullRange,
  onPrev,
  onNext,
  onToday,
  onActiveTime,
  calendarRangeType,
  onActiveCalendarType,
  calendarType,
}: CalendarHeaderInterface) {
  const isLtr = calendarType === "gregory";
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

        <div className="flex flex-col items-start justify-between">
          <div className="flex items-center gap-1" dir={isLtr ? "ltr" : "rtl"}>
            {" "}
            <span className=" text-[#181D27] font-primary-bold">
              {date.monthName}
            </span>
            <span className=" text-[#181D27] font-primary-bold">
              {date.year}
            </span>
          </div>
          <div className="text-xs text-[#535862] flex items-center gap-1" dir={isLtr ? "ltr" : "rtl"}>
            {fullRange &&
              fullRange.length > 0 &&
              fullRange?.map((item, index) => (
                <div key={"" + index} className="flex items-center gap-1" dir={isLtr ? "ltr" : "rtl"}>
                  <span>{item.day}</span>
                  <span>{item.monthName}</span>
                  <span>{item.year}</span>
                  <span>{index  < fullRange.length -1  && fullRange.length > 1 ? "-" : ""}</span>
                </div>
              ))}
          </div>
        </div>
      </div>

      <CalendarTypeFiltering
        list={CalendarTypeFilteringList}
        onActive={onActiveCalendarType}
        calendarType={calendarType}
      />
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

          <div className="px-4 py-1 border rounded text-sm text-[#414651] flex items-center justify-center" dir={isLtr ? "ltr" : "rtl"}>
            {selectedDaysRange &&
              selectedDaysRange.length > 0 &&
              selectedDaysRange?.map((item, index) => (
                <div key={"" + index} className="flex items-center gap-1" dir={isLtr ? "ltr" : "rtl"}>
                  <span>{item.day}</span>
                  <span>{item.monthName}</span>
                  <span>{item.year}</span>
                  <span>{index  < selectedDaysRange.length -1  && selectedDaysRange.length > 1 ? "-" : ""}</span>
                </div>
              ))}
          </div>

          <Button onClick={onNext} className="border rounded" variant={"ghost"}>
            <FaArrowLeft />
          </Button>
        </div>
        <Button
          onClick={onToday}
          className="border-[#1C68DA] rounded px-3 py-1 bg-[#1C68DA] text-card"
          variant={"ghost"}
        >
          امروز
        </Button>
      </div>
    </div>
  );
}
