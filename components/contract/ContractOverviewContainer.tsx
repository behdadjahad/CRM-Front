import { cn } from "@/lib/utils";
export interface ContractOverviewContainerInterface {
  className?: string;
  list: {
    label: string;
    value: number;
    className?: string;
  }[];
}
export default function ContractOverviewContainer({
  className,
  list,
}: ContractOverviewContainerInterface) {
  return (
    <div className={cn("bg-yellow-300 px-6", className)}>
          <div className="bg-red-400 flex">{list.map((item,index)=>(<div key={`contract-overview-${index}`}></div>)) }</div>
    </div>
  );
}
