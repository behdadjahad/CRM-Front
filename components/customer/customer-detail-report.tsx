import {
  buildStyles,
  CircularProgressbarWithChildren,
} from "react-circular-progressbar";
import Image from "next/image";
import CustomerSatisfactionReport from "./customer-satisfaction-report";
import MultipleBarChart from "../shared/multiple-bar-chart";
import CustomerReportInfoCard from "./customer-report-info-card";
export interface CustomerReportInterface {
  serviceData: {
    label: string;
    value: number;
    valueInPercent: number;
    chartFillColor: string;
    chartPathColor: string;
    icon: string;
    iconClassName: string;
  }[];
}
const satisfactionReportData = [
  {
    title: "علت نارضایتی",
    indicatorClassName: "bg-negative",
    list: [
      {
        label: "کثیف بودن اقامتگاه",
        value: 74,
      },
      {
        label: "رفتار نامحترم",
        value: 36,
      },
      {
        label: "عدم پیگیری",
        value: 52,
      },
    ],
  },
  {
    title: "علت رضایتمندی",
    indicatorClassName: "bg-success-active",

    list: [
      {
        label: "رفتارمحترمانه",
        value: 90,
      },
      {
        label: "قیمت مناسب",
        value: 52,
      },
      {
        label: "پیگیری",
        value: 74,
      },
    ],
  },
];
const data = [
  { month: "فروردین", تورداخلی: 30, تورخارجی: 20 },
  { month: "اردیبهشت", تورداخلی: 20, تورخارجی: 25 },
  { month: "خرداد", تورداخلی: 27, تورخارجی: 18 },
  { month: "تیر", تورداخلی: 23, تورخارجی: 22 },
  { month: "مرداد", تورداخلی: 34, تورخارجی: 28 },
  // More months here
];
const CustomerReportInfoData = [
  {
    label: "تعداد قراردادها",
    value: 207,
    icon: "/icons/contract.png",
    backgroundColor: "bg-[#FEC53D]",
  },
  {
    label: "تعداد قراردادها",
    value: 207,
    icon: "/icons/contract.png",
    backgroundColor: "bg-[#FEC53D]",
  },
  {
    label: "تعداد قراردادها",
    value: 207,
    icon: "/icons/contract.png",
    backgroundColor: "bg-[#FEC53D]",
  },
  {
    label: "تعداد قراردادها",
    value: 207,
    icon: "/icons/contract.png",
    backgroundColor: "bg-[#FEC53D]",
  },
];
const CustomerReportExpenseData = [
  {
    label: "هزینه",
    value: "135،490،000 تومان",
    icon: "/icons/contract.png",
    backgroundColor: "bg-[#FEC53D]",
  },
  {
    label: "هزینه",
    value: "135،490،000 تومان",
    icon: "/icons/contract.png",
    backgroundColor: "bg-[#FEC53D]",
  },
  {
    label: "هزینه",
    value: "135،490،000 تومان",
    icon: "/icons/contract.png",
    backgroundColor: "bg-[#FEC53D]",
  },
];
export default function CustomerDetailReport({
  serviceData,
}: CustomerReportInterface) {
  return (
    <div className="flex flex-col gap-4 mt-4">
      <div className="flex flex-col md:grid md:grid-cols-4 gap-4">
        <div className="grid grid-cols-2 md:col-span-1 md:flex md:flex-col gap-2 md:gap-4 justify-between">
          {CustomerReportInfoData.map((item) => (
            <CustomerReportInfoCard key={item.label} {...item} />
          ))}
        </div>

        <div className="flex flex-col md:col-span-3">
          <div className="flex flex-col gap-4 w-full h-full">
            <div className="flex flex-col md:flex-row gap-4 w-full">
              {" "}
              {CustomerReportExpenseData.map((item) => (
                <CustomerReportInfoCard key={item.label} {...item} />
              ))}
            </div>
            <div className="rounded-lg p-6 bg-card h-full flex flex-col justify-between">
              <div className="font-bold text-lg">سفرهای انجام‌ شده</div>{" "}
              <MultipleBarChart data={data} />
            </div>
          </div>
        </div>
      </div>

      <CustomerSatisfactionReport data={satisfactionReportData} />
      <div className="w-full bg-card p-8 rounded-lg">
        {/* <div className="flex justify-between items-center flex-wrap"> */}
        <div className="w-full grid grid-cols-2 md:flex md:justify-between gap-4">
          {serviceData.map((item) => (
            <div key={item.label} className="flex flex-row gap-2">
              <div className="w-15 h-15">
                <CircularProgressbarWithChildren
                  value={item.valueInPercent}
                  styles={buildStyles({
                    pathColor: item.chartFillColor,
                    trailColor: item.chartPathColor,
                  })}
                >
                  <Image
                    src={item.icon}
                    alt={"تصویر"}
                    width={107}
                    height={107}
                    className={item.iconClassName}
                  />
           
                </CircularProgressbarWithChildren>
              </div>
              <div className="flex flex-col gap-2">
                <span className="text-foreground-mute">{item.label}</span>
                <div className="flex gap-2">
                  <span className="text-foreground">{`(${item.valueInPercent}%)`}</span>
                  <span className="text-foreground font-bold">
                    {item.value}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
