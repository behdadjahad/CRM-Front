import ReactPaginate from "react-paginate";
import FormMaker from "../shared/form-maker";
import { useDispatch, useSelector } from "react-redux";
import { useFormik } from "formik";
import { fetchContracts, setCheckedItems } from "@/store/contract-slice";
import { useState } from "react";
import { buildRowOptions } from "@/lib/utils";
import ContractTable from "./ContractTable";

export interface ContractTableContainerInterface {
  list: any[];
}

export default function ContractTableContainer({
  list,
}: ContractTableContainerInterface) {
  const dispatch = useDispatch<any>();
  const [hasReset, setHasReset] = useState<boolean>(false);
  const contractSearchFormik = useFormik({
    initialValues: {
      contractKeyWord: "",
    },
    onSubmit: async () => {},
  });
  function searchSubmitHandler() {
    dispatch(setCheckedItems([]));
    const searchValue = contractSearchFormik.values.contractKeyWord;
 
    dispatch(
      fetchContracts({
        page: 1,
        limit: limit,
        filters: {
          keyword: searchValue,
        },
      })
    );
    setHasReset(true);
  }
  const currentPage = useSelector((state: any) => state.contract.currentPage);
  const total = useSelector((state: any) => state.contract.total);
  const limit = useSelector((state: any) => state.contract.limit);

  const filters = useSelector((state: any) => state.contract.filters);
  const pages = useSelector((state: any) => state.contract.totalPages);
  const contractList = useSelector((state: any) => state.contract.tableData);
  const limitFormik = useFormik({
    initialValues: {
      limit: limit,
    },
    onSubmit: async () => {},
  });
  function resetHandler() {
    dispatch(
      fetchContracts({
        page: 1,
        limit: limit,
        filters: { ...filters, keyword: "" },
      })
    );
    contractSearchFormik.resetForm();
    setHasReset(false);
  }
  const handlePageChange = (selectedItem: any) => {
    const selectedPage = selectedItem.selected + 1;
    dispatch(
      fetchContracts({
        page: selectedPage,
        limit: limit,
        filters: filters,
      })
    );
  };
  function limitHandler(data: any) {
    dispatch(
      fetchContracts({
        page: 1,
        limit: data ? Number(data) : limit,
        filters: filters,
      })
    );
  }
  return (
    <div className="bg-card flex flex-col justify-between pb-6 rounded-md custom-shadow">
      <div className="bg-[linear-gradient(180deg,#0475B5_-65.62%,#1C284F_100%)] rounded-md p-3 flex items-center justify-between px-6">
        <div className="flex items-center w-full  justify-between">
          {" "}
          <div>انتخاب همه</div>
          <FormMaker
            form={contractSearchFormik}
            fields={[
              {
                key: "leadKeyWord",
                component: "input",
                icon: "/icons/search-icon.png",
                type: "text",
                placeholder: "جستجوی قرارداد ها",
                onClick: searchSubmitHandler,
                hasReset: hasReset,
                resetFunction: resetHandler,
                className: "rounded-md h-12 p-0 w-full",
              },
            ]}
            className="w-1/3 flex justify-end"
          />
        </div>
      </div>
      <ContractTable contractList={contractList} />
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
