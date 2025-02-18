"use client";

import ClientInfoContainer, {
  ClientInfoContainerInterface,
} from "@/components/service/client-info-container";
import ContractExpenseContainer, {

} from "@/components/service/contract-expense-container";
import ContractInfoContainer, {
  ContractInfoInterface,
} from "@/components/shared/contract-info-container";
import ExpertInfoContainer, {
  ExpertInfoInterface,
} from "@/components/shared/expert-info-container";
import ServiceContainer, {
  ServiceContainerInterface,
} from "@/components/shared/service-container";
import Image from "next/image";

import Breadcrumb from "@/components/shared/breadcrumb";
import Title from "@/components/shared/title";

import { services } from "@/constants/services";
import { useParams } from "next/navigation";
import { useMutation, useQuery } from "@tanstack/react-query";
import { getContractById } from "@/api/contract";
//import { convertDate } from "@/lib/date";
import { useEffect, useState } from "react";
import { ServiceCardInterface } from "@/components/shared/service-card";
import { sendSingleServiceData } from "@/api/service";
import { convertDate } from "@/lib/date";


export default function Service() {
  const {
    clientInfoProps,
    contractServices,
   // expenses,
    expert,
    contractInfo,
    activeItemForm,
  } = getData();

  return (
    <main className="flex flex-col lg:flex-row">
      <div className=" flex flex-col w-full lg:w-3/4 gap-4">
        <div>
          <Title label="ثبت سرویس هتل" />

          <Breadcrumb
            list={[
              {
                label: "داشبورد",
                link: "/",
              },
              {
                label: "درخواست های ثبت شده مشتری",
                link: "/",
              },
              {
                label: "سرویس",
              },
            ]}
          />
        </div>
        <div className="flex flex-col gap-1 mt-12">
          <ExpertInfoContainer {...expert} />
          <ContractInfoContainer {...contractInfo} />
        </div>

        <ServiceContainer {...contractServices} />
        {activeItemForm && activeItemForm.form}
      </div>

      <div className="w-full lg:w-1/4 flex flex-col">
        <ContractExpenseContainer/>
        <div className="mt-4">
          <ClientInfoContainer {...clientInfoProps} />
        </div>
      </div>
    </main>
  );
}

