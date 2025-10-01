import { cn } from "@/lib/utils";
import EventDetailCard from "./EventDetailCard";
import { useState } from "react";
import EventCreationContainer from "./calendar/EventCreationContainer";
import {
  convertDateWithTimeZone,
  getTimeOfDate,
  getWeekdayLabel,
} from "@/lib/calendar";
import EventEditForm from "./EventEditForm";

export interface EventDetailSidebarInterface {
  state: boolean;
  setState: (prev: any) => any;
  eventList: any[];
  calendarType: "jalali" | "hijri" | "gregory";
}

export default function EventDetailSidebar({
  state,
  setState,
  eventList,
  calendarType,
}: EventDetailSidebarInterface) {
  const { data } = generateEventsDetailData();
  const [editForms, setEditForms] = useState<number[]>([]);
  return (
    <div
      className={cn("h-0 w-0 overflow-hidden top-0 left-0 z-50 fixed", {
        "w-screen h-screen": state,
      })}
    >
      <div
        className="bg-foreground/80 h-screen w-screen z-20"
        onClick={() => setState(false)}
      />
      <div
        className={cn(
          "h-screen rounded-r-2xl fixed top-0 z-50 left-0 w-0 bg-card text-foreground overflow-x-hidden duration-200 transition-all",
          {
            "w-72": state,
          }
        )}
      >
        <div className="flex flex-col w-full p-6 gap-4">
          <div className="flex items-center gap-2">
            <h2>{data.title}</h2>
            <div className="flex items-center gap-1">{data.actions}</div>
          </div>{" "}
          <div className="flex flex-col gap-4 mt-4">
            {" "}
            {data.list.map((event, index) => {
              const isEditForm = editForms.includes(event.id);
              return isEditForm ? (
                <EventEditForm
                  key={`event-edit-${event.id}`}
                  // {...event}
                  // onClose={() =>
                  //   setEditForms((prev) => prev.filter((id) => id !== event.id))
                  // }
                />
              ) : (
                <EventDetailCard
                  key={`event-detail-${event.id}`}
                  {...event}
                  onViewEditForm={() =>
                    setEditForms((prev) => [...prev, event.id])
                  }
                />
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
  function generateEventsDetailData() {
    const data = {
      title: "تاریخچه رویدادها",
      actions: <EventCreationContainer useForDetail={true} />,

      list: eventList.map((item) => {
        const date = convertDateWithTimeZone(item.start, calendarType); // pass event date to your util
        const weekLabel = getWeekdayLabel(new Date(item?.start), calendarType);
        return {
          id: item.id,
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
