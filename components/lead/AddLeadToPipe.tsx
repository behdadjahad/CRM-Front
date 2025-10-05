import { MdClose } from "react-icons/md";
import { Button } from "../ui/button";
import Image from "next/image";
import CustomModal from "../shared/custom-modal";
import { useState } from "react";
export default function AddLeadToPipe() {
  const [openModal, setOpenModal] = useState<boolean>(false);
  return (
    <>
      <Button variant={"foreground"} onClick={()=>{setOpenModal(true)}}>
        {" "}
        <Image
          src={"/icons/foreground-plus-icon.svg"}
          alt="plus"
          width={24}
          height={24}
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
