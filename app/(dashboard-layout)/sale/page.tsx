"use client";
import { getUsers } from "@/api/auth";
import { getContracts } from "@/api/contract";

import { getContractTypes } from "@/api/contract";
import ContractContainer, {
  ContractContainerInterface,
} from "@/components/contract/contract-container";
import ContractCreation from "@/components/sale/contract-creation";
import ContractOverview, {
  ContractOverviewInterface,
} from "@/components/sale/contract-overview";
import Breadcrumb from "@/components/shared/breadcrumb";
import { ServiceCardInterface } from "@/components/shared/service-card";
import Title from "@/components/shared/title";
import { convertDate } from "@/lib/date";
import { services } from "@/constants/services";
import { useMutation, useQuery } from "@tanstack/react-query";
import { useEffect, useState } from "react";
import { useFormik } from "formik";
import FormMaker from "@/components/shared/form-maker";
import FilterContainer from "@/components/section/filter-container";

export default function Sale() {
  const { requestCount, contractOverviewProps, contractList, contractTypes } =
    getData();

  const formik = useFormik({
    initialValues: {
      searchBy: [],
      contractStatus: [],
      name: "",
      gender: "",
      birthdate: "",
      socialNumber: "",
      career: "",
      location: "",
      contractNumber: "",
      contractDate: "",
      startDate: "",
      endDate: "",
      sellRange: [0, 10000],
      buyRange: [0, 10000],
    },
    onSubmit: async () => {},
  });
  const filterItems = [
    {
      title: "جستجو بر اساس",
      component: (
        <FormMaker
          form={formik}
          fields={[
            {
              key: "searchBy",
              component: "checkbox",
              placeholder: "جست‌وجو بر اساس",
              type: "text",
              className: "w-full items-start p-0",
              options: [
                { label: "درخواست", value: "request" },
                { label: "قرارداد", value: "contract" },
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
              key: "contractStatus",
              component: "checkbox",
              placeholder: "وضعیت قرارداد",
              type: "text",
              className: "w-full items-start p-0",
              options: [
                { label: "باز", value: "open" },
                { label: "بسته", value: "close" },
              ],
            },
          ]}
          className="flex flex-row w-full"
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
              key: "socialNumber",
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
              component: "date",
              placeholder: "از تاریخ",
              type: "text",
              floating: true,
              className: "w-full px-0",
            },
            {
              key: "endDate",
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
              key: "sellRange",
              component: "slider",
              placeholder: "",
              type: "text",
              className: "w-full items-start p-0",
              range: { max: 10000, min: 0, step: 200 },
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
              key: "buyRange",
              component: "slider",
              placeholder: "",
              type: "text",
              className: "w-full items-start p-0",
              range: { max: 10000, min: 0, step: 200 },
            },
          ]}
          className="flex flex-row w-full"
        />
      ),
    },
  ];
  const customerSortlist = [
    {
      label: "نام مشتری(الف-ی)",
      value: "",
    },
    { label: "نام مشتری(ی-الف)", value: "" },
    { label: "گران ترین", value: "MostExpensive" },

    { label: "جدید ترین ها", value: "Newest" },
    { label: "قدیمی ترین ها", value: "Oldest" },
  ];
  const { mutate: filterHandler } = useMutation({
    mutationFn: (data: any) => {
      return getContracts(data);
    },
    onSuccess: (data) => {
      console.log(data);
    },
  });
  function submitFilter() {
    console.log("hi")
    filterHandler({
      data: {
        openContracts: "true",
      },
    });
  }
  return (
    <main>
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

      <ContractOverview {...contractOverviewProps} />

      <div className="flex flex-col-reverse md:flex-row items-center justify-between gap-y-4">
        {/* <Filter /> */}
        <FilterContainer
          onFilterHandler={() => {
            submitFilter();
            formik.resetForm();
          }}
          rangeItems={rangeItems}
          filterItems={filterItems}
          sortList={customerSortlist}
        />
        <div className="text-base font-bold h-9 flex items-center justify-center">
          {requestCount} درخواست
        </div>
      </div>

      <div className="md:bg-background-active rounded-xl md:p-6">
        <ContractContainer list={contractList} />
      </div>
    </main>
  );
}

function getData() {
  const [contractTypes, setContractTypes] = useState<ServiceCardInterface[]>(
    []
  );
  const [contractItems, setContractItems] = useState<any[]>([]);
  const { data: users } = useQuery({
    queryKey: ["usersInformation"],
    queryFn: async () => await getUsers(),
  });

  const { data: contractInformation } = useQuery({
    queryKey: ["contractInformation"],
    queryFn: () => getContracts({}),
  });
  useEffect(() => {
    if (contractInformation?.data) {
      setContractItems(contractInformation?.data);
    }
  }, [contractInformation?.data]);

  const contractList: ContractContainerInterface["list"] = contractItems
    ? contractItems.map((item: any) => ({
        id: item.id,
        contract: {
          date:
            item?.contractDate && item?.dateType
              ? convertDate(item?.contractDate, item?.dateType)
              : "",

          destination: "",
          submitter:
            users?.find((obj) => obj.id === item.userSubmitterId)?.fullName ??
            "",
          unit: "",
        },
        footer: {
          cost: item.buyPrice.toString(),
          income: item.sellPrice.toString(),
          overall: (item.sellPrice - item.buyPrice).toString(),
        },
        header: {
          contractNumber: item.contractNo,
          icon: "/icons/visa-white.png",

          submitDate:
            item?.submitDateTime && item?.dateType
              ? convertDate(item?.submitDateTime, item?.dateType)
              : "",

          title:
            contractTypes.find((obj) => obj.id === item.contractTypeId)
              ?.title ?? "",
        },
        score: {
          final: 30,
          totalVotes: 10,
        },
        services: item.avServices
          ? services.filter((obj) => item.avServices.includes(obj.name))
          : [],
        user: {
          image: "/images/expert.png",
          name:
            users?.find((obj) => obj.id === item.userResponsibleId)?.fullName ??
            "",
        },
      }))
    : [];

  const contractOverviewProps: ContractOverviewInterface = {
    list: [
      {
        label: " قرار داد کل",
        value:
          contractInformation?.doneCount !== undefined &&
          contractInformation?.inProgressCount !== undefined
            ? (
                contractInformation.doneCount +
                contractInformation.inProgressCount
              ).toString()
            : "",
      },
      {
        label: "قرار داد تکمیل شده",
        value: (contractInformation?.doneCount ?? "").toString(),
      },
      {
        label: " قرار داد ناقص",
        value: (contractInformation?.inProgressCount ?? "").toString(),
      },
    ],
  };

  const { data } = useQuery({
    queryKey: ["contractTypeQuery"],
    queryFn: () => getContractTypes(),
  });

  useEffect(() => {
    if (data?.success && data?.data) {
      setContractTypes(
        data.data.map((item: any) => ({
          id: item.id,
          image: "http://185.126.203.246:3000/public/" + item.iconFile,
          title: item.name,
          activeImage:
            "http://185.126.203.246:3000/public/" + item.activeIconFile,
        }))
      );
    }
  }, [data]);
  return {
    requestCount: 273,
    contractOverviewProps,
    contractList,
    contractTypes,
  };
}
