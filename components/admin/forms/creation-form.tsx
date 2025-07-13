import CustomModal from "@/components/shared/custom-modal";
import FormMaker, { FieldType } from "@/components/shared/form-maker";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { useFormik } from "formik";

import { useState } from "react";
import { FaPlus } from "react-icons/fa";

import { MdClose } from "react-icons/md";
export interface CreationFormInterface {
  fields: FieldType[];
  initialValues: any;
  onSubmitForm: (values: any) => void;
  title: string;
}
export default function CreationForm({
  title,
  fields,
  initialValues,
  onSubmitForm,
}: CreationFormInterface) {
  const [openModal, setOpenModal] = useState<boolean>(false);
  const formik = useFormik({
    initialValues: initialValues,
    onSubmit: async () => {},
    enableReinitialize: true,
  });
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
        افزودن {title}
      </Button>
      <CustomModal
        minWidth="0"
        maxWidth="700px"
        isOpen={openModal}
        onRequestClose={() => setOpenModal(false)}
        contentLabel=""
      >
        <div className="flex flex-row reverse w-full items-center justify-between p-2 pb-5">
          <span className="text-lg font-bold"> افزودن {title}</span>
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
          fields={fields}
          className="flex flex-row w-full"
        />
        <div className="flex flex-row gap-4 items-center justify-end">
          <Button
            variant={"info"}
            onClick={() => {
              onSubmitForm(formik.values);
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
      </CustomModal>
    </>
  );
}
