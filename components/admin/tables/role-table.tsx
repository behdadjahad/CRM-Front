import {
  RoleDataInterface,
  RoleInterface,
} from "@/app/(admin-layout)/admin/role/page";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Fragment, useState } from "react";
import Image from "next/image";

import { Button } from "@/components/ui/button";
import { deleteRole, editRole } from "@/api/admin";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import EditableForm from "../forms/editable-form";
import {
  createFormFields,
  formDataInterface,
} from "@/constants/admin-creation-form-fields";
import { FaChevronDown, FaChevronUp, FaPlus } from "react-icons/fa";
import PermissionTable from "./permission-table";
import AddPermissionToRole from "../permission/add-permission-to-role";
import { NoData } from "../no-data";
import { cn } from "@/lib/utils";

export interface RoleTableInterface {
  roleList: RoleInterface[];
}
export default function RoleTable({ roleList }: RoleTableInterface) {
  const [expandedRows, setExpandedRows] = useState<number[]>([]);

  const toggleRow = (index: number) => {
    setExpandedRows((prev) =>
      prev.includes(index) ? prev.filter((i) => i !== index) : [...prev, index]
    );
  };
  const { roleEditFormData } = getData("role");
  const queryClient = useQueryClient();
  const { mutate: editPackageHandler } = useMutation({
    mutationFn: ({ id, data }: { id: number; data: any }) => {
      return editRole(id, data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["roleData"],
      });
    },
  });
  function editHandler(values: RoleDataInterface) {
    const data = {
      name: values.name,
      description: values.description,
    };
    editPackageHandler({
      id: values.id,
      data: data,
    });
  }
  const { mutate: removeRoleHandler } = useMutation({
    mutationFn: (id: number) => {
      return deleteRole(id);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["roleData"],
      });
    },
  });
  function removeHandler(id: number) {
    removeRoleHandler(id);
  }

  return (
    <Table>
      <TableHeader>
        <TableRow>
          {roleList?.[0]?.list.map((col, idx) => (
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
        {roleList?.map((role, rowIndex) => (
          <Fragment key={role.id}>
            <TableRow className="border border-gray-200 bg-card">
              {role.list.map((cell, cellIndex) => (
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
                      removeHandler(role.id);
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
                    fields={roleEditFormData.fields}
                    initialValues={role.data}
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
                  colSpan={role.list.length + 2}
                  className="text-sm text-gray-700 p-4"
                >
                  <div className="flex flex-col gap-2">
                    <div className="flex items-center justify-between">
                      <div>لیست دسترسی ها </div>

                      <AddPermissionToRole roleId={role?.id} />
                    </div>
                    {role?.permissionList?.length > 0 ? (
                      <PermissionTable
                        permissionList={role?.permissionList}
                        permissionTableType="roleSubTable"
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
}
function getData(formType: string) {
  const editFormData: formDataInterface = createFormFields(formType);
  const roleEditFormData = {
    fields: editFormData.fields,
  };

  return { roleEditFormData };
}
