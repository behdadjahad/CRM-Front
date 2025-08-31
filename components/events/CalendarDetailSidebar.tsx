import CalendarDetailContainer from "./CalendarDetailContainer";

interface CalendarDetailSideBar {
  eventList: any[];
  calendarType: "jalali" | "hijri" | "gregory";
  isSingleEventData: boolean;
  onDeleteEvent: (id: number) => void;
}

export default function CalendarDetailSideBar({
  eventList,
  calendarType,
  isSingleEventData,
  onDeleteEvent,
}: CalendarDetailSideBar) {
  return (
    <CalendarDetailContainer
      eventList={eventList}
      calendarType={calendarType}
      isSingleEventData={isSingleEventData}
      onDeleteEvent={onDeleteEvent}
    />
  );
}
