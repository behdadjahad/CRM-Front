import { Fragment, useState } from "react";
import Image from "next/image";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Checkbox } from "@/components/ui/checkbox";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { FaChevronUp } from "react-icons/fa";
import SettingEditForm from "../setting-edit-form";
import { createSettingEditFormFields, sliceMap } from "@/constants/setting";
import { useParams } from "next/navigation";
import { useSelector } from "react-redux";
export interface StationTableContainerInterface {
  tableHeaderLabels: string[];
  className?: string;
  onRemoveHandler: (id: number) => void;
  list: any[];
  cities: any[];
  countries: any[];
  airports: any[];
  accommodationTypes: any[];
  hotels: any[];
}

export default function SettingTableContainer({
  list,
  className,
  tableHeaderLabels,
  cities,
  countries,
  airports,
  onRemoveHandler,
  accommodationTypes,
  hotels,
}: StationTableContainerInterface) {
  const { service } = useParams();
  const [expandedRows, setExpandedRows] = useState<number[]>([]);
  const config = sliceMap[service as keyof typeof sliceMap];
  const editData = useSelector((state) => config?.selector(state).editData);
  const toggleRow = (index: number) => {
    setExpandedRows((prev) =>
      prev.includes(index) ? prev.filter((i) => i !== index) : [...prev, index]
    );
  };

  return (
    <div
      className={cn(
        " flex flex-col items-center justify-between h-full",
        className
      )}
    >
      <Table>
        <TableHeader>
          <TableRow className="bg-white sticky top-0 z-10  border-b border-gray-200">
            <TableHead className="text-center bg-white">
              {" "}
              <Checkbox
                onCheckedChange={() => {}}
                //checked={}
              />
              {""}
            </TableHead>
            {tableHeaderLabels.map((label, index) => (
              <TableHead
                key={index}
                className="text-center bg-white border-l border-gray-200 text-xs"
              >
                {label}
              </TableHead>
            ))}
            {/*  */}
          </TableRow>
        </TableHeader>
        <TableBody>
          {list?.map((item: any, index: number) => (
            <Fragment key={index}>
              <TableRow className="border-b border-gray-200" key={index}>
                <TableCell className="flex items-center justify-center">
                  {" "}
                  <Checkbox onCheckedChange={() => {}} />
                </TableCell>
                {tableHeaderLabels.map((label, labelIndex) => (
                  <TableCell key={labelIndex} className="text-center text-xs">
                    {item[label]}
                  </TableCell>
                ))}
                <TableCell
                  className="text-center"
                  onClick={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                  }}
                >
                  <Button
                    className="border-none p-0 text-[##212B36]"
                    onClick={() => {
                      onRemoveHandler(item.id);
                    }}
                  >
                    <Image
                      src="/icons/trash.png"
                      alt=""
                      width={1024}
                      height={1024}
                      className="w-5 h-5"
                      onClick={() => {}}
                    />
                  </Button>
                </TableCell>
                <TableCell
                  className="text-center"
                  onClick={(e) => {
                    toggleRow(index);
                    e.preventDefault();
                    e.stopPropagation();
                  }}
                >
                  <Button className="border-none p-0 text-[##212B36]">
                    {expandedRows.includes(index) ? (
                      <FaChevronUp />
                    ) : (
                      <Image
                        src="/icons/edit-primary.png"
                        alt=""
                        width={1024}
                        height={1024}
                        className="w-4 h-4"
                        onClick={() => {}}
                      />
                    )}{" "}
                  </Button>
                </TableCell>
              </TableRow>
              {expandedRows.includes(index) && (
                <TableRow className="bg-gray-100">
                  <TableCell
                    colSpan={tableHeaderLabels.length + 1}
                    className="p-4"
                  >
                    <div className="flex justify-between text-sm text-gray-700">
                      <SettingEditForm
                        editData={editData[index]}
                        countries={countries}
                        airports={airports}
                        accommodationTypes={accommodationTypes}
                        hotels={hotels}
                      />
                    </div>
                  </TableCell>
                </TableRow>
              )}
            </Fragment>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