function getData() {
  const [serviceList, setServiceList] = useState<ServiceCardInterface[]>([]);
  const [activeItemForm, setActiveItemForm] = useState<any>(null);
  const [clientInfo, setClientInfo] = useState<any>(null);
  const { id } = useParams();
  const { data: contract } = useQuery({
    queryKey: ["contract"],
    queryFn: () => getContractById(Number(id) as number),
  });
  useEffect(() => {
    if (contract) {
      const updatedServices = services.map((obj) => ({
        ...obj,
        isSelected: contract.avServices.includes(obj.name)
          ? true
          : obj.isSelected,
      }));

      setServiceList(updatedServices);
      setClientInfo(contract.mainCustomerSoldto);
    }
  }, [contract]);

  // const { data: expenseData } = useQuery({
  //   queryKey: ["expenses"],
  //   queryFn: () => getExpenses(Number(id) as number),
  // });
  // useEffect(() => {
  //   if (expenseData) {

  //   }
  // }, [expenseData]);
  const { mutate: submitService } = useMutation({
    mutationFn: (data: any) => {
      return sendSingleServiceData(data, Number(id));
    },
    onSuccess: (data) => {
      const updatedServices = services.map((obj) => ({
        ...obj,
        isSelected: data.avServices.includes(obj.name) ? true : obj.isSelected,
      }));

      setServiceList(updatedServices);
    },
  });
  const contractServices: ServiceContainerInterface = {
    services: serviceList,
    onActiveItemChange: (service: any) => {
      const item = serviceList.find((obj) => obj.id === service.id);
      if (item?.isSelected) {
        if (activeItemForm && item.id === activeItemForm.id) {
          setActiveItemForm(null);
        } else {
          setActiveItemForm(item);
        }
      } else {
        const singleService = { avService: service.name };
        submitService(singleService);
      }
    },
    askQuestion: true,
  };
  const expert: ExpertInfoInterface = {
    list: [
      {
        label: "",
        value: "",
        children: (
          <Image
            src={"/images/expert.png"}
            alt={"تصویر"}
            width={107}
            height={107}
            className="h-full w-full border-4 border-primary-foreground rounded-full"
          />
        ),
      },
      {
        label: "نام و نام خانوادگی",
        value: "آرشام رضایی",
      },
      {
        label: "نام دپارتمان",
        value: "دپارتمان",
      },
      {
        label: "سمت",
        value: "کارشناس سرویس هتل",
      },
    ],
  };

  const contractInfo: ContractInfoInterface = {
    list: [
      {
        label: "ثبت کننده",
        value: contract?.userSubmitter?.fullName ?? "",
      },
      {
        label: "تاریخ ثبت درخواست",
        value: contract?.submitDateTime
          ? convertDate(contract?.submitDateTime, contract?.dateType)
          : "",
      },
      {
        label: "تاریخ قرارداد",
        value: contract?.submitDateTime
          ? convertDate(contract?.contractDate, contract?.dateType)
          : "",
      },
      {
        label: "شماره قرارداد",

        value: contract?.contractNo ?? "",
      },
      {
        label: "موضوع قرارداد",
        value: contract?.contractType?.name ?? "",
      },
      {
        label: "توضیحات",
        value: contract?.description ?? "",
      },
    ],
  };

  const clientInfoProps: ClientInfoContainerInterface = {
    clients: [
      {
        data: [
          {
            label: "مشتری",
            value: "شخصی",
          },
          {
            label: "نام ونام خانوادگی",

            value:
              clientInfo?.person?.firstName && clientInfo?.person?.lastName
                ? `${clientInfo?.person?.firstName}${clientInfo?.person?.lastName}`
                : "",
          },
          {
            label: "تاریخ تولد",

            value:
              contract?.dateType && clientInfo?.person?.birthdate
                ? convertDate(clientInfo?.person?.birthdate, contract?.dateType)
                : "",
          },
          {
            label: "کدملی",
            value: "۲۴۴۵۸۹۷۵۸۴",
          },
          {
            label: "شماره تماس",
            value: "۰۲۱-۳۸۷۵۴۶۸۰",
          },
          {
            label: "شهر",
            value: "شیراز",
          },
        ],
        action: [
          {
            icon: { src: "/icons/trash.png", className: "w-5.5 h-5.5" },
            click: () => console.log("clicked"),
          },
          {
            icon: { src: "/icons/edit-primary.png", className: "w-4 h-4" },
            click: () => console.log("clicked"),
          },
        ],
        clientServices: [
          {
            icon: "/icons/airport.png",
            iconClassName: "w-6 h-4",
          },
          {
            icon: "/icons/visa.png",
          },
        ],
      },
    ],
  };

  // const expenses: ExpenseContainerInterface = {
  //   expenseList: [
  //     {
  //       title: "هتل",
  //       icon: "/icons/hotel.png",
  //       expenseInfo: [
  //         {
  //           price: "60000000",
  //           pricePostFix: "ریال",
  //           convertedPrice: "60000000",
  //           convertedPricePostFix: "$",
  //         },
  //         {
  //           price: "60000000",
  //           pricePostFix: "دلار",
  //           convertedPrice: "60000000",
  //           convertedPricePostFix: "$",
  //         },
  //         {
  //           price: "60000000",
  //           pricePostFix: "یورو",
  //           convertedPrice: "60000000",
  //           convertedPricePostFix: "$",
  //         },
  //       ],
  //     },
  //     {
  //       title: "ویزا",
  //       icon: "/icons/visa.png",
  //       expenseInfo: [
  //         {
  //           price: "60000000",
  //           pricePostFix: "ریال",
  //           convertedPrice: "60000000",
  //           convertedPricePostFix: "$",
  //         },
  //         {
  //           price: "60000000",
  //           pricePostFix: "دلار",
  //           convertedPrice: "60000000",
  //           convertedPricePostFix: "$",
  //         },
  //         {
  //           price: "60000000",
  //           pricePostFix: "یورو",
  //           convertedPrice: "60000000",
  //           convertedPricePostFix: "$",
  //         },
  //       ],
  //     },
  //     {
  //       title: "پرواز",
  //       icon: "/icons/airport.png",
  //       expenseInfo: [
  //         {
  //           price: "60000000",
  //           pricePostFix: "ریال",
  //           convertedPrice: "60000000",
  //           convertedPricePostFix: "$",
  //         },
  //         {
  //           price: "60000000",
  //           pricePostFix: "دلار",
  //           convertedPrice: "60000000",
  //           convertedPricePostFix: "$",
  //         },
  //         {
  //           price: "60000000",
  //           pricePostFix: "یورو",
  //           convertedPrice: "60000000",
  //           convertedPricePostFix: "$",
  //         },
  //       ],
  //     },
  //   ],
  //   overalExpense: {
  //     title: "کل",
  //     overalExpenseDetail: [
  //       {
  //         label: "هزینه",
  //         value: "60000000",
  //       },
  //       {
  //         label: "درآمد",
  //         value: "250000000",
  //         hasForm:true
  //       },
  //       {
  //         label: "سود و زیان",
  //         value: "50000000",
  //       },
  //     ],
  //   },
  //};

  return {
    clientInfoProps,
    contractServices,
    //expenses,
    expert,
    contractInfo,
    activeItemForm,
  };
}
