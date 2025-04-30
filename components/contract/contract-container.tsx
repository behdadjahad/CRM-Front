import React from "react";

import  ContractCard, { ContractCardInterface } from "./contract-card";
import { cn } from "@/lib/utils";

export interface ContractContainerInterface {
  list: ContractCardInterface[];
  className?: string;
}

export default function ContractContainer({
  list,
  className,
}: ContractContainerInterface) {

  return (
    <div
      className={cn(
        "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5",
        className
      )}
    >
      {list.map((item, index) => (
        <ContractCard
          {...item}
          key={item?.header?.submitDate + item?.user?.name + index}
        />
 
      ))}
    </div>
  
  );
}
