"use client";

import ClientInfoContainer from "@/components/service/client-info-container";
import ContractExpenseContainer from "@/components/service/contract-expense-container";



import Breadcrumb from "@/components/shared/breadcrumb";
import Title from "@/components/shared/title";

import { services } from "@/constants/services";
import { useParams } from "next/navigation";
import { useMutation, useQuery } from "@tanstack/react-query";
import { getContractById } from "@/api/contract";
import { convertDate } from "@/lib/date";
import { useEffect, useState } from "react";
import ServiceCard, {
  ServiceCardInterface,
} from "@/components/shared/service-card";
import { sendSingleServiceData } from "@/api/service";
import ContractInfoContainer, {
  ContractInfoInterface,
} from "@/components/shared/contract-info-container";
import Image from "next/image";
import ExpertInfoContainer, {
  PersonInfoInterface,
} from "@/components/shared/person-info-container";
import { Checkbox } from "@/components/ui/checkbox";
export default function Service() {
  const [serviceList, setServiceList] = useState<ServiceCardInterface[]>([]);
  const [activeItem, setActiveItem] = useState<any>(null);
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
      <div className=" flex flex-col w-full xl:w-3/4 gap-4">
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

        {activeItem && activeItem.isSelected === false && (
          <div className="flex justify-between w-full p-4 bg-background-active rounded-lg">
            <p className="text-negative text-sm font-bold">
              اکنون <span> سرویس {activeItem.title} </span>به قرارداد اضافه شود
              ؟{" "}
            </p>
            <div className="flex gap-4">
              <Checkbox
                onClick={() => {
                  console.log(activeItem);

                  submitService({ avService: activeItem.name });
                  setActiveItem(null);
                }}
              />
              <label
                htmlFor=""
                className="text-xs font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
              >
                بله
              </label>

              <Checkbox
                onClick={() => {
                  setActiveItem(null);
                }}
              />
              <label
                htmlFor=""
                className="text-xs font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
              >
                خیر
              </label>
            </div>
          </div>
        )}
        <div className=" flex flex-row flex-wrap items-center justify-start gap-8 w-full">
          {serviceList.map((item: ServiceCardInterface) => (
            <ServiceCard
              key={item.id}
              {...item}
              clickFunction={() => {
                if (activeItem && activeItem.title === item.title) {
                  setActiveItem(null);
                } else {
                  setActiveItem(item);
                }
              }}
              isActive={activeItem && activeItem.title == item.title}
              isSelected={item.isSelected}
            />
          ))}
        </div>
        {activeItem && activeItem.isSelected === true && activeItem.form}
      </div>
      <div className="w-full xl:w-1/4 flex flex-col">
        <ContractExpenseContainer />
        <div className="mt-4">
          <ClientInfoContainer />
        </div>
      </div>
    </main>
  );
}
