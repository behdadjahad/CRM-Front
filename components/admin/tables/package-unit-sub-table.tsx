"use client";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Fragment } from "react";
import Image from "next/image";

import { Button } from "@/components/ui/button";

import { PackageUnitInterface } from "@/app/(admin-layout)/admin/package-unit/page";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { removePackageUnitToCategory } from "@/api/admin";

export interface PackageUnitSubTableInterface {
  categoryId: number;
  packageUnitList: {
    id: number;
    list: {
      label: string;
      value: string;
    }[];
    unitCostData: {
      id: number;
      list: {
        label: string;
        value: string;
      }[];
    };
  }[];
}

export default function PackageUnitSubTable({
  packageUnitList,
  categoryId
}: PackageUnitSubTableInterface) {
  const queryClient = useQueryClient();
  const { mutate: deletePackageUnitHandler } = useMutation({
    mutationFn: ({ id, data }: { id: number; data: any }) => {
      return removePackageUnitToCategory(id, data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["categoryData"],
      });
    },
  });
  function deleteHandler(unitId: number, unitCostId: number) {
    deletePackageUnitHandler({
      id: categoryId,
      data: {
        packageUnits: [
          {
            packageUnitId: unitId,
            packageUnitCostId: unitCostId,
          },
        ],
      },
    });
  }
  return (
    <Table>
      <TableHeader>
        <TableRow>
          {packageUnitList?.[0]?.list.map((col, idx) => (
            <TableHead
              key={idx}
              className="text-center text-xs bg-card border font-bold"
            >
              {col.label}
            </TableHead>
          ))}
          {/* Add header for unitCostData */}
          <TableHead className="text-center text-xs bg-card border font-bold">
            هزینه
          </TableHead>
          <TableHead className="text-center text-xs bg-card border font-bold">
            عملیات
          </TableHead>
        </TableRow>
      </TableHeader>

      <TableBody>
        {packageUnitList?.map((unit) => (
          <Fragment key={unit.id}>
            <TableRow className="border border-gray-200 bg-card">
              {unit.list.map((cell, cellIndex) => (
                <TableCell
                  key={cellIndex}
                  className="text-center text-xs border"
                >
                  {cell.value}
                </TableCell>
              ))}

              {/* Table-style cell for unitCostData */}
              <TableCell className="text-center text-xs border p-0">
                <Table className="w-full border">
                  <TableHeader>
                    <TableRow>
                      {unit.unitCostData.list.map((item, idx) => (
                        <TableHead
                          key={idx}
                          className="text-center text-xs border font-bold bg-gray-100"
                        >
                          {item.label}
                        </TableHead>
                      ))}
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    <TableRow>
                      {unit.unitCostData.list.map((item, idx) => (
                        <TableCell
                          key={idx}
                          className="text-center text-xs border"
                        >
                          {item.value}
                        </TableCell>
                      ))}
                    </TableRow>
                  </TableBody>
                </Table>
              </TableCell>

              <TableCell className="text-center text-xs border">
                <div className="flex items-center gap-4 w-full justify-center">
                  <Button
                    className="border-none p-0 text-[##212B36]"
                    onClick={() => {
                      deleteHandler(unit.id, unit.unitCostData.id);
                    }}
                  >
                    <Image
                      src="/icons/trash.png"
                      alt="delete"
                      width={1024}
                      height={1024}
                      className="w-5 h-5"
                    />
                  </Button>
                </div>
              </TableCell>
            </TableRow>
          </Fragment>
        ))}
      </TableBody>
    </Table>
  );
}
