'use client';
import {
  PackageDataInterface,
  PackageInterface,
} from "@/app/(admin-layout)/admin/package/page";

import {
  createFormFields,
  formDataInterface,
} from "@/constants/admin-creation-form-fields";
import { addPackage, addPermission } from "@/api/admin";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useSelector } from "react-redux";
import { cleanFormatPrice } from "@/lib/utils";
import CreationForm from "../forms/creation-form";
import { PermissionInterface } from "@/app/(admin-layout)/admin/permission/page";
import PermissionTable from "../tables/permission-table";
import AddPermissionForm from "./add-permission-form";
export interface PermissionContainerInterface {
  permissionList: PermissionInterface[];
}
export default function PermissionContainer({
  permissionList,
}: PermissionContainerInterface) {
  const queryClient = useQueryClient();
  const currencyOptions=  useSelector((state: any) => state.currency.items);
  const { permissionFormData } = getData("permission");
  const { mutate: addPermissionHandler } = useMutation({
    mutationFn: (data: any) => {
      return addPermission(data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["permissionData"],
      });
    },
  });
  function submitHandler(values: any) {
    const data = {
      name: values.name,
      description: values.description,
  
    };
    addPermissionHandler(data);
  }

  return (
    <div className="bg-card flex flex-col justify-between p-6 rounded-md custom-shadow gap-4">
      {/* <CreationForm {...permissionFormData} onSubmitForm={submitHandler} /> */}
      <AddPermissionForm />
      <div className="bg-[linear-gradient(180deg,#0475B5_-65.62%,#1C284F_100%)] rounded-sm p-3 flex items-center justify-between px-6 text-card">
        دسترسی
      </div>
      <PermissionTable permissionList={permissionList} permissionTableType="mainTable"/>
    </div>
  );
  function getData(formType: string) {

  const formData: formDataInterface = createFormFields(formType);
  const permissionFormData = {
    title: formData.title,
    fields: formData.fields,
    initialValues: formData.initialValues,
  };

  return { permissionFormData };
}

}
