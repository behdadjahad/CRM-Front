import { cn, formatPrice } from "@/lib/utils";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../ui/tabs";
import { useState } from "react";

import InvoiceList from "./InvoiceList";

interface InvoiceContainerInterface {
  tabList: { label: string; value: string }[];
  className?: string;
  defaultValue: { label: string; value: string };
}
const listItems = [
  {
    id: 1,
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
            {/* <div className="grid grid-cols-3 custom-shadow bg-card p-3 rounded-md">
            <div className="col-span-2 w-full">
              {pages > 1 && (
                <ReactPaginate
                  breakLabel="..."
                  nextLabel="صفحه بعد"
                  previousLabel="صفحه قبل"
                  onPageChange={handlePageChange}
                  pageRangeDisplayed={2}
                  marginPagesDisplayed={3}
                  forcePage={currentPage - 1}
                  pageCount={pages}
                  renderOnZeroPageCount={null}
                  containerClassName="w-full relative flex justify-center items-center ltr"
                  pageClassName="mx-3 rounded-md"
                  pageLinkClassName="rounded-md text-sm hover:bg-gray-100  w-10 h-10 flex items-center justify-center"
                  activeClassName="bg-gray-100 rounded-md"
                  previousClassName="absolute right-8"
                  previousLinkClassName="rounded-md text-sm"
                  nextClassName="absolute left-8"
                  nextLinkClassName="rounded-md text-sm"
                  disabledClassName="opacity-50 cursor-not-allowed"
                />
              )}
            </div>
            <div className="col-span-1 flex items-center justify-end pl-3">
              <FormMaker
                form={limitFormik}
                fields={[
                  {
                    key: "limit",
                    component: "Select",
                    placeholder: "تعدادردیف",
                    type: "text",
                    floating: true,
                    className: "w-auto text-sm placeholder:text-foreground",
                    options: buildRowOptions(
                      total, Math.ceil(total / 10)),

                    menuPlacement: "top",
                    onChange: (data: any) => {
                      // limitHandler(Number(data?.value));
                    },
                  },
                ]}
                className="flex flex-row justify-end items-start"
              />
            </div>
          </div> */}
          </TabsContent>
        ))}
      </Tabs>
    </>
  );
}
