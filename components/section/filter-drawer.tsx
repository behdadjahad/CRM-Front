import React from "react";
import { cn } from "@/lib/utils";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "../ui/accordion";

import { Button } from "../ui/button";

export interface FilterDrawerInterface {
  state: boolean;
  setState: (prev: any) => any;
  filterItems: any[];
  rangeItems: any[];
  onFilterHandler: any;
  onCancleHandler: any;
}

export default function FilterDrawer({
  state,
  setState,
  filterItems,
  rangeItems,
  onFilterHandler,
  onCancleHandler,
}: FilterDrawerInterface) {
  return (
    <div
      className={cn("h-0 w-0 overflow-hidden top-0 left-0 z-50 fixed", {
        "w-screen h-screen": state,
      })}
    >
      <div
        className="bg-foreground/80 h-screen w-screen z-20"
        onClick={() => setState(false)}
      />
      <div
        className={cn(
          "h-screen rounded-r-2xl fixed top-0 z-50 left-0 w-0 bg-card text-foreground overflow-x-hidden duration-200 transition-all",
          {
            "w-72": state,
          }
        )}
      >
        <div className="flex flex-col w-full">
          <span className="p-5 border-b font-bold text-base">فیلتر ها</span>
          <Accordion type="multiple" className="w-full px-5 overflow-visible">
            {filterItems.map((item) => (
              <AccordionItem
                className="py-3"
                value={item.title}
                key={item.title}
              >
                <AccordionTrigger className="font-bold text-sm">
                  {item.title}
                </AccordionTrigger>
                <AccordionContent>{item.component}</AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </div>

        {rangeItems && rangeItems.length > 0 && (
          <div className="flex flex-col w-full">
            <span className="p-5 font-bold text-base">محدوده ها</span>
            <Accordion type="multiple" className="w-full px-5 overflow-visible">
              {rangeItems.map((item) => (
                <AccordionItem
                  className="py-3"
                  value={item.title}
                  key={item.title}
                >
                  <AccordionTrigger className="font-bold text-sm">
                    {item.title}
                  </AccordionTrigger>
                  <AccordionContent>{item.component}</AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </div>
        )}
        <div className="p-7 w-full flex gap-2">
          <Button variant={"info"} className="w-full" onClick={onFilterHandler}>
            اعمال فیلتر
          </Button>
          <Button
            variant={"foreground"}
            className="w-full"
            onClick={onCancleHandler}
          >
            لغو فیلتر
          </Button>
        </div>
      </div>
    </div>
  );
}
