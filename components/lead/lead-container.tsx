"use client";

import ReactPaginate from "react-paginate";
import FilterContainer from "../section/filter-container";
import FormMaker from "../shared/form-maker";
import LeadTable from "./lead-table";
import { useFormik } from "formik";
import ExportDataContainer from "../shared/export-data-container";
import { useSelector } from "react-redux";

export interface LeadContainerInterface {
  leadList: {
    id: number;
    list: {
      label: string;
      value: string;
    }[];
  }[];
}

export default function LeadContainer({ leadList }: LeadContainerInterface) {
  const limitFormik = useFormik({
    initialValues: {
      limit: 5,
    },
    onSubmit: async () => {},
  });
  const pages = useSelector((state: any) => state.lead.totalPages);
  return (
    <div className="bg-card rounded-lg p-6">
      <div className="gap-4 flex flex-col">
        <div className="flex flex-row items-center justify-between">
          <FilterContainer
            onFilterHandler={() => {}}
            rangeItems={[]}
            filterItems={[]}
            sortList={[]}
            onSortHandler={() => {}}
            onCancleHandler={() => {}}
          />
          <ExportDataContainer
            onGetData={()=>{}}
            list={[]}
            headerLabels={[]}
            loading={false}
            checkedItems={[]}
            dateTimeRange={{}}
          />
        </div>
        <div className="bg-card flex flex-col justify-between pb-6 rounded-md custom-shadow ">
          <div className="bg-[linear-gradient(180deg,#0475B5_-65.62%,#1C284F_100%)] rounded-sm p-3 flex items-center justify-between px-6 text-card">
            درخواست ها
          </div>

          <LeadTable leadList={leadList} />
          <div className="grid grid-cols-3 custom-shadow bg-card p-3 rounded-md">
            <div className="col-span-2 w-full">
              {pages > 1 && (
                <ReactPaginate
                  breakLabel="..."
                  nextLabel="صفحه بعد"
                  previousLabel="صفحه قبل"
                  onPageChange={() => {}}
                  pageRangeDisplayed={2}
                  marginPagesDisplayed={3}
                  forcePage={1}
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
