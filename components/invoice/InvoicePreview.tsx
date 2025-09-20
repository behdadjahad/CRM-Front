import { useState } from "react";
import { Button } from "../ui/button";
import Image from "next/image";
import CustomModal from "../shared/custom-modal";
import { MdClose } from "react-icons/md";
export default function InvoicePreview() {
  const [isOpen, setIsOpen] = useState(false);
  return (
    <>
      <Button
        className="border border-[#212B36] text-[#212B36] rounded-xl font-thin px-2 py-1"
        onClick={(e) => {
          e.preventDefault();
          e.stopPropagation();
          setIsOpen(true);
        }}
      >
        <Image
          src={"/icons/eye-icon.svg"}
          alt="preview"
          width={1024}
          height={1024}
          className="w-4 h-4"
        />
        <span>مشاهده</span>
      </Button>
      <CustomModal
        minWidth="0"
        maxWidth="610px"
        isOpen={isOpen}
        onRequestClose={() => {
          setIsOpen(false);
        }}
        contentLabel=""
        overflow="visible"
      >
        <div className="flex flex-row reverse w-full items-center justify-between p-2 pb-3">
          <span></span>
          <MdClose
            size={20}
            onClick={(e) => {
              setIsOpen(false);
              e.preventDefault();
              e.stopPropagation();
            }}
            className="cursor-pointer flex justify-end"
          />
        </div>
        <div className="flex flex-col items-center gap-6"></div>
      </CustomModal>
    </>
  );
}
