"use client";

import { getContractTypes } from "@/api/contract";
import ContractContainer from "@/components/contract/contract-container";
import ContractCreation from "@/components/sale/contract-creation";

import Breadcrumb from "@/components/shared/breadcrumb";
import { ServiceCardInterface } from "@/components/shared/service-card";
import Title from "@/components/shared/title";

import { useQuery } from "@tanstack/react-query";
import { useEffect, useRef, useState } from "react";
import { useFormik } from "formik";
import FormMaker, { OptionType } from "@/components/shared/form-maker";
import FilterContainer from "@/components/section/filter-container";
import {
  fetchAllContracts,
  fetchContracts,
  setCheckedItems,
  setScrollPosition,
} from "@/store/contract-slice";
import { useDispatch, useSelector } from "react-redux";
import { cleanObject, contractHeaderLabels, priceOptions } from "@/lib/utils";
import ReactPaginate from "react-paginate";
import { convertToGregorian } from "@/lib/date";
import {
  contractStateOptions,
  serviceOptions,
} from "@/constants/customer-filter-fields";
import ContractOverview from "@/components/sale/contract-overview";

import { useRouter } from "next/navigation";
import ExportDataContainer from "@/components/shared/export-data-container";
import { Button } from "@/components/ui/button";

export default function Sale() {
  const dispatch = useDispatch<any>();
  const [contractTypes, setContractTypes] = useState<ServiceCardInterface[]>(
    []
  );
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      router.push("/login");
    } else {
      router.push("/sale");
    }
  }, []);

  useEffect(() => {
    if (mainRef.current) {
      mainRef.current.scrollTo(0, scrollY);
    }
  }, []);

  const contractLists = useSelector((state: any) => state.contract.items);
  const pages = useSelector((state: any) => state.contract.totalPages);
  const total = useSelector((state: any) => state.contract.total);
  const filters = useSelector((state: any) => state.contract.filters);
  const currentPage = useSelector((state: any) => state.contract.currentPage);
  const ContractOverviewList = useSelector(
    (state: any) => state.contract.ContractOverviewList
  );
  const scrollY = useSelector((state: any) => state.contract.scrollPosition);
  const dateTimeRange=useSelector((state: any) => state.contract.dateTimeRange);
  const mainRef = useRef<HTMLDivElement>(null);

  const { data: contractTypeData } = useQuery({
    queryKey: ["contractTypeQuery"],
    queryFn: () => getContractTypes(),
  });
  const limit = useSelector((state: any) => state.contract.limit);
  const allItems = useSelector((state: any) => state.contract.allItems);
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
  const checkedItems = useSelector((state: any) => state.contract.checkedItems);
  useEffect(() => {
    if (contractTypeData && contractTypeData?.data?.length > 0) {
      setContractTypes(
        contractTypeData.data.map((item: any) => ({
          id: item.id,
          image: "http://185.126.203.246:3000/public/" + item.iconFile,
          title: item.name,
          activeImage:
            "http://185.126.203.246:3000/public/" + item.activeIconFile,
        }))
      );
    }
  }, [contractTypeData]);
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
  const limitFormik = useFormik({
    initialValues: {
      limit: limit,
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
  useEffect(() => {
    dispatch(
      fetchContracts({
        page: currentPage,
        limit: limit,
        filters: {},
      })
    );
  }, [dispatch]);

  const contractRecordList = [
    {
      label: "6ردیف",
      value: "6",
    },
    {
      label: "12ردیف",
      value: "12",
    },
    {
      label: "24 ردیف",
      value: "24",
    },
    {
      label: "36 ردیف",
      value: "36",
    },
    {
      label: "102 ردیف",
      value: "102",
    },
  ];
  function limitHandler(data: any) {
    dispatch(
      fetchContracts({
        page: 1,
        limit: Number(data),
        filters: filters,
      })
    );
  }
    const isChecked = contractLists?.every((item: any) =>
    checkedItems.some((obj: any) => obj.id === item.id)
  );
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

  function checkItemHandler() {
    if (!isChecked) {
      const updatedCheckItems = checkedItems?.filter(
        (item: any) =>
          !contractLists?.some((l: any) => l.exportData.id === item.id)
      );
      const exportDataArray = contractLists.map((item: any) => item.exportData);
      dispatch(setCheckedItems([...updatedCheckItems, ...exportDataArray]));
    } else {
      const updatedItems = checkedItems?.filter(
        (item: any) =>
          !contractLists?.some((l: any) => l.exportData.id === item.id)
      );
      dispatch(setCheckedItems(updatedItems));
    }
  }


  return (
    <main ref={mainRef}>
      <div className="flex items-center justify-between">
        <div>
          <Title label="فروش" />

          <Breadcrumb
            list={[
              {
                label: "داشبورد",
                link: "/",
              },
              {
                label: "گزارش فروش",
              },
            ]}
          />
        </div>

        <ContractCreation contractTypes={contractTypes} />
      </div>

      <ContractOverview list={ContractOverviewList} />

      <div className="flex flex-col-reverse md:flex-row items-center justify-between gap-y-4">
        <FilterContainer
          onFilterHandler={() => {
            submitFilter();
          }}
          rangeItems={rangeItems}
          filterItems={filterItems}
          sortList={customerSortlist}
          onSortHandler={(item: string) => {
            submitSort(item);
          }}
          onCancleHandler={cancleFilter}
        />
        <div className="text-base font-bold h-9 flex items-center justify-center gap-4">
          <Button
            variant={"foreground"}
            className=""
            onClick={() => {
              checkItemHandler();
            }}
          >
            {contractLists?.every((item: any) =>
              checkedItems.some((obj: any) => obj.id === item.id)
            )
              ? "حذف همه"
              : "انتخاب همه"}
          </Button>
          <ExportDataContainer
            headerLabels={contractHeaderLabels}
            list={allItems}
            onGetData={getDataHandler}
            loading={isLoading}
            checkedItems={checkedItems}
            dateTimeRange={dateTimeRange}
          />
        </div>
      </div>

      <div className="md:bg-background-active rounded-xl md:p-6">
        <ContractContainer list={contractLists} mainRef={mainRef} />
      </div>
      <div className="grid grid-cols-2 custom-shadow bg-card p-3 rounded-md">
        {" "}
        <div className="col-span-1 w-full">
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
            activeClassName="bg-gray-300 rounded-md"
            previousClassName="absolute right-8"
            previousLinkClassName="rounded-md text-sm"
            nextClassName="absolute left-8"
            nextLinkClassName="rounded-md text-sm"
            disabledClassName="opacity-50 cursor-not-allowed"
          />
        </div>
        <div className="col-span-1 flex items-center justify-end pl-3">
          {" "}
          <FormMaker
            form={limitFormik}
            fields={[
              {
                key: "limit",
                component: "Select",
                placeholder: "تعدادردیف",
                type: "text",
                floating: true,
                className: "w-auto text-sm",
                options: contractRecordList,
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
    </main>
  );
}
