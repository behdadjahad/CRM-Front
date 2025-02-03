"use client";
import { getUsers } from "@/api/auth";
import { getContracts, getContractTypes } from "@/api/contract";
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
import { services } from "@/constants/services";

import { convertDate } from "@/lib/date";
import { useQuery } from "@tanstack/react-query";
import { useEffect, useState } from "react";

export default function Sale() {
  const { requestCount, contractOverviewProps, contractList, contractTypes } =
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

        <ContractCreation contractTypes={contractTypes} />
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
    queryFn: () => getContracts(),
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
          totalVotes: 11,
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
      console.log(data.data[0]);
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
