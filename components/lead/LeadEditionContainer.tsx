import { useState } from "react";
import { Button } from "../ui/button";
import Image from "next/image";
import { MdClose } from "react-icons/md";
import CustomModal from "../shared/custom-modal";
export default function LeadEditionContainer() {
  const [openModal, setOpenModal] = useState<boolean>(false);
  return (
    <>
      <Button
        className="border-none p-0 text-[#212B36]"
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
        contentLabel="ویرایش درخواست"
      >
        <div className="flex flex-row reverse w-full items-center justify-between p-2 pb-5">
          <span className="text-lg font-bold">ویرایش درخواست</span>
          <MdClose
            size={20}
            onClick={() => {
              setOpenModal(false);
            }}
            className="cursor-pointer"
          />
        </div>
         
        <div className="flex flex-row gap-4 items-center justify-end">
          <Button
            variant={"info"}
            onClick={() => {
           
              setOpenModal(false);
          
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
    </>
  );
}
