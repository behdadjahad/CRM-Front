"use client"

import BarChartReport, { BarChartReportInterface } from "@/components/report/bar-report";
import CallContracts, { CallContractsInterface } from "@/components/report/call-contracts";
import { MonthReport, MonthReportInterface } from "@/components/report/month-report";
import PieChartReport, { PieChartReportInterface } from "@/components/report/pie-report";
import ReportOverview, { ReportOverviewInterface } from "@/components/report/report-overview";
import SatisfactionReport, { SatisfactionReportInterface } from "@/components/report/satisfaction-report";
import TimeFilter from "@/components/report/time-filter";
import Breadcrumb from "@/components/shared/breadcrumb";
import Title from "@/components/shared/title";
import { useState } from "react";

export default function Report() {
  const {
    contracts,
    overviews,
    internationalBarChartData,
    insideBarChartData,
    callFollowupsReport,
    satisfactionReportData,
    monthReportData
  } = getData()
  const [activeTime, setActiveTime] = useState<any>("today")

  return (
    <main className="px-0">
      <div className="px-8">
        <Title label="گزارش" />

        <Breadcrumb
          list={[
            {
              label: "داشبورد",
              link: "/",
            },
            {
              label: "گزارش",
            },
          ]}
        />
      </div>

      <TimeFilter
        activeTime={activeTime}
        setActiveTime={setActiveTime}
        className="min-h-fit px-8"
      />

      <ReportOverview overviews={overviews} className="px-8" />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 px-8">
        <CallContracts contracts={contracts} />
        <MonthReport {...monthReportData} className="lg:col-span-2" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 px-8">
        <BarChartReport {...internationalBarChartData} />
        <BarChartReport {...insideBarChartData} />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 px-8">
        <PieChartReport {...callFollowupsReport} />
        <SatisfactionReport
          {...satisfactionReportData}
          className="lg:col-span-2"
        />
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

  const internationalBarChartData: BarChartReportInterface = {
    barData: {

      data: [
        {
          name: 'خارجی',
          data: [3.1, 1.7, 2, 3.1, 2.7, 4, 2.3],
        },
      ],
      categories: ['آمریکا', 'مکزیک', 'ترکیه', 'اسپانیا', 'چین', 'ایتالیا', 'فرانسه'],
      color: "#FFCD29",
      yaxisLabels: ["می", "جون", "جولای", "آگوست", "سپتامبر"]
    },
    subtitle: "پر بازدید ترین مقاصد خارجی",
    title: "خارجی"
  }

  const insideBarChartData: BarChartReportInterface = {
    barData: {
      data: [
        {
          name: 'داخلی',
          data: [3.1, 1.7, 2, 3.1, 2.7, 4, 2.3],
        },
      ],
      categories: ['کرمانشاه', 'رشت', 'ساری', 'تهران', 'شیراز', 'مشهد', 'اصفهان'],
      color: "#00AB55",
      yaxisLabels: ["خرداد", "تیر", "مرداد", "شهریور", "مهر"]
    },
    subtitle: "پر بازدید ترین مقاصد داخلی",
    title: "داخلی"
  }

  const callFollowupsReport: PieChartReportInterface = {
    title: "نتیجه پیگیری تماس ها",
    barData: {
      data: [46, 33, 21],
      labels: ["جواب دادند", "جواب ندادند", "امکان تماس نیست"],
      colors: ["#00AB55", "#D90808", "#FFCD29"]
    }
  }

  const satisfactionReportData: SatisfactionReportInterface = {
    title: "درصد رضایتمندی",
    total: 44666,
    successful: 37406,
  }

  const monthReportData: MonthReportInterface = {
    title: "گزارش بهمن",
    headers: [
      <div key="contract" className="flex flex-col items-start justify-start w-full text-right gap-0.5 p-1">
        <span className="font-bold">قرارداد</span>
        <span className="text-subtitle">176</span>
      </div>,
      <div key="contract" className="flex flex-col items-start justify-start w-full text-right gap-0.5 p-1">
        <span className="font-bold">نفرات</span>
        <span className="text-subtitle">399</span>
      </div>,
      <div key="contract" className="flex flex-col items-start justify-start w-full text-right gap-0.5 p-1">
        <span className="font-bold">سود</span>
        <span className="text-subtitle">6.060.712.388</span>
      </div>,
      <div key="contract" className="flex flex-col items-start justify-start w-full text-right gap-0.5 p-1">
        <span className="font-bold">جمع کل</span>
      </div>
    ],
    rows: [
      {
        contract: "76",
        members: "158",
        profit: "1.127.836.388",
        total: "تیکت"
      },
      {
        contract: "21",
        members: "27",
        profit: "102.324.500",
        total: "تیکت آنلاین"
      },
      {
        contract: "51",
        members: "123",
        profit: "7.131.806173",
        total: "تور خارجی"
      },
      {
        contract: "28",
        members: "91",
        profit: "802.406.242",
        total: "تور داخلی"
      },
      {
        contract: "0",
        members: "0",
        profit: "0",
        total: "Incoming"
      },
      {
        contract: "0",
        members: "0",
        profit: "0",
        total: "طبیعت گردی"
      }
    ]
  }

  return {
    overviews,
    contracts,
    internationalBarChartData,
    insideBarChartData,
    callFollowupsReport,
    satisfactionReportData,
    monthReportData
  }
}
