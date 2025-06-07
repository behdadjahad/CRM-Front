import React, { forwardRef } from "react";
import Image from "next/image";
import { Checkbox } from "../ui/checkbox";

type CustomerInfiniteCardProps = {
  customer: {
    id: number;
    firstName: string;
    idNumber: string;
    job: string;
    lastName: string;
    phone: string;
    email: string;
    };
    onCheckCustomerhandler: any;
};


const CustomerInfiniteCard = forwardRef<HTMLElement, CustomerInfiniteCardProps>(
    ({ customer, onCheckCustomerhandler }, ref) => {
        console.log(customer)
    const customerInfiniteCardContent = (
      <div
        key={customer.id}
        className="border border-gray-200 p-3 rounded-md cursor-pointer flex items-center justify-between"
      >
        <div className="flex items-center gap-2">
          <Checkbox
            onCheckedChange={(checked) =>
              onCheckCustomerhandler(customer.id, Boolean(checked))
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
                {customer.firstName + " " + customer.lastName}
              </span>
              <span className="text-sm text-foreground-mute">
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
          <span>{customer.phone}</span>
        </div>
        <div className="flex items-center text-foreground-mute gap-2">
          <Image
            src={"/icons/customerID.png"}
            alt="edit"
            width={18}
            height={18}
          />
          <span>{customer.idNumber}</span>
        </div>
      </div>
    );

    const content = ref ? (
      <article  ref={ref}>
        {customerInfiniteCardContent}
      </article>
    ) : (
      <article >{customerInfiniteCardContent}</article>
    );

    return content;
  }
);

CustomerInfiniteCard.displayName = "CustomerInfinite";

export default CustomerInfiniteCard;
