"use client";

import { useEffect, useState } from "react";
import { Button } from "../ui/button";
import Image from "next/image";
import pdfMake from "pdfmake/build/pdfmake";
import { vfs as defaultVfs } from "pdfmake/build/vfs_fonts";
import { pdf } from "@react-pdf/renderer";
// import pdfMake from "@/lib/pdfmake-setup";
import IRANSansBase64 from "@/lib/IRANSansBase64";
import { TablePDF } from "../section/table-pdf";
export interface ExportDataContainerInterface {
  headerLabels: any[];
  list: any[];
  onGetData: any;
  loading: boolean;
}
export default function ExportDataContainer({
  headerLabels,
  list,
  onGetData,
  loading,
}: ExportDataContainerInterface) {
  const [showOptions, setShowOptions] = useState(false);
  useEffect(() => {
    pdfMake.vfs = {
      "IRANSans.ttf": IRANSansBase64,
    };

    // Register font
    pdfMake.fonts = {
      IRANSans: {
        normal: "IRANSans.ttf",
      },
    };
  }, []);

  // فقط روی متونی که فارسی هستن اعمال کن
  const fixRTLText = (text: string) => {
    if (!text) return text;
    const words = text.split(" ");
    if (words.length <= 1) return text;
    return words.join("‌"); // استفاده از ZWNJ (U+200C)
  };
  // useEffect(() => {
  // if (!loading && list.length > 0) {
  //   const reversedHeaders = [...headerLabels].reverse();
  //   const tableBody = [
  //     reversedHeaders.map((label) => ({
  //       text: fixRTLText(label),
  //       style: "tableHeader",
  //       alignment: "right",
  //       rtl: true,
  //       unbreakable: true,
  //     })),
  //     ...list.map((item) =>
  //       reversedHeaders.map((key) => ({
  //         text: item[key] ? fixRTLText(item[key].toString()) : "",
  //         alignment: "right",
  //         rtl: true,
  //         unbreakable: true,
  //       }))
  //     ),
  //   ];
  //   console.log(tableBody);
  //   const docDefinition = {
  //     content: [
  //       {
  //         table: {
  //           headerRows: 1,
  //           body: tableBody,
  //         },
  //         layout: "lightHorizontalLines",
  //       },
  //     ],
  //     defaultStyle: {
  //       font: "IRANSans",
  //       alignment: "right" as const,
  //     },
  //     pageDirection: "rtl",
  //   };
  //   pdfMake.createPdf(docDefinition).download("report.pdf");
  // }
  // Load template HTML
  // const res = await fetch("/template.html");
  // const rawHtml = await res.text();
  // // Convert headers and rows
  // const headers = headerLabels.map((h) => h.toString());
  // const rows = list.map((item) =>
  //   headerLabels.map((key) => item[key]?.toString() || "")
  // );
  // // Dynamic data for template
  // const logoBase64 = "data:image/png;base64,..."; // your logo here
  // const filledHtml = Mustache.render(rawHtml, {
  //   title: "گزارش فروش",
  //   logo: logoBase64,
  //   headers,
  //   rows,
  // });
  // // Convert HTML to pdfMake content
  // const content = htmlToPdfmake(filledHtml, {
  //   defaultStyles: { font: "IRANSans" },
  // });
  // // Build document
  // const docDefinition = {
  //   content,
  //   pageMargins: [40, 80, 40, 60] as [number, number, number, number],
  //   defaultStyle: {
  //     font: "IRANSans",
  //     fontSize: 10,
  //   },
  //   header: {
  //     text: "گزارش سیستم",
  //     alignment: "right",
  //     fontSize: 12,
  //     margin: [20, 20],
  //   },
  //   footer: (currentPage: number, pageCount: number) => ({
  //     text: `صفحه ${currentPage} از ${pageCount}`,
  //     alignment: "center",
  //     fontSize: 9,
  //     margin: [0, 10],
  //   }),
  //   pageDirection: "rtl",
  // };
  // pdfMake.createPdf(docDefinition).download("report.pdf");
  // }, [list, loading]);

  const exportPDF = async () => {
    await onGetData();
  };
  useEffect(() => {
    if (!loading && list.length > 0) {
      generatePdf();
    }
  }, [list, loading]);
  const generatePdf = async () => {
    const blob = await pdf(<TablePDF headers={headerLabels} list={list} />).toBlob();
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "report.pdf";
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div
      className="flex flex-row  gap-2"
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
            onClick={exportPDF}
          />
          <Image
            src={"/icons/excel.png"}
            alt={"تصویر"}
            width={107}
            height={107}
            className="h-4 w-4"
            onClick={() => {}}
          />
          <Image
            src={"/icons/print.png"}
            alt={"تصویر"}
            width={107}
            height={107}
            className="h-4 w-4"
            onClick={() => {}}
          />
        </Button>
      )}
    </div>
  );
}
