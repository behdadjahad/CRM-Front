"use client";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useState, Fragment } from "react";
import Image from "next/image";
import { FaChevronDown, FaChevronUp, FaPlus } from "react-icons/fa";
import { PackageDataInterface } from "@/app/(admin-layout)/admin/package/page";
import { Button } from "@/components/ui/button";
import CategoryTable from "./category-table";
import { cn } from "@/lib/utils";
import AddCategoryToPackage from "../category/add-category-to-package";

export interface PackageTableProps {
  packageList: PackageDataInterface[];
}

export default function PackageTable({ packageList }: PackageTableProps) {
  const [expandedRows, setExpandedRows] = useState<number[]>([]);

  const toggleRow = (index: number) => {
    setExpandedRows((prev) =>
      prev.includes(index) ? prev.filter((i) => i !== index) : [...prev, index]
    );
  };
  console.log(packageList);
  return (
    <Table>
      <TableHeader>
        <TableRow>
          {packageList?.[0]?.list.map((col, idx) => (
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
        {packageList?.map((pkg, rowIndex) => (
          <Fragment key={pkg.id}>
            <TableRow className="border border-gray-200 bg-card">
              {pkg.list.map((cell, cellIndex) => (
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
                >
                  {expandedRows.includes(rowIndex) ? (
                    <FaChevronUp />
                  ) : (
                    <FaChevronDown />
                  )}
                </Button>
              </TableCell>
            </TableRow>

            {expandedRows.includes(rowIndex) && (
              <TableRow className="bg-gray-100">
                <TableCell
                  colSpan={pkg.list.length + 2}
                  className="text-sm text-gray-700 p-4"
                >
                  <div className="flex flex-col gap-2">
                    <div className="flex items-center justify-between">
                      <div>لیست دسته بندی</div>

                      <AddCategoryToPackage packageId={pkg?.id} />
                    </div>

                    <CategoryTable categoryList={pkg?.categoryList} />
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
