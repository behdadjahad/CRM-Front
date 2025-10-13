import { MdClose } from "react-icons/md";
import CustomModal from "../shared/custom-modal";
import { useState } from "react";
import { Button } from "../ui/button";
import EventCreationContainer from "./EventCreationContainer";

export default function LeadStatus() {
  const [openModal, setOpenModal] = useState<boolean>(false);
  return (
    <>
      <div
        className="flex items-center justify-center w-4 h-4 rounded-full bg-red-700 cursor-pointer"
        onClick={() => {
          setOpenModal(true);
        }}
      >
        1
      </div>
      <CustomModal
        minWidth="0"
        maxWidth="278px"
        isOpen={openModal}
        onRequestClose={() => setOpenModal(false)}
        contentLabel=""
      >
        <div className="flex flex-col gap-4">
          {" "}
          <div className="flex flex-row reverse w-full items-center justify-between">
            <span className="text-sm font-bold">پیگیری درخواست</span>
            <MdClose
              size={20}
              onClick={() => {
                setOpenModal(false);
              }}
              className="cursor-pointer"
            />
          </div>
          <div className="flex items-center w-full  justify-center gap-2">
            <Button variant={"info"} className="p-0 text-xs px-4 py-2">
              پیگیری
            </Button>
            {/* */}
            <EventCreationContainer
              trigger={
                <Button
                  variant={"foreground"}
                  className="p-0 text-xs px-4 py-2"
                >
                  افزودن رویداد
                </Button>
              }
            />
          </div>
        </div>
      </CustomModal>
    </>
  );
}
