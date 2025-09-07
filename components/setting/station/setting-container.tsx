import { useFormik } from "formik";

import ReactPaginate from "react-paginate";

import SettingTableContainer from "./setting-table-container";
import FormMaker, { OptionType } from "@/components/shared/form-maker";
import FilterContainer from "@/components/section/filter-container";
import { useEffect, useRef, useState } from "react";
import { fetchStations } from "@/store/station-slice";
import { useDispatch, useSelector } from "react-redux";
import {
  createSettingHeaderLabels,
  getSettingDelete,
  sliceMap,
} from "@/constants/setting";
import { useParams, usePathname } from "next/navigation";
import { useMutation } from "@tanstack/react-query";
import { store } from "@/store";
import ExportDataContainer from "@/components/shared/export-data-container";
import { buildRowOptions } from "@/lib/utils";
import { convertToGregorian } from "@/lib/date";
import { generateFeatureAccess } from "@/lib/generatePageData";
import { usePageData } from "@/hooks/usePageData";
import { AccessDenied } from "@/components/shared/AccessDenied";
import { render } from "@fullcalendar/core/preact.js";

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
 const pageFeatures = usePageData();

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
  const filters = useSelector((state) => config?.selector(state).filters);
  const dateTimeRange = useSelector(
    (state) => config?.selector(state).dateTimeRange
  );
  const checkedItems = useSelector(
    (state) => config?.selector(state).checkedItems
  );

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
      })
    );
  }, [dispatch, service]);
  const { mutate: removeHandler } = useMutation({
    mutationFn: (item: number) => {
      return getSettingDelete(service, item);
    },
    onSuccess: () => {
      const returnPage = items.length < 2 ? currentPage - 1 : currentPage;
      (dispatch as any)(
        config.fetchAction({
          page: returnPage,
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
        filters: filters,
      })
    );
  };

  function searchSubmitHandler() {
    const searchValue = settingSearchFormik.values.settingKeyWord;

    dispatch(
      config.fetchAction({
        page: 1,
        limit: limit,
        filters: { keyword: searchValue },
      })
    );
    setHasReset(true);
  }
  function resetHandler() {
    dispatch(
      config.fetchAction({
        page: 1,
        limit: limit,
        filters: { ...filters, keyword: "" },
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
          filters: filters,
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
        filters: filters,
      })
    );
  }
  const formik = useFormik({
    initialValues: {
      startDate: "",
      startDateType: "",
      endDate: "",
      endDateType: "",
      name: "",
      city: "",
      country: "",
      submitter: "",
    },
    onSubmit: async () => {},
  });
  const filterItems = [
    {
      title: "اطلاعات",
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
              key: "country",
              component: "input",
              placeholder: "کشور",
              type: "text",
              floating: true,
              labelClassName: "w-full",
              className: "w-full px-0",
            },
            {
              key: "city",
              component: "input",
              placeholder: "شهر",
              type: "text",
              floating: true,
              labelClassName: "w-full",
              className: "w-full px-0",
            },
            {
              key: "submitter",
              component: "input",
              placeholder: "نام ثبت کننده",
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
              dependantKey: "startDateType",
              component: "date",
              placeholder: "از تاریخ",
              type: "text",
              floating: true,
              className: "w-full px-0",
            },
            {
              key: "endDate",
              dependantKey: "endDateType",
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
    const filterData = {
      startRangeTime: convertToGregorian(
        formik.values?.startDate,
        formik.values?.startDateType
      ),

      endRangeTime: convertToGregorian(
        formik.values?.endDate,
        formik.values?.endDateType
      ),
      name: formik.values.name,
      city: formik.values.city,
      country: formik.values.country,
      userSubmitterFullname: formik.values.submitter,
    };
    dispatch(
      config.fetchAction({
        page: 1,
        limit: limit,
        filters: filterData,
      })
    );
  }
  function cancleFilter() {
    formik.resetForm();

    dispatch(
      config.fetchAction({
        page: 1,
        limit: limit,
        filters: {},
      })
    );
  }
const pathname = usePathname();
const serviceType = pathname?.split("/").pop();  // "hotel" | "airport" | "airline"

function renderFilter() {
  if (serviceType === "airline") {
    // always show
    return (
      <FilterContainer
        onFilterHandler={submitFilter}
        rangeItems={rangeItems}
        filterItems={filterItems}
        sortList={[]}
        onSortHandler={() => {}}
        onCancleHandler={cancleFilter}
      />
    );
  }

  if (
    serviceType === "hotel" &&
    generateFeatureAccess(pageFeatures, "filter-accommodations")?.show &&
    generateFeatureAccess(pageFeatures, "filter-accommodations")?.enable
  ) {
    return (
      <FilterContainer
        onFilterHandler={submitFilter}
        rangeItems={rangeItems}
        filterItems={filterItems}
        sortList={[]}
        onSortHandler={() => {}}
        onCancleHandler={cancleFilter}
      />
    );
  }

  if (
    serviceType === "airport" &&
    generateFeatureAccess(pageFeatures, "filter-airports")?.show &&
    generateFeatureAccess(pageFeatures, "filter-airports")?.enable
  ) {
    return (
      <FilterContainer
        onFilterHandler={submitFilter}
        rangeItems={rangeItems}
        filterItems={filterItems}
        sortList={[]}
        onSortHandler={() => {}}
        onCancleHandler={cancleFilter}
      />
    );
  }

  return (
    <AccessDenied
      variant="foreground"
      title=""
      message="امکان دسترسی به این قابلیت وجود ندارد"
    />
  );
}
function renderExport() {
  if (serviceType === "airline") {
    return (
      <ExportDataContainer
        onGetData={getDataHandler}
        list={totalItems}
        headerLabels={createSettingHeaderLabels(serviceType)}
        loading={isLoading}
        checkedItems={checkedItems}
        dateTimeRange={dateTimeRange}
      />
    );
  }

  if (
    serviceType === "hotel" &&
    generateFeatureAccess(pageFeatures, "export-accommodations")?.show &&
    generateFeatureAccess(pageFeatures, "export-accommodations")?.enable
  ) {
    return (
      <ExportDataContainer
        onGetData={getDataHandler}
        list={totalItems}
        headerLabels={createSettingHeaderLabels(serviceType)}
        loading={isLoading}
        checkedItems={checkedItems}
        dateTimeRange={dateTimeRange}
      />
    );
  }

  if (
    serviceType === "airport" &&
    generateFeatureAccess(pageFeatures, "create-airports")?.show &&
    generateFeatureAccess(pageFeatures, "create-airports")?.enable
  ) {
    return (
      <ExportDataContainer
        onGetData={getDataHandler}
        list={totalItems}
        headerLabels={createSettingHeaderLabels(serviceType)}
        loading={isLoading}
        checkedItems={checkedItems}
        dateTimeRange={dateTimeRange}
      />
    );
  }

  return (
    <AccessDenied
      variant="foreground"
      title="خروجی"
      message="شما به این بخش دسترسی ندارید"
    />
  );
}


  return (
    <div className="bg-card rounded-lg p-6">
      <div className="gap-4 flex flex-col">
        <div className="flex flex-row items-center justify-between">
         
          
          {renderFilter()}
          {renderExport()}
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
          </div>{" "}
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
                    options: buildRowOptions(total, Math.ceil(total / 10)),
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
