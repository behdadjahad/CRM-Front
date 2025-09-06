import { MdClose } from "react-icons/md";
import CustomModal from "./custom-modal";
import { useState } from "react";
import { Button } from "../ui/button";
import { VariantProps } from "class-variance-authority";

interface AccessDeniedInterface {
  title: string;
  message?: string;

  icon?: React.ReactNode;
  variant?: any;
  className?: string;

}

export function AccessDenied({ message, icon, variant, className, title }: AccessDeniedInterface) {
  const [isOpen, setIsOpen] = useState(false);
  return (
    <>
      <Button variant={variant} className={className} onClick={() => setIsOpen(true)}>
        {icon ? icon : <></>} {title}
      </Button>
      <CustomModal
        minWidth="0"
        maxWidth="610px"
        isOpen={isOpen}
        onRequestClose={() => setIsOpen(false)}
        contentLabel="ویرایش"
        overflow="visible"
      >
        <div className="flex flex-row reverse w-full items-center justify-between p-2 pb-3">
          <span className="text-lg font-bold"> محدودیت سطح کاربری</span>
          {message && <p className="text-sm text-gray-500">{message}</p>}
          <MdClose
            size={20}
            onClick={() => {
              setIsOpen(false);

            }}
            className="cursor-pointer"
          />
        </div>
      </CustomModal>
    </>
  );
}

