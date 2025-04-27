import { cn } from "@/lib/utils";
import CustomerCard from "./customer-card";

export default function CustomerDetailContractContainer({
  className,
  list,
  labels
}: {
  className?: string;
  list:any[];
  labels:any;
}) {
    return <div className={cn("flex flex-col gap-4 bg-transparent", className)}>
       { list.map((item,index) => (<CustomerCard className="custom-shadow" customer={item} key={index} labels={labels}/>))}

    </div>;
}
