"use client";
import { CustomizePiChart } from "@/components/chart/customize-pi-chart";
import MultipleBarChart from "@/components/chart/multiple-bar-chart";
import { useReactToPrint } from "react-to-print";
import ContractReportTable from "@/components/section/contract-report-table";

import AnimatedBarChart from "@/components/shared/animated-bar-chart";
import Image from "next/image";
import Breadcrumb from "@/components/shared/breadcrumb";
import { pdf } from "@react-pdf/renderer";
import Title from "@/components/shared/title";
import { Button } from "@/components/ui/button";
import {
  cn,
  colors,
  formatPrice,
  getDateRange,
  getRandomColor,
  kpiType,
  subContracts,
} from "@/lib/utils";

import dynamic from "next/dynamic";
import { TimeFilterContainer } from "@/components/section/time-filter-container";

import { useMutation } from "@tanstack/react-query";
import { getReportData } from "@/api/report";
import { useEffect, useRef, useState } from "react";
import { exportMultipleSheets } from "@/lib/exportToExcel";
import { ReportPDF } from "@/components/section/report-pdf";
import { captureAllCharts } from "@/lib/pdf";
import { splitRangeBySolarMonths } from "@/lib/date";
import { usePageData } from "@/hooks/usePageData";
import { generateFeatureAccess } from "@/lib/generatePageData";
import { AccessDenied } from "@/components/shared/AccessDenied";

