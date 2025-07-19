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

import {
  UnitCostDataInterface,
  UnitCostInterface,
} from "@/app/(admin-layout)/admin/package-unit/page";

import {
  createFormFields,
  formDataInterface,
} from "@/constants/admin-creation-form-fields";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { deletePackageUnitCost, editPackageUnitCost } from "@/api/admin";
import EditableForm from "../forms/editable-form";
import { useSelector } from "react-redux";
import { cleanFormatPrice } from "@/lib/utils";

export interface UnitCostTableInterface {
  unitCosts: UnitCostInterface[];
}

export default function UnitCostTable({ unitCosts }: UnitCostTableInterface) {
  const queryClient = useQueryClient();
  const currencyOptions = useSelector((state: any) => state.currency.items);
  const { UnitCostEditFormData } = getData("unit-cost");

  const { mutate: deleteUnitCostHandler } = useMutation({
    mutationFn: (id: number) => {
      return deletePackageUnitCost(id);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["packageUnitData"],
      });
    },
  });
  function deleteHandler(id: number) {
    deleteUnitCostHandler(id);
  }
  const { mutate: editUnitCostHandler } = useMutation({
    mutationFn: ({ id, data }: { id: number; data: any }) => {
      return editPackageUnitCost(id, data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["packageUnitData"],
      });
    },
  });
  function editHandler(values: UnitCostDataInterface) {
    const data = {
      title: values.title,
      description: values.description,
      unitType: values.unitType,
      unitModel: values.unitModel,
      enabledDurationInDays: Number(values.enabledDurationInDays),
      showDurationInDays: Number(values.showDurationInDays),
      countUnit: Number(values.countUnit),
      price: Number(cleanFormatPrice(values.price)),
      currencyId: Number(values.currency),
    };
    editUnitCostHandler({
      id: values.id,
      data: data,
    });
  }
  return (
    <Table>
      <TableHeader>
        <TableRow>
          {unitCosts?.[0]?.list.map((col, idx) => (
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
        </TableRow>
      </TableHeader>

      <TableBody>
        {unitCosts?.map((unit) => (
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
                    fields={UnitCostEditFormData.fields}
                    initialValues={unit.data}
                    onEditForm={editHandler}
                  />
                </div>
              </TableCell>
            </TableRow>
          </Fragment>
        ))}
      </TableBody>
    </Table>
  );
  function getData(formType: string) {
    const editFormData: formDataInterface = createFormFields(
      formType,
      currencyOptions
    );
    const UnitCostEditFormData = {
      fields: editFormData.fields,
    };

    return { UnitCostEditFormData };
  }
}
