"use client";


import { Button } from "../ui/button";


export interface NotificationTabListInterface {
  tabList: NotificationTabInterface[];
  onChangeTab: any;
  activeTab: string;
}
export interface NotificationTabInterface {
  label: string;
  value: string;
  count: number;
}

export default function NotificationTabList({
  tabList,
  onChangeTab,
  activeTab
}: NotificationTabListInterface) {
return (
    <div className="flex flex-row gap-2">
      {" "}
      {tabList.map((item: NotificationTabInterface) => (
        <Button
          key={item.label}
          onClick={() => {
            onChangeTab(item?.value);
          }}
          className={`text-sm min-w-fit p-1 rounded-none text-[#757575] text-right flex flex-row gap-2 ${
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
      ))}
    </div>
  );
}
