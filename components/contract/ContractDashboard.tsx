import { useDispatch, useSelector } from "react-redux";
import { ContractCardInterface } from "./contract-card";
import ContractOverview from "@/components/contract/contract-overview";
import { usePageData } from "@/hooks/usePageData";
import { generateFeatureAccess } from "@/lib/generatePageData";
import { AccessDenied } from "../shared/AccessDenied";
import { Button } from "../ui/button";
import FilterContainer from "../section/filter-container";
import Image from "next/image";
import ExportDataContainer from "../shared/export-data-container";
import { useFormik } from "formik";
import {
  contractStateOptions,
  serviceOptions,
} from "@/constants/customer-filter-fields";
import FormMaker from "../shared/form-maker";
import {
  fetchAllContracts,
  fetchContracts,
  setCheckedItems,
} from "@/store/contract-slice";
import { cleanObject, contractHeaderLabels, priceOptions } from "@/lib/utils";
import { convertToGregorian } from "@/lib/date";
import { useRef, useState } from "react";
import ContractContainer from "./contract-container";
import ViewToggleGroup from "../shared/ViewToggleGroup";
import { LeadViewType } from "../lead/LeadContainer";
import { leadViewOptions } from "@/constants/lead";
import ContractTableContainer from "./ContractTableContainer";
import ContractOverviewContainer from "./ContractOverviewContainer";

export interface ContractDashboardInterface {
  contractList: ContractCardInterface[];
}

