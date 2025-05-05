import { Progress } from "@/components/ui/progress";
import { CustomerSatisfactionReportInterface } from "./customer-satisfaction-report";
import { Button } from "../ui/button";
import { FaChevronDown, FaChevronUp } from "react-icons/fa";
import { useState } from "react";

export default function CustomerSatisfactionReportCard({
  title,
  list,
  indicatorClassName,
}: CustomerSatisfactionReportInterface) {
    const [isCollapsed, setIsCollapsed] = useState<boolean>(true);
  return (
    <div className="bg-card custom-shadow rounded-lg p-6 flex flex-col gap-4">
    <div
      key={title}
      className={`flex flex-col gap-4 bg-card overflow-hidden ${
          isCollapsed ? "h-[200px]" : "h-[100px]"
        } transition-all duration-300 ease-in-out`}
    >
      <div className="text-foreground-mute">{title}</div>
      <div className="w-full flex flex-col gap-4">
        {list.map((listItem, index) => (
          <div key={index} className="w-full flex flex-col md:grid md:grid-cols-4 items-center gap-2">
            <div className="w-full md:col-span-1 text-center md:text-right">{listItem.label}</div>
            <div className="w-full md:col-span-3 flex items-center justify-between">
            <Progress
              value={listItem.value}
              className="h-1.5 bg-muted/30"
              indicatorClassName={indicatorClassName}
            />
              <div className="text-foreground-mute text-left text-xs md:text-sm">{`% ${listItem.value}`}</div>
              </div>
          </div>
        ))}
        </div>
        </div>
      <Button
        variant={"transparent"}
              onClick={() => setIsCollapsed(!isCollapsed)}
              className="flex justify-start text-primary-active"
      >
        <span className="text-sm">
          {" "}
          {isCollapsed ? "مشاهده کمتر" : "مشاهده بیشتر"}
        </span>

        {isCollapsed ? <FaChevronDown size={8} /> : <FaChevronUp size={8} />}
      </Button>
    </div>
  );
}
