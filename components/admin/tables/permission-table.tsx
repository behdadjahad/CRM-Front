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
  deletePermission,
  editPackage,
  editPermission,
} from "@/api/admin";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import EditableForm from "../forms/editable-form";
import {
  createFormFields,
  formDataInterface,
} from "@/constants/admin-creation-form-fields";
import { useSelector } from "react-redux";
import { cleanFormatPrice } from "@/lib/utils";
import {
  PermissionDataInterface,
  PermissionInterface,
} from "@/app/(admin-layout)/admin/permission/page";

import PermissionPageFeatureContainer from "../permission/permission-page-feature-container";

export interface PermissionTableInterface {
  permissionList: PermissionInterface[];
  permissionTableType: "roleSubTable" | "packageUnitSubTable" | "mainTable";
}

export default function PermissionTable({
  permissionList,
}: PermissionTableInterface) {
  const { permissionEditFormData } = getData("permission");
  const [expandedRows, setExpandedRows] = useState<number[]>([]);
  const toggleRow = (index: number) => {
    setExpandedRows((prev) =>
      prev.includes(index) ? prev.filter((i) => i !== index) : [...prev, index]
    );
  };
  const queryClient = useQueryClient();

  const { mutate: deletePermissionHandler } = useMutation({
    mutationFn: (id: number) => {
      return deletePermission(id);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["permissionData"],
      });
    },
  });
  const { mutate: editPermissionHandler } = useMutation({
    mutationFn: ({ id, data }: { id: number; data: any }) => {
      return editPermission(id, data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["permissionData"],
      });
    },
  });
  function editHandler(values: PermissionDataInterface) {
    const data = {
      name: values.name,
      description: values.description,
    };
    editPermissionHandler({
      id: values.id,
      data: data,
    });
  }
  function deleteHandler(permissionId: number) {
    deletePermissionHandler(permissionId);
  }
  return (
    <Table>
      <TableHeader>
        <TableRow>
          {permissionList?.[0]?.list.map((col, idx) => (
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
          <TableHead className="text-center text-xs bg-card border font-bold">
            لیست صفحات
          </TableHead>
        </TableRow>
      </TableHeader>

      <TableBody>
        {permissionList?.map((permission, rowIndex) => (
          <Fragment key={permission.id}>
            <TableRow className="border border-gray-200 bg-card">
              {permission.list.map((cell, cellIndex) => (
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
                      deleteHandler(permission.id);
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
                    fields={permissionEditFormData.fields}
                    initialValues={permission.data}
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
                  colSpan={permission.list.length + 2}
                  className="text-sm text-gray-700 p-4"
                >
                  <PermissionPageFeatureContainer
                    pageList={permission?.pageList}
                  />
                </TableCell>
              </TableRow>
            )}
          </Fragment>
        ))}
      </TableBody>
    </Table>
  );
  function getData(formType: string) {
    const editFormData: formDataInterface = createFormFields(formType);
    const permissionEditFormData = {
      fields: editFormData.fields,
    };

    return { permissionEditFormData };
  }
}
