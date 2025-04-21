import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "../ui/button";
import { Fragment, useState } from "react";
import React from "react";

export default function CustomerTableContainer({
  tableHeaderLabels,
  customers,
}: {
    tableHeaderLabels: string[];
    customers: any;
}) {
  const [expandedRows, setExpandedRows] = useState<number[]>([]);

  const toggleRow = (index: number) => {
    setExpandedRows((prev) =>
      prev.includes(index) ? prev.filter((i) => i !== index) : [...prev, index]
    );
  };
  return (
    <div className="w-full flex flex-col items-center justify-between mt-4 h-full">
      <Table className="w-full">
        <TableHeader>
          <TableRow className="bg-white sticky top-0 z-10">
            {tableHeaderLabels.map((label, index) => (
              <TableHead key={index} className="text-center bg-white">
                {label}
              </TableHead>
            ))}
            <TableHead className="text-center bg-white">عملیات</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {customers?.map((customer: any, index: number) => (
            <Fragment key={index}>
              <TableRow>
                {tableHeaderLabels.map((label, idx) => (
                  <TableCell key={idx} className="text-center">
                    {customer.Info[label]}{" "}
                  </TableCell>
                ))}
                <TableCell className="text-center">
                  <Button
                    className="bg-blue-500 text-white px-4 py-2 rounded-lg"
                    onClick={() => toggleRow(index)}
                  >
                    {expandedRows.includes(index) ? "بستن" : "مشاهده"}{" "}
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
                      {Object.keys(customer.subInfo).map((lbl, ix) => (
                        <div
                          key={ix}
                          className="flex flex-col items-center gap-2"
                        >
                          <div className="font-semibold">{lbl}</div>
                          <div>{customer.subInfo[lbl]}</div>
                        </div>
                      ))}
                    </div>
                  </TableCell>
                </TableRow>
              )}
            </Fragment>
          ))}
        </TableBody>
      </Table>{" "}
    </div>
  );
}
