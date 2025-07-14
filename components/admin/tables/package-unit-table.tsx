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
import { FaChevronDown, FaChevronUp } from "react-icons/fa";

import { Button } from "@/components/ui/button";

import {
  PackageUnitDataInterface,
  PackageUnitInterface,
} from "@/app/(admin-layout)/admin/package-unit/page";
import EditableForm from "../forms/editable-form";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { deletePackageUnit, editPackageUnit } from "@/api/admin";
import {
  createFormFields,
  formDataInterface,
} from "@/constants/admin-creation-form-fields";
import AddUnitCostToPackageUnit from "../unit-cost/add-unit-cost-to-package-unit";

export interface PackageUnitTableInterface {
  packageUnitList: PackageUnitInterface[];
}

export default function PackageUnitTable({
  packageUnitList,
}: PackageUnitTableInterface) {
  const [expandedRows, setExpandedRows] = useState<number[]>([]);
  const queryClient = useQueryClient();
  const { packageUnitEditFormData } = getData("package-unit");
  const toggleRow = (index: number) => {
    setExpandedRows((prev) =>
      prev.includes(index) ? prev.filter((i) => i !== index) : [...prev, index]
    );
  };
  const { mutate: editPackageUnitHandler } = useMutation({
    mutationFn: ({ id, data }: { id: number; data: any }) => {
      return editPackageUnit(id, data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["packageData"],
      });
      queryClient.invalidateQueries({
        queryKey: ["categoryData"],
      });
      queryClient.invalidateQueries({
        queryKey: ["packageUnitData"],
      });
    },
  });
  function editHandler(values: PackageUnitDataInterface) {
    const data = {
      name: values.name,
      description: values.description,
    };
    editPackageUnitHandler({
      id: values.id,
      data: data,
    });
  }
  const { mutate: deletePackageUnitHandler } = useMutation({
    mutationFn: (id: number) => {
      return deletePackageUnit(id);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["packageUnitData"],
      });
    },
  });
  function deleteHandler(id: number) {
    deletePackageUnitHandler(id);
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
          <TableHead className="text-center text-xs bg-card border font-bold">
            عملیات
          </TableHead>
          <TableHead className="text-center text-xs bg-card border font-bold" />
        </TableRow>
      </TableHeader>

      <TableBody>
        {packageUnitList?.map((unit, rowIndex) => (
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
              <TableCell className="text-center text-xs border">
                <div className="flex items-center gap-4 w-full justify-center">
                  <Button
                    className="border-none p-0 text-[##212B36]"
                    onClick={() => {
                      deleteHandler(unit.id);
                    }}
                  >
                    <Image
                      src="/icons/trash.png"
                      alt=""
                      width={1024}
                      height={1024}
                      className="w-5 h-5"
                    />
                  </Button>
                  <EditableForm
                    fields={packageUnitEditFormData.fields}
                    initialValues={unit.data}
                    onEditForm={editHandler}
                  />
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
                  colSpan={unit.list.length + 2}
                  className="text-sm text-gray-700 p-4"
                >
                  <AddUnitCostToPackageUnit 
                    packageUnitId={unit.id}/>
                </TableCell>
              </TableRow>
            )}
          </Fragment>
        ))}
      </TableBody>
    </Table>
  );
}
function getData(formType: string) {
  const editFormData: formDataInterface = createFormFields(formType);
  const packageUnitEditFormData = {
    fields: editFormData.fields,
  };

  return { packageUnitEditFormData };
}
