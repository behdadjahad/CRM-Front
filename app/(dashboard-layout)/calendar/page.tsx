"use client";

import { getCalendarData } from "@/api/calendar";

import EventCreationContainer from "@/components/events/calendar/EventCreationContainer";
import CalendarContainer from "@/components/events/CalendarContainer";

import Breadcrumb from "@/components/shared/breadcrumb";
import Title from "@/components/shared/title";
import { useMutation, useQuery } from "@tanstack/react-query";
import { useEffect, useState } from "react";

export default function Calendar() {
  const [calendarData, setCalendarData] = useState<any[]>([]);
  const { data: calendar } = useQuery({
    queryKey: ["calendar"],
    queryFn: async () => await getCalendarData(),
  });

  useEffect(() => {
    if (calendar && calendar?.data && calendar?.data?.length > 0) {
      const calendarDataList = calendar?.data?.map((item:any) => ({
        id:item?.id,
        title: item?.subject,
        start: item?.occurenceDate,
        followUpTypeId: item?.extraInformation?.followUpTypeId
        ,
      }));
      setCalendarData(calendarDataList);
    }
  }, [calendar]);
  const { mutate: getCalendarDataHandler } = useMutation({
    mutationFn: (data: any) => {
      return getCalendarData(data);
    },
    onSuccess: (response) => {
      if (response && response?.data && response?.data?.length > 0) {
      const calendarDataList = response?.data?.map((item:any) => ({
        id:item?.id,
        title: item?.subject,
        start: item?.occurenceDate,
       followUpTypeId: item?.extraInformation?.followUpTypeId
      }));
      setCalendarData(calendarDataList);
    }
    },
  });
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
      <CalendarContainer data={calendarData} onFilter={(data:any)=>getCalendarDataHandler(data)}/>
    </main>
  );
}
