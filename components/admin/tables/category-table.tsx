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
import {
  CategoryDataInterface,
  CategoryInterface,
} from "@/app/(admin-layout)/admin/category/page";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import {
  deleteCategoryFromPackage,
  deletePackageCategory,
  editPackageCategory,
} from "@/api/admin";
import EditableForm from "../forms/editable-form";
import {
  createFormFields,
  formDataInterface,
} from "@/constants/admin-creation-form-fields";
import PackageUnitTable from "./package-unit-table";

export interface CategoryTableInterface {
  categoryList: CategoryInterface[];
  isPackageSubTable: boolean;
  packageId?: number;
}

export default function CategoryTable({
  categoryList,
  isPackageSubTable,
  packageId,
}: CategoryTableInterface) {
  const queryClient = useQueryClient();
  const [expandedRows, setExpandedRows] = useState<number[]>([]);
  const { categoryEditFormData } = getData("category");
  const toggleRow = (index: number) => {
    setExpandedRows((prev) =>
      prev.includes(index) ? prev.filter((i) => i !== index) : [...prev, index]
    );
  };
  const { mutate: editCategoryHandler } = useMutation({
    mutationFn: ({ id, data }: { id: number; data: any }) => {
      return editPackageCategory(id, data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["packageData"],
      });
      queryClient.invalidateQueries({
        queryKey: ["categoryData"],
      });
    },
  });
  function editHandler(values: CategoryDataInterface) {
    const data = {
      title: values.name,
      description: values.description,
      price: +values.price,
    };
    editCategoryHandler({
      id: values.id,
      data: data,
    });
  }
  const { mutate: deleteCategoryFromPackageHandler } = useMutation({
    mutationFn: ({ packageId, ids }: { packageId: number; ids: number[] }) => {
      return deleteCategoryFromPackage(packageId, ids);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["packageData"],
      });
    },
  });

  const { mutate: deleteCategoryHandler } = useMutation({
    mutationFn: (id: number) => {
      return deletePackageCategory(id);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["categoryData"],
      });
    },
  });

  function deleteHandler(id: number) {
    if (isPackageSubTable && packageId) {
      deleteCategoryFromPackageHandler({ packageId: packageId, ids: [id] });
    } else {
      deleteCategoryHandler(id);
    }
  }
  return (
    <Table className="mt-2 border">
      <TableHeader>
        <TableRow>
          {categoryList?.[0]?.list.map((headerItem, idx) => (
            <TableHead
              key={idx}
              className="text-center text-xs bg-card border font-bold"
            >
              {headerItem.label}
            </TableHead>
          ))}
          <TableHead className="text-center text-xs bg-card border font-bold">
            عملیات
          </TableHead>
          <TableHead className="text-center text-xs bg-card border font-bold" />
        </TableRow>
      </TableHeader>

      <TableBody>
        {categoryList?.map((category, index) => (
          <Fragment key={category.id}>
            <TableRow className="border border-gray-200 bg-card">
              {category.list.map((item, itemIndex) => (
                <TableCell
                  key={itemIndex}
                  className="text-center text-xs border"
                >
                  {item.value}
                </TableCell>
              ))}
              <TableCell className="text-center text-xs border">
                <div className="flex items-center gap-4 w-full justify-center">
                  <Button
                    className="border-none p-0 text-[##212B36]"
                    onClick={() => {
                      deleteHandler(category.id);
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
                    fields={categoryEditFormData.fields}
                    initialValues={category.data}
                    onEditForm={editHandler}
                  />
                </div>
              </TableCell>
              <TableCell className="text-center border">
                <Button
                  className="border-none p-0"
                  onClick={() => toggleRow(index)}
                >
                  {expandedRows.includes(index) ? (
                    <FaChevronUp />
                  ) : (
                    <FaChevronDown />
                  )}
                </Button>
              </TableCell>
            </TableRow>

            {/* Expanded row */}
            {expandedRows.includes(index) && (
              <TableRow className="bg-gray-100">
                <TableCell
                  colSpan={category.list.length + 2}
                  className="text-sm text-gray-700 p-4"
                >
                  <div className="flex flex-col gap-2">
                    <div className="font-semibold mb-2">لیست واحدها</div>

                    <PackageUnitTable
                      packageUnitList={category.packageUnitList}
                    />
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
function getData(formType: string) {
  const editFormData: formDataInterface = createFormFields(formType);
  const categoryEditFormData = {
    fields: editFormData.fields,
  };

  return { categoryEditFormData };
}
