import { cn } from "@/lib/utils";
import CustomerCard from "./customer-card";

export default function CustomerContainer({
  className,
  customers,
  labels
}: {
  className?: string;
  customers:any[];
  labels:any;
  }) {
  console.log(customers)
    return <div className={cn("flex flex-col gap-4 bg-transparent", className)}>
       { customers.map((item,index) => (<CustomerCard className="custom-shadow" customer={item} key={index} labels={labels}/>))}

    </div>;
}

