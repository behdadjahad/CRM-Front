"use client";

import { useEffect, useState } from "react";
import { Button } from "../ui/button";
import Image from "next/image";

import { pdf, Font } from "@react-pdf/renderer";
// import pdfMake from "@/lib/pdfmake-setup";

import { TablePDF } from "../section/table-pdf";

import { getTitleFromSlug } from "@/constants/setting";
import { useParams } from "next/navigation";
import { exportMultipleSheets } from "@/lib/exportToExcel";
export interface ExportDataContainerInterface {
  headerLabels: any[];
  list: any[];
  onGetData: any;
  loading: boolean;
  checkedItems: any[];
  dateTimeRange?: any;
}
export default function ExportDataContainer({
  headerLabels,
  list,
  onGetData,
  dateTimeRange,

  checkedItems,
}: ExportDataContainerInterface) {
  const { service } = useParams();
  const [showOptions, setShowOptions] = useState(false);
  const [exportOutput, setExportOutput] = useState<string>("");
  const [isFetchedData, setIsFetchedData] = useState(false);

  async function Generate(listItems: any[], exporttype: string) {
    switch (exporttype) {
      case "pdf":
        await generatePdf(listItems);
        break;
      case "excel":
        const updatedList = listItems.map(({ id, ...rest }) => rest);
        exportMultipleSheets([{ sheetName: "", data: updatedList }]);
        break;
      case "print":
        Print(listItems);
        break;
      default:
        return;
    }
  }
  useEffect(() => {
    if (list?.length > 0 && isFetchedData) {
      Generate(list, exportOutput);
    }
  }, [list, exportOutput]);

  const generatePdf = async (listItems: any[]) => {
    const blob = await pdf(
      <TablePDF
        headers={headerLabels}
        list={listItems}
        title={getTitleFromSlug(service) ?? ""}
        dateTimeRange={dateTimeRange}
      />
    ).toBlob();

    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "report.pdf";
    a.click();
    URL.revokeObjectURL(url);
  };
  const Print = async (listItems: any[]) => {
    const blob = await pdf(
      <TablePDF
        headers={headerLabels}
        list={listItems}
        title={getTitleFromSlug(service) ?? ""}
        dateTimeRange={dateTimeRange}
      />
    ).toBlob();

    const url = URL.createObjectURL(blob);

    const iframe = document.createElement("iframe");
    iframe.style.position = "fixed";
    iframe.style.right = "0";
    iframe.style.bottom = "0";
    iframe.style.width = "0";
    iframe.style.height = "0";
    iframe.style.border = "none";
    iframe.src = url;

    document.body.appendChild(iframe);

    iframe.onload = () => {
      const iframeWindow = iframe.contentWindow;

      if (!iframeWindow) {
        return;
      }

      // Listen for afterprint event to clean up
      iframeWindow.onafterprint = () => {
        document.body.removeChild(iframe);
        URL.revokeObjectURL(url);
      };

      iframeWindow.focus();
      iframeWindow.print();
    };
  };

  const exportData = async (exportType: string) => {
    setExportOutput(exportType);
    await registerFont();
    if (checkedItems?.length > 0) {
      setIsFetchedData(false);
      const orderedCheckedItems = checkedItems.map(
        (item: any, index: number) => ({
          ...item,
          ردیف: index + 1,
        })
      );
      Generate(orderedCheckedItems, exportType);
    } else if (list?.length > 0) {
      setIsFetchedData(false);
      Generate(list, exportType);
    } else {
      setIsFetchedData(true);
      await onGetData();
    }
  };
  async function registerFont() {
    Font.register({
      family: "IRANSans",
      src: "/fonts/IRANSans(FaNum).ttf",
    });
  }
  return (
    <div
      className="flex flex-row  gap-2"
      onMouseEnter={() => setShowOptions(true)}
      onMouseLeave={() => setShowOptions(false)}
    >
      {" "}
      {!showOptions && (
        <Button type="button" variant={"info"}>
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
            onClick={() => {
              exportData("pdf");
            }}
          />
          <Image
            src={"/icons/excel.png"}
            alt={"تصویر"}
            width={107}
            height={107}
            className="h-4 w-4"
            onClick={() => {
              exportData("excel");
            }}
          />
          <Image
            src={"/icons/print.png"}
            alt={"تصویر"}
            width={107}
            height={107}
            className="h-4 w-4"
            onClick={() => {
              exportData("print");
            }}
          />
        </Button>
      )}
    </div>
  );
}
