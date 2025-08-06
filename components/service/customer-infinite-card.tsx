import React, { forwardRef, useState } from "react";
import Image from "next/image";
import { Checkbox } from "../ui/checkbox";
export interface CustomerDataInterface {
  id?: number;
  firstName: string;
  idNumber: string;
  job?: string;
  lastName: string;
  phone: string;
  email: string;
}
export interface CustomerInfiniteCardInterface {
  customer: CustomerDataInterface;
  onCheckCustomerhandler?: any;
  searchKeyWord: string;
  onSendSelectedCustomer?: (customer: CustomerDataInterface) => void;
  isActive?: boolean;
}

const highlightMatch = (text: string, keyword: string) => {
  if (!text || !keyword) return text;

  const escapedKeyword = keyword
    .trim()
    .replace(/[-\/\\^$*+?.()|[\]{}]/g, "\\$&");
  const regex = new RegExp(escapedKeyword, "gi");

  return text.split(regex).reduce<React.ReactNode[]>((acc, part, i, arr) => {
    acc.push(part);
    if (i < arr.length - 1) {
      acc.push(
        <span key={i} className="text-yellow-600 font-bold">
          {text.match(regex)?.[i]}
        </span>
      );
    }
    return acc;
  }, []);
};

const CustomerInfiniteCard = forwardRef<
  HTMLElement,
  CustomerInfiniteCardInterface
>(
  (
    {
      customer,
      onCheckCustomerhandler,
      searchKeyWord,
      onSendSelectedCustomer,
      isActive,
    },
    ref
  ) => {
    const customerInfiniteCardContent = (
      <div
        key={customer.id}
        className={`border p-3 rounded-md cursor-pointer flex items-center justify-between ${
          isActive ? " border-[#F8AC3F]" : " border-gray-200"
        }`}
        onClick={() => {
          if (onSendSelectedCustomer) {
            if (isActive) {
              return;
            } else {
              if (customer.id) onSendSelectedCustomer(customer);
            }
          } else {
            return;
          }
        }}
      >
        <div className="flex items-center gap-2">
          {onCheckCustomerhandler && (
            <Checkbox
              onCheckedChange={(checked) =>
                onCheckCustomerhandler(customer.id, Boolean(checked))
              }
              // checked={isChecked}
            />
          )}
          <div className="flex items-center gap-2">
            {" "}
            <div className="rounded-full flex items-center justify-center bg-[#F5F5F5] border border-gray-200 w-10 h-10">
              <Image
                src={"/icons/customer.png"}
                alt="edit"
                width={18}
                height={18}
              />
            </div>
            <div className="flex flex-col">
              <span className="text-sm font-primary-bold">
                <>
                  {/* {customer.firstName + " " + customer.lastName} */}
                  {highlightMatch(customer.firstName, searchKeyWord)}{" "}
                  {highlightMatch(customer.lastName, searchKeyWord)}
                </>
              </span>

              <span className="text-sm text-foreground-mute">
                {highlightMatch(customer.email, searchKeyWord)}
                {/* {customer.email} */}
              </span>
            </div>
          </div>
        </div>
        <div className="flex items-center text-foreground-mute gap-2">
          <Image
            src={"/icons/customerMobile.png"}
            alt="edit"
            width={12}
            height={12}
          />
          <span>
            {/* {customer.phone} */}
            {highlightMatch(customer.phone, searchKeyWord)}
          </span>
        </div>
        <div className="flex items-center text-foreground-mute gap-2">
          <Image
            src={"/icons/customerID.png"}
            alt="edit"
            width={18}
            height={18}
          />
          <span>
            {/* {customer.idNumber} */}
            {highlightMatch(customer.idNumber, searchKeyWord)}
          </span>
        </div>
      </div>
    );

    const content = ref ? (
      <article ref={ref} >{customerInfiniteCardContent}</article>
    ) : (
      <article>{customerInfiniteCardContent}</article>
    );

    return content;
  }
);

CustomerInfiniteCard.displayName = "CustomerInfinite";

export default CustomerInfiniteCard;
