import { useState } from "react";
import CustomModal from "../shared/custom-modal";
import { MdClose } from "react-icons/md";

export interface EventCreationContainerInterface {
  trigger?: React.ReactElement;
}
export default function EventCreationContainer({
  trigger,
}: EventCreationContainerInterface) {
  const [openModal, setOpenModal] = useState<boolean>(false);
  return (
    <>
      {trigger ? (
        <div
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
            setOpenModal(true);
          }}
          className="cursor-pointer"
        >
          <div style={{ pointerEvents: "none" }}>{trigger}</div>
        </div>
      ) : (
        <></>
      )}
      <CustomModal
        minWidth="0"
        maxWidth="700px"
        isOpen={openModal}
        onRequestClose={() => setOpenModal(false)}
        contentLabel=""
      >
        <div className="flex flex-col gap-4">
          {" "}
          <div className="flex flex-row reverse w-full items-center justify-between">
            <span className="text-sm font-bold">افزودن رویداد</span>
            <MdClose
              size={20}
              onClick={() => {
                setOpenModal(false);
              }}
              className="cursor-pointer"
            />
          </div>
        </div>
      </CustomModal>
    </>
  );
}
