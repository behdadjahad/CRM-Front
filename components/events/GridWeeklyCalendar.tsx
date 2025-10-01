import {
  convertDateWithTimeZone,
  convertToGregorianYMD,
  generateWeekVisibleRange,
  getDatePartFromISOString,
  getDatesBetween,
  getDayNumber,
  weekdaysMap,
} from "@/lib/calendar";
import LeadContactTypeCard from "./lead/LeadContactTypeCard";

export interface GridWeeklyCalendarInterface {
  followUpTypeList: any[];
  visibleRange: {
    start: Date;
    end: Date;
  };
  calendarType: "jalali" | "hijri" | "gregory";
  events: any[];
  currentDate: string;
  onGetDayData: (eventData: any) => void;
  onGetFollowUpTypeData: (eventData: any) => void;
}

export function GridWeeklyCalendar({
  followUpTypeList,
  visibleRange,
  calendarType,
  events,
  currentDate,
  onGetDayData,
  onGetFollowUpTypeData,
}: GridWeeklyCalendarInterface) {
  console.log(events);
  function getDayEventList(date: string) {
    const dayEventOptions = events.filter(
      (event) => getDatePartFromISOString(event?.start) === date
    );
    console.log(dayEventOptions);
    onGetDayData(dayEventOptions);
  }
  function getFollowUpTypeEventList(id: number, date: string) {
    const eventOptions = events.filter(
      (event) =>
        getDatePartFromISOString(event?.start) === date &&
        Number(event.followUpTypeId) === Number(id)
    );
    onGetFollowUpTypeData(eventOptions);
  }
  const start = convertToGregorianYMD(visibleRange.start);
  const end = convertToGregorianYMD(visibleRange.end);

  const weekdaysArray = getDatesBetween(start, end);
  const isLtr = calendarType === "gregory";
  return (
    <div className="grid grid-cols-7" dir={isLtr ? "ltr" : "rtl"}>
      {weekdaysArray.map((date, index) => {
        const { day, month, year } = convertDateWithTimeZone(
          date,
          calendarType
        );
        const weekdays = weekdaysMap[calendarType];
        const weekLabel = weekdays[index];
        const isCurrentDay = currentDate === weekdaysArray[index];
        return (
          <div
            key={index}
            className="flex items-center justify-between  border border-[#E9EAEB] bg-card text-[#535862]  flex-col cursor-pointer"
            onClick={() => {
              getDayEventList(date);
            }}
          >
            <div className="w-full p-3 border-b border-[#E9EAEB] flex gap-2 items-center justify-center">
              <span
                className={`${
                  isCurrentDay
                    ? "flex items-center justify-center rounded-full bg-[#5a0e47] text-card w-6 h-6"
                    : ""
                } ${isLtr ? "custom-font" : ""}`}
              >
                {day}
              </span>{" "}
              <span className={`${isLtr ? "custom-font" : ""}`}>
                {weekLabel}
              </span>
            </div>

            <div className="flex flex-col p-4 gap-2" dir="rtl">
              {" "}
              {followUpTypeList
                .filter((contactType) => contactType?.id !== null)
                .map((contactType: any, i: number) => {
                  const FollowUpTypeHourEvents = events.filter(
                    (event) =>
                      Number(event.followUpTypeId) === contactType.id &&
                      getDatePartFromISOString(event?.start) === date
                  );

                  return (
                    <LeadContactTypeCard
                      {...contactType}
                      key={contactType.value}
                      onActiveItem={(label, value, id) => {
                        if (id) getFollowUpTypeEventList(id, date);
                        
                      }}
                      eventOrder={FollowUpTypeHourEvents?.length}
                    />
                  );
                })}
            </div>
          </div>
        );
      })}
    </div>
  );
}
