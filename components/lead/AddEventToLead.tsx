import { MdClose } from "react-icons/md";
import CustomModal from "../shared/custom-modal";
import { useState } from "react";
import Image from "next/image";
export interface AddEventToLeadInterface {
  list: {
    label: string;
    value: string;
    icon: string;
    className?: string;
  }[];
}

export function AddEventToLead({ list }: AddEventToLeadInterface) {
  const [openModal, setOpenModal] = useState<boolean>(false);
  return (
    <>
      <div className="flex items-center w-full justify-center gap-2">
        {list.map((item, index) => (
          <div
            key={`lead-followup-type-${index}`}
            className="w-11 h-11 bg-card rounded-lg flex items-center justify-center cursor-pointer"
            onClick={() => {
              setOpenModal(true);
            }}
          >
            <Image
              src={item.icon}
              alt="edit"
              width={24}
              height={24}
              className="w-5 h-5"
            />
          </div>
        ))}
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
