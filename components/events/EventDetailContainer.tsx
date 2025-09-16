import {
  convertDateWithTimeZone,
  getTimeOfDate,
  getWeekdayLabel,
} from "@/lib/calendar";
import EventCreationContainer from "./calendar/EventCreationContainer";
import DeleteConfirmation from "../admin/delete-confirmation";

export interface EventDetailContainerInterface {
  eventList: {
    id:number;
    title: string;
    start: string;
  }[];
  calendarType: "jalali" | "hijri" | "gregory";
  multiEvent: boolean;
  onDeleteHandler:(id:number)=>void;
}

export default function EventDetailContainer({
  eventList,
  calendarType,
  multiEvent,
  onDeleteHandler
}: EventDetailContainerInterface) {
  const { list, actions } = generateEventDetail();


  return (
    <div className="w-full flex flex-col gap-4">
      <div className="flex items-center justify-between">
        {" "}
        <h2>تاریخچه رویدادها</h2>
        {multiEvent ? (
          <EventCreationContainer useForDetail={true} />
        ) : (
          <div className="flex items-center gap-2">
            <DeleteConfirmation onDelete={()=>{onDeleteHandler(eventList?.[0].id)}

              }  />
          </div>
        )}
      </div>

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
   
    const actions = <>action</>;
    const list = eventList.map((item) => {
      const date = convertDateWithTimeZone(item.start, calendarType); // pass event date to your util
      const weekLabel = getWeekdayLabel(new Date(item?.start), calendarType);
      return {
        time: getTimeOfDate(item.start), // e.g., "10:30 AM"
        weekLabel: weekLabel, // e.g., "Mon"
        title: item?.title || "",
        monthName: date.monthName, // e.g., "Aug"
        day: date.day,
        timeLabel: "ساعت",
        // e.g., "26"
      };
    });

    return { list, actions };
  }
}
