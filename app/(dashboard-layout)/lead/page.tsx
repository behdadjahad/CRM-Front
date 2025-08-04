"use client";

import LeadContainer from "@/components/lead/lead-container";
import Breadcrumb from "@/components/shared/breadcrumb";
import Title from "@/components/shared/title";
import { fetchLeads } from "@/store/lead-slice";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";

export default function Lead() {
  const dispatch = useDispatch<any>();
  const limit = useSelector((state: any) => state.lead.limit);
  const filters = useSelector((state: any) => state.lead.limit);
  
  useEffect(() => {
    dispatch(
      fetchLeads({
        page: 1,
        limit: limit,
        filters: filters,
      })
    );
  }, [dispatch]);
  const leadList = [
    {
      id: 1,
      list: [
        {
          label: "نام و نام خانوادگی",
          value: "مینا فرجاد",
        },
        {
          label: "ایمیل",
          value: "MinaFarjad@gmail.com",
        },
        {
          label: "شماره تماس",
          value: "۰۹۱۷۷۸۹۵۲۳۶",
        },
        {
          label: "نوع درخواست",
          value: "تور داخلی",
        },
        {
          label: "ثبت درخواست",
          value: "ایمیل",
        },
        {
          label: "وضعیت",
          value: "از دست رفته",
        },
        {
          label: "آخرین پیگیری توسط",
          value: "۱۴۰4/1/16",
        },

        {
          label: "مسئول پیگیری",
          value: "سیما احدی",
        },
        {
          label: "زمان ثبت درخواست",
          value: "۱۴۰4/1/16",
        },
      ],
    },
  ];
  return (
    <main className="flex flex-col">
      <Title label="درخواست ها" />

      <Breadcrumb
        list={[
          {
            label: "داشبورد",
            link: "/",
          },
          {
            label: "درخواست ها",
          },
        ]}
      />

      <LeadContainer leadList={leadList} />
    </main>
  );
}
