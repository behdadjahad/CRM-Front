import { cn } from "@/lib/utils";

import { Checkbox } from "../ui/checkbox";
import { FaCircle } from "react-icons/fa";

export default function CustomerCard({
  className,
  customer,
  labels,
}: {
  className?: string;
  customer: any;
  labels: any;
}) {
  const customerRank = [
    {
      label: "طلایی",
      value: "Gold",
      className: "bg-[#FFFAEB] text-[#FDB022] border border-[#FDB022]",
    },
    {
      label: "نقره ای",
      value: "Silver",
      className: "bg-[#F3F2F2] text-[#919EAB] border border-[#919EAB]",
    },
    {
      label: "برنز",
      value: "Bronze",
      className: "bg-[#FFE6CE] text-[#B55D04] border border-[#B55D04]",
    },
    {
      label: "آبی",
      value: "Blue",
      className: "bg-[#EEF8FF] text-[#0475B5] border border-[#0475B5]",
    },
  ];
  return (
    <div
      className={cn("w-full p-4 rounded-md bg-card custom-shadow", className)}
    >
      <div className="grid grid-cols-2 md:grid-cols-3  lg:grid-cols-4 p-4 gap-6">
        {labels.map((item: any, index: number) => {
          const rankMatch =
            item.label === "رتبه مشتری"
              ? customerRank.find((rank) => rank.value === customer[item.label])
              : null;
          return (
            <div key={item.label} className="flex gap-2 items-center">
              {index === 0 && (
                <Checkbox
                  onCheckedChange={() => {}}
                  //checked={}
                />
              )}
              <div className="flex flex-col justify-between gap-2">
                <div className="text-xs">
                  {!item.labelIsHidden && item.label}
                </div>
                <div className="text-xs">
                  {item.label === "رتبه مشتری" ? (
                    <div
                      className={cn(
                        "flex items-center rounded-xl justify-around w-16 h-6 p-2",
                        rankMatch?.className
                      )}
                    >
                      <FaCircle className="w-2 h-2" />
                      <span>
                        {" "}
                        {rankMatch?.label
                          ? rankMatch?.label
                          : customer[item.label]}
                      </span>
                    </div>
                  ) : (
                    customer[item.label]
                  )}
                </div>
              </div>
            </div>
          );
        })}
        {/* <Checkbox
            onCheckedChange={() => {}}
            //checked={}
          /> */}
      </div>
    </div>
  );
}
