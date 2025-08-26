import { convertDateWithTimeZone, getTimeOfDate, getWeekdayLabel } from "@/lib/calendar";

export interface EventDetailContainerInterface {
  eventList: {
    title: string;
    start: string;
  }[];
  calendarType: "jalali" | "hijri" | "gregory";
}

export default function EventDetailContainer({
  eventList,
  calendarType,
}: EventDetailContainerInterface) {
  const { list } = generateEventDetail();
  console.log(eventList);
  return (
    <div className="w-full flex flex-col gap-4">
      <h2>تاریخچه رویدادها</h2>
      {list.map((event, index) => (
        <div key={`event-${index + 1}`} className="flex flex-col gap-1">
          <div className="flex items-center gap-1">
            <div className="flex gap-1 text-xs text-[#A1A1AA]  border-l px-1">
              <span>{event.weekLabel}</span>
              <span>{event.day}</span>
              <span>{event.monthName}</span>
            </div>
            <div className="flex gap-1 text-xs text-[#A1A1AA]">
              <span>{event.timeLabel}</span>
              <span>{event.time}</span>
              </div>
          
          </div>
          <div className="text-[#637381] text-sm">{event?.title}</div>
        </div>
      ))}
    </div>
  );

  function generateEventDetail() {
    console.log(eventList);

    const list = eventList.map((item) => {
      const date = convertDateWithTimeZone(item.start, calendarType); // pass event date to your util
      const weekLabel=getWeekdayLabel(new Date(item?.start),calendarType)
      return {
        time: getTimeOfDate(item.start), // e.g., "10:30 AM"
        weekLabel: weekLabel, // e.g., "Mon"
        title: item?.title || "",
        monthName: date.monthName, // e.g., "Aug"
        day: date.day,
        timeLabel:"ساعت"// e.g., "26"
      };
    });

    return { list };
  }
}
