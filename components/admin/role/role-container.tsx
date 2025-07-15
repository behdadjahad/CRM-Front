"use client";
import {
  createFormFields,
  formDataInterface,
} from "@/constants/admin-creation-form-fields";
import CreationForm from "../forms/creation-form";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { addRole } from "@/api/admin";
import { RoleInterface } from "@/app/(admin-layout)/admin/role/page";
import RoleTable from "../tables/role-table";
export interface RoleContainerInterface {
  roleList: RoleInterface[];
}
export default function RoleContainer({ roleList }: RoleContainerInterface) {
  const { roleFormData } = getData("role");
  const queryClient = useQueryClient();
  const { mutate: addRoleHandler } = useMutation({
    mutationFn: (data: any) => {
      return addRole(data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["roleData"],
      });
    },
  });
  function submitHandler(values: any) {
    const data = {
      name: values.name,
      description: values.description,
    };
    addRoleHandler(data);
  }
  return (
    <div className="bg-card flex flex-col justify-between p-6 rounded-md custom-shadow gap-4">
      <CreationForm {...roleFormData} onSubmitForm={submitHandler} />
      <div className="bg-[linear-gradient(180deg,#0475B5_-65.62%,#1C284F_100%)] rounded-sm p-3 flex items-center justify-between px-6 text-card">
        نقش
      </div>
      <RoleTable roleList={roleList} />
    </div>
  );
}
function getData(formType: string) {
  const formData: formDataInterface = createFormFields(formType);
  const roleFormData = {
    title: formData.title,
    fields: formData.fields,
    initialValues: formData.initialValues,
  };

  return { roleFormData };
}
