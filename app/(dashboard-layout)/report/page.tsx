"use client";
import TimeFilter from "@/components/report/time-filter";
import ContractReportTable from "@/components/section/contract-report-table";
import AnimatedBarChart from "@/components/shared/animated-bar-chart";

import Breadcrumb from "@/components/shared/breadcrumb";
import Title from "@/components/shared/title";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { PieChart } from "react-minimal-pie-chart";
export default function Report() {
  const [activeTime, setActiveTime] = useState<any>("today");
  const totalContracts = 120;
  const satisfaction = 80;
  const unsatisfaction = 40;
  const saleReportData = [
    {
      title: "گزارش کلی فروش(سود)",
      fill: "#6CCE81",
      list: [
        { label: "تورخارجی", value: 100 },
        { label: "هتل", value: 250 },
        { label: "ویزا", value: 300 },
        { label: "سایر", value: 350 },
        { label: "تورداخلی", value: 50 },
      ],
    },
    {
      title: "گزارش کلی فروش (نفرات)",
      fill: "#889BFD",
      list: [
        { label: "تورخارجی", value: 100 },
        { label: "هتل", value: 250 },
        { label: "ویزا", value: 300 },
        { label: "سایر", value: 350 },
        { label: "تورداخلی", value: 50 },
      ],
    },
    {
      title: "گزارش کلی فروش (قرارداد)",
      fill: "#F9CE86",
      list: [
        { label: "تورخارجی", value: 100 },
        { label: "هتل", value: 250 },
        { label: "ویزا", value: 300 },
        { label: "سایر", value: 350 },
        { label: "تورداخلی", value: 50 },
      ],
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
        <TimeFilter
          activeTime={activeTime}
          setActiveTime={setActiveTime}
          className="min-h-fit"
        />
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
        <div className="col-span-3 bg-card rounded-lg">Range</div>
        <div className="col-span-1  flex flex-col bg-card rounded-lg w-full p-6 gap-4">
          <h2>رضایتمندی ها</h2>
          <div className="relative h-36 w-full flex  items-center justify-between">
            {" "}
            <PieChart
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
              lineWidth={50}
              animate
              label={({ dataEntry }) => `${dataEntry.value}%`}
              labelStyle={{
                fontSize: "8px",
                fontWeight: "400",
                fill: "#000", // label color
              }}
              labelPosition={75}
            />
            <div className="flex flex-col gap-2 text-sm">
              {[
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
              ].map((item, index) => (
                <div key={index} className="flex items-center gap-2 text-xs">
                  <div
                    className="w-4 h-4 rounded-sm"
                    style={{ backgroundColor: item.color }}
                  />
                  <span>{item.title}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
      <div className="flex flex-row gap-4 px-6">
        {saleReportData.map((item, index) => (
          <AnimatedBarChart key={index} data={item.list} fill={item.fill} />
        ))}
      </div>

      <div className="grid grid-cols-12 gap-4 px-6">
        <div className="col-span-7">
          <div className="w-full bg-card p-6 rounded-lg">
            <div>درصد قرارداد ها بر اساس تماس</div>
            <ContractReportTable
              tableHeaderLabels={["#", "عنوان", "تعداد"]}
              list={[
                {
                  "#": 1,
                  عنوان: "تعداد قراردادهای قابل تماس",
                  تعداد: 121,
                  value: 40,
                  indicatorClassName: "bg-red-400",
                },
                {
                  "#": 2,
                  عنوان: "تعداد قراردادهای قابل تماس",
                  تعداد: 121,
                  value: 40,
                  indicatorClassName: "bg-red-400",
                },
              ]}
              className="w-full"
            />
          </div>
        </div>
        <div className="col-span-5 bg-card rounded-lg p-6">Box 2</div>
      </div>
    </main>
  );
}
