import React from "react";
import Image from "next/image";
import { Checkbox } from "../ui/checkbox";
export default function ServiceCustomerCard({ customer ,onCheckCustomerHandler}: { customer: any,onCheckCustomerHandler:any }) {
  return (
    <div
      key={customer.id}
      className="border border-gray-200 p-3 rounded-md cursor-pointer flex items-center justify-between"
    >
      <div className="flex items-center gap-2">
        <Checkbox
          onCheckedChange={(checked) =>
            onCheckCustomerHandler(customer.id, Boolean(checked))
          }
        // checked={isChecked}
        />
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
                {customer.firstName + " " + customer.lastName}
                {/* {highlightMatch(customer.firstName, searchKeyWord)}{" "}
                    {highlightMatch(customer.lastName, searchKeyWord)} */}
              </>
            </span>

            <span className="text-sm text-foreground-mute">
              {/* {highlightMatch(customer.email, searchKeyWord)} */}
              {customer.email}
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
          {customer.phone}
          {/* {highlightMatch(customer.phone, searchKeyWord)} */}
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
          {customer.idNumber}
          {/* {highlightMatch(customer.idNumber, searchKeyWord)} */}
        </span>
      </div>
    </div>
  );
}
