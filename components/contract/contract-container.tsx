import React, { useState } from "react";

import ContractCard, { ContractCardInterface } from "./contract-card";
import { cn } from "@/lib/utils";
import { usePageData } from "@/hooks/usePageData";
import { generateFeatureAccess } from "@/lib/generatePageData";
import { AccessDenied } from "../shared/AccessDenied";

export interface ContractContainerInterface {
  list: ContractCardInterface[];
  className?: string;
  mainRef: any;
}

export default function ContractContainer({
  list,
  className,
  mainRef,
}: ContractContainerInterface) {
  const pageFeatures = usePageData();
  const hasAccess = generateFeatureAccess(
    pageFeatures,
    "contract-detail"
  )?.enable;

  return (
    <div
      className={cn(
        "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5",
        className
      )}
    >
      {list?.map((item, index) => {
        return hasAccess ? (
          <ContractCard
            {...item}
            key={item?.header?.submitDate + item?.user?.name + index}
            mainRef={mainRef}
          />
        ) : (
          <AccessDenied
            featureCode="contract-detail"
            trigger={
              <ContractCard
                {...item}
                key={item?.header?.submitDate + item?.user?.name + index + 'noAccess'}
                mainRef={mainRef}
              />
            }
          />
        );
      })}
    </div>
  );
}
