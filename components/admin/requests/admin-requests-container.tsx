"use client";

import React, { useState } from "react";

import AdminRequestsTable from "./admin-requests-table";
import FilterContainer from "@/components/section/filter-container";
import FormMaker from "@/components/shared/form-maker";
import { useFormik } from "formik";

import { useDispatch, useSelector } from "react-redux";
import { RootState } from "@/store";
import { fetchAllInvoices, fetchInvoice } from "@/store/admin-invoice-slice";
import ReactPaginate from "react-paginate";
import { buildRowOptions } from "@/lib/utils";
import ExportDataContainer from "@/components/shared/export-data-container";
import { convertToGregorian } from "@/lib/date";
import {
  filterPaymantStatusOptions,
  invoiceHeaderLabels,
} from "@/constants/invoice-constants";

interface AdminRequestsContainerInterface {
  requestList: any[];
}

export default function AdminRequestsContainer({
  requestList,
}: AdminRequestsContainerInterface) {
  const [isLoading, setIsLoading] = useState(false);
  const dispatch = useDispatch<any>();
  const limit = useSelector((state: RootState) => state.adminInvoice.limit);
  const limitFormik = useFormik({
    initialValues: {
      limit: limit,
    },
    onSubmit: async () => {},
  });
  const formik = useFormik({
    initialValues: {
      searchTerm: "",
      paymentStatus: "",
      amountFrom: "",
      amountTo: "",
      dateFrom: "",
      dateTo: "",
      dateFromType: "",
      dateToType: "",
    },
    onSubmit: async () => {},
  });

  // const filterItems = FILTER_ITEMS.map((item) => ({
  //   ...item,
  //   component: (
  //     <FormMaker
  //       form={formik}
  //       fields={[item.component(formik)]}
  //       className="flex flex-row w-full"
  //     />
  //   ),
  // }));
  const filterItems = [
    {
      title: "وضعیت درخواست",
      component: (
        <FormMaker
          form={formik}
          fields={[
            {
              key: "paymentStatus",
              component: "radio",

              type: "text",
              className: "flex flex-col  items-start",
              options: filterPaymantStatusOptions,
            },
          ]}
          className="w-full"
        />
      ),
    },
  ];
  const rangeItems = [
    {
      title: "محدوده تاریخ سفارش",
      component: (
        <FormMaker
          form={formik}
          fields={[
            {
              key: "dateFrom",
              dependantKey: "dateFromtype",
              component: "date",
              placeholder: "از تاریخ",
              type: "text",
              floating: true,
              className: "w-full px-0",
            },
            {
              key: "dateTo",
              dependantKey: "dateToType",
              component: "date",
              placeholder: "تا تاریخ",
              type: "text",
              floating: true,
              className: "w-full items-start p-0",
            },
          ]}
          className="flex flex-row w-full"
        />
      ),
    },
  ];

  const submitFilter = () => {
    const filterData = {
      ...filters,
      paymentStatus: formik.values.paymentStatus,
      dateTo: convertToGregorian(
        formik.values.dateTo,
        formik.values.dateToType
      ),
      dateFrom: convertToGregorian(
        formik.values.dateFrom,
        formik.values.dateToType
      ),
    };
    dispatch(
      fetchInvoice({
        page: 1,
        limit: limit,
        filters: filterData,
      })
    );
  };

  const cancelFilter = () => {
    formik.resetForm();
    dispatch(
      fetchInvoice({
        page: 1,
        limit: limit,
        filters: {},
      })
    );
  };

  const submitSort = (itemValue: string, type?: string) => {
    // Sorting can be implemented here if needed
    console.log("Sort applied:", itemValue, type);
  };
  const pages = useSelector(
    (state: RootState) => state.adminInvoice.totalPages
  );
  const currentPage = useSelector(
    (state: RootState) => state.adminInvoice.currentPage
  );

  const total = useSelector(
    (state: RootState) => state.adminInvoice.totalItems
  );
  const filters = useSelector((state: RootState) => state.adminInvoice.filters);
  const handlePageChange = (selectedItem: any) => {
    const selectedPage = selectedItem.selected + 1;
    dispatch(
      fetchInvoice({
        page: selectedPage,
        limit: limit,
        filters: filters,
      })
    );
  };
  function limitHandler(data: any) {
    dispatch(
      fetchInvoice({
        page: 1,
        limit: Number(data),
        filters: filters,
      })
    );
  }
  const getDataHandler = async () => {
    setIsLoading(true);

    try {
      return await dispatch(
        fetchAllInvoices({
          page: 1,
          limit: total,
          filters: filters,
        })
      );
    } finally {
      setIsLoading(false);
    }
  };
  const allItems = useSelector((state: any) => state.adminInvoice.allItems);
  const checkedItems = useSelector(
    (state: any) => state.adminInvoice.checkedItems
  );
  const dateTimeRange = useSelector(
    (state: any) => state.adminInvoice.dateTimeRange
  );
  return (
    <div className="bg-card rounded-lg p-6">
      <div className="gap-4 flex flex-col">
        <div className="flex flex-row items-center justify-between">
          <FilterContainer
            onFilterHandler={submitFilter}
            rangeItems={rangeItems}
            filterItems={filterItems}
            sortList={[]}
            onCancleHandler={cancelFilter}
            onSortHandler={submitSort}
          />
          <ExportDataContainer
            headerLabels={invoiceHeaderLabels}
            list={allItems}
            onGetData={getDataHandler}
            loading={isLoading}
            checkedItems={checkedItems}
            dateTimeRange={dateTimeRange}
          />
          <></>
        </div>
        <div className="bg-card flex flex-col justify-between pb-6 rounded-md custom-shadow">
          <div className="bg-[linear-gradient(180deg,#0475B5_-65.62%,#1C284F_100%)] rounded-sm p-3 flex items-center justify-between px-6">
            <FormMaker
              form={formik}
              fields={[
                {
                  key: "searchTerm",
                  component: "input",
                  icon: "/icons/search-icon.png",
                  type: "text",
                  placeholder:
                    "جستجو بر اساس شماره فاکتور، نام کاربر یا پکیج...",
                  className: "rounded-md h-12 p-0 w-full",
                },
              ]}
              className="w-full"
            />
          </div>
          <AdminRequestsTable requestList={requestList} />
          <div className="grid grid-cols-3 custom-shadow bg-card p-3 rounded-md">
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
                    options: buildRowOptions(total, Math.ceil(total / 10)),

                    menuPlacement: "top",
                    onChange: (data: any) => {
                      limitHandler(Number(data?.value));
                    },
                  },
                ]}
                className="flex flex-row justify-end items-start"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
