import CustomModal from "@/components/shared/custom-modal";

import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

import { useState } from "react";
import { FaPlus } from "react-icons/fa";
import { MdClose } from "react-icons/md";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { addPackageUnitToCategory, getPackageUnit } from "@/api/admin";
import FormMaker, { OptionType } from "@/components/shared/form-maker";
import { useFormik } from "formik";
export interface AddPackageUnitToCategoryInterface {
  categoryId: number;
}
export default function AddPackageUnitToCategory({
  categoryId,
}: AddPackageUnitToCategoryInterface) {
  const [openModal, setOpenModal] = useState(false);
   const queryClient = useQueryClient();
  const { data: packageUnitData } = useQuery({
    queryKey: ["packageUnitData"],
    queryFn: async () => await getPackageUnit(),
  });
  const { packageUnitOptions } = getData(packageUnitData);
  const formik = useFormik({
    initialValues: {
      categoryId: categoryId,
      packageUnit: null,
    },

    onSubmit: () => {},
  });
  const { mutate: addCategoryhandler } = useMutation({
    mutationFn: ({ id, data }: { id: number; data: any }) => {
      return addPackageUnitToCategory(id, data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["categoryData"],
      });
      queryClient.invalidateQueries({
        queryKey: ["packageData"],
      });

      setOpenModal(false);
      formik.resetForm();
    },
  });
  function addPackageUnitToCategoryHandler(values: any) {
    const id = values.categoryId;
    const data ={
  packageUnits: [
    {
      packageUnitId: values.packageUnit
    }
  ]
};
    addCategoryhandler({
      id: id,
      data: data,
    });
  }
  return (
    <div className="flex items-center justify-between flex-col gap-4">
      <Button
        variant={"transparent"}
        onClick={() => {
          setOpenModal(true);
        }}
        className={cn("text-aqua-foreground text-xs")}
      >
        <FaPlus />
        افزودن واحد پکیج به دسته بندی
      </Button>

      <CustomModal
        minWidth="0"
        maxWidth="700px"
        isOpen={openModal}
        onRequestClose={() => setOpenModal(false)}
        contentLabel="افزودن واحد پکیج به دسته بندی"
      >
        <div className="flex flex-row reverse w-full items-center justify-between p-2 pb-5">
          <span className="text-lg font-bold"> افزودن واحد پکیج</span>
          <MdClose
            size={20}
            onClick={() => {
              setOpenModal(false);
            }}
            className="cursor-pointer"
          />
        </div>
        <FormMaker
          form={formik}
          fields={[
            {
              key: "packageUnit",
              component: "Select",
              placeholder: "واحد پکیج",
              type: "text",
              className: "w-full md:w-1/3",
              options: packageUnitOptions,
            },
          ]}
          className="flex flex-row items-center"
        />

        <div className="flex flex-row gap-4 items-center justify-end">
          <Button
            variant={"info"}
            onClick={() => {
              addPackageUnitToCategoryHandler(formik.values);
            }}
          >
            ثبت
          </Button>
          <Button
            variant={"foreground"}
            onClick={() => {
              setOpenModal(false);
            }}
          >
            لغو
          </Button>
        </div>
      </CustomModal>
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
