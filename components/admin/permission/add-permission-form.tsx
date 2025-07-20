import Page from "@/app/(admin-layout)/admin/page/page";
import CustomModal from "@/components/shared/custom-modal";
import FormMaker from "@/components/shared/form-maker";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { useFormik } from "formik";
import { useState } from "react";
import { FaPlus } from "react-icons/fa";
import { MdClose } from "react-icons/md";
import PageSelectionInfinitieTable from "../tables/page-selection-table";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { addPermission } from "@/api/admin";

export default function AddPermissionForm() {
  const queryClient = useQueryClient();
  const [openModal, setOpenModal] = useState<boolean>(false);
  const formik = useFormik({
    initialValues: {
      name: "",
      description: "",
      pages: {},
    },
    onSubmit: async () => {},
    enableReinitialize: true,
  });

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
      accessesJson: values.pages ,
    };
    addPermissionHandler(data);
  }
  return (
    <>
      <Button
        variant={"transparent"}
        onClick={() => {
          setOpenModal(true);
        }}
        className={cn("text-aqua-foreground flex justify-end w-full")}
      >
        <FaPlus />
        افزودن دسترسی
      </Button>
      <CustomModal
        minWidth="0"
        maxWidth="900px"
        isOpen={openModal}
        onRequestClose={() => setOpenModal(false)}
        contentLabel=""
      >
        <div className="flex flex-row reverse w-full items-center justify-between p-2 pb-5">
          <span className="text-lg font-bold"> افزودن دسترسی</span>
          <MdClose
            size={20}
            onClick={() => {
              setOpenModal(false);
            }}
            className="cursor-pointer"
          />
        </div>
        <div className="flex flex-col gap-4">
          <FormMaker
            form={formik}
            fields={[
              {
                key: "name",
                component: "input",
                placeholder: "نام",
                type: "text",
                floating: true,
                labelClassName: "w-full",
                className: "w-full md:w-1/2",
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
          <PageSelectionInfinitieTable
            onSendPageData={(data) => {
              formik.setFieldValue("pages", data);
            }}
          />

          <div className="flex flex-row gap-4 items-center justify-end">
            <Button
              variant={"info"}
              onClick={() => {
                submitHandler(formik.values);
                setOpenModal(false);
                formik.resetForm();
              }}
            >
              ثبت
            </Button>
            <Button
              variant={"foreground"}
              onClick={() => {
                setOpenModal(false);
                formik.resetForm();
              }}
            >
              لغو
            </Button>
          </div>
        </div>
      </CustomModal>
    </>
  );
}
