
import CardContainer, { CardContainerInterface } from "@/components/sale/card-container";
import ContractCreation from "@/components/sale/contract-creation";
import ContractOverview, { ContractOverviewInterface } from "@/components/sale/contract-overview";
import Filter from "@/components/sale/filter";
import Breadcrumb from "@/components/shared/breadcrumb";
import Title from "@/components/shared/title";

export default function Sale() {
  const { contractOverviewProps, requestCount, visaContainerList } = getData();

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

        <ContractCreation />
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
  const contractOverviewProps: ContractOverviewInterface = {
    list: [
      {
        label: " قرار داد کل",
        value: "100",
      },
      {
        label: "قرار داد تکمیل شده",
        value: "94",
      },
      {
        label: " قرار داد ناقص",
        value: "8",
      },
    ],
  };

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
      {
        image: "/images/services/visa.png",
        title: "ویزا",
      },
      {
        image: "/images/services/international-airport.png",
        title: "پرواز خارجی",
      },
      {
        image: "/images/services/suitcase.png",
        title: "تور خارجی",
      },
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
  };
}
