"use client";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Fragment, useState } from "react";
import { FaChevronDown, FaChevronUp } from "react-icons/fa";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import { CategoryDataInterface } from "@/app/(admin-layout)/admin/category/page";


export interface CategoryTableProps {
  categoryList: CategoryDataInterface[];
}

export default function CategoryTable({ categoryList }: CategoryTableProps) {
  const [expandedRows, setExpandedRows] = useState<number[]>([]);

  const toggleRow = (index: number) => {
    setExpandedRows((prev) =>
      prev.includes(index) ? prev.filter((i) => i !== index) : [...prev, index]
    );
  };

  return (
    <Table className="mt-2 border">
      <TableHeader>
        <TableRow>
          {categoryList?.[0]?.list.map((col, idx) => (
            <TableHead
              key={idx}
              className="text-center text-xs bg-card border font-bold"
            >
              {col.label}
            </TableHead>
          ))}
          <TableHead className="text-center text-xs bg-card border font-bold">
            عملیات
          </TableHead>
          <TableHead className="text-center text-xs bg-card border font-bold" />
        </TableRow>
      </TableHeader>

      <TableBody>
        {categoryList?.map((category, rowIndex) => (
          <Fragment key={category.id}>
            <TableRow className="border border-gray-200 bg-card">
              {category.list.map((cell, cellIndex) => (
                <TableCell
                  key={cellIndex}
                  className="text-center text-xs border"
                >
                  {cell.value}
                </TableCell>
              ))}
              <TableCell className="text-center text-xs border">
                <div className="flex items-center gap-4 w-full justify-center">
                  <Button
                    className="border-none p-0 text-[##212B36]"
                    onClick={() => {}}
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
                  <Button className="border-none p-0 text-[##212B36]">
                    <Image
                      src="/icons/edit-primary.png"
                      alt=""
                      width={1024}
                      height={1024}
                      className="w-4 h-4"
                      onClick={() => {}}
                    />
                  </Button>
                </div>
              </TableCell>
              <TableCell className="text-center border">
                <Button
                  className="border-none p-0"
                  onClick={() => toggleRow(rowIndex)}
                  aria-label={
                    expandedRows.includes(rowIndex)
                      ? "Collapse row"
                      : "Expand row"
                  }
                >
                  {expandedRows.includes(rowIndex) ? (
                    <FaChevronUp />
                  ) : (
                    <FaChevronDown />
                  )}
                </Button>
              </TableCell>
            </TableRow>

            {/* Expanded row */}
            {expandedRows.includes(rowIndex) && (
              <TableRow className="bg-gray-100">
                <TableCell
                  colSpan={category.list.length + 1}
                  className="text-sm text-gray-700 p-4"
                >
                  <div className="flex flex-col gap-2">
                    <div className="font-semibold mb-2">لیست واحدها</div>
                    {/* Render next level here, e.g. UnitTable */}
                    <div>محتوای واحدها در اینجا</div>
                  </div>
                </TableCell>
              </TableRow>
            )}
          </Fragment>
        ))}
      </TableBody>
    </Table>
  );
}
