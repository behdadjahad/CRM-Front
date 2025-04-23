import { cn } from "@/lib/utils";
import CustomerCard from "./customer-card";

export default function CustomerContainer({
  className,
}: {
  className?: string;
}) {
    return <div className={cn("flex flex-col", className)}>
  
        <CustomerCard className={""} />
    </div>;
}

