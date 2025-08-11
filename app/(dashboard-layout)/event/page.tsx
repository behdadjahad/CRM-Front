"use client";

import MonthlyCalendarContainer from "@/components/events/CalendarContainer";

import Breadcrumb from "@/components/shared/breadcrumb";
import Title from "@/components/shared/title";

export default function Event() {
  return (
    <main className="flex flex-col">
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

      <MonthlyCalendarContainer />
    </main>
  );
}