export default function ContractDashboard({
  contractList,
}: ContractDashboardInterface) {
  const [view, setView] = useState<string>("table");
  const dispatch = useDispatch<any>();
  const pageFeatures = usePageData();
  const [isLoading, setIsLoading] = useState(false);
  const ContractOverviewList = useSelector(
    (state: any) => state.contract.ContractOverviewList
  );
  const checkedItems = useSelector((state: any) => state.contract.checkedItems);
  const limit = useSelector((state: any) => state.contract.limit);
  const allItems = useSelector((state: any) => state.contract.allItems);
  const dateTimeRange = useSelector(
    (state: any) => state.contract.dateTimeRange
  );
  const total = useSelector((state: any) => state.contract.total);
  const filters = useSelector((state: any) => state.contract.filters);
  const formik = useFormik({
    initialValues: {
      openContracts: "",
      contractState: [],
      name: "",
      gender: "",
      birthdate: "",
      birthdateType: "",
      idNumber: "",
      career: "",
      location: "",
      contractNumber: "",
      contractDate: "",
      contractDateType: "",
      startDate: "",
      startDateType: "",
      endDate: "",
      endDateType: "",
      services: [],
      minBuyRange: "",
      maxBuyRange: "",
      minSellRange: "",
      maxSellRange: "",
    },
    onSubmit: async () => {},
  });
  const filterItems = [
    {
      title: " نوع قرارداد (باز-بسته) ",
      component: (
        <FormMaker
          form={formik}
          fields={[
            {
              key: "openContracts",
              component: "radio",
              placeholder: "نوع قرارداد",
              type: "text",
              className: "w-full items-start p-0",
              options: [
                { label: "باز", value: "true" },
                { label: "بسته", value: "false" },
              ],
            },
          ]}
          className="flex flex-row w-full"
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
    {
      title: "اطلاعات مشتری",
      component: (
        <FormMaker
          form={formik}
          fields={[
            {
              key: "gender",
              component: "radio",
              placeholder: "جنسیت",
              type: "text",
              className: "w-full items-start p-0",
              options: [
                { label: "مرد", value: "female" },
                { label: "زن", value: "male" },
              ],
            },
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
              key: "birthdate",
              component: "date",
              placeholder: "تاریخ تولد",
              type: "text",
              floating: true,
              labelClassName: "w-full",
              className: "w-full px-0",
            },
            {
              key: "idNumber",
              component: "input",
              placeholder: "کد ملی",
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
            {
              key: "location",
              component: "input",
              placeholder: "محل سکونت",
              type: "text",
              floating: true,
              labelClassName: "w-full",
              className: "w-full px-0",
            },
            {
              key: "contractNumber",
              component: "input",
              placeholder: "شماره قرارداد",
              type: "text",
              floating: true,
              className: "w-full px-0",
            },
            {
              key: "contractDate",
              component: "date",
              placeholder: "تاریخ قرارداد",
              type: "text",
              floating: true,
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
  ];
  const getDataHandler = async () => {
    setIsLoading(true);

    try {
      return await dispatch(
        fetchAllContracts({
          page: 1,
          limit: total,
          filters: filters,
        })
      );
    } finally {
      setIsLoading(false);
    }
  };
  function submitSort(itemValue: string) {
    const sortData = {
      sortBy: itemValue,
    };
    dispatch(
      fetchContracts({
        page: 1,
        limit: limit,
        filters: sortData,
      })
    );
  }
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
    {
      title: "محدوده مبلغ فروش",
      component: (
        <FormMaker
          form={formik}
          fields={[
            {
              key: "minSellRange",
              component: "Select",
              placeholder: "واردکردن مبلغ",
              type: "text",
              floating: true,
              className: "w-full  px-0",
              options: priceOptions,
            },
            {
              key: "maxSellRange",
              component: "Select",
              placeholder: "واردکردن مبلغ",
              type: "text",
              floating: true,
              className: "w-full  px-0",
              options: priceOptions,
            },
          ]}
          className="flex flex-row w-full"
        />
      ),
    },
    {
      title: "محدوده مبلغ خرید",
      component: (
        <FormMaker
          form={formik}
          fields={[
            {
              key: "minBuyRange",
              component: "Select",
              placeholder: "واردکردن مبلغ",
              type: "text",
              floating: true,
              className: "w-full  px-0",
              options: priceOptions,
            },
            {
              key: "maxBuyRange",
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
  const customerSortlist = [
    { label: "پرفروش ترین ها", value: "MostSold" },
    { label: "ارزان ترین ها", value: "MostCheap" },
    { label: "گران ترین ها", value: "MostExpensive" },
    { label: "جدید ترین ها", value: "Newest" },
    { label: "قدیمی ترین ها", value: "Oldest" },
  ];
  function submitFilter() {
    const filterData = {
      openContracts: formik.values.openContracts,
      customerName: formik.values.name,
      submitDateTimeRangeStart: convertToGregorian(
        formik.values?.startDate,
        formik.values?.startDateType
      ),

      submitDateTimeRangeEnd: convertToGregorian(
        formik.values?.endDate,
        formik.values?.endDateType
      ),

      priceWeSellRangeStart: Number(formik.values.minSellRange),
      priceWeSellRangeEnd: Number(formik.values.maxSellRange),
      priceWeBuyRangeStart: Number(formik.values.minBuyRange),
      priceWeBuyRangeEnd: Number(formik.values.maxBuyRange),
      avServices: formik.values.services,
      contractState: formik.values.contractState,

      gender: formik.values.gender,
      birthDate: formik.values.birthdate
        ? convertToGregorian(
            formik.values.birthdate,
            formik.values.birthdateType
          )
        : "",
      customerIdNumber: formik.values.idNumber,
      customerJob: formik.values.career,
      address: formik.values.location,
      contractNo: formik.values.contractNumber,
      contractDate: formik.values.contractDate
        ? convertToGregorian(
            formik.values.contractDate,
            formik.values?.contractDateType
          )
        : "",
    };

    dispatch(
      fetchContracts({
        page: 1,
        limit: limit,
        filters: cleanObject(filterData),
      })
    );
  }
  function cancleFilter() {
    formik.resetForm();
    dispatch(
      fetchContracts({
        page: 1,
        limit: limit,
        filters: {},
      })
    );
  }
  const isChecked = contractList?.every((item: any) =>
    checkedItems.some((obj: any) => obj.id === item.id)
  );
  function checkItemHandler() {
    if (!isChecked) {
      const updatedCheckItems = checkedItems?.filter(
        (item: any) =>
          !contractList?.some((l: any) => l.exportData.id === item.id)
      );
      const exportDataArray = contractList.map((item: any) => item.exportData);
      dispatch(setCheckedItems([...updatedCheckItems, ...exportDataArray]));
    } else {
      const updatedItems = checkedItems?.filter(
        (item: any) =>
          !contractList?.some((l: any) => l.exportData.id === item.id)
      );
      dispatch(setCheckedItems(updatedItems));
    }
  }
  const mainRef = useRef<HTMLDivElement>(null);
  return (
    <div className="w-full flex flex-col gap-4 bg-card rounded-lg p-6">
      {/* <ContractOverview list={ContractOverviewList} /> */}
      <ContractOverviewContainer list={[]} />
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          {" "}
          <ViewToggleGroup
            onActive={(item: LeadViewType) => {
              setView(item);
            }}
            defaultValue={leadViewOptions?.[0].label}
            options={leadViewOptions}
            activeItem={view}
          />
          {generateFeatureAccess(pageFeatures, "filter-contracts")?.show &&
            generateFeatureAccess(pageFeatures, "filter-contracts")?.enable && (
              <FilterContainer
                onFilterHandler={() => {
                  submitFilter();
                }}
                rangeItems={rangeItems}
                filterItems={filterItems}
                // sortList={customerSortlist}
                // onSortHandler={(item: string) => {
                //   submitSort(item);
                // }}
                onCancleHandler={cancleFilter}
              />
            )}
          {generateFeatureAccess(pageFeatures, "filter-contracts")?.show &&
            !generateFeatureAccess(pageFeatures, "filter-contracts")
              ?.enable && (
              <AccessDenied
                title="فیلتر"
                icon={
                  <Image
                    src={"/icons/disable-filter.png"}
                    alt="ادیت"
                    width={1024}
                    height={1024}
                    className="w-6 h-6"
                  />
                }
              />
            )}
        </div>
        {generateFeatureAccess(pageFeatures, "export-contracts")?.show &&
          generateFeatureAccess(pageFeatures, "export-contracts")?.enable && (
            <ExportDataContainer
              headerLabels={contractHeaderLabels}
              list={allItems}
              onGetData={getDataHandler}
              loading={isLoading}
              checkedItems={checkedItems}
              dateTimeRange={dateTimeRange}
            />
          )}
        {generateFeatureAccess(pageFeatures, "export-contracts")?.show &&
          !generateFeatureAccess(pageFeatures, "export-contracts")?.enable && (
            <AccessDenied
              title="خروجی"
              icon={
                <Image
                  src={"/icons/disable-download.png"}
                  alt="ادیت"
                  width={1024}
                  height={1024}
                  className="w-4 h-4"
                />
              }
            />
          )}
      </div>

      {/* {generateFeatureAccess(pageFeatures, "check-all-contracts")?.show &&
            generateFeatureAccess(pageFeatures, "check-all-contracts")
              ?.enable && (
              <Button
                variant={"foreground"}
                className=""
                onClick={() => {
                  checkItemHandler();
                }}
              >
                {contractList?.every((item: any) =>
                  checkedItems.some((obj: any) => obj.id === item.id)
                )
                  ? "حذف همه"
                  : "انتخاب همه"}
              </Button>
            )}
          {generateFeatureAccess(pageFeatures, "check-all-contracts")?.show &&
            !generateFeatureAccess(pageFeatures, "check-all-contracts")
              ?.enable && <AccessDenied title={"انتخاب همه"} />} */}

      {view === "table" ? (
        <ContractTableContainer list={[]} />
      ) : view === "pipe" ? (
        <div>pipe view</div>
      ) : (
        <></>
      )}
    </div>
  );
}
