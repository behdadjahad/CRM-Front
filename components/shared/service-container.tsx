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
  multiChosen?: boolean;
  onActiveItemChange?: any;
}

export default function ServiceContainer({
  services,
  className,
  askQuestion,
  multiChosen,
  children,
  onActiveItemChange,
}: ServiceContainerInterface) {
  const [activeItem, setActiveItem] = useState<any>([]);

  return (
    <div
      className={cn(
        "flex flex-col items-end p-6 rounded-xl justify-between gap-8 bg-background-active",
        className
      )}
    >
      {(Array.isArray(activeItem)
        ? activeItem.length > 0 &&
          activeItem.every((item) => item.isSelected === false)
        : activeItem && activeItem.isSelected === false) &&
        askQuestion && (
          <div className="flex justify-between w-full p-4 bg-background-active rounded-lg overflow-hidden">
            <p className="text-negative text-xs font-bold">
              اکنون پرواز خارجی به عنوان قرارداد به سرویس اضافه شود؟
            </p>
            <div className="flex gap-4">
              <Checkbox
                onClick={() => {
                  onActiveItemChange(activeItem);
                  setActiveItem(null);
                }}
              />
              <label
                htmlFor=""
                className="text-xs font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
              >
                بله
              </label>

              <Checkbox
                onClick={() => {
                  setActiveItem(null);
                }}
              />
              <label
                htmlFor=""
                className="text-xs font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
              >
                خیر
              </label>
            </div>
          </div>
        )}

      <h2>سرویس ها</h2>

      <div className="flex flex-row flex-wrap items-center justify-start gap-2 w-full">
        {services.map((item) => (
          <ServiceCard
            key={item.id}
            {...item}
            clickFunction={() => {
              if (multiChosen) {
                const isExist = activeItem.some(
                  (obj: any) => obj.id === item.id
                );
                if (isExist) {
                  setActiveItem(
                    activeItem.filter((obj: any) => obj.id !== item.id)
                  );
                  onActiveItemChange(
                    activeItem.filter((obj: any) => obj.id !== item.id)
                  );
                } else {
                  setActiveItem([...activeItem, item]);
                  onActiveItemChange([...activeItem, item]);
                }
              } else if (activeItem && activeItem.title === item.title) {
                setActiveItem(null);
                onActiveItemChange(item)
              } else {
                setActiveItem(item);
                 onActiveItemChange(item);
                
              }
            }}
            isActive={
              multiChosen
                ? activeItem.some((obj: any) => obj.id === item.id)
                : activeItem && activeItem.id == item.id
            }
          />
        ))}
      </div>

      {activeItem && activeItem.children}

      {children}
      
    </div>
  );
}
