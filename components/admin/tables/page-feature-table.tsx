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
import {
  deletePackage,
  deletePageFeature,
  editPackage,
  editPageFeature,
} from "@/api/admin";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import EditableForm from "../forms/editable-form";
import {
  createFormFields,
  formDataInterface,
} from "@/constants/admin-creation-form-fields";
import {
  PageFeatureDataInterface,
  PageFeatureInterface,

} from "@/app/(admin-layout)/admin/page/page";

export interface PageFeatureTableInterface {
  pageFeatureList: PageFeatureInterface[];
}

export default function PageFeatureTable({
  pageFeatureList,
}: PageFeatureTableInterface) {
  const { pageFeatureEditFormData } = getData("page-feature");

  const queryClient = useQueryClient();

  const { mutate: deleteFeatureHandler } = useMutation({
    mutationFn: (id: number) => {
      return deletePageFeature(id);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["pageData"],
      });
    },
  });
  const { mutate: editFeatureHandler } = useMutation({
    mutationFn: ({ id, data }: { id: number; data: any }) => {
      return editPageFeature(id, data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["pageData"],
      });
    },
  });
  function editHandler(values: PageFeatureDataInterface) {
 
    const data = {
      name: values.name,
      code: values.code,
      description: values.description,
      urlPattern: values.urlPattern,
    };

    editFeatureHandler({
      id: values.id,
      data: data,
    });
  }
  return (
    <Table>
      <TableHeader>
        <TableRow>
          {pageFeatureList?.[0]?.list.map((col, idx) => (
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
        {pageFeatureList?.map((feature) => (
          <Fragment key={feature.id}>
            <TableRow className="border border-gray-200 bg-card">
              {feature.list.map((cell, cellIndex) => (
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
                      deleteFeatureHandler(feature.id);
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
                    fields={pageFeatureEditFormData.fields}
                    initialValues={feature.data}
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
}

function getData(formType: string) {
  const editFormData: formDataInterface = createFormFields(formType);
  const pageFeatureEditFormData = {
    fields: editFormData.fields,
  };

  return { pageFeatureEditFormData };
}
