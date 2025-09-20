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
import {
  deletePackageUnit,
  editPackageUnit,
  removePackageUnitFromCategory,
  removePackageUnitFromLabel,
} from "@/api/admin";
import {
  createFormFields,
  formDataInterface,
} from "@/constants/admin-creation-form-fields";

import { cleanFormatPrice } from "@/lib/utils";
import { useSelector } from "react-redux";
import AddPermissionToPackageUnit from "../permission/add-permission-to-package-unit";
import { NoData } from "../no-data";
import TagContainer from "../tag-container";
import PermissionTable from "./permission-table";
import PermissionPageFeatureContainer from "../permission/permission-page-feature-container";

export interface PackageUnitTableInterface {
  packageUnitList: PackageUnitInterface[];
  isCategorySubTable?: boolean;
  isLabelSubTable?: boolean;
  categoryId?: number;
  labelId?: number;
}

export default function PackageUnitTable({
  packageUnitList,
  isCategorySubTable,
  categoryId,
  isLabelSubTable,
  labelId,
}: PackageUnitTableInterface) {
  const [expandedRows, setExpandedRows] = useState<number[]>([]);
  const queryClient = useQueryClient();
  const currencyOptions = useSelector((state: any) => state.currency.items);
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
      price: Number(cleanFormatPrice(values.price)),
      description: values.description,
      currencyId: values.currency,
      unitType: values.unitType,
      unitModel: values.unitModel,
      enabledDurationInDays: Number(values.enabledDurationInDays),
      showDurationInDays: Number(values.showDurationInDays),
      countUnit: Number(values.countUnit),
    };
    editPackageUnitHandler({
      id: values.id,
      data: data,
    });
  }
  const { mutate: deleteUnitFromCategoryHandler } = useMutation({
    mutationFn: ({ categoryId, data }: { categoryId: number; data: any }) => {
      return removePackageUnitFromCategory(categoryId, data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["packageUnitData"],
      });
      queryClient.invalidateQueries({
        queryKey: ["categoryData"],
      });
    },
  });
  const { mutate: deleteUnitFromLabelHandler } = useMutation({
    mutationFn: ({ labelId, data }: { labelId: number; data: any }) => {
      return removePackageUnitFromLabel(labelId, data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["packageUnitData"],
      });
      queryClient.invalidateQueries({
        queryKey: ["labelData"],
      });
    },
  });
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
    if (isCategorySubTable && categoryId) {
      deleteUnitFromCategoryHandler({
        categoryId: categoryId,
        data: {
          packageUnits: [
            {
              packageUnitId: id,
            },
          ],
        },
      });
    } else if (isLabelSubTable && labelId) {
      deleteUnitFromLabelHandler({
        labelId: labelId,
        data: {
          packageUnits: [
            {
              packageUnitId: id,
            },
          ],
        },
      });
    } else {
      deletePackageUnitHandler(id);
    }
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
            لیست دسته بندی ها
          </TableHead>
          <TableHead className="text-center text-xs bg-card border font-bold">
            لیست لیبل ها
          </TableHead>
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
                {unit?.data?.categories?.length > 0 ? (
                  <TagContainer
                    list={unit?.data?.categories}
                    onDeleteHandler={(itemId) => {
                      deleteUnitFromCategoryHandler({
                        categoryId: itemId,
                        data: {
                          packageUnits: [
                            {
                              packageUnitId: unit.id,
                            },
                          ],
                        },
                      });
                    }}
                  />
                ) : (
                  <p>به دسته بندی اختصاص داده نشده است</p>
                )}
              </TableCell>
              {/* <TableCell className="text-center text-xs border">
                {unit?.data?.labelList?.length > 0 ? (
                  <TagContainer
                    list={unit?.data?.labelList}
                    onDeleteHandler={(itemId) => {
                      deleteUnitFromCategoryHandler({
                        categoryId: itemId,
                        data: {
                          packageUnits: [
                            {
                              packageUnitId: unit.id,
                            },
                          ],
                        },
                      });
                    }}
                  />
                ) : (
                  <p>به لیبل اختصاص داده نشده است</p>
                )}
              </TableCell> */}
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
                  colSpan={unit.list.length + 3}
                  className="text-sm text-gray-700 p-4"
                >
                  <div className="flex flex-col gap-4">
                    <div className="flex flex-col gap-2">
                      <div className="flex items-center justify-between">
                        <div>لیست دسترسی ها </div>

                        <AddPermissionToPackageUnit packageUnitId={unit.id} />
                      </div>

                      <PermissionTable
                        permissionList={unit?.permissionList}
                        permissionTableType="packageUnitSubTable"
                        packageUnitId={unit.id}
                      />
                    </div>
                    <div className="flex flex-col gap-2">
                      <div className="flex items-center justify-between"></div>

                      <PermissionPageFeatureContainer
                        pageList={unit?.pageList}
                        permissionId={unit.id}
                        subTable="unit"
                      />
                    </div>
                  </div>
                </TableCell>
              </TableRow>
            )}
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
    const packageUnitEditFormData = {
      fields: editFormData.fields,
    };

    return { packageUnitEditFormData };
  }
}
