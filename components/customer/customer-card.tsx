import { cn } from "@/lib/utils";

import { Checkbox } from "../ui/checkbox";

export default function CustomerCard({
  className,
  customer,
  labels,
}: {
  className?: string;
  customer: any;
  labels: any;
}) {
  
  return (
    <div className={cn("w-full p-4 rounded-md bg-card custom-shadow", className)}>
      <div className="grid grid-cols-2 md:grid-cols-3  lg:grid-cols-4 p-4 gap-6">
        {labels.map((item: any,index:number) => (
          <div key={item.label} className="flex gap-2 items-center">
           {index === 0 && <Checkbox
              onCheckedChange={() => {}}
              //checked={}
            />}
            <div className="flex flex-col justify-between gap-2">
              <div className="text-xs">{!item.labelIsHidden && item.label}</div>
              <div className="text-xs">{customer[item.label]}</div>
            </div>
          </div>
        ))}
        {/* <Checkbox
            onCheckedChange={() => {}}
            //checked={}
          /> */}
      </div>
    </div>
  );
}
