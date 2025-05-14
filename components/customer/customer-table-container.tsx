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
import { FaChevronDown, FaChevronUp } from "react-icons/fa";
import { Checkbox } from "../ui/checkbox";
import { cn, customerRank } from "@/lib/utils";
import Link from "next/link";

export default function CustomerTableContainer({
  tableHeaderLabels,
  customers,
  className,
}: {
  tableHeaderLabels: string[];
  customers: any[];
  className: string;
}) {
  const [expandedRows, setExpandedRows] = useState<number[]>([]);

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
          {customers?.map((customer: any, index: number) => (
            <Fragment key={index}>
              <Link
                href={`/customer/${customer.id}`}
                style={{ display: "contents" }} // ✅ Preserves layout
              >
                <TableRow className="border-b border-gray-200">
                  {/* <Link
                  href={`/customer/${customer.id}`}
                  className="absolute inset-0 z-10"
                ></Link> */}
                  <TableCell className="flex items-center justify-center">
                    {" "}
                    <Checkbox
                      onCheckedChange={() => {}}
                      //checked={}
                    />
                  </TableCell>

                  {/* {tableHeaderLabels.map((label, idx) => (
                      const rankMatch = customerRank.find(
    (rank) => rank.value === customer.info[label]
  );
                   retrun(<TableCell key={idx} className="text-center text-xs">
                      <span
                        className={
                          label === "رتبه مشتری"
                            ? "font-bold text-green-600"
                            : ""
                        }
                      >
                        {customer.info[label]}
                      </span>
                    </TableCell>) 
                    
))} */}
                  {tableHeaderLabels.map((label, idx) => {
                    const rankMatch =
                      label === "رتبه مشتری"
                        ? customerRank.find(
                            (rank) => rank.value === customer.info[label]
                          )
                        : null;
                    console.log(rankMatch)
                    console.log(rankMatch?.className)
                    return (
                      <TableCell key={idx} className="text-center text-xs">
                        <div className={cn("",rankMatch?.className)}>
                          {customer.info[label]}
                        </div>
                      </TableCell>
                    );
                  })}
                  <TableCell className="text-center">
                    <Button
                      onClick={(e) => {
                        toggleRow(index);
                        e.preventDefault();
                        e.stopPropagation();
                      }}
                      className="border-none p-0 text-[##212B36]"
                    >
                      {expandedRows.includes(index) ? (
                        <FaChevronUp />
                      ) : (
                        <FaChevronDown />
                      )}{" "}
                    </Button>
                  </TableCell>
                </TableRow>
              </Link>
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
