"use client";
import { MdClose } from "react-icons/md";
import CustomModal from "./custom-modal";
import { useEffect, useState } from "react";
import { Button } from "../ui/button";
import Image from "next/image";
import { cn } from "@/lib/utils";
import { cloneElement, isValidElement } from "react";
import { useRouter } from "next/navigation";
interface AccessDeniedInterface {
  title?: string;
  message?: string;
  icon?: React.ReactNode;
  variant?: any;
  className?: string;
  trigger?: React.ReactElement;
  featureCode?: string; // Feature code to highlight in single-features page
}

export function AccessDenied({
  message,
  icon,
  variant,
  className,
  title,
  trigger,
  featureCode,
}: AccessDeniedInterface) {
  const [isOpen, setIsOpen] = useState(false);
  const router = useRouter();


  const handleBuyService = () => {
    setIsOpen(false); // Close modal first
    // Navigate with feature code as query parameter
    const url = featureCode
      ? `/single-features?highlightCode=${encodeURIComponent(featureCode)}`
      : '/single-features';
    router.push(url);

  };

  return (
    <>
      {trigger ? (
        // cloneElement(trigger, {
        //   onClick: (e: React.MouseEvent) => {
        //     if (trigger.props.onClick) {
        //       trigger.props.onClick(e);
        //     }
        //     setIsOpen(true);
        //   },
        // })
        <div
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
            setIsOpen(true);
          }}
          className="cursor-pointer"
        >
          <div style={{ pointerEvents: "none" }}>{trigger}</div>
        </div>
      ) : (
        <Button
          variant={"disable"}
          className={cn(`${title ? "disable-shadow" : ""}`, className)}
          onClick={() => setIsOpen(true)}
        >
          {icon ? icon : <></>} {title}
        </Button>
      )}

      <CustomModal
        minWidth="0"
        maxWidth="610px"
        isOpen={isOpen}
        onRequestClose={() => {
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
          <Button variant={"info"} onClick={handleBuyService}>
            خرید سرویس
          </Button>
        </div>
      </CustomModal>
    </>
  );
}
