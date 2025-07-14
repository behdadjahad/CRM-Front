import { getPackageUnit } from "@/api/admin";
import FormMaker, { OptionType } from "@/components/shared/form-maker";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { useQuery } from "@tanstack/react-query";
import { useFormik } from "formik";
import { useEffect } from "react";
import { FaMinus, FaPlus } from "react-icons/fa";

export interface AddPackageUnitToCategoryFormInterface {
  onAddForm: () => void;
  isFirstItem?: boolean;
  onDeleteForm: (formId: string) => void;
  formId: string;
  onFormChange: (formId: string, values: any) => void;
}

export default function AddPackageUnitToCategoryForm({
  onAddForm,
  isFirstItem,
  onDeleteForm,
  formId,
  onFormChange,
}: AddPackageUnitToCategoryFormInterface) {
  const { data: packageUnitData } = useQuery({
    queryKey: ["packageUnitData"],
    queryFn: async () => await getPackageUnit(),
  });
  const { packageUnitOptions } = getData(packageUnitData);
  const formik = useFormik({
    initialValues: {
      packageUnit: "",
      unitCost: "",
    },

    onSubmit: () => {},
  });
  useEffect(() => {
    onFormChange(formId, formik.values);
  }, [formik.values]);
  return (
    <div>
      <FormMaker
        form={formik}
        fields={[
          isFirstItem
            ? {
                key: "action",
                component: "non-field",
                children: (
                  <Button
                    variant={"transparent"}
                    onClick={() => {
                      onAddForm();
                    }}
                    className={cn("w-7 h-7  rounded-full flex p-0 bg-aqua")}
                  >
                    <FaPlus className="text-white" />
                  </Button>
                ),
                className: "w-fit",
              }
            : {
                key: "action",
                component: "non-field",
                children: (
                  <Button
                    variant={"transparent"}
                    onClick={() => {
                      onDeleteForm(formId);
                    }}
                    className={cn("w-7 h-7  rounded-full flex p-0 bg-aqua")}
                  >
                    {" "}
                    <FaMinus className="text-white text-sm" />
                  </Button>
                ),

                className: "w-fit",
              },
          {
            key: "packageUnit",
            component: "Select",
            placeholder: "واحد پکیج",
            type: "text",
            className: "w-full md:w-1/3",
            options: packageUnitOptions,
          },
          {
            key: "unitCost",
            component: "Select",
            placeholder: "واحد هزینه",
            type: "text",
            className: "w-full md:w-1/3",
            options: [],
          },
        ]}
        className="flex flex-row items-center"
      />
    </div>
  );
}
function getData(packageUnitData: any) {
  const packageUnitOptions: OptionType[] = packageUnitData?.data?.map(
    (item: any) => ({
      label: item.name,
      value: item.id,
    })
  );
  return { packageUnitOptions };
}
