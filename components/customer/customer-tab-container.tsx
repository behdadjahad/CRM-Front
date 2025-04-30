"use client";

import { useEffect, useState } from "react";
import CustomerTabContent from "./customer-tab-content";
import FilterContainer from "../section/filter-container";
import { useFormik } from "formik";
import FormMaker from "../shared/form-maker";
import {
  contractStateOptions,
  followUpOptions,
  serviceOptions,
} from "@/constants/customer-filter-fields";
import { limitForCustomers } from "@/lib/utils";
import { fetchCustomers } from "@/store/customer-slice";

import { useDispatch, useSelector } from "react-redux";
export default function CustomerTabContainer({ tabList }: { tabList: any[] }) {
  const [activeTab, setActiveTab] = useState(tabList[0]);
  const dispatch = useDispatch<any>();
  /**/
  const priceOptions = Array.from({ length: 11 }, (_, i) => {
    const value = (i * 10000000).toString(); // string value
    return {
      label: `${i * 10} میلیون تومان`, // display label
      value, // string value
    };
  });
  const formik = useFormik({
    initialValues: {
      name: "",
      family: "",
      career: "",
      scoreRange: [1, 10],
      minSellPrice: 0,
      maxSellPrice: 0,
      services: [],
      contractState: [],
      followupStatus: [],
    },
    onSubmit: async () => {},
  });

  const filterItems = [
    {
      title: "اطلاعات مشتری",
      component: (
        <FormMaker
          form={formik}
          fields={[
            {
              key: "name",
              component: "input",
              placeholder: "نام",
              type: "text",
              floating: true,
              labelClassName: "w-full",
              className: "w-full px-0",
            },
            {
              key: "family",
              component: "input",
              placeholder: "نام خانوادگی",
              type: "text",
              floating: true,
              labelClassName: "w-full",
              className: "w-full px-0",
            },

            {
              key: "career",
              component: "input",
              placeholder: "شغل",
              type: "text",
              floating: true,
              labelClassName: "w-full",
              className: "w-full px-0",
            },
          ]}
          className="flex flex-row w-full gap-y-2"
        />
      ),
    },
    {
      title: "سرویس ها",
      component: (
        <FormMaker
          form={formik}
          fields={[
            {
              key: "services",
              component: "checkbox",
              placeholder: "سرویس ها",
              type: "text",
              className: "w-full items-start p-0",
              options: serviceOptions,
            },
          ]}
          className="flex flex-row w-full gap-y-2"
        />
      ),
    },
    {
      title: "وضعیت پیگیری",
      component: (
        <FormMaker
          form={formik}
          fields={[
            {
              key: "followupStatus",
              component: "checkbox",
              placeholder: "وضعیت پیگیری",
              type: "text",
              className: "w-full items-start p-0",
              options: followUpOptions,
            },
          ]}
          className="flex flex-row w-full gap-y-2"
        />
      ),
    },
    {
      title: "وضعیت قرارداد",
      component: (
        <FormMaker
          form={formik}
          fields={[
            {
              key: "contractState",
              component: "checkbox",
              placeholder: "وضعیت قرارداد",
              type: "text",
              className: "w-full items-start p-0",
              options: contractStateOptions,
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
    {
      title: "محدوده امتیاز",
      component: (
        <FormMaker
          form={formik}
          fields={[
            {
              key: "scoreRange",
              component: "slider",
              placeholder: "",
              type: "text",
              className: "w-full items-start p-0",
              range: { max: 10, min: 1, step: 1 },
            },
          ]}
          className="flex flex-row w-full"
        />
      ),
    },
    {
      title: "محدوده مبلغ درآمد",
      component: (
        <FormMaker
          form={formik}
          fields={[
            {
              key: "minSellPrice",
              component: "Select",
              placeholder: "واردکردن مبلغ",
              type: "text",
              floating: true,
              className: "w-full  px-0",
              options: priceOptions,
            },
            {
              key: "maxSellPrice",
              component: "Select",
              placeholder: "حداکثرقیمت",
              type: "text",
              floating: true,
              className: "w-full items-start p-0",
              options: priceOptions,
            },
          ]}
          className="flex flex-row w-full"
        />
      ),
    },
  ];
  function submitFilter() {
    const filters = {
      customerName: formik.values.name,
      customerLastName: formik.values.family,
      customerJob: formik.values.career,
      // satisfactionScore: formik.values.scoreRange,
      satisfactionScore: 4,
      contractState: formik.values.contractState,
      followUpStatus: formik.values.followupStatus,
      // followUpDateTimeRangeStart: "2000-01-01T00:00:00Z",
      // followUpDateTimeRangeEnd: "2030-01-01T00:00:00Z",
      avServices: formik.values.services,
      // dateTimeRangeStart: "2000-01-01T00:00:00Z",
      // dateTimeRangeEnd: "2030-01-01T00:00:00Z",
      minPrice: Number(formik.values.minSellPrice),
      maxPrice: Number(formik.values.maxSellPrice),
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
      label: "نام مشتری(الف-ی)",
      value: "",
    },
    { label: "نام مشتری(ی-الف)", value: "" },
    { label: "گران ترین", value: "MostExpensive" },

    { label: "جدید ترین ها", value: "Newest" },
    { label: "قدیمی ترین ها", value: "Oldest" },
  ];
  const customerList = useSelector((state: any) => state.customer.items);

  function setTabData(tabKey: string) {
    const filters: any = {};
    const today = new Date();
    const start = new Date(
      Date.UTC(today.getUTCFullYear(), today.getUTCMonth(), today.getUTCDate())
    ); // Today 00:00 UTC
    const end = new Date(start);
    end.setUTCDate(end.getUTCDate() + 1);
    switch (tabKey) {
      case "امروز":
        filters.dateTimeRangeStart = start.toISOString();
        filters.dateTimeRangeEnd = end.toISOString();
        break;
      case "5روز آینده":
 
        const endDate = new Date(start);
        end.setUTCDate(end.getUTCDate() + 5); // 5 days ahead
        filters.dateTimeRangeStart = start.toISOString();
        filters.dateTimeRangeEnd = endDate.toISOString();
        break;
      case "گذشته و رسیدگی نشده":
        filters.dateTimeRangeEnd = start.toISOString();
        break;
      default:
        break;
    }
    dispatch(
      fetchCustomers({
        page: 1,
        limit: limitForCustomers,
        filters: filters,
      })
    );
  }
  useEffect(() => {
    dispatch(
      fetchCustomers({
        page: 1,
        limit: limitForCustomers,
        filters: {},
      })
    );
  }, [dispatch]);

  return (
    <div className="bg-card rounded-lg p-6">
      <div>
        <FilterContainer
          onFilterHandler={() => {
            submitFilter();
            formik.resetForm();
          }}
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
            onClick={() => {
              setActiveTab(tab);
              setTabData(tab);
            }}
          >
            {tab.toUpperCase()}
          </button>
        ))}
      </div>

      <div className="mt-4 h-full">
        {activeTab === "همه مشتری ها" && (
          <CustomerTabContent customerList={customerList} />
        )}
           {activeTab === "امروز" && (
          <CustomerTabContent customerList={customerList} />
        )}
           {activeTab === "5روز آینده" && (
          <CustomerTabContent customerList={customerList} />
        )}
{/*        
           {activeTab === "گذشته و رسیدگی نشده" && (
          <CustomerTabContent customerList={customerList} />
        )} */}
       
      </div>
    </div>
  );
}
