import { useState } from "react";
import CustomModal from "../shared/custom-modal";
import { Button } from "../ui/button";
import Image from "next/image";
export interface DeleteConfirmationInterface {
  onDelete: () => void;
}
export default function DeleteConfirmation({
  onDelete,
}: DeleteConfirmationInterface) {
  const [openModal, setOpenModal] = useState<boolean>(false);
  return (
    <>
      <Button
        className="border-none p-0 text-[##212B36]"
        onClick={() => {
         setOpenModal(true)
        }}
      >
        <Image
          src="/icons/trash.png"
          alt=""
          width={1024}
          height={1024}
          className="w-5 h-5"
        />
      </Button>
      <CustomModal
        isOpen={openModal}
        onRequestClose={() => setOpenModal(false)}
        maxWidth="400px"
        minWidth="0"
        contentLabel="تایید عملیات"
      >
        <div className="flex flex-col justify-between p-4 gap-4">
          <div className="text-sm text-right text-gray-700 font-bold">
            آیا از حذف آیتم مورد نظر اطمینان دارید؟
          </div>
          <div className="flex justify-end gap-3 mt-4">
            <Button
              variant="transparent"
              className="w-16 h-8 bg-danger text-card"
              onClick={() => {
                setOpenModal(false);

                onDelete?.();
              }}
            >
              بله
            </Button>
            <Button
              variant="foreground"
              className="w-16 h-8"
              onClick={() => setOpenModal(false)}
            >
              خیر
            </Button>
          </div>
        </div>
      </CustomModal>
    </>
  );
}
