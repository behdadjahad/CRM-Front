"use client";
import Image from "next/image";
import { getContractTypes } from "@/api/contract";
import ContractCreation from "@/components/contract/contract-creation";
import ContractDashboard from "@/components/contract/ContractDashboard";
import { AccessDenied } from "@/components/shared/AccessDenied";
import Breadcrumb from "@/components/shared/breadcrumb";
import { ServiceCardInterface } from "@/components/shared/service-card";
import Title from "@/components/shared/title";
import { usePageData } from "@/hooks/usePageData";
import { generateFeatureAccess } from "@/lib/generatePageData";
import { useQuery } from "@tanstack/react-query";

import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchContracts } from "@/store/contract-slice";
export default function Contracts() {
  const dispatch = useDispatch<any>();
  const pageFeatures = usePageData();
  const [contractTypes, setContractTypes] = useState<ServiceCardInterface[]>(
    []
  );
  const { data: contractTypeData } = useQuery({
    queryKey: ["contractTypeQuery"],
    queryFn: () => getContractTypes(),
  });
  useEffect(() => {
    if (contractTypeData && contractTypeData?.data?.length > 0) {
      setContractTypes(
        contractTypeData?.data?.map((item: any) => ({
          id: item.id,
          image: "http://185.126.203.246:3000/public/" + item.iconFile,
          title: item.name,
          activeImage:
            "http://185.126.203.246:3000/public/" + item.activeIconFile,
        }))
      );
    }
  }, [contractTypeData]);
  const contractList = useSelector((state: any) => state.contract.items);
  const limit = useSelector((state: any) => state.contract.limit);
  const currentPage = useSelector((state: any) => state.contract.currentPage);
  const scrollY = useSelector((state: any) => state.contract.scrollPosition);
  useEffect(() => {
    dispatch(
      fetchContracts({
        page: currentPage,
        limit: limit,
        filters: {},
      })
    );
  }, [dispatch]);
  return (
    <main className="flex flex-col">
      <div className="flex items-center justify-between">
        {" "}
        <div>
          <Title label="قراردادها" />
          <Breadcrumb
            list={[
              {
                label: "داشبورد",
                link: "/",
              },
              {
                label: "قراردادها",
              },
            ]}
          />
        </div>{" "}
        {generateFeatureAccess(pageFeatures, "create-contract")?.show &&
          generateFeatureAccess(pageFeatures, "create-contract")?.enable && (
            <ContractCreation contractTypes={contractTypes} />
          )}
        {generateFeatureAccess(pageFeatures, "create-contract")?.show &&
          !generateFeatureAccess(pageFeatures, "create-contract")?.enable && (
            <AccessDenied
              title="قرارداد جدید"
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

      <ContractDashboard contractList={contractList} />
    </main>
  );
}
