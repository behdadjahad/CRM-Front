import { useFormik } from "formik";

import ReactPaginate from "react-paginate";

import SettingTableContainer from "./setting-table-container";
import FormMaker, { OptionType } from "@/components/shared/form-maker";
import FilterContainer from "@/components/section/filter-container";
import { useEffect, useState } from "react";
import { fetchStations } from "@/store/station-slice";
import { useDispatch, useSelector } from "react-redux";
import {
  createSettingHeaderLabels,
  getSettingDelete,
  sliceMap,
} from "@/constants/setting";
import { useParams } from "next/navigation";
import { useMutation } from "@tanstack/react-query";
import { store } from "@/store";
import ExportDataContainer from "@/components/shared/export-data-container";
import { buildRowOptions } from "@/lib/utils";

export default function SettingContainer({
  cities,
  countries,
  airports,
  accommodationTypes,
  hotels,
  airlines,
}: {
  cities: any[];
  countries: any[];
  airports: any[];
  accommodationTypes: any[];
  hotels: any[];
  airlines: any[];
}) {
  const [hasReset, setHasReset] = useState<boolean>(false);

  const { service } = useParams();
  const settingSearchFormik = useFormik({
    initialValues: {
      settingKeyWord: "",
    },
    onSubmit: async () => {},
  });
  const config = sliceMap[service as keyof typeof sliceMap];

  const currentPage = useSelector(
    (state) => config?.selector(state).currentPage
  );
  const limit = useSelector((state) => config?.selector(state).limit);
  const total = useSelector((state) => config?.selector(state).total);
  const totalItems = useSelector((state) => config?.selector(state).totalItems);
  const items = useSelector((state) => config?.selector(state).items);
  const pages = useSelector((state) => config?.selector(state).totalPages);
  const dispatch = useDispatch<any>();
  const limitFormik = useFormik({
    initialValues: {
      limit: limit,
    },
    onSubmit: async () => {},
  });
  useEffect(() => {
    if (!config) return;
    dispatch(
      config.fetchAction({
        page: currentPage,
        limit: limit,
        filters: {},
        sort: {},
      })
    );
  }, [dispatch, service]);
  const { mutate: removeHandler } = useMutation({
    mutationFn: (item: number) => {
      return getSettingDelete(service, item);
    },
    onSuccess: () => {
      (dispatch as any)(
        config.fetchAction({
          page: 1,
          limit: limit,
          filters: {},
        })
      );
    },
  });
  function removeData(id: number) {
    removeHandler(id);
  }
  const handlePageChange = (selectedItem: any) => {
    const selectedPage = selectedItem.selected + 1;
    dispatch(
      config.fetchAction({
        page: selectedPage,
        limit: limit,
        filters: {},
        sort: {},
      })
    );
  };

  function searchSubmitHandler() {
    const searchValue = settingSearchFormik.values.settingKeyWord;

    dispatch(
      config.fetchAction({
        page: 1,
        limit: limit,
        filters: {},
        keyword: searchValue,
        sort: {},
      })
    );
    setHasReset(true);
  }
  function resetHandler() {
    dispatch(
      config.fetchAction({
        page: 1,
        limit: limit,
        filters: {},
        sort: {},
      })
    );
    settingSearchFormik.resetForm();
    setHasReset(false);
  }

  const [isLoading, setIsLoading] = useState(false);

  const getDataHandler = async () => {
    setIsLoading(true);

    try {
      return await dispatch(
        config.fetchAllData({
          page: 1,
          limit: total,
          filters: {},
          sort: {},
        })
      );
    } finally {
      setIsLoading(false);
    }
  };
  function limitHandler(data: any) {
    dispatch(
      config.fetchAction({
        page: 1,
        limit: Number(data),
        filters: {},
        keyword: "",
        sort:{}
      })
    );
  }
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
            onGetData={getDataHandler}
            list={totalItems}
            headerLabels={createSettingHeaderLabels(service)}
            loading={isLoading}
          />
        </div>

        <div className="bg-card flex flex-col justify-between pb-6 rounded-md custom-shadow">
          <div className="bg-[linear-gradient(180deg,#0475B5_-65.62%,#1C284F_100%)] rounded-sm p-3 flex items-center justify-between px-6">
            <FormMaker
              form={settingSearchFormik}
              fields={[
                {
                  key: "settingKeyWord",
                  component: "input",
                  icon: "/icons/search-icon.png",
                  type: "text",
                  placeholder: "جستجوی پیشرفته و...",
                  className: "rounded-md h-12 p-0 w-1/2",
                  onClick: searchSubmitHandler,
                  hasReset: hasReset,
                  resetFunction: resetHandler,
                },
              ]}
              className="w-full"
            />
          </div>
          <SettingTableContainer
            tableHeaderLabels={createSettingHeaderLabels(service)}
            list={items}
            countries={countries}
            cities={cities}
            airports={airports}
            onRemoveHandler={(item) => removeData(item)}
            accommodationTypes={accommodationTypes}
            hotels={hotels}
            airlines={airlines}
          />
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
                    options: buildRowOptions(total,Math.round(total/10)),
                    menuPlacement: "top",
                    onChange: (data: any) => {
                      limitHandler(Number(data.value));
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
