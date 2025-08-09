"use client";

import ReactPaginate from "react-paginate";
import FilterContainer from "../section/filter-container";
import FormMaker, { OptionType } from "../shared/form-maker";
import LeadTable from "./lead-table";
import { useFormik } from "formik";
import ExportDataContainer from "../shared/export-data-container";
import { useDispatch, useSelector } from "react-redux";
import LeadCreationContainer from "./lead-creation-container";
import { fetchAllLeads, fetchLeads } from "@/store/lead-slice";
import { useEffect, useState } from "react";
import { getLeadTags } from "@/api/lead";
import { useQuery } from "@tanstack/react-query";
import { leadHeaderLabels } from "@/lib/utils";

export interface LeadContainerInterface {
  leadList: {
    id: number;
    list: {
      label: string;
      value: string;
    }[];
    exportData: any;
  }[];
}

export default function LeadContainer({ leadList }: LeadContainerInterface) {
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
  const limitFormik = useFormik({
    initialValues: {
      limit: 5,
    },
    onSubmit: async () => {},
  });
  const leadSearchFormik = useFormik({
    initialValues: {
      leadKeyWord: "",
    },
    onSubmit: async () => {},
  });
  function searchSubmitHandler() {
    // dispatch(setCheckedItems([]));
    const searchValue = leadSearchFormik.values.leadKeyWord;
    dispatch(
      fetchLeads({
        page: 1,
        limit: limit,
        filters: {
          keyword: searchValue,
        },
      })
    );
  }
  const pages = useSelector((state: any) => state.lead.totalPages);
  const limit = useSelector((state: any) => state.lead.limit);
  const currentPage = useSelector((state: any) => state.lead.currentPage);
  const filters = useSelector((state: any) => state.lead.filters);
  const total = useSelector((state: any) => state.lead.total);
  const allItems = useSelector((state: any) => state.lead.allItems);
  const checkedItems = useSelector((state: any) => state.lead.checkedItems);
  const dateTimeRange = useSelector((state: any) => state.lead.dateTimeRange);
  const handlePageChange = (selectedItem: any) => {
    const selectedPage = selectedItem.selected + 1;
    dispatch(
      fetchLeads({
        page: selectedPage,
        limit: limit,
        filters: filters,
      })
    );
  };
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

  // const rangeItems = [
  //   {
  //     title: "محدوده تاریخ ثبت",
  //     component: (
  //       <FormMaker
  //         form={formik}
  //         fields={[
  //           {
  //             key: "startDate",
  //             dependantKey: "startDateType",
  //             component: "date",
  //             placeholder: "از تاریخ",
  //             type: "text",
  //             floating: true,
  //             className: "w-full px-0",
  //           },
  //           {
  //             key: "endDate",
  //             dependantKey: "endDateType",
  //             component: "date",
  //             placeholder: "تا تاریخ",
  //             type: "text",
  //             floating: true,
  //             className: "w-full items-start p-0",
  //           },
  //         ]}
  //         className="flex flex-row w-full"
  //       />
  //     ),
  //   },
  // ];
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
        filters: filterData,
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

  return (
    <div className="bg-card rounded-lg p-6">
      <div className="gap-4 flex flex-col">
        <div className="flex flex-row items-center justify-between">
          <FilterContainer
            onFilterHandler={() => {
              submitFilter();
            }}
            rangeItems={[]}
            filterItems={filterItems}
            sortList={[]}
            onSortHandler={() => {}}
            onCancleHandler={() => {}}
          />
          <div className="flex gap-4">
            <LeadCreationContainer />
            <ExportDataContainer
              headerLabels={leadHeaderLabels}
              list={allItems}
              onGetData={getDataHandler}
              loading={isLoading}
              checkedItems={checkedItems}
              dateTimeRange={dateTimeRange}
            />
          </div>
        </div>
        <div className="bg-card flex flex-col justify-between pb-6 rounded-md custom-shadow ">
          <div className="bg-[linear-gradient(180deg,#0475B5_-65.62%,#1C284F_100%)] rounded-sm p-3 flex items-center justify-between px-6">
            <FormMaker
              form={leadSearchFormik}
              fields={[
                {
                  key: "leadKeyWord",
                  component: "input",
                  icon: "/icons/search-icon.png",
                  type: "text",
                  placeholder: "جستجوی درخواست ها",

                  className: "rounded-md h-12 p-0 w-1/2",
                  onClick: searchSubmitHandler,
                },
              ]}
              className="w-full"
            />
          </div>

          <LeadTable leadList={leadList} />
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
                    // options: buildRowOptions(total, Math.ceil(total / 10)),
                    options: [],
                    menuPlacement: "top",
                    onChange: (data: any) => {
                      // limitHandler(Number(data.value));
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
