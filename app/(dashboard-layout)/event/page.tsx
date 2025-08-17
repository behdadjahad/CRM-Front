"use client";

import EventCreationContainer from "@/components/events/calendar/EventCreationContainer";
import CalendarContainer from "@/components/events/CalendarContainer";

import Breadcrumb from "@/components/shared/breadcrumb";
import Title from "@/components/shared/title";

export default function Event() {
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
      <CalendarContainer />
    </main>
  );
}
