"use client";
import { MdClose } from "react-icons/md";
import CustomModal from "./custom-modal";
import { useEffect, useState } from "react";
import { Button } from "../ui/button";
import Image from "next/image";
import { cn } from "@/lib/utils";
interface AccessDeniedInterface {
  title?: string;
  message?: string;

  icon?: React.ReactNode;
  variant?: any;
  className?: string;
  state?: boolean;
  setState?: (state: boolean) => void;
}

export function AccessDenied({
  message,
  icon,
  variant,
  className,
  title,
  state,
  setState,
}: AccessDeniedInterface) {
  console.log("AccessDenied state", state);

  const [isOpen, setIsOpen] = useState(false);
  useEffect(() => {
    setIsOpen(state!);
  }, [state]);

  return (
    <>
      <Button
        variant={"disable"}
        className={cn(`${title ? "disable-shadow" : ""}`, className)}
        onClick={() => setIsOpen(true)}
      >
        {icon ? icon : <></>} {title}
      </Button>
      <CustomModal
        minWidth="0"
        maxWidth="610px"
        isOpen={isOpen}
        onRequestClose={() => {
          // setState!(false);
          setIsOpen(false);
        }}
        contentLabel="ویرایش"
        overflow="visible"
      >
        <div className="flex flex-row reverse w-full items-center justify-between p-2 pb-3">
          {/* <span className="text-lg font-bold"> محدودیت سطح کاربری</span> */}
          <span></span>
          <MdClose
            size={20}
            onClick={() => {
              setIsOpen(false);
              // setState!(false);
            }}
            className="cursor-pointer flex justify-end"
          />
        </div>
        <div className="flex flex-col items-center gap-6">
          <Image
            src={"/icons/access-alert.png"}
            alt="edit"
            width={1024}
            height={1024}
            className="w-11 h-11"
          />{" "}
          <div className="flex flex-col items-center gap-2">
            <h2>محدودیت سطح کاربری</h2>
            {message && <p className="text-sm text-gray-500">{message}</p>}
          </div>
          <Button variant={"info"}>خرید سرویس</Button>
        </div>
      </CustomModal>
    </>
  );
}
