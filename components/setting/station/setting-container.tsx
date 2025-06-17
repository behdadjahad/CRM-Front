import { useFormik } from "formik";

import ReactPaginate from "react-paginate";

import SettingTableContainer from "./setting-table-container";
import FormMaker, { OptionType } from "@/components/shared/form-maker";
import FilterContainer from "@/components/section/filter-container";
import { useEffect } from "react";
import { fetchStations } from "@/store/station-slice";
import { useDispatch, useSelector } from "react-redux";
import { createSettingHeaderLabels, getSettingDelete } from "@/constants/setting";
import { useParams } from "next/navigation";
import { useMutation } from "@tanstack/react-query";

export default function SettingContainer({
  cities,
  countries,
  airports,
}: {
  cities: any[];
  countries: any[];
  airports: any[];
}) {
  const { service } = useParams();
  const settingSearchFormik = useFormik({
    initialValues: {
      settingKeyWord: "",
    },
    onSubmit: async () => {},
  });

  const currentPage = useSelector((state: any) => state.station.currentPage);
  const limit = useSelector((state: any) => state.station.limit);
  const stations = useSelector((state: any) => state.station.items);
  const dispatch = useDispatch<any>();
  useEffect(() => {
    dispatch(
      fetchStations({
        page: currentPage,
        limit: limit,
        filters: {},
      })
    );
  }, [dispatch]);
    const { mutate: removeHandler } = useMutation({
    mutationFn: (item: number) => {
      return getSettingDelete(service,item);
    },
    onSuccess: () => {},
  });
  function removeData(id: number) { 
    removeHandler(id)
  }
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
            tableHeaderLabels={createSettingHeaderLabels(service)}
            list={stations}
            countries={countries} cities={cities} airports={airports}
           onRemoveHandler={(item)=>removeData(item)}
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
