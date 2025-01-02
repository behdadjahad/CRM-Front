import React, { useState } from "react";
import ServiceCard, { ServiceCardInterface } from "./service-card";
import { Checkbox } from "../ui/checkbox";
import { cn } from "@/lib/utils";
export interface ServiceContainerInterface {
  services: ServiceCardInterface[];
  className?: string;
  children?: any;
  selectedItems?: ServiceCardInterface[];
  askQuestion?: boolean;
}
export default function ServiceContainer({
  services,
  className,
  askQuestion = true,
}: ServiceContainerInterface) {
  const [activeItem, setActiveItem] = useState<any>(null);

  return (
    <div
      className={cn(
        "flex flex-col items-end p-6 rounded-xl justify-between gap-8 bg-background-active",
        className
      )}
    >
      {activeItem && askQuestion && (
        <div className="flex justify-between w-full p-4 bg-background-active rounded-lg overflow-hidden">
          <p className="text-negative text-xs font-bold">
            اکنون پرواز خارجی به عنوان قرارداد به سرویس اضافه شود؟
          </p>
          <div className="flex gap-4">
            <Checkbox />
            <Checkbox />
          </div>
        </div>
      )}

      <h2>سرویس ها</h2>

      <div className="flex flex-row-reverse flex-wrap items-center justify-start gap-3 w-full">
        {services.map((item) => (
          <ServiceCard
            key={item.title}
            {...item}
            clickFunction={() =>
              activeItem && activeItem.title === item.title
                ? setActiveItem(null)
                : setActiveItem(item)
            }
            isActive={activeItem && activeItem.title == item.title}
          />
        ))}
      </div>

      {activeItem && activeItem.children}
    </div>
  );
}
