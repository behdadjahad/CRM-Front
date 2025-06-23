"use client";

import { useEffect, useState } from "react";
import { Button } from "../ui/button";
import Image from "next/image";
import { useReactToPrint } from "react-to-print";
import { pdf } from "@react-pdf/renderer";
// import pdfMake from "@/lib/pdfmake-setup";

import { TablePDF } from "../section/table-pdf";
import { useSelector } from "react-redux";
import { sliceMap } from "@/constants/setting";
import { useParams } from "next/navigation";
import { exportMultipleSheets } from "@/lib/exportToExcel";
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
  const { service } = useParams();
  const [showOptions, setShowOptions] = useState(false);
  const [exporttype, setExport] = useState<string>("");
  const [isChoosenExportData, setIsChoosenExportData] = useState(true);
  const config = sliceMap[service as keyof typeof sliceMap];
  const checkedItems = useSelector(
    (state) => config?.selector(state).checkedItems
  );

  useEffect(() => {
    if (!loading && list?.length > 0 && !isChoosenExportData) {
      switch (exporttype) {
        case "pdf":
          generatePdf(list);
          break;
        case "excel":
          const updatedList = list.map(({ id, ...rest }) => rest);
          exportMultipleSheets([{ sheetName: "", data: updatedList }]);
          break;
        case "print":
          Print(list);
          break;
        default:
          return;
      }
    }
  }, [list, loading, exporttype]);
  const generatePdf = async (listItems: any[]) => {
    const blob = await pdf(
      <TablePDF headers={headerLabels} list={listItems} />
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
      <TablePDF headers={headerLabels} list={listItems} />
    ).toBlob();

    const url = URL.createObjectURL(blob);

    // Create a hidden iframe
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
    setExport(exportType);
    console.log("Export type:", exportType);

    if (checkedItems?.length > 0) {
      switch (exportType) {
        case "pdf":
          await generatePdf(checkedItems);
          break;

        case "excel":
          const updatedCheckedItems = checkedItems.map(
            ({ id, ...rest }:any) => rest
          );
          await exportMultipleSheets([
            { sheetName: "", data: updatedCheckedItems },
          ]);
          break;

        case "print":
          await Print(checkedItems);
          break;

        default:
          
          break;
      }
    } else {
      setIsChoosenExportData(false);
      await onGetData();
    }
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
