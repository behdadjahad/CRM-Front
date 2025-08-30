import {
  convertDateWithTimeZone,
  getTimeOfDate,
  getWeekdayLabel,
} from "@/lib/calendar";
import Image from "next/image";
import EventDetailCard from "./EventDetailCard";
import { Button } from "../ui/button";
import DeleteConfirmation from "../admin/delete-confirmation";
import { useState } from "react";
interface CalendarDetailContainerInterface {
  //   data: {
  //     title: string;
  //     actions: React.ReactNode;
  //     list: any[];
  //   };
  eventList: any[];
  calendarType: "jalali" | "hijri" | "gregory";
}

export default function CalendarDetailContainer({
  eventList,
  calendarType,
}: CalendarDetailContainerInterface) {
  const [viewEditForm, setViewEditForm] = useState<boolean>(false);
  const { data } = generateEventsDetailData();
  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center justify-between">
        <h2>{data.title}</h2>
        <div className="flex items-center gap-1">{data.actions}</div>
      </div>
      <div className="flex flex-col gap-4">
        {data.list.map((event, index) => (
          <EventDetailCard key={`event-detail-${index}`} {...event} />
        ))}
      </div>
    </div>
  );
  function generateEventsDetailData() {
    const data = {
      title: "تاریخچه رویدادها",
      actions: (
        <>
          <Button
            className="border-none p-0 text-[#212B36]"
            onClick={() => {
              setViewEditForm(true);
            }}
          >
            <Image
              src="/icons/edit-primary.png"
              alt=""
              width={1024}
              height={1024}
              className="w-4 h-4"
              onClick={() => {}}
            />
          </Button>

          <DeleteConfirmation onDelete={() => {}} />
        </>
      ),

      // list: singleDateEvents,
      list: eventList.map((item) => {
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
      }),
    };
    return { data };
  }
}
