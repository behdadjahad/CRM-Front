import { ReactNode, useState } from "react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

import { cn } from "@/lib/utils";
import { FaEllipsisH } from "react-icons/fa";
import { FaEllipsisV } from "react-icons/fa";
import { ActionType } from "../admin/requests/admin-requests-table";
import { MdClose } from "react-icons/md";
import CustomModal from "./custom-modal";

import { Button } from "../ui/button";
import DiscountActionContent from "../admin/requests/discount-action-content";
import { RequestDataInterface } from "@/app/(admin-layout)/admin/invoices/page";
export interface ActionDropDownInterface {
  list: {
    label: string;
    value: string;
    actionType: ActionType;
    content?: ReactNode;
  }[];
  onActionHandler: (actionType: ActionType,discount?:number) => void;
  requestData: RequestDataInterface;
}

export default function ActionDropDown({
  list,
  onActionHandler,
  requestData
}: ActionDropDownInterface) {
  const [isOpen, setIsOpen] = useState(false);
  const [actionType, setActionType] = useState<ActionType>("Accept");
  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger
          className={cn(
            "bg-card rounded-lg flex flex-row items-center gap-3 outline-none"
          )}
        >
          <div className="flex flex-row items-center gap-2 text-sm">
            <FaEllipsisV />
          </div>
        </DropdownMenuTrigger>

        <DropdownMenuContent>
          {" "}
          {list &&
            list.map((item, index) => (
              <div
                key={`action-content-${index}`}
                className="text-xs cursor-pointer hover:bg-[#D5D7DA] p-2 rounded-sm bg-card text-right"
                onClick={() => {
                  setIsOpen(true);
                  setActionType(item.actionType);
                }}
              >
                {item.label}
              </div>
            ))}
        </DropdownMenuContent>
      </DropdownMenu>
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
        <div className="flex flex-col items-center gap-6">
          {actionType === "Discount" ? <DiscountActionContent {...requestData} onSubmit={(discount:number)=>{onActionHandler(actionType,discount)}}/> :    
          <>
          <span className="text-[#637381] text-sm">
            آیا از انجام این عملیات مطمئن هستید؟
          </span>
          <div className="flex items-center gap-2">
            {" "}
            <Button
              variant={"info"}
              onClick={() => {
                onActionHandler(actionType);
                setIsOpen(false);
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
          </>}

  
        </div>
      </CustomModal>
    </>
  );
}
