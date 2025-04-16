"use client";
import { useState } from "react";
import CustomerTabContent from "./customer-tab-content";

export default function CustomerTabContainer({ tabList }: { tabList: any[] }) {
  const [activeTab, setActiveTab] = useState(tabList[0]);
  

  return (
    <div className="w-full ">
      <div className="flex items-center justify-between  border border-[#DCE0E4] rounded-lg">
        {tabList.map((tab: any) => (
          <button
            key={tab}
            className={`w-full text-center h-full py-2 ${
              activeTab === tab
                ? "border-b-2 border-black font-bold text-black"
                : "text-neutral-500"
            }`}
            onClick={() => setActiveTab(tab)}
          >
            {tab.toUpperCase()}
          </button>
        ))}
      </div>

      <div className="mt-4">
        {activeTab === "همه مشتری ها" && <CustomerTabContent />}
        {activeTab === "امروز" && <CustomerTabContent />}
      </div>
    </div>
  );
}
