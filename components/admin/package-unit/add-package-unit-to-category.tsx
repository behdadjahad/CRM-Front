import CustomModal from "@/components/shared/custom-modal";

import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

import { useState } from "react";
import { FaPlus } from "react-icons/fa";
import { MdClose } from "react-icons/md";
import AddPackageUnitToCategoryForm from "./add-package-unit-to-category-form";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import {  addPackageUnitToCategory } from "@/api/admin";
export interface AddPackageUnitToCategoryInterface {
 categoryId: number;
}
export default function AddPackageUnitToCategory({categoryId}: AddPackageUnitToCategoryInterface) {
  const queryClient = useQueryClient();
  const [openModal, setOpenModal] = useState(false);

  const [formValues, setFormValues] = useState<any[]>([]);
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
    setAddedPackageUnitForms(updatedAddedPackageUnitForm);
    setFormValues((prev) => prev.filter((item) => item.id !== formId));
  }
  const { mutate: addPackageUnit } = useMutation({
    mutationFn: ({id,data}:{ id: number; data: any }) => {
      return addPackageUnitToCategory(id,data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["categoryData"],
      });

      setOpenModal(false);
      setFormValues([]);
      setAddedPackageUnitForms([
        {
          id: `package-unit-form-1`,
        },
      ]);
    },
  });
  function addPackageUnitToCategoryHandler() {
    console.log(formValues)
    const packageUnits = formValues.map((item) => ({
      packageUnitId: item.packageUnit,
      packageUnitCostId: item.unitCost,
    })).filter((item)=>(item.packageUnitId && item.packageUnitCostId));
    const data = {
      packageUnits: packageUnits,
    };
    addPackageUnit({id: categoryId, data: data});
  }

  function handleFormChange(formId: string, values: any) {
  setFormValues((prev) => [
    ...prev.filter((item) => item.id !== formId),
    { ...values, id: formId }, 
  ]);
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
            onFormChange={handleFormChange}
          />
        ))}

        <div className="flex flex-row gap-4 items-center justify-end">
          <Button
            variant={"info"}
            onClick={() => {
              addPackageUnitToCategoryHandler();
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
