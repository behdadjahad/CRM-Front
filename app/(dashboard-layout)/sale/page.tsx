"use client";
import { getContracts, getServices } from "@/api/contract";
import CardContainer, {
  CardContainerInterface,
} from "@/components/sale/card-container";
import ContractCreation from "@/components/sale/contract-creation";
import ContractOverview, {
  ContractOverviewInterface,
} from "@/components/sale/contract-overview";
import Filter from "@/components/sale/filter";
import Breadcrumb from "@/components/shared/breadcrumb";
import { ServiceCardInterface } from "@/components/shared/service-card";
import Title from "@/components/shared/title";
import { useQuery } from "@tanstack/react-query";
import { useEffect, useState } from "react";

export default function Sale() {
  const {
    contractOverviewProps,
    requestCount,
    visaContainerList,
    formServices,
  } = getData();
  getContracts();
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
        <CardContainer {...visaContainerList} />
      </div>
    </main>
  );
}

function getData() {
  const [formServices, setFormServices] = useState<ServiceCardInterface[]>([]);
  const { data: contractInformation } = useQuery({
    queryKey: ["contractInformation"],
    queryFn: () => getContracts(),
  });

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
          image: item.iconFile,
          title: item.name,
        }))
      );
    }
  }, [data]);

  const visaCardProps: CardContainerInterface["list"][0] = {
    id: "1",
    contract: {
      date: "1360/01/20",
      destination: "دبی",
      submitter: "سام امیری",
      unit: "دلار",
    },
    footer: {
      cost: "1,234,568",
      income: "1,234,568",
      overall: "3,456,789",
    },
    header: {
      contractNumber: "358067357101",
      icon: "/icons/visa-white.png",
      submitDate: "1360/01/20",
      title: "ویزا",
    },
    score: {
      final: 30,
      totalVotes: 11,
    },
    services: [
      { id: 1, image: "/images/services/visa.png", title: "ویزا" },
      {
        id: 2,
        image: "/images/services/international-airport.png",
        title: "پرواز خارجی",
      },
      { id: 3, image: "/images/services/suitcase.png", title: "تور خارجی" },
    ],
    user: {
      image: "/temp/avatar-2.png",
      name: "مهدی میرزایی",
    },
  };

  const visaContainerList: CardContainerInterface = {
    list: [
      visaCardProps,
      visaCardProps,
      visaCardProps,
      visaCardProps,
      visaCardProps,
      visaCardProps,
      visaCardProps,
      visaCardProps,
    ],
  };

  return {
    requestCount: 273,
    contractOverviewProps,
    visaContainerList,
    formServices,
  };
}
