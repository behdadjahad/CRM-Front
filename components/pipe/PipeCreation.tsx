import { useState } from "react";
import CustomModal from "../shared/custom-modal";
import { MdClose } from "react-icons/md";
import { Button } from "../ui/button";

export default function PipeCreation() {
  const [openModal, setOpenModal] = useState<boolean>(false);
  return (
    <>
      <div className="h-full  rounded-xl border border-dashed border-[2px] border-[#D2D6DB] p-3">
        <Button
          onClick={() => {
            setOpenModal(true);
          }}
          variant={"transparent"}
          className="w-full text-xs border-b rounded-none text-[#717680]"
        >
          پایپ جدید
        </Button>
      </div>
      <CustomModal
        minWidth="0"
        maxWidth="700px"
        isOpen={openModal}
        onRequestClose={() => setOpenModal(false)}
        contentLabel=""
      >
        <div className="flex flex-row reverse w-full items-center justify-between p-2 pb-5">
          <span className="text-lg font-bold"></span>
          <MdClose
            size={20}
            onClick={() => {
              setOpenModal(false);
            }}
            className="cursor-pointer"
          />
        </div>
      </CustomModal>
    </>
  );
}
