import { MdClose } from "react-icons/md";
import CustomModal from "./custom-modal";
import { useState } from "react";
import { Button } from "../ui/button";
import { ActionType } from "../admin/requests/admin-requests-table";
export interface ActionDropDownContentInterface {
  label: string;
  onActionHandler: (actionType: ActionType) => void;
  actionType: ActionType;
}
export default function ActionDropDownContent({
  label,
  onActionHandler,
  actionType,
}: ActionDropDownContentInterface) {
  const [isOpen, setIsOpen] = useState(false);
  console.log(actionType);
  return (
    <>
      <div
        className={`text-foreground text-xs cursor-pointer hover:bg-static-border-neutral w-full text-right rounded-sm p-2 bg-card"
        //   activeItem === label ? "" : ""
        `}
        onClick={() => {
          setIsOpen(true);
        }}
      >
        {label}
        {/* {activeItem === item.value} */}
      </div>

      <CustomModal
        minWidth="0"
        maxWidth="610px"
        isOpen={isOpen}
        onRequestClose={() => {
          setIsOpen(false);
        }}
        contentLabel="عملیات"
        overflow="visible"
      >
        <div className="flex flex-row reverse w-full items-center justify-between p-2 pb-3">
          <span></span>
          <MdClose
            size={20}
            onClick={() => {
              setIsOpen(false);
            }}
            className="cursor-pointer flex justify-end"
          />
        </div>
        <div className="flex flex-col items-center">
          <span className="text-lg font-bold mb-4">
            آیا از انجام این عملیات مطمئن هستید؟
          </span>
          <div className="flex items-center gap-2">
            {" "}
            <Button
              variant={"info"}
              onClick={() => {
                onActionHandler(actionType);

                console.log("ok clicked");
              }}
            >
              بله مطمئنم
            </Button>
            <Button
              variant={"foreground"}
              onClick={() => {
                setIsOpen(false);
              }}
            >
              لغو
            </Button>
          </div>
        </div>
      </CustomModal>
    </>
  );
}
