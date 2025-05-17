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
import { cn } from "@/lib/utils";
import Link from "next/link";
import { Rating } from "react-simple-star-rating";
export default function CustomerTableContainer({
  tableHeaderLabels,
  customers,
  className,
}: {
  tableHeaderLabels: string[];
  customers: any[];
  className: string;
}) {
  const customerRank = [
    {
      label: "طلایی",
      value: "Gold",
      className: "bg-[#FFFAEB] text-[#FDB022] border border-[#FDB022]",
    },
    {
      label: "نقره ای",
      value: "Silver",
      className: "bg-[#F3F2F2] text-[#919EAB] border border-[#919EAB]",
    },
    {
      label: "برنز",
      value: "Bronze",
      className: "bg-[#FFE6CE] text-[#B55D04] border border-[#B55D04]",
    },
  ];
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

                  {tableHeaderLabels.map((label, idx) => {
                    const rankMatch =
                      label === "رتبه مشتری"
                        ? customerRank.find(
                            (rank) => rank.value === customer.info[label]
                          )
                        : null;

                    return (
                      <TableCell key={idx} className="text-center text-xs">
                        {label === "رتبه مشتری" ? (
                          <div
                            className={cn(
                              "flex items-center rounded-md justify-around",
                              rankMatch?.className
                            )}
                          >
                            <span
                              className={cn(
                                "border-none inline-block w-4 h-4 rounded-full mr-2",
                                rankMatch?.className
                              )}
                            ></span>
                            <span>
                              {" "}
                              {rankMatch?.label
                                ? rankMatch?.label
                                : customer?.info[label]}
                            </span>
                          </div>
                        ) : (
                          customer?.info[label]
                        )}
                      </TableCell>
                    );
                  })}
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
                          <div className="flex items-center gap-1">
                            <span>{customer.subInfo[lbl]}</span>
                            {lbl === "امتیاز مشتری" && (
                              <span>
                                <Rating
                                  iconsCount={1} // Only 1 star
                                  size={20} // Optional: size of the star
                                  onClick={(rate) => console.log(rate)}
                                  readonly
                                  allowFraction={true}
                                  initialValue={customer.subInfo[lbl]} // Optional: handle click
                                />
                              </span>
                            )}
                          </div>
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
