import { cn } from "@/lib/utils";
import CustomerCard from "./customer-card";
import Link from "next/link";

export default function CustomerContainer({
  className,
  customers,
  labels,
}: {
  className?: string;
  customers: any[];
  labels: any;
  }) {

  return (
    <div className={cn("flex flex-col gap-4 bg-transparent", className)}>
      {customers.map((item, index) => (
        <Link
          href={`/customer/${item.id}`}
          style={{ display: "contents" }}
          key={index}// ✅ Preserves layout
        >
          <CustomerCard
            className="custom-shadow"
            customer={item.info}
            key={index}
            labels={labels}
          />
        </Link>
      ))}
    </div>
  );
}
