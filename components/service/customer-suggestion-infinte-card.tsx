import React, { forwardRef } from "react";
import Image from "next/image";
import { Checkbox } from "../ui/checkbox";

type CustomerSuggestionInfiniteCardProps = {
  customer: {
    id: number;
    firstName: string;
    idNumber: string;
    job: string;
    lastName: string;
    phone: string;
    email: string;
  };

  onFillCustomerHandler: any;
};

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

const CustomerSuggestionInfiniteCard = forwardRef<
  HTMLElement,
  CustomerSuggestionInfiniteCardProps
>(({ customer, onFillCustomerHandler }, ref) => {
  const customerInfiniteCardContent = (
    <div
      key={customer.id}
      className="border border-gray-200 p-3 rounded-md cursor-pointer flex items-center justify-between"
      onClick={() => {
        onFillCustomerHandler(customer);
      }}
    >
      <div className="flex items-center gap-2">
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
              <>{customer.firstName + " " + customer.lastName}</>
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
    <article ref={ref}>{customerInfiniteCardContent}</article>
  ) : (
    <article>{customerInfiniteCardContent}</article>
  );

  return content;
});

CustomerSuggestionInfiniteCard.displayName = "CustomerSuggestionInfinite";

export default CustomerSuggestionInfiniteCard;
