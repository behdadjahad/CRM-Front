import {
  getDatePartFromISOString,
  getHourFromISOString,
  getHourStringFromIndex,
} from "@/lib/calendar";
import LeadContactTypeCard from "./lead/LeadContactTypeCard";

export interface GridDailyCalendarInterface {
  events: any[];
  followUpTypeList: any[];
  onGetFollowUpTypeData: (eventData: any) => void;
  onGetHourData: (eventData: any) => void;
  currentDate: string;
}

export default function GridDailyCalendar({
  events,
  followUpTypeList,
  onGetFollowUpTypeData,
  onGetHourData,
  currentDate,
}: GridDailyCalendarInterface) {
  const dayEvents = events?.filter(
    (event) => getDatePartFromISOString(event?.start) === currentDate
);
  console.log(dayEvents);
  function getEventListHandler(id?: number, hour?: string) {
    const filteredEvents = id
      ? dayEvents.filter(
          (event) =>
            Number(event.followUpTypeId) === id &&
            getHourFromISOString(event?.start) == hour
        )
      : dayEvents;
    onGetFollowUpTypeData(filteredEvents);
  }
  function getHourEventList(hour: string) {
    const filteredEvents = hour
      ? dayEvents.filter((event) => getHourFromISOString(event?.start) == hour)
      : dayEvents;
    console.log(filteredEvents)
    onGetHourData(filteredEvents);
  }
  return (
    <div className="grid grid-cols-3 md:grid-cols-6 lg:grid-cols-8">
      {Array.from({ length: 24 }).map((_, index) => (
        <div
          key={index}
          className="flex items-center justify-between  border border-[#E9EAEB] bg-card text-[#535862] h-64 flex-col p-4"
          onClick={() => {
            getHourEventList(getHourStringFromIndex(index))
          }}
        >
          <div>{getHourStringFromIndex(index)}</div>
          {followUpTypeList.filter((contactType)=>contactType?.id !== null).map((contactType: any, i: number) => {
            const FollowUpTypeHourEvents = dayEvents.filter(
              (event) =>
                Number(event.followUpTypeId) === contactType.id &&
                getHourFromISOString(event?.start) ==
                  getHourStringFromIndex(index)
            );

            return (
              <LeadContactTypeCard
                {...contactType}
                key={contactType.value}
                onActiveItem={(label, value, id) => {
                  getEventListHandler(id, getHourStringFromIndex(index));
                }}
                eventOrder={FollowUpTypeHourEvents?.length}
              />
            );
          })}
        </div>
      ))}
    </div>
  );
}
