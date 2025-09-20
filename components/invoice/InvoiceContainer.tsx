"use client";

import { buildRowOptions, cn, formatPrice } from "@/lib/utils";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../ui/tabs";
import { useEffect, useState } from "react";

import InvoiceList from "./InvoiceList";
import { useDispatch, useSelector } from "react-redux";

import { RootState } from "@/store";
import { fetchInvoice } from "@/store/invoice-slice";
import ReactPaginate from "react-paginate";
import FormMaker from "../shared/form-maker";
import { useFormik } from "formik";

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
  const limit = useSelector((state: RootState) => state.invoice.limit);
  const limitFormik = useFormik({
    initialValues: {
      limit: limit,
    },
    onSubmit: async () => {},
  });
  const dispatch = useDispatch<any>();
  const chadcoCustomerId = useSelector(
    (state: RootState) => state.login.chadcoCustomerId
  );

  const handleTabChange = (value: string) => {
    setActiveTab(value);
    dispatch(
      fetchInvoice({
        chadcoCustomerId: chadcoCustomerId,
        page: 1,
        limit: limit,
        filters: { paymentStatus: value },
      })
    );
  };
  const listItems = useSelector((state: RootState) => state.invoice.items);
  const pages = useSelector((state: RootState) => state.invoice.totalPages);
  const currentPage = useSelector(
    (state: RootState) => state.invoice.currentPage
  );
  const total = useSelector((state: RootState) => state.invoice.total);
  const filters = useSelector((state: RootState) => state.invoice.filters);
  useEffect(() => {
    dispatch(
      fetchInvoice({
        chadcoCustomerId: chadcoCustomerId,
        page: 1,
        limit: limit,
        filters: {},
      })
    );
  }, [dispatch, chadcoCustomerId]);
  const handlePageChange = (selectedItem: any) => {
    const selectedPage = selectedItem.selected + 1;
    dispatch(
      fetchInvoice({
        chadcoCustomerId: chadcoCustomerId,
        page: selectedPage,
        limit: limit,
        filters: filters,
      })
    );
  };
  return (
    <>
      <Tabs
        defaultValue={defaultValue.value}
        value={activeTab}
        onValueChange={handleTabChange}
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
       
            <div className="flex flex-row-reverse custom-shadow bg-card p-3 rounded-md">
              <div className="w-3/4">
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
                    containerClassName="w-full relative flex justify-center items-center flex-row-reverse"
                    pageClassName="mx-3 rounded-md"
                    pageLinkClassName="rounded-md text-sm hover:bg-gray-100 w-10 h-10 flex items-center justify-center"
                    activeClassName="bg-gray-100 rounded-md"
                    previousClassName="absolute right-8"
                    previousLinkClassName="rounded-md text-sm"
                    nextClassName="absolute left-8"
                    nextLinkClassName="rounded-md text-sm"
                    disabledClassName="opacity-50 cursor-not-allowed"
                  />
                )}
              </div>

              <div className="flex items-center justify-start w-1/4">
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
                      options: buildRowOptions(total, Math.ceil(total / 10)),
                      menuPlacement: "top",
                      onChange: (data: any) => {
                        // limitHandler(Number(data?.value));
                      },
                    },
                  ]}
                  className="flex flex-row justify-start items-start"
                />
              </div>
            </div>
          </TabsContent>
        ))}
      </Tabs>
    </>
  );
}
