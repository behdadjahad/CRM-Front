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
              <TableHead key={index} className="text-right">
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
                  <TableCell key={idx} className="text-center text-xs">
                    {item[label]}
                  </TableCell>
                ))}
                <TableCell className="text-center w-36">
                  <Progress
                    value={item.value}
                    className="h-1 bg-muted/30"
                    indicatorClassName={item.indicatorClassName}
                  />
                </TableCell>

                {/* Extra: percentage text */}
                <TableCell className="text-center text-xs font-medium">
                  <div> {item.value}%</div>
                </TableCell>
              </TableRow>
            </Fragment>
          ))}
        </TableBody>
      </Table>{" "}
    </div>
  );
}
