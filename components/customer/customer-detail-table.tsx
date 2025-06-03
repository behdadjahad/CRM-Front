"use client";
import { cleanFormatPrice, cn, totalVotes } from "@/lib/utils";
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
import { FaChevronDown, FaChevronUp } from "react-icons/fa";

export default function CustomerDetailTable({
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
              <TableRow className="border-b border-gray-200 bg-card">
                {/* <TableCell className="flex items-center justify-center">
                {" "}
                <Checkbox
                  onCheckedChange={() => {}}
                  checked={}
                />
              </TableCell> */}

                {tableHeaderLabels.map((label, idx) => (
                  <TableCell key={idx} className="text-center text-xs">
                    {label === "سود و زیان" ? (
                      <div
                        className={
                          cleanFormatPrice(item[label]) > 0
                            ? "text-[#039855]"
                            : cleanFormatPrice(item[label]) < 0
                            ? "text-[#D80027]"
                            : ""
                        }
                      >
                        <div className="flex flex-row items-center gap-2">
                          {cleanFormatPrice(item[label]) > 0 ? <FaChevronUp /> :cleanFormatPrice(item[label]) < 0 ? <FaChevronDown />:""}
                          <span>{item[label]}</span></div>
                       
                      </div>
                    ) : (
                      <div>
                        {item[label]}

                        {label === "رضایتمندی" && (
                          <Rating
                            iconsCount={1} // Only 1 star
                            size={20} // Optional: size of the star
                            onClick={(rate) => console.log(rate)}
                            readonly
                            allowFraction={true}
                            initialValue={item[label]} // Optional: handle click
                          />
                        )}
                      </div>
                    )}
                  </TableCell>
                ))}
              </TableRow>
            </Fragment>
          ))}
        </TableBody>
      </Table>{" "}
    </div>
  );
}
