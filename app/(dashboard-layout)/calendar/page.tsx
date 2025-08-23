"use client";

import { getCalendarData } from "@/api/calendar";
import { getEvent } from "@/api/event";
import EventCreationContainer from "@/components/events/calendar/EventCreationContainer";
import CalendarContainer from "@/components/events/CalendarContainer";

import Breadcrumb from "@/components/shared/breadcrumb";
import Title from "@/components/shared/title";
import { useQuery } from "@tanstack/react-query";
import { useEffect, useState } from "react";

export default function Calendar() {
  const [calendarData, setCalendarData] = useState<any[]>([]);
  const { data: calendar } = useQuery({
    queryKey: ["calendar"],
    queryFn: async () => await getCalendarData(),
  });
  console.log(calendar?.data)
  console.log(calendarData)
  useEffect(() => {
    if (calendar && calendar?.data && calendar?.data?.length > 0) {
      const calendarDataList = calendar?.data?.map((item:any) => ({
        title: item?.subject,
        start: item?.occurenceDate,
      }));
      setCalendarData(calendarDataList);
    }
  }, [calendar]);
  return (
    <main className="flex flex-col">
      <div className="flex justify-between items-center">
        <div>
          {" "}
          <Title label="قرار ملاقات ها" />
          <Breadcrumb
            list={[
              {
                label: "داشبورد",
                link: "/",
              },
              {
                label: "قرار ملاقات ها",
              },
            ]}
          />
        </div>
        <EventCreationContainer />
      </div>
      <CalendarContainer data={calendarData} />
    </main>
  );
}
