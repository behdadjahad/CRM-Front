"use client"

import TimeFilter from "@/components/report/time-filter";
import Breadcrumb from "@/components/shared/breadcrumb";
import Title from "@/components/shared/title";
import { useState } from "react";

export default function Report() {
  const [activeTime, setActiveTime] = useState<any>("today")

  return (
    <main>
      <div>
        <Title label="گزارش" />

        <Breadcrumb
          list={[
            {
              label: "داشبورد",
              link: ""
            },
            {
              label: "گزارش"
            }
          ]}
        />
      </div>

      <TimeFilter activeTime={activeTime} setActiveTime={setActiveTime} />
    </main>
  );
}
