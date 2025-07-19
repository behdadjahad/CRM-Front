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
import {
  PackageDataInterface,
  PackageInterface,
} from "@/app/(admin-layout)/admin/package/page";
import { Button } from "@/components/ui/button";
import CategoryTable from "./category-table";

import AddCategoryToPackage from "../category/add-category-to-package";
import { deletePackage, editPackage } from "@/api/admin";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import EditableForm from "../forms/editable-form";
import {
  createFormFields,
  formDataInterface,
} from "@/constants/admin-creation-form-fields";
import { useSelector } from "react-redux";
import { cleanFormatPrice } from "@/lib/utils";
import { NoData } from "../no-data";

export interface PackageTableInterface {
  packageList: PackageInterface[];
}

export default function PackageTable({ packageList }: PackageTableInterface) {
  const currencyOptions = useSelector((state: any) => state.currency.items);
  const { packageEditFormData } = getData("package");
  const [expandedRows, setExpandedRows] = useState<number[]>([]);
  const queryClient = useQueryClient();
  const toggleRow = (index: number) => {
    setExpandedRows((prev) =>
      prev.includes(index) ? prev.filter((i) => i !== index) : [...prev, index]
    );
  };
  const { mutate: deletePackageHandler } = useMutation({
    mutationFn: (id: number) => {
      return deletePackage(id);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["packageData"],
      });
    },
  });
  const { mutate: editPackageHandler } = useMutation({
    mutationFn: ({ id, data }: { id: number; data: any }) => {
      return editPackage(id, data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["packageData"],
      });
    },
  });
  function editHandler(values: PackageDataInterface) {
    const data = {
      title: values.title,
      description: values.description,
      price: Number(cleanFormatPrice(values.price)),
      currencyId: values.currency,
    };
    editPackageHandler({
      id: values.id,
      data: data,
    });
  }
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
                    onClick={() => {
                      deletePackageHandler(pkg.id);
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
                    fields={packageEditFormData.fields}
                    initialValues={pkg.data}
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
                  colSpan={pkg.list.length + 2}
                  className="text-sm text-gray-700 p-4"
                >
                  <div className="flex flex-col gap-2">
                    <div className="flex items-center justify-between">
                      <div>لیست دسته بندی</div>

                      <AddCategoryToPackage packageId={pkg?.id} />
                    </div>

                    {pkg.categoryList.length > 0 ? (
                      <CategoryTable
                        categoryList={pkg?.categoryList}
                        isPackageSubTable={true}
                        packageId={pkg?.id}
                      />
                    ) : (
                      <NoData />
                    )}
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
    const packageEditFormData = {
      fields: editFormData.fields,
    };

    return { packageEditFormData };
  }
}
