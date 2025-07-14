import {
  createFormFields,
  formDataInterface,
} from "@/constants/admin-creation-form-fields";
import CreationForm from "../forms/creation-form";
import { PackageUnitInterface } from "@/app/(admin-layout)/admin/package-unit/page";
import PackageUnitTable from "../tables/package-unit-table";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { addPackageUnit } from "@/api/admin";

export interface PackageUnitContainerInterface {
  packageUnitList: PackageUnitInterface[];
}

export default function PackageUnitContainer({
  packageUnitList,
}: PackageUnitContainerInterface) {
  const queryClient = useQueryClient();
  const { packageUnitFormData } = getData("package-unit");
  const { mutate: addPackageUnitHandler } = useMutation({
    mutationFn: (data: any) => {
      return addPackageUnit(data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["packageUnitData"],
      });
    },
  });
  function submitHandler(values: any) {
    const data = {
      name: values.name,
      description: values.description,
    };
    addPackageUnitHandler(data);
  }
  return (
    <div className="bg-card flex flex-col justify-between p-6 rounded-md custom-shadow gap-4">
      <CreationForm {...packageUnitFormData} onSubmitForm={submitHandler} />
      <div className="bg-[linear-gradient(180deg,#0475B5_-65.62%,#1C284F_100%)] rounded-sm p-3 flex items-center justify-between px-6 text-card">
        واحد پکیج
      </div>
      <PackageUnitTable
        packageUnitList={packageUnitList}
        isCategorySubTable={false}
      />
    </div>
  );
}
function getData(formType: string) {
  const formData: formDataInterface = createFormFields(formType);
  const packageUnitFormData = {
    title: formData.title,
    fields: formData.fields,
    initialValues: formData.initialValues,
  };

  return { packageUnitFormData };
}
