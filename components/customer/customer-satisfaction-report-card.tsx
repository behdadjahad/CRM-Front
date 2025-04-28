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
      <div className="flex flex-col gap-4">
        {list.map((listItem, index) => (
          <div key={index} className="flex items-center gap-2">
            <div className="w-1/4">{listItem.label}</div>
            <Progress
              value={listItem.value}
              className="h-1.5 w-2/3 bg-muted/30"
              indicatorClassName={indicatorClassName}
            />
            <div className="text-foreground-mute">{`% ${listItem.value}`}</div>
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
