import { cn } from "@/lib/utils";
import ContractCard from "./ContractCard";
export interface ContractContainerInterface {
  className?: string;
  contractList?: any[];
}
export default function ContractContainer({
  className,
  contractList,
}: ContractContainerInterface) {
  return (
    <div className={cn("", className)}>
      {contractList?.map((contract,index) => (
        <ContractCard key={`contract-${index}`} {...contract} />
      ))}
    </div>
  );
}
