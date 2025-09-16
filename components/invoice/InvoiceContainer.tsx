import { cn, formatPrice } from "@/lib/utils";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../ui/tabs";
import { useState } from "react";
import InvoiceCard from "./InvoiceCard";
import InvoiceList from "./InvoiceList";

interface InvoiceContainerInterface {
  tabList: { label: string; value: string }[];
  className?: string;
  defaultValue: { label: string; value: string };
}
const listItems = [
  {id: 1,
    title: "عنوان سفارش کاربر",
    description: "خلاصه توضیحات سفارش کاربر",
    paymentDates: [
      {
        label: "تاریخ سفارش",
        value: "1404/05/08",
      },
      {
        label: "مهلت پرداخت",
        value: "1404/07/15",
      },
      {
        label: "تاریخ پرداخت",
        value: "1404/07/15",
      },
    ],
    status: {
      label: "پرداخت شده",
      className:
        "bg-green-100 text-green-800 px-2 py-1 rounded-lg text-sm font-medium",
    },
    price: { amount: formatPrice("16000000"), currency: "تومان" },
    actions: [

      {
        label: "مشاهده",
        icon: "/icons/eye-icon.svg",
      },
            {
        label: "دانلود",
        icon: "/icons/download-icon.svg",
      },
    ],
  },
];
export default function InvoiceContainer({
  tabList,
  className,
  defaultValue,
}: InvoiceContainerInterface) {
  const [activeTab, setActiveTab] = useState(defaultValue?.value);
  return (
    <>
      <Tabs
        defaultValue={defaultValue.value}
        value={activeTab}
        onValueChange={setActiveTab}
        className={cn("w-full hidden md:block", className)}
        activationMode="automatic"
      >
        <TabsList className="w-full flex flex-row-reverse">
          {tabList.map((item) => (
            <TabsTrigger
              key={`trigger-${item.label}`}
              value={item.value}
              className="w-full"
            >
              {item.label}
            </TabsTrigger>
          ))}
        </TabsList>
        {tabList.map((item) => (
          <TabsContent
            key={`content-${item.label}`}
            value={item.value}
            className="w-full gap-8 p-0 flex flex-col bg-card"
          >
            <InvoiceList data={listItems} />
          </TabsContent>
        ))}
      </Tabs>
    </>
  );
}
