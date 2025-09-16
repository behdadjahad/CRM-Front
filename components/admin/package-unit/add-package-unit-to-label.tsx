import { addPackageUnitToLabel, getPackageCategory } from "@/api/admin";
import CustomModal from "@/components/shared/custom-modal";
import FormMaker from "@/components/shared/form-maker";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useFormik } from "formik";
import { useState } from "react";
import { FaPlus } from "react-icons/fa";
import { MdClose } from "react-icons/md";
export interface AddPackageUnitToLabelInterface {
  labelId: number;
}
export default function AddPackageUnitToLabel({
  labelId,
}: AddPackageUnitToLabelInterface) {
  const queryClient = useQueryClient();
  const { data: packageUnitData } = useQuery({
    queryKey: ["packageUnitData"],
    queryFn: async () => await getPackageCategory(),
  });
  const { packageUnitList } = getData(packageUnitData);
  const [openModal, setOpenModal] = useState(false);
  const formik = useFormik({
    initialValues: {
      labelId: labelId,
      packageUnits: "",
    },
    onSubmit: async () => {},
    enableReinitialize: true,
  });
  const { mutate: addPackageUnitHandler } = useMutation({
    mutationFn: ({ id, data }: { id: number; data: any }) => {
      return addPackageUnitToLabel(id, data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["labelData"],
      });

      setOpenModal(false);
      formik.resetForm();
    },
  });
  function addPackageUnitToLabelHandler(values: any) {
    const id = values.labelId;
    const ids = values.packageUnits;
    const data = { ids: ids };
    addPackageUnitHandler({
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
        افزودن واحد پکیج به لیبل
      </Button>

      <CustomModal
        minWidth="0"
        maxWidth="700px"
        isOpen={openModal}
        onRequestClose={() => setOpenModal(false)}
        contentLabel="افزودن  واحد پکیج به لیبل"
      >
        <div className="flex flex-row reverse w-full items-center justify-between p-2 pb-5">
          <span className="text-lg font-bold"> افزودن  واحد پکیج</span>
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
                key: "packageUnits",
                dependantKey:"packageUnitPreview",
                component: "multi-select",
                placeholder: "واحد پکیج",
                type: "text",
                className: "w-full md:w-1/2",
                options: packageUnitList,
              },
               {
              key: "packageUnitPreview",
              component: "tag-preview",
              className: "w-full",
            },
            ]}
            className="flex flex-row w-full"
          />
        </div>
        <div className="flex flex-row gap-4 items-center justify-end">
          <Button
            variant={"info"}
            onClick={() => {
              addPackageUnitToLabelHandler(formik.values);
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
  const packageUnitList = packageUnitData?.data?.map((item: any) => ({
    value: item.id,
    label: item.name,
  }));

  return { packageUnitList };
}
