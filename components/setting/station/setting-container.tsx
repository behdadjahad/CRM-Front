import { useFormik } from "formik";

import ReactPaginate from "react-paginate";

import SettingTableContainer from "./setting-table-container";
import FormMaker from "@/components/shared/form-maker";
import FilterContainer from "@/components/section/filter-container";

export default function SettingContainer() {
  const settingSearchFormik = useFormik({
    initialValues: {
      settingKeyWord: "",
    },
    onSubmit: async () => {},
  });

  const tableHeaderLabels = [
    "ردیف",
    "کشور",
    "شهر",
    "فرودگاه",
    "تاریخ ثبت",
  
  ];
  const stationData = [
    {
      ردیف: 1,
      کشور: "ایران",
      شهر: "تهران",
      فرودگاه: "مهرآباد",
      "تاریخ ثبت": "1402/01/01",

    },
  ];
  return (
    <div className="bg-card rounded-lg p-6">
      <div className="gap-4 flex flex-col">
        <FilterContainer
          onFilterHandler={() => {}}
          rangeItems={[]}
          filterItems={[]}
          sortList={[]}
          onSortHandler={() => {}}
          onCancleHandler={() => {}}
        />
        <div className="bg-card flex flex-col justify-between pb-6 rounded-md custom-shadow">
          <div className="bg-[linear-gradient(180deg,#0475B5_-65.62%,#1C284F_100%)] rounded-sm p-3 flex items-center justify-between px-6">
            <FormMaker
              form={settingSearchFormik}
              fields={[
                {
                  key: "clientKeyWord",
                  component: "input",
                  icon: "/icons/search-icon.png",
                  type: "text",
                  placeholder: "جستجوی پیشرفته و...",
                  className: "rounded-md h-12 p-0 w-1/2",
                  onClick: () => {},
                },
              ]}
              className="w-full"
            />
          </div>
          <SettingTableContainer
            tableHeaderLabels={tableHeaderLabels}
            list={stationData}
            className="hidden xl:flex"
          />

          <div className="w-full mt-4">
            <ReactPaginate
              breakLabel="..."
              nextLabel="صفحه بعد"
              previousLabel="صفحه قبل"
              onPageChange={() => {}}
              pageRangeDisplayed={2}
              marginPagesDisplayed={3}
              forcePage={1}
              pageCount={10}
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
          </div>
        </div>
      </div>
    </div>
  );
}
