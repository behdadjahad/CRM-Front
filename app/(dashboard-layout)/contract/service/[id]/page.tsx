"use client";

import ClientInfoContainer from "@/components/service/client-info-container";
import ContractExpenseContainer from "@/components/service/contract-expense-container";

import ServiceContainer, {
  ServiceContainerInterface,
} from "@/components/shared/service-container";

import Breadcrumb from "@/components/shared/breadcrumb";
import Title from "@/components/shared/title";

import { services } from "@/constants/services";
import { useParams } from "next/navigation";
import { useMutation, useQuery } from "@tanstack/react-query";
import { getContractById } from "@/api/contract";
import { convertDate } from "@/lib/date";
import { useEffect, useState } from "react";
import { ServiceCardInterface } from "@/components/shared/service-card";
import { sendSingleServiceData } from "@/api/service";
import ContractInfoContainer, {
  ContractInfoInterface,
} from "@/components/shared/contract-info-container";
import Image from "next/image";
import ExpertInfoContainer, {
  PersonInfoInterface,
} from "@/components/shared/person-info-container";
export default function Service() {
  const [serviceList, setServiceList] = useState<ServiceCardInterface[]>([]);
  const [activeItemForm, setActiveItemForm] = useState<any>(null);

  const { id } = useParams();
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

  const { data: contract } = useQuery({
    queryKey: ["contract"],
    queryFn: async () => await getContractById(Number(id)),
  });
  useEffect(() => {
    if (contract) {
      const updatedServices = services.map((obj) => ({
        ...obj,
        isSelected: contract?.avServices?.includes(obj.name)
          ? true
          : obj.isSelected,
      }));

      setServiceList(updatedServices);
    }
  }, [contract]);
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
  const expert: PersonInfoInterface = {
    list: [
      {
        label: "",
        value: "",
        children: (
          <Image
            src={"/images/receptionist.png"}
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
        <ContractExpenseContainer />
        <div className="mt-4">
          <ClientInfoContainer />
        </div>
      </div>
    </main>
  );
}
