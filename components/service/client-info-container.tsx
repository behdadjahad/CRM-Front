import ClientInfoCard, { ClientInfoCardInterface } from "./client-info-card";
import { useEffect, useState } from "react";
import Image from "next/image";
import { useQuery } from "@tanstack/react-query";
import { getCustomersData } from "@/api/customer";
import { useParams } from "next/navigation";
import { usePageData } from "@/hooks/usePageData";
import { generateFeatureAccess } from "@/lib/generatePageData";
import CustomerManager from "./customer-manager";
import { AccessDenied } from "../shared/AccessDenied";

export interface ClientInfoContainerInterface {
  clients: ClientInfoCardInterface[];
}

export default function ClientInfoContainer() {
  const pageFeatures = usePageData();
  const { id } = useParams();
  const [clientList, setClientList] = useState<any[]>([]);
  const [clientsInfo, setClientsInfo] = useState<any[]>([]);

  const { data: contractCustomersData } = useQuery({
    queryKey: ["contractCustomersData"],
    queryFn: () => getCustomersData(Number(id)),
  });

  useEffect(() => {
    if (contractCustomersData) {
      const clients = contractCustomersData?.data?.map((client: any) => [
        {
          label: "نام و نام خانوادگی",
          value: client?.person?.firstName + " " + client?.person?.lastName,
        },
        { label: "کدملی", value: client?.person?.idNumber },
        {
          label: "شماره تلفن",
          value: client?.Communication?.mobile?.[0]?.communicationDetails,
        },
        {
          label: "ایمیل",
          value: client?.Communication?.email?.[0]?.communicationDetails,
        },
      ]);
      const clientInfoList = contractCustomersData?.data?.map(
        (client: any) => ({
          editKey: client?.id,
          deleteKey: client?.contractCustomers?.[0]?.id,
          name: client?.person?.firstName,
          family: client?.person?.lastName,
          idNumber: client?.person?.idNumber,
          phone: client?.Communication?.mobile?.[0]?.communicationDetails,
          email: client?.Communication?.email?.[0]?.communicationDetails,
        })
      );

      setClientList(clients);
      setClientsInfo(clientInfoList);
    }
  }, [contractCustomersData]);

  return (
    <div className="bg-card p-4 rounded-lg overflow-hidden flex flex-col gap-4">
      <h2 className="text-foreground text-lg">اطلاعات مشتری</h2>
      <div className="flex flex-col gap-4">
        {generateFeatureAccess(pageFeatures, "contract-customers")?.show &&
          clientList?.map((item, index) => (
            <ClientInfoCard
              key={`client-${index}`}
              clientData={item}
              clientInfo={clientsInfo[index]}
            />
          ))}
      </div>
      {generateFeatureAccess(pageFeatures, "add-customer")?.show &&
        generateFeatureAccess(pageFeatures, "add-customer")?.enable && (
          <CustomerManager />
        )}
      {generateFeatureAccess(pageFeatures, "add-customer")?.show &&
        !generateFeatureAccess(pageFeatures, "add-customer")?.enable && (
          <AccessDenied
            title="افزودن مشتری"
            icon={
              <Image
                src={"/icons/disable-plus.png"}
                alt="ادیت"
                width={1024}
                height={1024}
                className="w-4 h-4"
              />
            }
          />
        )}
    </div>
  );
}
