"use client";
import { getUsers } from "@/api/auth";
import { getContracts, getServices } from "@/api/contract";
import ContractContainer, {
  ContractContainerInterface,
} from "@/components/contract/contract-container";
import ContractCreation from "@/components/sale/contract-creation";
import ContractOverview, {
  ContractOverviewInterface,
} from "@/components/sale/contract-overview";
import Filter from "@/components/sale/filter";
import Breadcrumb from "@/components/shared/breadcrumb";
import { ServiceCardInterface } from "@/components/shared/service-card";
import Title from "@/components/shared/title";
import { convertGregorianToSolarWithTimeZone } from "@/constants/time";
import { useQuery } from "@tanstack/react-query";
import { useEffect, useState } from "react";

export default function Sale() {
  const { requestCount, contractOverviewProps, contractList, formServices } =
    getData();

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

        <ContractCreation formServices={formServices} />
      </div>

      <ContractOverview {...contractOverviewProps} />

      <div className="flex flex-col-reverse md:flex-row items-center justify-between gap-y-4">
        <Filter />

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
  const [formServices, setFormServices] = useState<ServiceCardInterface[]>([]);
  const { data: users } = useQuery({
    queryKey: ["usersInformation"],
    queryFn: async () => await getUsers(),
  });
  const { data: contractInformation } = useQuery({
    queryKey: ["contractInformation"],
    queryFn: () => getContracts(),
  });

  const contractList: ContractContainerInterface["list"] =
    contractInformation?.data
      ? contractInformation?.data.map((item: any) => ({
          id: item.id,
          contract: {
            date: convertGregorianToSolarWithTimeZone(item.contractDate),
            destination: "",
            submitter:
              users?.find((obj) => obj.id === item.contractTypeId)?.fullName ??
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
            icon: "",
            submitDate: convertGregorianToSolarWithTimeZone(
              item.submitDateTime
            ),
            title:
              formServices.find((obj) => obj.id === item.contractTypeId)
                ?.title ?? "",
          },
          score: {
            final: 30,
            totalVotes: 11,
          },
          services: item.avServices ? item.avServices : [],
          user: {
            image: "",
            name:
              users?.find((obj) => obj.id === item.contractTypeId)?.fullName ??
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
    queryKey: ["serviceQuery"],
    queryFn: () => getServices(),
  });

  useEffect(() => {
    if (data?.success && data?.data) {
      setFormServices(
        data.data.map((item: any) => ({
          id: item.id,
          image: "public/" + item.iconFile,
          title: item.name,
        }))
      );
    }
  }, [data]);
  return {
    requestCount: 273,
    contractOverviewProps,
    contractList,
    formServices,
  };
}
