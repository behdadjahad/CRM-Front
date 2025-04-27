"use client";

import { useState } from "react";
import CustomerTabContent from "./customer-tab-content";
import FilterContainer from "../section/filter-container";
import { useFormik } from "formik";
import FormMaker from "../shared/form-maker";
import { contractStatusOptions } from "@/constants/customer-filter-fields";
import { limitForCustomers } from "@/lib/utils";
import { fetchCustomers } from "@/store/customer-slice";
import { useDispatch } from "react-redux";
export default function CustomerTabContainer({ tabList }: { tabList: any[] }) {
  const [activeTab, setActiveTab] = useState(tabList[0]);
  const dispatch = useDispatch<any>();
  /**/
  const formik = useFormik({
    initialValues: {
      contractStatus: "",
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
              key: "contractStatus",
              component: "checkbox",
              placeholder: "وضعیت پیگیری",
              type: "text",
              className: "w-full items-start p-0",
              options: contractStatusOptions,
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
  function submitFilter() {
    const filters = {
      // contractStatus: formik.values.contractStatus,
      contractStatus: "Sign",
    };
    dispatch(
      fetchCustomers({
        page: 1,
        limit: limitForCustomers,
        filters: filters,
      })
    );
  }
  const customerSortlist = [
    {
      label: "پرفروش ترین ها",
      value: "MostSold",
    },
    { label: "ارزان ترین", value: "MostCheap" },
    { label: "گران ترین", value: "MostExpensive" },

    { label: "جدید ترین ها", value: "Newest" },
    { label: "قدیمی ترین ها", value: "Oldest" },
  ];
  return (
    <div className="bg-card rounded-lg p-6">
      <div>
        <FilterContainer
          onFilterHandler={submitFilter}
          rangeItems={rangeItems}
          filterItems={filterItems}
          sortList={customerSortlist}
        />
      </div>
      <div className="flex items-center justify-between  border border-[#DCE0E4] rounded-lg">
        {tabList.map((tab: any) => (
          <button
            key={tab}
            className={`w-full text-center h-full py-2 ${
              activeTab === tab
                ? "border-b-2 border-black font-bold text-black"
                : "text-neutral-500"
            }`}
            onClick={() => setActiveTab(tab)}
          >
            {tab.toUpperCase()}
          </button>
        ))}
      </div>

      <div className="mt-4 h-full">
        {activeTab === "" && <CustomerTabContent />}
        
      </div>
    </div>
  );
}
