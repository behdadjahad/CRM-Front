import { addPackageUnitCost } from "@/api/admin";
import CustomModal from "@/components/shared/custom-modal";
import FormMaker from "@/components/shared/form-maker";
import { Button } from "@/components/ui/button";
import { cleanFormatPrice, cn } from "@/lib/utils";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useFormik } from "formik";

import { useState } from "react";
import { FaPlus } from "react-icons/fa";
import { MdClose } from "react-icons/md";
import { useSelector } from "react-redux";

export interface AddUnitCostToPackageUnitInterface {
  packageUnitId: number;
}
export default function AddUnitCostToPackageUnit({
  packageUnitId,
}: AddUnitCostToPackageUnitInterface) {
  const [openModal, setOpenModal] = useState(false);
  const queryClient = useQueryClient();

  const currencyOptions = useSelector((state: any) => state.currency.items);

  const formik = useFormik({
    initialValues: {
      packageUnitId: packageUnitId,
      title: "",
      description: "",
      unitType: "",
      unitModel: "",
      enabledDurationInDays: "",
      showDurationInDays: "",
      countUnit: "",
      price: "",
      currencyId: "",
    },
    onSubmit: async () => {},
    enableReinitialize: true,
  });

  const { mutate: addUnitCostHandler } = useMutation({
    mutationFn: (data: any) => {
      return addPackageUnitCost(data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["packageUnitData"],
      });

      setOpenModal(false);
      formik.resetForm();
    },
  });
  function addUnitCostToPackageUnitHandler(values: any) {
    const data = {
      packageUnitId: values.packageUnitId,
      title: values.title,
      description: values.description,
      unitType: values.unitType,
      unitModel: values.unitModel,
      enabledDurationInDays: Number(values.enabledDurationInDays),
      showDurationInDays: Number(values.showDurationInDays),
      countUnit: Number(values.countUnit),
      price: Number(cleanFormatPrice(values.price)),
      currencyId: Number(values.currency),
    };
    addUnitCostHandler(data);
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
        افزودن هزینه به واحد پکیج
      </Button>

      <CustomModal
        minWidth="0"
        maxWidth="700px"
        isOpen={openModal}
        onRequestClose={() => setOpenModal(false)}
        contentLabel="افزودن هزینه به واحد پکیج"
      >
        <div className="flex flex-row reverse w-full items-center justify-between p-2 pb-5">
          <span className="text-lg font-bold"> افزودن هزینه</span>
          <MdClose
            size={20}
            onClick={() => {
              setOpenModal(false);
            }}
            className="cursor-pointer"
          />
        </div>
        <div>
          {" "}
          <FormMaker
            form={formik}
            fields={[
              {
                key: "title",
                component: "input",
                placeholder: "عنوان",
                type: "text",
                floating: true,
                labelClassName: "w-full",
                className: "w-full md:w-1/2",
              },
              {
                key: "unitType",
                component: "Select",
                placeholder: "نوع فروش واحد",
                type: "text",
                floating: true,
                labelClassName: "w-full",
                className: "w-full md:w-1/2",
                options: [
                  { label: "اجاره", value: "rent" },
                  { label: "فروش", value: "sale" },
                ],
              },
              {
                key: "unitModel",
                component: "Select",
                placeholder: "مدل فروش واحد",
                type: "text",
                floating: true,
                labelClassName: "w-full",
                className: "w-full md:w-1/2",
                options: [
                  { label: "مدت زمانی", value: "perDuration" },
                  { label: "تعدادی", value: "perCount" },
                  { label: "کامل", value: "flat" },
                ],
              },
              {
                key: "countUnit",
                component: "input",
                placeholder: "تعداد",
                type: "number",
                floating: true,
                labelClassName: "w-full",
                className: "w-full md:w-1/2",
              },
              {
                key: "enabledDurationInDays",
                component: "input",
                placeholder: "مدت زمان امکان تعامل (روز)",
                type: "number",
                floating: true,
                labelClassName: "w-full",
                className: "w-full md:w-1/2",
              },
              {
                key: "showDurationInDays",
                component: "input",
                placeholder: "مدت زمان امکان نمایش (روز)",
                type: "number",
                floating: true,
                labelClassName: "w-full",
                className: "w-full md:w-1/2",
              },
              {
                key: "price",
                component: "input",
                placeholder: "قیمت",
                formatted:true,
                type: "text",
                floating: true,
                labelClassName: "w-full",
                className: "w-full md:w-1/2",
              },
              {
                key: "currency",
                component: "Select",
                placeholder: "ارز",
                type: "text",
                floating: true,
                labelClassName: "w-full",
                className: "w-full md:w-1/2",
                options: currencyOptions,
              },
              {
                key: "description",
                component: "input",
                placeholder: "توضیحات",
                type: "text",
                floating: true,
                labelClassName: "w-full",
                className: "w-full md:w-1/2",
              },
            ]}
            className="flex flex-row w-full"
          />
        </div>
        <div className="flex flex-row gap-4 items-center justify-end">
          <Button
            variant={"info"}
            onClick={() => {
              addUnitCostToPackageUnitHandler(formik.values);
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
