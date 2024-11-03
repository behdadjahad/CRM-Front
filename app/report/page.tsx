"use client"

import CallContracts, { CallContractsInterface } from "@/components/report/call-contracts";
import ReportOverview, { ReportOverviewInterface } from "@/components/report/report-overview";
import TimeFilter from "@/components/report/time-filter";
import Breadcrumb from "@/components/shared/breadcrumb";
import Title from "@/components/shared/title";
import { useState } from "react";

export default function Report() {
  const { contracts, overviews } = getData()
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

      <TimeFilter activeTime={activeTime} setActiveTime={setActiveTime} className="min-h-fit" />

      <div className="border rounded-lg p-6 flex flex-col gap-6">

        <ReportOverview overviews={overviews} />

        <CallContracts contracts={contracts} className="lg:w-1/3" />
      </div>
    </main>
  );
}


function getData() {
  const overviews: ReportOverviewInterface['overviews'] = [
    {
      imageSrc: '/icons/profit.png',
      isProfit: true,
      price: '6.142.772.429',
    },
    {
      imageSrc: '/icons/loss.png',
      isProfit: false,
      price: '82.060.000.00',
    }
  ]

  const contracts: CallContractsInterface['contracts'] = [
    {
      count: 121,
      label: 'تعداد قرارداد های قابل تماس',
      percentage: 68
    },
    {
      count: 26,
      label: 'تعداد قرارداد های آژانس همکار',
      percentage: 46
    },
    {
      count: 1,
      label: 'توریست',
      percentage: 1
    },
    {
      count: 3,
      label: 'شماره ایران نیست',
      percentage: 5
    },
    {
      count: 1,
      label: 'مسافران Gold',
      percentage: 1
    },
    {
      count: 2,
      label: 'تور کنسل شده',
      percentage: 1
    }
  ]


  return {
    overviews,
    contracts
  }
}
