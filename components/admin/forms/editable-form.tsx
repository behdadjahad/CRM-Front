import { PackageDataInterface } from "@/app/(admin-layout)/admin/package/page";
import CustomModal from "@/components/shared/custom-modal";
import FormMaker, { FieldType } from "@/components/shared/form-maker";
import { Button } from "@/components/ui/button";

import { useFormik } from "formik";
import Image from "next/image";
import { useState } from "react";


import { MdClose } from "react-icons/md";
export interface EditableFormInterface {
  fields: FieldType[];
  initialValues: any;
  onEditForm: (values: any) => void;
}
export default function EditableForm({
  fields,
  initialValues,
  onEditForm,
}: EditableFormInterface) {
  const [openModal, setOpenModal] = useState<boolean>(false);
  const formik = useFormik({
    initialValues: initialValues,
    onSubmit: async () => {},
    enableReinitialize: true,
  });
  return (
    <>
      <Button
        className="border-none p-0 text-[##212B36]"
        onClick={() => {
          setOpenModal(true);
        }}
      >
        <Image
          src="/icons/edit-primary.png"
          alt=""
          width={1024}
          height={1024}
          className="w-4 h-4"
          onClick={() => {}}
        />
      </Button>
      <CustomModal
        minWidth="0"
        maxWidth="700px"
        isOpen={openModal}
        onRequestClose={() => setOpenModal(false)}
        contentLabel=""
      >
        <div className="flex flex-row reverse w-full items-center justify-between p-2 pb-5">
          <span className="text-lg font-bold">ویرایش</span>
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
              onEditForm(formik.values);
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
