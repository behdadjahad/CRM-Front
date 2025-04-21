"use client";

import Image from "next/image";
import React, { useState } from "react";
import { Button } from "../ui/button";

import SortDropDown from "../shared/sort-drop-down";
import { useFormik } from "formik";
import FormMaker from "../shared/form-maker";
import FilterDrawer from "./filter-drawer";

export default function FilterContainer() {
  const [openFilter, setOpenFilter] = useState(false);
  const formik = useFormik({
    initialValues: {
      searchBy: [],
      contractStatus: [],
      name: "",
      gender: "",
      birthdate: "",
      socialNumber: "",
      career: "",
      location: "",
      contractNumber: "",
      contractDate: "",
      startDate: "",
      endDate: "",
      sellRange: [0, 10000],
      buyRange: [0, 10000],
    },
    onSubmit: async () => {},
  });
  const filterItems = [
    // {
    //   title: "شغل مشتری",
    //   component: (
    //     <FormMaker
    //       form={formik}
    //       fields={[

    //       ]}
    //       className="flex flex-row w-full"
    //     />
    //   ),
    // },
    // {
    //   title: "امتیاز رضایتمندی",
    //   component: (
    //     <FormMaker
    //       form={formik}
    //       fields={[

    //       ]}
    //       className="flex flex-row w-full"
    //     />
    //   ),
    // },
    {
      title: "وضعیت پیگیری",
      component: (
        <FormMaker
          form={formik}
          fields={[
            {
              key: "searchBy",
              component: "checkbox",
              placeholder: "جست‌وجو بر اساس",
              type: "text",
              className: "w-full items-start p-0",
              options: [
                { label: "پیگیری کامل", value: "completed" },
                { label: "نیاز به تماس", value: "contract" },
                { label: "درانتظار", value: "pending" },
              ],
            },
              ]}
              
          className="flex flex-row w-full gap-y-2"
        />
      ),
    },
  ];
  const rangeItems = [
    {
      title: "محدوده تاریخ ثبت",
      component: (
        <FormMaker
          form={formik}
          fields={[
            {
              key: "startDate",
              component: "date",
              placeholder: "از تاریخ",
              type: "text",
              floating: true,
              className: "w-full px-0",
            },
            {
              key: "endDate",
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
  return (
    <div className="flex items-center gap-4 text-sm">
      <Button
        onClick={() => setOpenFilter(true)}
        variant={"ghost"}
        className="flex items-center gap-2"
      >
        <Image src={"/icons/filter.png"} alt="Filter" width={24} height={24} />

        <span>فیلتر</span>
      </Button>

      {/* <Button variant={"ghost"} className='flex items-center gap-2'>
        <Image src={'/icons/sort-ascending.png'} alt='Sort' width={24} height={24} />

        <span>
          مرتب سازی بر اساس
        </span>
      </Button> */}
      <SortDropDown />

      <FilterDrawer
        setState={setOpenFilter}
        state={openFilter}
        filterItems={filterItems}
        rangeItems={rangeItems}
      />
    </div>
  );
}
