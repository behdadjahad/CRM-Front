"use client";

import React, {  useEffect } from "react";

import AdminRequestsContainer from "@/components/admin/requests/admin-requests-container";
import Breadcrumb from "@/components/shared/breadcrumb";
import Title from "@/components/shared/title";

import { useDispatch, useSelector } from "react-redux";
import { RootState } from "@/store";
import { fetchInvoice } from "@/store/admin-invoice-slice";
export interface requestInterface {
  id: number;
  list: { label: string; value: string }[];
  data: RequestDataInterface;
}
export interface RequestDataInterface {
  id: number;
  price: string;
}
export default function AdminInvoices() {
  const dispatch = useDispatch<any>();
  useEffect(() => {
    dispatch(
      fetchInvoice({
        page: 1,
        limit: limit,
        filters: {},
      })
    );
  }, [dispatch]);
  const requestList = useSelector(
    (state: RootState) => state.adminInvoice.items
  );
  const limit = useSelector((state: RootState) => state.adminInvoice.limit);
  console.log(requestList);
  return (
    <main className="flex flex-col">
      <Title label="مدیریت درخواست‌ها" />

      <Breadcrumb
        list={[
          {
            label: "ادمین",
            link: "/",
          },
          {
            label: "درخواست‌ها",
          },
        ]}
      />

      {/* Statistics Cards */}
      {/* <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4 mb-8 p-6">
        {STATS_CARDS.map((card) => (
          <div
            key={card.key}
            className="bg-white rounded-lg border border-gray-200 p-6"
          >
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <div
                  className={`w-8 h-8 ${card.className} rounded-full flex items-center justify-center`}
                >
                  <span className="text-sm font-medium">{card.icon}</span>
                </div>
              </div>
              <div className="mr-4">
                <p className="text-sm font-medium text-gray-500">
                  {card.label}
                </p>
                <p className="text-2xl font-bold text-gray-900">
                  {statusCounts[card.key as keyof typeof statusCounts]}
                </p>
              </div>
            </div>
          </div>
        ))}
      </div> */}

      {/* Requests Container */}
      <AdminRequestsContainer requestList={requestList} />
    </main>
  );
}
