"use client";
import { CustomizePiChart } from "@/components/chart/customize-pi-chart";
import MultipleBarChart from "@/components/chart/multiple-bar-chart";
import PieChartWithLegend from "@/components/chart/pi-chart";
import TimeFilter from "@/components/report/time-filter";
import ContractReportTable from "@/components/section/contract-report-table";
import { ProgressBarContainer } from "@/components/section/progress-bar-container";
import AnimatedBarChart from "@/components/shared/animated-bar-chart";

import Breadcrumb from "@/components/shared/breadcrumb";
import ProgressBar from "@/components/shared/progress-bar";
import Title from "@/components/shared/title";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { useState } from "react";
import { PieChart } from "react-minimal-pie-chart";
import dynamic from "next/dynamic";
const GaugeComponent = dynamic(() => import("react-gauge-component"), {
  ssr: false,
});
export default function Report() {
  const [activeTime, setActiveTime] = useState<any>("today");
  const ProfitReportData = {
    list: [
      { month: "فروردین", profit: 750000000, loss: 600000000 },
      { month: "اردیبهشت", profit: 900000000, loss: 550000000 },
      { month: "خرداد", profit: 800000000, loss: 450000000 },
      { month: "تیر", profit: 650000000, loss: 700000000 },
      { month: "مرداد", profit: 500000000, loss: 400000000 },
      { month: "شهریور", profit: 750000000, loss: 350000000 },
    ],
    chartSeries: [
      { key: "profit", label: "سود", fill: "#89D89A" },
      { key: "loss", label: "زیان", fill: "#F64E60" },
    ],
  };

  const saleReportData = [
    {
      title: "(سود)",
      fill: "#6CCE81",
      info:"سود کل 6،607،249،800 تومان",
      list: [
        { label: "تورخارجی", value: 100 },
        { label: "هتل", value: 250 },
        { label: "ویزا", value: 300 },
        { label: "سایر", value: 350 },
        { label: "تورداخلی", value: 50 },
      ],
    },
    {
      title: "(نفرات)",
      fill: "#889BFD",
      info:"تعداد کل 399",
      list: [
        { label: "تورخارجی", value: 100 },
        { label: "هتل", value: 250 },
        { label: "ویزا", value: 300 },
        { label: "سایر", value: 350 },
        { label: "تورداخلی", value: 50 },
      ],
    },
    {
      title: "(قرارداد)",
      fill: "#F9CE86",
      info:"تعداد کل 176",
      list: [
        { label: "تورخارجی", value: 100 },
        { label: "هتل", value: 250 },
        { label: "ویزا", value: 300 },
        { label: "سایر", value: 350 },
        { label: "تورداخلی", value: 50 },
      ],
    },
  ];
  const contactData = [
    {
      title: "سایت",
      value: 16,
      color: "#6993FF",
    },
    {
      title: "گروه واتس اپ",
      value: 28,
      color: "#E94B5C",
    },

    {
      title: "دوستان",
      value: 5,
      color: "#FFDA44",
    },
    {
      title: "همکاران",
      value: 23,
      color: "#8CDAAA",
    },
    {
      title: "مسافران قدیمی",
      value: 32,
      color: "#A0AFFD",
    },
    {
      title: "پیامک",
      value: 18,
      color: "#FAD89E",
    },

    {
      title: "تبلیغات شهری",
      value: 16,
      color: "#E9EDF0",
    },
  ];
  const progressBarData = [
    {
      title: "درصد مراجعه ها",
      list: [
        {
          label: "مسافرجدید",
          value: 61,
          valueInPercent: 39,
          fill: "#0BB783",
        },
        {
          label: "مسافرقدیمی",
          value: 69,
          valueInPercent: 35,
          fill: "#F3A56E",
        },
        {
          label: "آژانس همکار",
          value: 46,
          valueInPercent: 26,
          fill: "#A0AFFD",
        },
      ],
    },
    {
      title: "نتیجه پیگیری تماس ها",
      list: [
        {
          label: "جواب دادند",
          value: 92,
          valueInPercent: 76,
          fill: "#0BB783",
        },
        {
          label: "جواب ندادند",
          value: 7,
          valueInPercent: 6,
          fill: "#F64E60",
        },
        {
          label: "براساس تاریخ امکان تماس نیست",
          value: 22,
          valueInPercent: 16,
          fill: "#FAD89E",
        },
      ],
    },
  ];
  const overalData = [
    {
      className: "bg-[#6CCE811A]",
      label: "سود",
      value: 72,
    },
    {
      className: "bg-[#F8C2681A]",
      label: "تعداد قرارداد",
      value: 93,
    },
    {
      className: "bg-[#BC29700F]",
      label: "تعداد مسافر",
      value: 28,
    },
    {
      className: "bg-[#70BCFD1A]",
      label: "فروش",
      value: 50,
    },
  ];
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
      <div className="flex px-6">
        {/* <TimeFilter
          activeTime={activeTime}
          setActiveTime={setActiveTime}
          className="min-h-fit"
        /> */}
        <Button
          type="button"
          variant={"foreground"}
          className="bg-quartiery-background text-tertiary-foreground"
          onClick={() => {}}
        >
          خروجی
        </Button>
      </div>
      <div className="grid grid-cols-4 gap-6 px-6">
        <div className="col-span-3 bg-card rounded-lg p-6 flex flex-row gap-4">
          {overalData.map((item: any) => (
            <div
              className={cn(
                "w-full rounded-md flex flex-col items-center justify-center",
                item.className
              )}
            >
              <div className="h-30 w-56">
                <GaugeComponent
                  id="gauge-component4"
                  type="semicircle"
                  arc={{
                    cornerRadius: 10,
                    width: 0.15,
                  padding: -0.5, 

                    subArcs: [
                      {
                        limit: 33, // up to 50%

                        color: "#E5AE21", // yellow
                        showTick: true,
                      },
                      {
                        limit: 66,
                        color: "#E65F2B", // green (from 50% to 100%)
                        showTick: true,
                      },
                      {
                        limit: 100,
                        color: "#1A932E", // green (from 50% to 100%)
                        showTick: true,
                      },
                    ],
                  }}
                  value={item.value}
                  pointer={{ type: "arrow", elastic: true ,  length: 1.2}}
                />
              </div>
              <div className="text-lf font-primary-bold">{item.label}</div>
              <div className="text-xs text-[#4079ED]">جزییات بیشتر</div>
            </div>
          ))}
        </div>
        <div className="col-span-1  flex flex-col bg-card rounded-lg p-6 gap-6">
          <div className="font-primary-bold">رضایتمندی ها</div>{" "}
          <CustomizePiChart
            data={[
              {
                title: "رضایت مندی",
                value: 48,
                color: "#8CDAAA",
              },
              {
                title: "نارضایتی",
                value: 26,
                color: "#F64E60",
              },
              {
                title: "نظری نداشتند",
                value: 32,
                color: "#F9CE86",
              },
            ]}
            labelFontSize="8px"
          />
        </div>
      </div>
      <div className="flex flex-row gap-4 px-6">
        {saleReportData.map((item, index) => (
          
          
          <AnimatedBarChart key={index} data={item.list} fill={item.fill} title={item.title} info={item.info} />
      
        ))}
      </div>

      <div className="grid grid-cols-12 gap-4 px-6">
        <div className="col-span-7">
          <div className="w-full bg-card p-6 rounded-lg flex flex-col gap-4">
            <div className="text-lg font-primary-bold">
              درصد قرارداد ها بر اساس تماس
            </div>
            <ContractReportTable
              tableHeaderLabels={["#", "عنوان", "تعداد"]}
              list={[
                {
                  "#": 1,
                  عنوان: "تعداد قراردادهای قابل تماس",
                  تعداد: 121,
                  value: 68,
                  indicatorClassName: "bg-[#6993FF]",
                  labelClassName:
                    "border border-[#6993FF] text-[#6993FF] bg-[#F0F9FF] w-12 h-6 rounded-md flex justify-center items-center",
                },
                {
                  "#": 2,
                  عنوان: "تعداد قرارداد های آژانس همکار",
                  تعداد: 46,
                  value: 25,
                  indicatorClassName: "bg-[#FF8F0D]",
                  labelClassName:
                    "border border-[#FFA800] text-[#FFA800] bg-[#FEF6E6] w-12 h-6 rounded-md flex justify-center items-center",
                },
                {
                  "#": 3,
                  عنوان: "توریست",
                  تعداد: 1,
                  value: 1,
                  indicatorClassName: "bg-[#A3B1FD]",
                  labelClassName:
                    "border border-[#8951FC] text-[#8951FC] bg-[#FBF1FF] w-12 h-6 rounded-md flex justify-center items-center",
                },
                {
                  "#": 4,
                  عنوان: "شماره ایران نیست",
                  تعداد: 5,
                  value: 3,
                  indicatorClassName: "bg-[#00AB9A]",
                  labelClassName:
                    "border border-[#00AB9A] text-[#00AB9A] bg-[##F0FDF4] w-12 h-6 rounded-md flex justify-center items-center",
                },
                {
                  "#": 5,
                  عنوان: "مسافران طلایی",
                  تعداد: 1,
                  value: 1,
                  indicatorClassName: "bg-[#F9CE86]",
                  labelClassName:
                    "border border-[#F9CE86] text-[#F9CE86] bg-[#FEF4E3] w-12 h-6 rounded-md flex justify-center items-center",
                },
                {
                  "#": 6,
                  عنوان: "تورکنسل شده",
                  تعداد: 1,
                  value: 1,
                  indicatorClassName: "bg-[#F64E60]",
                  labelClassName:
                    "border border-[#F64E60] text-[#F64E60] bg-[#FFF0F7] w-12 h-6 rounded-md flex justify-center items-center",
                },
              ]}
              className="w-full"
            />
          </div>
        </div>
        <div className="col-span-5 bg-card rounded-lg p-6">
          <div className="font-primary-bold text-lg">مقاصد خارجی</div>
        </div>
      </div>
      <div className="grid grid-cols-12 gap-4 px-6">
        <div className="col-span-5 flex flex-col bg-card rounded-lg p-6 gap-4">
          <div className="text-lg font-primary-bold">نحوه آشنایی</div>{" "}
          <CustomizePiChart
            data={contactData}
            className="flex flex-col gap-4 items-center justify-center h-48 mt-8"
            legendClassName="flex flex-row flex-wrap gap-2 items-center justify-between mt-8 grid grid-cols-4 w-full"
            labelFontSize="6px"
          />
        </div>
        <div className="col-span-7 bg-card rounded-lg p-6 flex flex-col gap-4">
          <div className="text-lg font-primary-bold">گزارش سود و زیان</div>
          <MultipleBarChart data={ProfitReportData} />
        </div>
      </div>
      <div className="grid grid-cols-2 px-6 gap-4">
        {progressBarData.map((item: any) => (
          <div
            key={item.title}
            className="col-span-1 bg-card rounded-lg p-6 flex flex-col gap-4"
          >
            <div className="font-semibold text-lg">{item.title}</div>
            <ProgressBarContainer data={item.list} />
          </div>
        ))}
      </div>
    </main>
  );
}
