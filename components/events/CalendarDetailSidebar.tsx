import CalendarDetailContainer from "./CalendarDetailContainer";

interface CalendarDetailSideBar {
    eventList: any[]
    calendarType: "jalali" | "hijri" | "gregory";
}

export default function CalendarDetailSideBar({
    eventList,
    calendarType
}: CalendarDetailSideBar) {
    return <CalendarDetailContainer eventList={eventList} calendarType={ calendarType} />;
}
