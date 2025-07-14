import CustomModal from "@/components/shared/custom-modal";

import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

import { useState } from "react";
import { FaPlus } from "react-icons/fa";
import { MdClose } from "react-icons/md";
import AddPackageUnitToCategoryForm from "./add-package-unit-to-category-form";
export interface AddCategoryToPackageInterface {
  packageId: number;
}
export default function AddPackageUnitToCategory() {
  const [openModal, setOpenModal] = useState(false);
  const [addedPackageUnitForms, setAddedPackageUnitForms] = useState<any[]>([
    {
      id: `package-unit-form-1`,
    },
  ]);
  function addPackageUnitForm() {
    setAddedPackageUnitForms([
      ...addedPackageUnitForms,
      {
        id: `package-unit-form-${addedPackageUnitForms.length + 1}`,
      },
    ]);
  }
  function deletePackageUnitForm(formId: string) {
    const updatedAddedPackageUnitForm = addedPackageUnitForms.filter(
      (item) => item.id !== formId
      );
      setAddedPackageUnitForms(updatedAddedPackageUnitForm)
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
        {addedPackageUnitForms.map((item, index) => (
          <AddPackageUnitToCategoryForm
            key={item.id}
            formId={item.id}
            onAddForm={addPackageUnitForm}
            onDeleteForm={deletePackageUnitForm}
            isFirstItem={index === 0}
          />
        ))}

        <div className="flex flex-row gap-4 items-center justify-end">
          <Button variant={"info"} onClick={() => {}}>
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
