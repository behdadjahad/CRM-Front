


import {
  createFormFields,
  formDataInterface,
} from "@/constants/admin-creation-form-fields";
import { addLabel, addPackage } from "@/api/admin";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useSelector } from "react-redux";
import { cleanFormatPrice } from "@/lib/utils";
import { LabelInterface } from "@/app/(admin-layout)/admin/label/page";
import CreationForm from "../forms/creation-form";
import LabelTable from "../tables/label-table";

export interface LabelContainerInterface {
  labelList: LabelInterface[];
}
export default function LabelContainer({
  labelList,
}: LabelContainerInterface) {
  const queryClient = useQueryClient();
  const currencyOptions = useSelector((state: any) => state.currency.items);
  const { labelFormData } = getData("label");
  const { mutate: addLabelHandler } = useMutation({
    mutationFn: (data: any) => {
      return addLabel(data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["labelData"],
      });
    },
  });
  function submitHandler(values: any) {
    const data = {
      name: values.name,
      description: values.description,
    };
    addLabelHandler(data);
  }

  return (
    <div className="bg-card flex flex-col justify-between p-6 rounded-md custom-shadow gap-4">
      <CreationForm {...labelFormData} onSubmitForm={submitHandler} />
      <div className="bg-[linear-gradient(180deg,#0475B5_-65.62%,#1C284F_100%)] rounded-sm p-3 flex items-center justify-between px-6 text-card">
        لیبل
      </div>

      <LabelTable labelList={labelList} />
    </div>
  );
  function getData(formType: string) {
    const formData: formDataInterface = createFormFields(
      formType,
      currencyOptions
    );
    const labelFormData = {
      title: formData.title,
      fields: formData.fields,
      initialValues: formData.initialValues,
    };

    return { labelFormData };
  }
}