const GaugeComponent = dynamic(() => import("react-gauge-component"), {
  ssr: false,
});
const WorldMap = dynamic(() => import("@/components/section/world-map"), {
  ssr: false,
  loading: () => <p>Loading map...</p>,
});
const IranMap = dynamic(() => import("@/components/section/iran-map"), {
  ssr: false,
  loading: () => <p>Loading map...</p>,
});
export default function Report() {
  const pageFeatures = usePageData();


  const [isWorldActive, setIsWorldActive] = useState<boolean>(true);
  const [satisfactionData, setSatisafactionData] = useState<any[]>([]);
  const [salesReportData, setSaleReportData] = useState<any[]>([]);
  const [provinceData, setProvinceData] = useState<any[]>([]);
  const [countryData, setCountryData] = useState<any[]>([]);
  const [contactData, setContactData] = useState<any[]>([]);
  const [profitReportData, setProfitReportData] = useState<any>();
  const [overalData, setOveralData] = useState<any[]>([]);
  const [customerTypeData, setCustomerTypeData] = useState<any[]>([]);
  const [callReportData, setCallReportData] = useState<any[]>([]);

  const printRef = useRef<HTMLDivElement>(null);

  // const ProfitReportData = {
  //   list: [
  //     { month: "فروردین", profit: 750000000, loss: 600000000 },
  //     { month: "اردیبهشت", profit: 900000000, loss: 550000000 },
  //     { month: "خرداد", profit: 800000000, loss: 450000000 },
  //     { month: "تیر", profit: 650000000, loss: 700000000 },
  //     { month: "مرداد", profit: 500000000, loss: 400000000 },
  //     { month: "شهریور", profit: 750000000, loss: 350000000 },
  //   ],
  //   chartSeries: [
  //     { key: "profit", label: "سود", fill: "#89D89A" },
  //     { key: "loss", label: "زیان", fill: "#F64E60" },
  //   ],
  // };

  // const progressBarData = [
  //   {
  //     title: "درصد مراجعه ها",
  //     list: [
  //       {
  //         label: "مسافرجدید",
  //         value: 61,
  //         valueInPercent: 39,
  //         fill: "#0BB783",
  //       },
  //       {
  //         label: "مسافرقدیمی",
  //         value: 69,
  //         valueInPercent: 35,
  //         fill: "#F3A56E",
  //       },
  //       {
  //         label: "آژانس همکار",
  //         value: 46,
  //         valueInPercent: 26,
  //         fill: "#A0AFFD",
  //       },
  //     ],
  //   },
  //   {
  //     title: "نتیجه پیگیری تماس ها",
  //     list: [
  //       {
  //         label: "جواب دادند",
  //         value: 92,
  //         valueInPercent: 76,
  //         fill: "#0BB783",
  //       },
  //       {
  //         label: "جواب ندادند",
  //         value: 7,
  //         valueInPercent: 6,
  //         fill: "#F64E60",
  //       },
  //       {
  //         label: "براساس تاریخ امکان تماس نیست",
  //         value: 22,
  //         valueInPercent: 16,
  //         fill: "#FAD89E",
  //       },
  //     ],
  //   },
  // ];
  // const overalData = [
  //   {
  //     className: "bg-[#6CCE811A]",
  //     label: "سود",
  //     value: 72,

  //   },
  //   {
  //     className: "bg-[#F8C2681A]",
  //     label: "تعداد قرارداد",
  //     value: 93,
  //   },
  //   {
  //     className: "bg-[#BC29700F]",
  //     label: "تعداد مسافر",
  //     value: 28,
  //   },
  //   {
  //     className: "bg-[#70BCFD1A]",
  //     label: "فروش",
  //     value: 50,
  //   },
  // ];
  // const countryData = [
  //   { label: "India", value: 10 },
  //   { label: "Germany", value: 6 },
  //   { label: "Canada", value: 3 },
  // ];
  // const cityData = [
  //   { label: "تهران", value: 120 },
  //   { label: "مشهد", value: 95 },
  //   { label: "اصفهان", value: 80 },
  //   { label: "تبریز", value: 70 },
  //   { label: "شیراز", value: 65 },
  //   { label: "اهواز", value: 50 },
  //   { label: "کرمانشاه", value: 40 },
  //   { label: "قم", value: 35 },
  // ];
  const timeFilteringData = [
    {
      label: "ماهانه",
      value: 1,
    },
    {
      label: "3ماه",
      value: 3,
    },
    {
      label: "6ماه",
      value: 6,
    },
    {
      label: "9ماه",
      value: 9,
    },
    {
      label: "12 ماه",
      value: 12,
    },
  ];

  const { mutate: submitTimeFiltering, data: reportData } = useMutation({
    mutationFn: (data: any) => {
      return getReportData(data);
    },
    onSuccess: () => { },
  });

  useEffect(() => {
    if (reportData && reportData.data) {
      const satisfactionReport = reportData?.data?.satisfactionReport;
      const subContractsReport = reportData?.data?.subContractsReport?.stats;
      const subContractsOveralNo = reportData?.data?.subContractsReport;
      const provinceReport = reportData?.data?.provinceDistribution;
      const countryReport = reportData?.data?.countryDistribution;
      const contactReport = reportData?.data?.howIntroducedReport;
      const profitLossReport = reportData?.data?.contractsProfitReport;
      const overalReport = reportData?.data?.kpisReport;
      const customerTypeReport = reportData?.data?.customerType?.report;
      const callReport = reportData?.data?.callsReport;
      const provinces = provinceReport?.map((item: any) => ({
        label: item?.provinceName,
        value: item?.percentage,
      }));
      const countries = countryReport?.map((item: any) => ({
        label: item?.foreignName,
        fa_label: item?.countryName,
        value: item?.percentage,
      }));

      const satisafactionList = [
        {
          title: "رضایت مندی",
          value: satisfactionReport?.satisfiedPercentage,
          color: "#8CDAAA",
        },
        {
          title: "نارضایتی",
          value: satisfactionReport?.unsatisfiedPercentage,
          color: "#F64E60",
        },
        {
          title: "نظری نداشتند",
          value: satisfactionReport?.noSatisfactionPercentage,
          color: "#F9CE86",
        },
      ];
      const profitList = [];
      const customerList = [];
      const contractList = [];
      for (const key in subContractsReport) {
        const label = subContracts[key as keyof typeof subContracts];
        profitList.push({
          label: label,
          value: subContractsReport[key].profit < 0 ? 0 : subContractsReport[key].profit,
        });
        customerList.push({
          label: label,
          value: subContractsReport[key].noCustomers,
        });
        contractList.push({
          label: label,
          value: subContractsReport[key].noContracts,
        });
      }
      const subContractList = [
        {
          title: "(سود)",
          fill: "#6CCE81",
          info: `سود کل ${subContractsOveralNo?.overallProfit < 0 ? 0 : formatPrice(subContractsOveralNo?.overallProfit)} تومان`,

          list: profitList,
        },
        {
          title: "(نفرات)",
          fill: "#889BFD",
          info: `تعداد کل ${subContractsOveralNo?.overallNoCustomers}`,

          list: customerList,
        },
        {
          title: "(قرارداد)",
          fill: "#F9CE86",
          info: `تعداد کل ${subContractsOveralNo?.overallNoContracts}`,

          list: contractList,
        },
      ];
      const contactTypes = contactReport.report.map((item: any) => ({
        title: item.howIntroducedName,
        value: item.percentage,
        color: getRandomColor(colors),
      }));
      const profitLossList = {
        list: profitLossReport?.map((item: any) => ({
          month: item?.month,
          profit: item?.profit,
          loss: Math.abs(item?.loss),
        })),
        chartSeries: [
          { key: "profit", label: "سود", fill: "#89D89A" },
          { key: "loss", label: "زیان", fill: "#F64E60" },
        ],
      };
      const overalReportList = overalReport?.map((item: any) => ({
        className: "bg-[#6CCE811A]",
        label: kpiType[item.kpiType.name as keyof typeof kpiType],
        value: item.percentage,
        arcs: item.splits.map((item: any) => ({
          limit: item?.endPercent,
          color: item?.color,
          showTick: true,
        })),
      }));
      // const customerTypeList = customerTypeReport.map((item: any) => ({
      //   label: item.name ==="oldCustomer"?"مشتری قدیمی":item.name ==="newCustomer"?"مشتری جدید":item.name,
      //   value: 46,
      //   valueInPercent: 26,
      //   fill: "#A0AFFD",
      // }));
      // const callReportList = callReport.map((item: any) => ({
      //   label: "جواب دادند",
      //   value: 92,
      //   valueInPercent: 76,
      //   fill: "#0BB783",
      // }));
      setOveralData(overalReportList);
      setSatisafactionData(satisafactionList);
      setSaleReportData(subContractList);
      setProvinceData(provinces);
      setCountryData(countries);
      setContactData(contactTypes);
      setProfitReportData(profitLossList);
      // setCustomerTypeData(customerTypeList)
      // setCallReportData(callReportList)
    }
  }, [reportData]);
  function timeCheckHandler(value: number) {
    const timeRange = getDateRange(value);
    const rangeDatesArray = splitRangeBySolarMonths(
      timeRange.startDate,
      timeRange.endDate
    );
    const rangeDates = rangeDatesArray?.map((item: any) => ({
      month: item.name,
      date: item.start,
    }));
    submitTimeFiltering({
      beginRangeDateTime: timeRange.startDate,
      endRangeDateTime: timeRange.endDate.replace("00:00:00Z", "23:59:59Z"),
      rangeDates: rangeDates,
    });
  }
  useEffect(() => {
    // submitTimeFiltering({
    //   beginRangeDateTime: "",
    //   endRangeDateTime: "",
    //   rangeDates: [],
    // });
    timeCheckHandler(6);
  }, []);

  const handlePrint = useReactToPrint({
    content: () => {
      const element = printRef.current;
      if (!element) return null;

      // Temporarily expand styles before printing
      const originalHeight = element.style.height;
      const originalOverflow = element.style.overflow;
      element.style.height = element.scrollHeight + "px";
      element.style.overflow = "visible";

      // Cleanup after print
      setTimeout(() => {
        element.style.height = originalHeight;
        element.style.overflow = originalOverflow;
      }, 500); // allow time for printing

      return element;
    },
    documentTitle: "My Document",
  });

  // const exportPDF = async () => {
  //   const element = document.getElementById("export-container");
  //   if (!element) return;

  //   // Expand element to full height
  //   const originalHeight = element.style.height;
  //   const originalOverflow = element.style.overflow;
  //   element.style.height = element.scrollHeight + "px";
  //   element.style.overflow = "visible";

  //   window.scrollTo(0, 0);
  //   await new Promise((resolve) => setTimeout(resolve, 500));

  //   const canvas = await html2canvas(element, {
  //     useCORS: true,
  //     scrollY: -window.scrollY,
  //     windowWidth: element.scrollWidth,
  //     windowHeight: element.scrollHeight,
  //   });

  //   const imgData = canvas.toDataURL("image/png");
  //   const pdf = new jsPDF("p", "mm", "a4");

  //   const pdfWidth = pdf.internal.pageSize.getWidth();
  //   const pdfHeight = pdf.internal.pageSize.getHeight();

  //   const imgWidth = pdfWidth;
  //   const imgHeight = (canvas.height * imgWidth) / canvas.width;

  //   const pageHeightInPixels = (canvas.width * pdfHeight) / pdfWidth;
  //   let position = 0;

  //   while (position < canvas.height) {
  //     const pageCanvas = document.createElement("canvas");
  //     const pageContext = pageCanvas.getContext("2d")!;
  //     pageCanvas.width = canvas.width;
  //     pageCanvas.height = Math.min(
  //       pageHeightInPixels,
  //       canvas.height - position
  //     );

  //     pageContext.drawImage(
  //       canvas,
  //       0,
  //       position,
  //       canvas.width,
  //       pageCanvas.height,
  //       0,
  //       0,
  //       canvas.width,
  //       pageCanvas.height
  //     );

  //     const pageData = pageCanvas.toDataURL("image/png");
  //     if (position > 0) pdf.addPage();
  //     pdf.addImage(
  //       pageData,
  //       "PNG",
  //       0,
  //       0,
  //       imgWidth,
  //       (pageCanvas.height * imgWidth) / canvas.width
  //     );

  //     position += pageHeightInPixels;
  //   }

  //   pdf.save("export.pdf");

  //   // Restore original styles
  //   element.style.height = originalHeight;
  //   element.style.overflow = originalOverflow;
  // };

  const handleExport = () => {
    exportMultipleSheets([
      {
        sheetName: "رضایت مندی",
        data: satisfactionData.map((item) => ({
          عنوان: item.title,
          "درصد افراد": item.value,
        })),
      },
      {
        sheetName: "میزان سود فروش",
        data: salesReportData?.[0]?.list.map((item: any) => ({
          سرویس: item?.label,
          "میزان سود": item?.value,
        })),
      },
      {
        sheetName: "تعداد نفرات فروش",
        data: salesReportData?.[1]?.list.map((item: any) => ({
          سرویس: item?.label,
          "تعداد نفرات": item?.value,
        })),
      },
      {
        sheetName: "تعداد قرارداد فروش",
        data: salesReportData?.[2]?.list.map((item: any) => ({
          سرویس: item?.label,
          "تعداد قرارداد": item?.value,
        })),
      },
      {
        sheetName: "نحوه آشنایی با مجموعه ",
        data: contactData.map((item: any) => ({
          " نحوه آشنایی": item?.title,
          درصدافراد: item?.value,
        })),
      },
    ]);
  };
  const [showOptions, setShowOptions] = useState(false);

  const handleClick = async () => {
    const chartImages = await captureAllCharts();
    const blob = await pdf(<ReportPDF chartImages={chartImages} />).toBlob();

    // Download manually
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "report.pdf";
    a.click();
    URL.revokeObjectURL(url);
  };
  return (
    <main className="px-0" id="export-container" ref={printRef}>
      <div className="w-full flex items-end justify-between px-8">
        {" "}
        <div className="">
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
        <div
          className="flex flex-row xl:hidden gap-2"
          onMouseEnter={() => setShowOptions(true)}
          onMouseLeave={() => setShowOptions(false)}
        >
          {" "}
          {!showOptions && (
            <Button
              type="button"
              variant={"info"}
              className="bg-quartiery-background text-tertiary-foreground"
            >
              <span>خروجی</span>
              <Image
                src={"/icons/dark-download.png"}
                alt={"تصویر"}
                width={107}
                height={107}
                className="h-4 w-4"
              />
            </Button>
          )}
          {showOptions && (
            <Button type="button" variant={"foreground"} className="">
              <Image
                src={"/icons/pdf.png"}
                alt={"تصویر"}
                width={107}
                height={107}
                className="h-4 w-4"
                onClick={handleClick}
              />
              <Image
                src={"/icons/excel.png"}
                alt={"تصویر"}
                width={107}
                height={107}
                className="h-4 w-4"
                onClick={handleExport}
              />
              <Image
                src={"/icons/print.png"}
                alt={"تصویر"}
                width={107}
                height={107}
                className="h-4 w-4"
                onClick={handlePrint}
              />
            </Button>
          )}
        </div>
      </div>

      <div className="flex px-6 flex-row items-center justify-between">
        <TimeFilterContainer
          listItem={timeFilteringData}
          onCheckTimeFilter={(value: number) => {
            timeCheckHandler(value);
          }}
          onDateFilterSubmit={(data: any) => {
            const rangeDatesArray = splitRangeBySolarMonths(
              data.startDate,
              data.endDate
            );
            const rangeDates = rangeDatesArray?.map((item: any) => ({
              month: item.name,
              date: item.start,
            }));
            submitTimeFiltering({
              beginRangeDateTime: data.startDate,
              endRangeDateTime: data.endDate.replace("00:00:00Z", "23:59:59Z"),
              rangeDates: rangeDates,
            });
          }}
        />
        <div
          className="hidden xl:flex xl:flex-row gap-2"
          onMouseEnter={() => setShowOptions(true)}
          onMouseLeave={() => setShowOptions(false)}
        >
          {" "}
          {(
            <>

              {generateFeatureAccess(pageFeatures, "export-reports")?.show && generateFeatureAccess(pageFeatures, "export-reports")?.enable && (<>
                {!showOptions && (<Button
                  type="button"
                  variant={"info"}
                  className="bg-quartiery-background text-tertiary-foreground"
                >
                  <span>خروجی</span>
                  <Image
                    src={"/icons/dark-download.png"}
                    alt={"تصویر"}
                    width={107}
                    height={107}
                    className="h-4 w-4"
                  />
                </Button>)}

                {showOptions && (
                  <Button type="button" variant={"foreground"} className="">
                    <Image
                      src={"/icons/pdf.png"}
                      alt={"تصویر"}
                      width={107}
                      height={107}
                      className="h-4 w-4"
                      onClick={handleClick}
                    />
                    <Image
                      src={"/icons/excel.png"}
                      alt={"تصویر"}
                      width={107}
                      height={107}
                      className="h-4 w-4"
                      onClick={handleExport}
                    />
                    <Image
                      src={"/icons/print.png"}
                      alt={"تصویر"}
                      width={107}
                      height={107}
                      className="h-4 w-4"
                      onClick={handlePrint}
                    />
                  </Button>
                )}
              </>
              )}

              {generateFeatureAccess(pageFeatures
                , "export-reports")?.show && !generateFeatureAccess(pageFeatures
                  , "export-reports")?.enable && (
                  <AccessDenied variant={"foreground"}
                    title="خروجی "
                    message="امکان دسترسی به این قابلیت وجود ندارد "
                    icon={(<Image
                      src={"/icons/disable-download.png"}
                      alt="edit"
                      width={24}
                      height={24}
                    />)} />
                )


              }
            </>

          )}

         
        </div>
      </div>
      <div
        className="flex flex-col xl:grid xl:grid-cols-4 gap-2 xl:gap-6 px-6"
        id="gauge-chart"
      >
        <div className="grid grid-cols-2 xl:col-span-3 bg-card rounded-lg p-6 xl:flex flex-row gap-4">
          {overalData?.map((item: any) => (
            <div
              className={cn(
                "w-full rounded-md flex flex-col items-center justify-center",
                item.className
              )}
              key={`${item.label}-gauge`}
            >
              <div className="h-30 w-48">
                <GaugeComponent
                  id="gauge-component4"
                  type="semicircle"
                  arc={{
                    cornerRadius: 10,
                    width: 0.15,
                    padding: -2,
                    subArcs: item.arcs,
                    // subArcs: [
                    //   {
                    //     limit: 33, // up to 50%

                    //     color: "#E5AE21", // yellow
                    //     showTick: true,
                    //   },
                    //   {
                    //     limit: 66,
                    //     color: "#E65F2B", // green (from 50% to 100%)
                    //     showTick: true,
                    //   },
                    //   {
                    //     limit: 100,
                    //     color: "#1A932E", // green (from 50% to 100%)
                    //     showTick: true,
                    //   },
                    // ],
                  }}
                  value={item.value}
                  // valueLabel={{
                  //   style: {
                  //     fill: "black", // This controls the text color
                  //     fontSize: 20,
                  //   },
                  //   formatTextValue: (value:string) => `${value}%`,
                  // }}
                  className="custom-guage"
                  pointer={{ type: "arrow", elastic: true, length: 1.2 }}
                />
              </div>
              <div className="text-lg font-primary-bold">{item.label}</div>
              <div className="text-xs text-[#4079ED]">جزییات بیشتر</div>
            </div>
          ))}
        </div>
        <div className="col-span-1  flex flex-col bg-card rounded-lg p-6 gap-6">
          <div className="font-primary-bold">رضایتمندی ها</div>{" "}
          <CustomizePiChart data={satisfactionData} labelFontSize="8px" />
        </div>
      </div>
      <div
        className="flex flex-col xl:flex-row gap-4 px-6 "
        id="sale-bar-chart"
      >
        {salesReportData.map((item, index) => (
          <AnimatedBarChart
            key={index}
            data={item.list}
            fill={item.fill}
            title={item.title}
            info={item.info}
          />
        ))}
      </div>

      <div className="flex flex-col xl:grid xl:grid-cols-12 gap-4 px-6">
        <div className="col-span-7 " id="report-table">
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
        <div className="col-span-5 bg-card rounded-lg p-6 flex flex-col gap-4 min-h-[480px]">
          <div className="flex flex-row justify-between">
            <div className="font-primary-bold text-lg">مقاصد خارجی</div>
            <div className="flex flex-row gap-2">
              <Button
                variant={isWorldActive ? "foreground" : "info"}
                onClick={() => setIsWorldActive(false)}
                className="p-2"
              >
                <Image
                  width={1024}
                  height={1024}
                  src="/icons/iran.png"
                  alt="Iran"
                  className="w-6 h-5"
                />
              </Button>
              <Button
                variant={isWorldActive ? "info" : "foreground"}
                onClick={() => setIsWorldActive(true)}
                className="p-2"
              >
                <Image
                  width={1024}
                  height={1024}
                  src="/icons/world.png"
                  alt="Iran"
                  className="w-8 h-5"
                />
              </Button>
            </div>
          </div>
          <div className="w-full  h-full" id="leaflet-map">
            {" "}
            {isWorldActive ? (
              <WorldMap countryData={countryData} />
            ) : (
              <IranMap cityData={provinceData} />
            )}
          </div>
        </div>
      </div>
      <div className="flex flex-col xl:grid xl:grid-cols-12 gap-4 px-6">
        <div className="col-span-5 flex flex-col bg-card rounded-lg p-6 gap-4">
          <div className="text-lg font-primary-bold">نحوه آشنایی</div>{" "}
          <CustomizePiChart
            data={contactData}
            className="flex flex-col gap-4 items-center justify-center  mt-8"
            legendClassName="flex flex-row flex-wrap gap-2 items-center justify-between mt-8 grid grid-cols-4 w-full"
            labelFontSize="6px"
          />
        </div>
        <div
          className="col-span-7 bg-card rounded-lg p-6 flex flex-col gap-4"
          id="multiple-bar-chart"
        >
          <div className="text-lg font-primary-bold">گزارش سود و زیان</div>
          <MultipleBarChart data={profitReportData} />
        </div>
      </div>
      <div
        className="flex flex-col xl:grid xl:grid-cols-2 px-6 gap-4"
        id="progress-bar"
      >
        {/* {progressBarData.map((item: any, index: number) => (
          <div
            key={item.title}
            className="col-span-1 bg-card rounded-lg p-6 flex flex-col gap-4"
            id={`progress-bar-${index}`}
          >
            <div className="font-semibold text-lg">{item.title}</div>
            <ProgressBarContainer data={item.list} />
          </div>
        ))} */}
        {/* <div className="col-span-1 bg-card rounded-lg p-6 flex flex-col gap-4">
          <div className="font-semibold text-lg">درصد مراجعه ها</div>
          <ProgressBarContainer
            data={customerTypeData}
          />
        </div>
        <div className="col-span-1 bg-card rounded-lg p-6 flex flex-col gap-4">
          <div className="font-semibold text-lg">نتیجه پیگیری تماس ها</div>
          <ProgressBarContainer
            data={callReportData}
          />
        </div> */}
      </div>
    </main>
  );
}
