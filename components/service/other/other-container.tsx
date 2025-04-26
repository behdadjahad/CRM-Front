import { FaPlus } from "react-icons/fa";
import OtherForm from "./other-form";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { useState } from "react";

export default function OtherContainer() {
  const [addedOthers, setAddedOthers] = useState<any[]>([
    {
      id: "other-1",
      title: null,
      isSubmitted: false,
    },
  ]);
  function addOtherForm() {
    setAddedOthers([
      ...addedOthers,
      {
        id: `other-${addedOthers.length + 1}`,
        title: null,
        isSubmitted: false,
      },
    ]);
  }
  function removeHandler(formId: string | number) {
    const selectedOther = addedOthers.find((item) => item.id == formId);
    if (selectedOther.isSubmitted) {
      //   removeOther(selectedOther.id);
      //   const updatedAddedOthers = addedOthers.filter(
      //     (item) => item.id != formId
      //   );
      //   setAddedOthers(updatedAddedOthers);
    } else if (addedOthers.length > 1) {
      const updatedAddedOthers = addedOthers.filter(
        (item) => item.id != formId
      );
      setAddedOthers(updatedAddedOthers);
    } else return;
  }

  return (
    <div className="bg-card p-6 rounded-xl flex flex-col gap-4">
      <div className="flex justify-end">
        <Button
          variant={"transparent"}
          // onClick={}
          className={cn("text-aqua-foreground flex justify-end w-full")}
        >
          <FaPlus />
          اضافه کردن مشتری
        </Button>
        <Button
          variant={"transparent"}
          onClick={addOtherForm}
          className={cn("text-aqua-foreground flex justify-end w-full")}
        >
          <FaPlus />
          اضافه کردن فرم
        </Button>
      </div>
      {addedOthers.map((item, index) => (
        <OtherForm
          key={item.id}
          itemId={item.id}
          onRemoveHandler={removeHandler}
        />
      ))}
    </div>
  );
}
