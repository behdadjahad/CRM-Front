"use client";

import { useEffect, useState } from "react";
import { Button } from "../ui/button";
import Image from "next/image";

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

  const exportPDF = async () => {
    await onGetData();
  };
  useEffect(() => {
    if (!loading && list?.length > 0) {
      generatePdf();
    }
  }, [list, loading]);
  const generatePdf = async () => {
    const blob = await pdf(
      <TablePDF headers={headerLabels} list={list} />
    ).toBlob();
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
