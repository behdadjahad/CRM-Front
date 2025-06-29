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
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { totalVotes } from "@/lib/utils";

export default function Service() {
  const [serviceList, setServiceList] = useState<ServiceCardInterface[]>([]);
  const [activeItem, setActiveItem] = useState<any>(null);
  const [contract, setContract] = useState<any>(null);
  const { id } = useParams();
  const { mutate: submitService, data: updatedServiceData } = useMutation({
    mutationFn: (data: any) => {
      return sendSingleServiceData(data, Number(id));
    },
    onSuccess: () => {},
  });
  useEffect(() => {
    if (updatedServiceData) {
      const updatedServices = services.map((obj) => ({
        ...obj,
        isSelected: updatedServiceData.data?.avServices?.includes(obj.name)
          ? true
          : obj.isSelected,
      }));

      setServiceList(updatedServices);
    }
  }, [updatedServiceData]);
  const { data: contractData } = useQuery({
    queryKey: ["contract"],
    queryFn: async () => await getContractById(Number(id)),
  });
  useEffect(() => {
    if (contractData) {
      const updatedServices = services.map((obj) => ({
        ...obj,
        isSelected: contractData?.data?.avServices?.includes(obj.name)
          ? true
          : obj.isSelected,
      }));

      setServiceList(updatedServices);
      setContract(contractData);
    }
  }, [contractData]);
  console.log(contract?.data?.mainCustomerSoldto?.person?.avatar);
  const contractInfo: ContractInfoInterface = {
    list: [
      {
        label: "ثبت کننده",
        value: contract?.data?.userSubmitter?.fullName ?? "",
      },
      {
        label: "تاریخ ثبت درخواست",
        value:
          contract?.data?.submitDateTime && contract?.data?.dateType
            ? convertDate(
                contract?.data?.submitDateTime,
                contract?.data?.dateType
              )
            : "",
      },
      {
        label: "تاریخ قرارداد",
        value:
          contract?.data?.contractDate && contract?.data?.dateType
            ? convertDate(
                contract?.data?.contractDate,
                contract?.data?.dateType
              )
            : "",
      },
      {
        label: "شماره قرارداد",

        value: contract?.data?.contractNo ?? "",
      },
      {
        label: "موضوع قرارداد",
        value: contract?.data?.contractType?.name ?? "",
      },

      {
        label: "توضیحات",
        value: contract?.data?.description ?? "",
      },
      {
        label: "",
        value: "",
        score: {
          id: contract?.data?.contractSatisfaction?.[0]?.id,
          isSubmitted: contract?.data?.contractSatisfaction?.[0]
            ?.satisfactionScore
            ? true
            : false,
          final: contract?.data?.contractSatisfaction?.[0]?.satisfactionScore
            ? contract?.data?.contractSatisfaction?.[0]?.satisfactionScore
            : 0,
          scoreInPercent: contract?.data?.contractSatisfaction?.[0]
            ?.satisfactionScore
            ? (contract?.data?.contractSatisfaction?.[0]?.satisfactionScore *
                100) /
              10
            : 0,
          totalVotes: totalVotes,
        },
      },
    ],
  };
  const expert: PersonInfoInterface = {
    list: [
      {
        label: "",
        value: "",
        image:contract ? "http://185.126.203.246:3000/public/" + contract?.data?.mainCustomerSoldto?.person?.avatar :""
      },
      {
        label: "نام و نام خانوادگی",

        value: contract?.data?.mainCustomerSoldto?.person?.fullName ?? "",
      },
      {
        label: "کدملی",
        value: contract?.data?.mainCustomerSoldto?.person?.idNumber ?? "",
      },
      {
        label: "شغل",
        value:
          contract?.data?.mainCustomerSoldto?.person?.personJobs?.[0]?.jobs
            ?.name,
      },
      {
        label: "شماره تماس",
        value:
          contract?.data?.mainCustomerSoldto?.Communication?.mobile?.[0]
            ?.communicationDetails,
      },
    ],
    
  };

  return (
    <main className="flex flex-col">
      <div className="w-full flex justify-between items-end">
        <div>
          <Title label="ثبت سرویس" />
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

        <Button variant={"foreground"} className="">
          <Link href="/sale">برگشت</Link>
        </Button>
      </div>
      <div className="flex flex-col lg:flex-row gap-4">
        {" "}
        <div className=" flex flex-col w-full xl:w-3/4 gap-4">
          <div className="flex flex-col gap-1">
            <ExpertInfoContainer {...expert} />
            <ContractInfoContainer {...contractInfo} contract={contract} />
          </div>

          {activeItem && activeItem.isSelected === false && (
            <div className="flex justify-between w-full p-4 bg-background-active rounded-lg">
              <p className="text-negative text-sm font-bold">
                اکنون <span> سرویس {activeItem.title} </span>به قرارداد اضافه
                شود ؟{" "}
              </p>
              <div className="flex gap-4">
                <Checkbox
                  onClick={() => {
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
                <label className="text-xs font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
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
                  if (item.disable) {
                    return;
                  } else {
                    if (activeItem && activeItem.title === item.title) {
                      setActiveItem(null);
                    } else {
                      setActiveItem(item);
                    }
                  }
                }}
                isActive={activeItem && activeItem.title == item.title}
                isSelected={item.isSelected}
                className={
                  item.disable
                    ? "cursor-not-allowed text-foreground-mute"
                    : "cursor-pointer"
                }
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
      </div>
    </main>
  );
}
