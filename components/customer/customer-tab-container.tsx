'use client'
import { useState } from "react";


export default function CustomerTabContainer({tabList}:{tabList: any[]}) {
    console.log(tabList)
  const [activeTab, setActiveTab] = useState(tabList[0]);
  return (
    <div className="w-full ">
      {/* Tab Buttons */}
      <div className="flex items-center justify-between  border border-[#DCE0E4] rounded-lg">
        {tabList.map((tab:any) => (
          <button
            key={tab}
            className={`w-full text-center h-full py-2 ${
              activeTab === tab ? "border-b-2 border-black font-bold text-black" : "text-neutral-500"
            }`}
            onClick={() => setActiveTab(tab)}
          >
            {tab.toUpperCase()}
          </button>
        ))}
      </div>

      {/* Tab Content */}
      <div className="mt-4">
        {activeTab === "همه مشتری ها" && <div className="flex items-center justify-center">Content for Tab 1</div>}
        {activeTab === "tab2" && <div>Content for Tab 2</div>}
        {activeTab === "tab3" && <div>Content for Tab 3</div>}
      </div>
    </div>
  );
}
