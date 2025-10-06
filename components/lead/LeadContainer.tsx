"use client";

import { useDispatch, useSelector } from "react-redux";
import LeadCreationContainer from "./lead-creation-container";
import LeadPipeContainer from "./LeadPipeContainer";
import { fetchAllLeads, fetchLeads, setCheckedItems } from "@/store/lead-slice";
import { useFormik } from "formik";
import FormMaker, { OptionType } from "../shared/form-maker";
import FilterContainer from "../section/filter-container";
import { useEffect, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { usePageData } from "@/hooks/usePageData";
import { getLeadTags } from "@/api/lead";
import { leadHeaderLabels } from "@/lib/utils";
import ExportDataContainer from "../shared/export-data-container";
import { Button } from "../ui/button";
import LeadTableContainer from "./LeadTableContainer";
import { CustomerDataInterface } from "../service/customer-infinite-card";
import { AccessDenied } from "../shared/AccessDenied";
import { generateFeatureAccess } from "@/lib/generatePageData";
import Image from "next/image";
import ViewToggleGroup from "../shared/ViewToggleGroup";
import { leadViewOptions } from "@/constants/lead";
export interface LeadContainerInterface {
  className?: string;
}
export interface PipeInterface {
  title: string;
  leadList: any[];
  overal: {
    label: string;
    value: string;
  }[];
}
export const leadPipeList = [
  {
    title: "ایجاد شده",
    leadList: [
      {
        main: { owner: "مهدی میرزایی", date: "1404/02/17" },
        list: [
          { label: "نوع درخواست", value: "ویزا" },
          { label: "منبع ", value: "ایمیل" },
          { label: "مسئول پیگیری", value: "سیما احمدی" },
          { label: "آخرین پیگیری", value: "1404/02/17" },
          { label: "تخمین درآمد", value: "132,528,000,000 تومان" },
        ],
      },
      {
        main: { owner: "مهدی میرزایی", date: "1404/02/17" },
        list: [
          { label: "نوع درخواست", value: "ویزا" },
          { label: "منبع ", value: "ایمیل" },
          { label: "مسئول پیگیری", value: "سیما احمدی" },
          { label: "آخرین پیگیری", value: "1404/02/17" },
          { label: "تخمین درآمد", value: "132,528,000,000 تومان" },
        ],
      },
    ],
    overal: [
      { label: "تعداد درخواست", value: "7" },
      { label: "مجموع پیشبینی ارزش:", value: "7,073,721 تومان" },
    ],
  },
  {
    title: "درجریان",
    leadList: [
      {
        main: { owner: "مهدی میرزایی", date: "1404/02/17" },
        list: [
          { label: "نوع درخواست", value: "ویزا" },
          { label: "منبع ", value: "ایمیل" },
          { label: "مسئول پیگیری", value: "سیما احمدی" },
          { label: "آخرین پیگیری", value: "1404/02/17" },
          { label: "تخمین درآمد", value: "132,528,000,000 تومان" },
        ],
      },
      {
        main: { owner: "مهدی میرزایی", date: "1404/02/17" },
        list: [
          { label: "نوع درخواست", value: "ویزا" },
          { label: "منبع ", value: "ایمیل" },
          { label: "مسئول پیگیری", value: "سیما احمدی" },
          { label: "آخرین پیگیری", value: "1404/02/17" },
          { label: "تخمین درآمد", value: "132,528,000,000 تومان" },
        ],
      },
    ],
    overal: [
      { label: "تعداد درخواست", value: "7" },
      { label: "مجموع پیشبینی ارزش:", value: "7,073,721 تومان" },
    ],
  },
  {
    title: "پیگیری",
    leadList: [
      {
        main: { owner: "مهدی میرزایی", date: "1404/02/17" },

        list: [
          { label: "نوع درخواست", value: "ویزا" },
          { label: "منبع ", value: "ایمیل" },
          { label: "مسئول پیگیری", value: "سیما احمدی" },
          { label: "آخرین پیگیری", value: "1404/02/17" },
          { label: "تخمین درآمد", value: "132,528,000,000 تومان" },
        ],
      },
      {
        main: { owner: "مهدی میرزایی", date: "1404/02/17" },

        list: [
          { label: "نوع درخواست", value: "ویزا" },
          { label: "منبع ", value: "ایمیل" },
          { label: "مسئول پیگیری", value: "سیما احمدی" },
          { label: "آخرین پیگیری", value: "1404/02/17" },
          { label: "تخمین درآمد", value: "132,528,000,000 تومان" },
        ],
      },
    ],
    overal: [
      { label: "تعداد درخواست", value: "7" },
      { label: "مجموع پیشبینی ارزش:", value: "7,073,721 تومان" },
    ],
  },
];
export type LeadViewType = "table" | "pipe";
export interface LeadContainerInterface {
  leadList: {
    id: number;
    list: {
      label: string;
      value: string;
    }[];
    exportData: any;
    editData: {
      id: number;
      leadType: string;
      leadTag: OptionType[];
      customer: CustomerDataInterface;
      body: string;
      leadTemperature: string;
    };
  }[];
}
export default function LeadContainer({ leadList }: LeadContainerInterface) {
  const pageFeatures = usePageData();
  const [view, setView] = useState<LeadViewType>("table");
  const [leadTagOptions, setLeadTagOptions] = useState<OptionType[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const { data: leadTagData } = useQuery({
    queryKey: ["leadTagData"],
    queryFn: async () => await getLeadTags(),
  });
  useEffect(() => {
    if (leadTagData && leadTagData?.data?.length > 0) {
      const leadTags = leadTagData.data.map((leadTag: any) => ({
        label: leadTag.title,
        value: leadTag.title,
      }));
      setLeadTagOptions(leadTags);
    }
  }, [leadTagData]);
  const dispatch = useDispatch<any>();

  const pages = useSelector((state: any) => state.lead.totalPages);
  const limit = useSelector((state: any) => state.lead.limit);
  const currentPage = useSelector((state: any) => state.lead.currentPage);
  const filters = useSelector((state: any) => state.lead.filters);
  const total = useSelector((state: any) => state.lead.total);
  const allItems = useSelector((state: any) => state.lead.allItems);
  const checkedItems = useSelector((state: any) => state.lead.checkedItems);
  const dateTimeRange = useSelector((state: any) => state.lead.dateTimeRange);

  const formik = useFormik({
    initialValues: {
      leadTemperature: "",
      leadStatus: "",
      leadTag: [],
    },
    onSubmit: async () => {},
  });

  const filterItems = [
    {
      title: "علاقه مندی(سرد،گرم ، داغ)",
      component: (
        <FormMaker
          form={formik}
          fields={[
            {
              key: "leadTemperature",
              component: "radio",
              placeholder: "علاقه مندی",
              type: "text",
              className: "w-full items-start p-0",
              options: [
                {
                  label: "سرد",
                  value: "COLD",
                },
                {
                  label: "گرم",
                  value: "WARM",
                },
                {
                  label: "داغ",
                  value: "HOT",
                },
              ],
            },
          ]}
          className="flex flex-row w-full"
        />
      ),
    },
    {
      title: "وضعیت درخواست",
      component: (
        <FormMaker
          form={formik}
          fields={[
            {
              key: "leadStatus",
              component: "radio",
              placeholder: "وضعیت درخواست",
              type: "text",
              className: "flex flex-col  items-start",
              options: [
                {
                  label: "ایجاد شده",
                  value: "INITIAL",
                },
                {
                  label: "در جریان",
                  value: "INPROGRESS",
                },
                {
                  label: "تبدیل به قرارداد",
                  value: "CONTRACTED",
                },
                {
                  label: "از دست رفته",
                  value: "FAILED",
                },
              ],
            },
          ]}
          className="w-full"
        />
      ),
    },
    {
      title: "اطلاعات مشتری",
      component: (
        <FormMaker
          form={formik}
          fields={[
            {
              key: "name",
              component: "input",
              placeholder: "نام و نام خانوادگی",
              type: "text",
              floating: true,
              labelClassName: "w-full",
              className: "w-full px-0",
            },
            {
              key: "email",
              component: "input",
              placeholder: "ایمیل",
              type: "text",
              floating: true,
              labelClassName: "w-full",
              className: "w-full px-0",
            },
            {
              key: "phone",
              component: "input",
              placeholder: "تلفن همراه",
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
      title: "برچسب",
      component: (
        <FormMaker
          form={formik}
          fields={[
            {
              key: "leadTag",
              component: "multi-select",
              placeholder: "برچسب",
              type: "text",
              floating: true,
              labelClassName: "w-full",
              className: "w-full",
              options: leadTagOptions,
              isValidNewOption: true,
            },
            {
              key: "leadTagPreview",
              component: "tag-preview",
              dependantKey: "leadTag",
              className: "w-full",
            },
          ]}
          className="flex flex-row w-full gap-y-2"
        />
      ),
    },
  ];
  function submitFilter() {
    const filterData = {
      temperature: formik.values.leadTemperature,
      status: formik.values.leadStatus,
      tags: formik.values.leadTag,
    };

    dispatch(
      fetchLeads({
        page: 1,
        limit: limit,
        filters: { ...filters, ...filterData },
      })
    );
  }
  const getDataHandler = async () => {
    setIsLoading(true);

    try {
      return await dispatch(
        fetchAllLeads({
          page: 1,
          limit: total,
          filters: filters,
        })
      );
    } finally {
      setIsLoading(false);
    }
  };
  function cancleFilter() {
    formik.resetForm();
    dispatch(
      fetchLeads({
        page: 1,
        limit: limit,
        filters: {},
      })
    );
  }

  return (
    <div className="flex flex-col bg-card border rounded-xl p-6 gap-4">
      <div className="flex flex-row items-center justify-between">
        <div className="flex items-center gap-2">
          {/* <Button
            variant={"foreground"}
            onClick={() => {
              setView("table");
            }}
          >
            table
          </Button>
          <Button
            variant={"foreground"}
            onClick={() => {
              setView("pipe");
            }}
          >
            pipe
          </Button>{" "} */}
          <ViewToggleGroup
            onActive={(item: LeadViewType) => {
              setView(item);
            }}
            defaultValue={leadViewOptions?.[0].label}
            options={leadViewOptions}
            activeItem={view}
          />
          {generateFeatureAccess(pageFeatures, "filter-lead")?.show &&
            generateFeatureAccess(pageFeatures, "filter-lead")?.enable && (
              <FilterContainer
                onFilterHandler={() => {
                  submitFilter();
                }}
                rangeItems={[]}
                filterItems={filterItems}
                sortList={[]}
                onSortHandler={() => {}}
                onCancleHandler={cancleFilter}
              />
            )}
          {generateFeatureAccess(pageFeatures, "filter-lead")?.show &&
            !generateFeatureAccess(pageFeatures, "filter-lead")?.enable && (
              <AccessDenied
                variant={"foreground"}
                title="فیلتر "
                message="امکان دسترسی به این قابلیت وجود ندارد "
                icon={
                  <Image
                    src={"/icons/disable-filter.png"}
                    alt="edit"
                    width={24}
                    height={24}
                  />
                }
              />
            )}
        </div>
        <div className="flex items-center gap-2">
          {" "}
          {generateFeatureAccess(pageFeatures, "export-lead")?.show &&
            generateFeatureAccess(pageFeatures, "export-lead")?.enable && (
              <ExportDataContainer
                headerLabels={leadHeaderLabels}
                list={allItems}
                onGetData={getDataHandler}
                loading={isLoading}
                checkedItems={checkedItems}
                dateTimeRange={dateTimeRange}
              />
            )}
          {generateFeatureAccess(pageFeatures, "export-lead")?.show &&
            !generateFeatureAccess(pageFeatures, "export-lead")?.enable && (
              <AccessDenied
                variant={""}
                title="خروجی "
                message="شما به این بخش دسترسی ندارید"
                icon={
                  <Image
                    src={"/icons/disable-download.png"}
                    alt="edit"
                    width={1024}
                    height={1024}
                    className="w-4 h-4"
                  />
                }
              />
            )}
          {generateFeatureAccess(pageFeatures, "lead-action")?.show &&
            generateFeatureAccess(pageFeatures, "lead-action")?.enable && (
              <LeadCreationContainer />
            )}
          {generateFeatureAccess(pageFeatures, "lead-action")?.show &&
            !generateFeatureAccess(pageFeatures, "lead-action")?.enable && (
              <AccessDenied
                variant={""}
                title=" درخواست جدید "
                message="شما به این بخش دسترسی ندارید"
                icon={
                  <Image
                    src={"/icons/disable-plus.png"}
                    alt="edit"
                    width={1024}
                    height={1024}
                    className="w-4 h-4"
                  />
                }
              />
            )}
        </div>
      </div>
      {view === "pipe" ? (
        <LeadPipeContainer pipeList={leadPipeList} />
      ) : view === "table" ? (
        <LeadTableContainer leadList={leadList} />
      ) : (
        <></>
      )}
    </div>
  );
}
