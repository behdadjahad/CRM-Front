"use client";
import { cn, totalVotes } from "@/lib/utils";
import { Progress } from "@/components/ui/progress";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

import { Fragment } from "react";
import React from "react";
import { Rating } from "react-simple-star-rating";

export default function ContractReportTable({
  tableHeaderLabels,
  list,
  className,
}: {
  tableHeaderLabels: any[];
  list: any[];
  className: string;
}) {
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
            {tableHeaderLabels.map((label, index) => (
              <TableHead key={index} className="text-right text-[#757575]">
                {label}
              </TableHead>
            ))}
            {/*  */}
          </TableRow>
        </TableHeader>
        <TableBody>
          {list?.map((item: any, index: number) => (
            <Fragment key={index}>
              <TableRow className="border-b border-gray-200 bg-card">
                {tableHeaderLabels.map((label, idx) => (
                  <TableCell key={idx} className="text-right text-xs ">
                    {item[label]}
                  </TableCell>
                ))}
                <TableCell className="text-center w-36 px-0">
                  <Progress
                    value={item.value}
                    className="h-1 bg-[#F0F4F8] w-full"
                    indicatorClassName={item.indicatorClassName}
                  />
                </TableCell>

                {/* Extra: percentage text */}
                <TableCell className="text-center text-xs font-medium">
                  <div className={item.labelClassName}> {item.value}%</div>
                </TableCell>
              </TableRow>
            </Fragment>
          ))}
        </TableBody>
      </Table>{" "}
    </div>
  );
}
