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
  deletePermissionFromPackageUnit,
  deletePermissionFromRole,
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
import TagContainer from "../tag-container";

export interface PermissionTableInterface {
  permissionList: PermissionInterface[];
  permissionTableType: "roleSubTable" | "packageUnitSubTable" | "mainTable";
  packageUnitId?: number;
  roleId?: number;
}

export default function PermissionTable({
  permissionList,
  permissionTableType,
  packageUnitId,
  roleId,
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
  const { mutate: deletePermissionFromRoleHandler } = useMutation({
    mutationFn: ({ roleId, data }: { roleId: number; data: any }) => {
      return deletePermissionFromRole(roleId, data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["roleData"],
      });
      queryClient.invalidateQueries({
        queryKey: ["permissionData"],
      });
    },
  });
  const { mutate: deletePermissionFromUnitHandler } = useMutation({
    mutationFn: ({
      packageUnitId,
      data,
    }: {
      packageUnitId: number;
      data: any;
    }) => {
      return deletePermissionFromPackageUnit(packageUnitId, data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["packageUnitData"],
      });
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
       queryClient.invalidateQueries({
        queryKey: ["roleData"],
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
    switch (permissionTableType) {
      case "roleSubTable":
        if (roleId)
          deletePermissionFromRoleHandler({
            roleId: roleId,
            data: {
              ids: [permissionId],
            },
          });
        break;
      case "packageUnitSubTable":
        if (packageUnitId)
          deletePermissionFromUnitHandler({
            packageUnitId: packageUnitId,
            data: {
              ids: [permissionId],
            },
          });
        break;
      case "mainTable":
        deletePermissionHandler(permissionId);
        break;
      default:
        return;
    }
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
            واحد پکیج ها
          </TableHead>
          <TableHead className="text-center text-xs bg-card border font-bold">
            نقش ها
          </TableHead>
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
                {permission?.data?.packageUnits?.length > 0 ? (
                  <TagContainer
                    list={permission?.data?.packageUnits}
                    onDeleteHandler={(itemId: number) => {
                      deletePermissionFromUnitHandler({
                        packageUnitId: itemId,
                        data: {
                          ids: [permission.id],
                        },
                      });
                    }}
                  />
                ) : (
                  <p>به واحد پکیجی اختصاص داده نشده است</p>
                )}
              </TableCell>
              <TableCell className="text-center text-xs border">
                {permission?.data?.roles?.length > 0 ? (
                  <TagContainer
                    list={permission?.data?.roles}
                    onDeleteHandler={(itemId: number) => {
                      deletePermissionFromRoleHandler({
                        roleId: itemId,
                        data: {
                          ids: [permission.id],
                        },
                      });
                    }}
                  />
                ) : (
                  <p>به نقشی اختصاص داده نشده است</p>
                )}
              </TableCell>
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
                  colSpan={permission.list.length + 4}
                  className="text-sm text-gray-700 p-4"
                >
                  <PermissionPageFeatureContainer
                    pageList={permission?.pageList}
                    permissionId={permission.id}
                    subTable="permission"
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
