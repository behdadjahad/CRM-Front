import {
  convertDateWithTimeZone,
  convertToGregorianYMD,
  getDatesBetween,
  weekdaysMap,
} from "@/lib/calendar";

export interface CustomRangeCalendarInterface {
  visibleRange: {
    start: Date;
    end: Date;
  };
  calendarType: "jalali" | "hijri" | "gregory";
  events: any[];
  currentDate: string;
  selectedRange: any;
}

export default function CustomRangeCalendar({
  visibleRange,
  calendarType,
  events,
  currentDate,
  selectedRange,
}: CustomRangeCalendarInterface) {
  const start = convertToGregorianYMD(visibleRange?.start);
  const end = convertToGregorianYMD(visibleRange?.end);

  const rangeDaysArray = getDatesBetween(start, end);
  const selectedDaysArray = getDatesBetween(
    selectedRange?.start,
    selectedRange?.end
  );
  console.log(selectedRange);
  console.log(selectedDaysArray);
  console.log(rangeDaysArray);
  const weekdays = weekdaysMap[calendarType];
  console.log(selectedDaysArray);
  return (
    <div>
      <div className="grid grid-cols-7">
        {weekdays.map((weekday, index) => {
          const weekLabel = weekdays[index];
          return (
            <div
              key={index}
              className="w-full p-3 border border-[#E9EAEB] flex gap-2 items-center justify-center"
            >
              {weekLabel}
            </div>
          );
        })}
      </div>
      <div className="grid grid-cols-7">
        {" "}
        {rangeDaysArray.map((date, index) => {
          const { day, month, year } = convertDateWithTimeZone(
            date,
            calendarType
          );
          const {
            day: cellDay,
            month: cellMonth,
            year: cellYear,
          } = convertDateWithTimeZone(date, calendarType);
          const {
            day: currentDay,
            month: currentMonth,
            year: currentYear,
          } = convertDateWithTimeZone(currentDate, calendarType);
          const isCurrentMonth =
            cellYear === currentYear && cellMonth === currentMonth;
          const outOfRange = selectedRange
            ? !selectedDaysArray.includes(date)
            : !isCurrentMonth;

          return (
            <div
              key={index}
              className="flex items-center justify-between  border border-[#E9EAEB] bg-card text-[#535862]  flex-col cursor-pointer h-[130px] p-3"
              onClick={() => {}}
            >
              <div
                className={`flex justify-end w-full ${
                  outOfRange ? "text-[#B6BCC2]" : ""
                }`}
              >
                {day}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
