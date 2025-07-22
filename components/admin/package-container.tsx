import {
  PackageDataInterface,
  PackageInterface,
} from "@/app/(admin-layout)/admin/package/page";
import CreationForm from "./forms/creation-form";
import PackageTable from "./tables/package-table";
import {
  createFormFields,
  formDataInterface,
} from "@/constants/admin-creation-form-fields";
import { addPackage } from "@/api/admin";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useSelector } from "react-redux";
import { cleanFormatPrice } from "@/lib/utils";
import TagContainer from "./tag-container";
export interface PackageContainerInterface {
  packageList: PackageInterface[];
}
export default function PackageContainer({
  packageList,
}: PackageContainerInterface) {
  const queryClient = useQueryClient();
  const currencyOptions = useSelector((state: any) => state.currency.items);
  const { packageFormData } = getData("package");
  const { mutate: addPackageHandler } = useMutation({
    mutationFn: (data: any) => {
      return addPackage(data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["packageData"],
      });
    },
  });
  function submitHandler(values: any) {
    const data = {
      title: values.title,
      description: values.description,
      price: Number(cleanFormatPrice(values.price)),
      currencyId: values.currency,
    };
    addPackageHandler(data);
  }

  return (
    <div className="bg-card flex flex-col justify-between p-6 rounded-md custom-shadow gap-4">
      <CreationForm {...packageFormData} onSubmitForm={submitHandler} />
      <div className="bg-[linear-gradient(180deg,#0475B5_-65.62%,#1C284F_100%)] rounded-sm p-3 flex items-center justify-between px-6 text-card">
        پکیج
      </div>

      <PackageTable packageList={packageList} />
    </div>
  );
  function getData(formType: string) {
    const formData: formDataInterface = createFormFields(
      formType,
      currencyOptions
    );
    const packageFormData = {
      title: formData.title,
      fields: formData.fields,
      initialValues: formData.initialValues,
    };

    return { packageFormData };
  }
}
