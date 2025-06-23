"use client";

import { useEffect, useState } from "react";
import { Button } from "../ui/button";
import Image from "next/image";

import { pdf } from "@react-pdf/renderer";
// import pdfMake from "@/lib/pdfmake-setup";
import IRANSansBase64 from "@/lib/IRANSansBase64";
import { TablePDF } from "../section/table-pdf";
import { useSelector } from "react-redux";
import { sliceMap } from "@/constants/setting";
import { useParams } from "next/navigation";
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
  const [isChoosenExportData, setIsChoosenExportData] = useState(true);
  const config = sliceMap[service as keyof typeof sliceMap];
  const checkedItems = useSelector(
    (state) => config?.selector(state).checkedItems
  );
  console.log("checkedItems",checkedItems)
  const exportPDF = async () => {
    if (checkedItems?.length > 0) {
      await generatePdf(checkedItems);
    } else {
      setIsChoosenExportData(false);
      await onGetData();
    }
  };
  useEffect(() => {
    if (!loading && list?.length > 0 && !isChoosenExportData) {
      generatePdf(list);
    }
  }, [list, loading]);
  const generatePdf = async (listItems: any[]) => {
    console.log("pdf list",listItems)
    const blob = await pdf(
      <TablePDF headers={headerLabels} list={listItems} />
    ).toBlob();
    console.log("52 line")
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
