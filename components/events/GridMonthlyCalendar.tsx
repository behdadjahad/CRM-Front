import {
  convertDateWithTimeZone,
  convertToGregorianYMD,
  getDatePartFromISOString,
  getDatesBetween,
  getTimeOfDate,
  weekdaysMap,
} from "@/lib/calendar";

export interface MonthlyCalendarInterface {
  currentDate: string;
  visibleRange: {
    start: Date;
    end: Date;
  };
  calendarType: "jalali" | "hijri" | "gregory";
  events: any[];
  onSelectEvent: (id: number) => void;
  onSelectDate: (date: string) => void;
}

export default function GridMonthlyCalendar({
  currentDate,
  visibleRange,
  calendarType,
  events,
  onSelectDate,
  onSelectEvent,
}: MonthlyCalendarInterface) {
  const start = convertToGregorianYMD(visibleRange?.start);
  const end = convertToGregorianYMD(visibleRange?.end);
  const visibleDaysArray = getDatesBetween(start, end);
  const weekdays = weekdaysMap[calendarType];
 

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
        {visibleDaysArray.map((date, index) => {
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
            currentYear === cellYear && currentMonth === cellMonth;
          const isCurrentDay =
            currentYear === cellYear &&
            currentMonth === cellMonth &&
            currentDay === cellDay;
          const cellDayEvents = events?.filter(
            (event) => getDatePartFromISOString(event?.start) === date
          );
          console.log(cellDayEvents);

          return (
            <div
              key={index}
              className="flex items-center border border-[#E9EAEB] bg-card text-[#535862]  flex-col cursor-pointer h-[130px] p-3"
              onClick={() => {
                onSelectDate(date);
              }}
            >
              <div
                className={`flex justify-end w-full
  ${isCurrentMonth ? "" : "text-[#B6BCC2]"}
`}
              >
                <span
                  className={`${
                    isCurrentDay
                      ? "bg-[#1C68DA] text-white rounded-full h-6 w-6 flex items-center justify-center"
                      : ""
                  }`}
                >
                  {cellDay}
                </span>
              </div>
              <div className="flex flex-col w-full">
                {cellDayEvents.map((event) => {
                  return (
                    <div
                      key={`event-day-${index}`}
                      className="flex items-center justify-between w-full p-1 rounded-xl border border-[#FCCEEE] bg-[#FDF2FA] cursor-pointer text-xs"
                      onClick={() => {
                        onSelectEvent(event?.id);
                      }}
                    >
                      <div className="text-[#C11574] font-bold">
                        {event.title}
                      </div>
                      <div className="text-[#DD2590]">
                        {event.start ? getTimeOfDate(event.start) : ""}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
