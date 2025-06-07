import ClientInfoCard, { ClientInfoCardInterface } from "./client-info-card";
import { useEffect, useState } from "react";

import { useQuery, useQueryClient } from "@tanstack/react-query";
import { getCustomersData } from "@/api/customer";
import { useParams } from "next/navigation";
import CustomerManager from "./customer-manager";

export interface ClientInfoContainerInterface {
  clients: ClientInfoCardInterface[];
}

export default function ClientInfoContainer() {
  const { id } = useParams();
  const [clientList, setClientList] = useState<any[]>([]);

  const { data: contractCustomersData } = useQuery({
    queryKey: ["contractCustomersData"],
    queryFn: () => getCustomersData(Number(id)),
  });

  useEffect(() => {
    if (contractCustomersData) {
      console.log(contractCustomersData);
      const clients = contractCustomersData?.data?.map((client: any) => [
        { label: "id", value: client?.id },
        {
          label: "نام و نام خانوادگی",
          value: client?.person?.firstName + " " + client?.person?.lastName,
        },
        { label: "کدملی", value: client?.person?.idNumber },
        {
          label: "شماره تلفن",
          value: client?.communication?.mobile?.[0]?.communicationDetails,
        },
        {
          label: "ایمیل",
          value: client?.communication?.email?.[0]?.communicationDetails,
        },
      ]);

      setClientList(clients);
    }
  }, [contractCustomersData]);

  return (
    <div className="bg-card p-4 rounded-lg overflow-hidden flex flex-col gap-4">
      <h2 className="text-foreground text-lg">اطلاعات مشتری</h2>
      <div className="flex flex-col gap-4">
        {clientList?.map((item, index) => (
          <ClientInfoCard
            key={`client-${index}`}
            clientId={item[0].value}
            clientData={item}
            clientInfo={clientList[index]}
          />
        ))}
      </div>
      <CustomerManager />
    </div>
  );
}
