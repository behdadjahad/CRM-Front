import { useDispatch, useSelector } from "react-redux";
import LeadTable from "./lead-table";
import { fetchLeads, setCheckedItems } from "@/store/lead-slice";
import { useState } from "react";
import ReactPaginate from "react-paginate";
import FormMaker from "../shared/form-maker";
import { useFormik } from "formik";
import { buildRowOptions } from "@/lib/utils";

export interface LeadTableContainerInterface {
  leadList: any[];
}

export default function LeadTableContainer({
  leadList,
}: LeadTableContainerInterface) {
  const dispatch = useDispatch<any>();
  const pages = useSelector((state: any) => state.lead.totalPages);
  const limit = useSelector((state: any) => state.lead.limit);
  const currentPage = useSelector((state: any) => state.lead.currentPage);
  const filters = useSelector((state: any) => state.lead.filters);
  const total = useSelector((state: any) => state.lead.total);
  const [hasReset, setHasReset] = useState<boolean>(false);
  const limitFormik = useFormik({
    initialValues: {
      limit: limit,
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
    dispatch(setCheckedItems([]));
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
    setHasReset(true);
  }
  function limitHandler(data: any) {
    dispatch(
      fetchLeads({
        page: 1,
        limit: data ? Number(data) : limit,
        filters: filters,
      })
    );
  }
  function resetHandler() {
    dispatch(
      fetchLeads({
        page: 1,
        limit: limit,
        filters: { ...filters, keyword: "" },
      })
    );
    leadSearchFormik.resetForm();
    setHasReset(false);
  }
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
  return (
    <div className="bg-card flex flex-col justify-between pb-6 rounded-md custom-shadow">
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
              onClick: searchSubmitHandler,
              hasReset: hasReset,
              resetFunction: resetHandler,
              className: "rounded-md h-12 p-0 w-1/2",
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
  );
}
