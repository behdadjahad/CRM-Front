import { cn } from "@/lib/utils";
import { Button } from "../ui/button";
import { useState } from "react";
import Link from "next/link";
import { NotificationList } from "./notification-list";

export interface NotificationDrawerInterface {
  state: boolean;
  setState: (prev: any) => any;
  tabList: any[];
  list: any[];
}
export default function NotificationDrawer({
  state,
  setState,
  tabList,
  list,
}: NotificationDrawerInterface) {
  const [activeTab, setActiveTab] = useState("all");
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
            "w-110": state,
          }
        )}
      >
        <div className="flex flex-col w-full h-full justify-between">
          <div className="flex flex-col gap-4 p-5">
            <span className="font-bold text-base">اعلان ها</span>
            <div className="flex flex-row w-full justify-between">
              {" "}
              {tabList.map((item) => {
                return (
                  <Button
                    key={item.label}
                    onClick={() => setActiveTab(item.value)}
                    className={`text-sm min-w-fit w-full p-1 rounded-none text-[#757575] text-right flex-gap-1 ${
                      activeTab === item.value
                        ? "border-b-2 text-foreground border-b-[#DF9832]"
                        : ""
                    }`}
                    variant={"transparent"}
                  >
                    <span> {item.label}</span>
                    <span className="w-5 h-5 rounded-full bg-[#F2F4F7] flex item-center justify-center">
                      {item.count}
                    </span>
                  </Button>
                );
              })}
            </div>
            <NotificationList list={list} />
          </div>

          <Link
            className="text-center h-12 flex items-center justify-center text-[#2E70E8] border border-t font-primary-bold"
            href="/notification"
            onClick={() => setState(false)}
          >
            مشاهده همه
          </Link>
        </div>
      </div>
    </div>
  );
}
