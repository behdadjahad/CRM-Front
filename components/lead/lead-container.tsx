"use client";

import FilterContainer from "../section/filter-container";
import LeadTable from "./lead-table";

export interface LeadContainerInterface {
  leadList: {
    id: number;
    list: {
      label: string;
      value: string;
    }[];
  }[];
}

export default function LeadContainer({ leadList }: LeadContainerInterface) {
  return (
    <div className="bg-card flex flex-col justify-between p-6 rounded-md custom-shadow gap-4">
      <FilterContainer
        onFilterHandler={() => {}}
        rangeItems={[]}
        filterItems={[]}
        sortList={[]}
        onSortHandler={() => {}}
        onCancleHandler={() => {}}
      />
      <div className="bg-[linear-gradient(180deg,#0475B5_-65.62%,#1C284F_100%)] rounded-sm p-3 flex items-center justify-between px-6 text-card">
        درخواست ها
      </div>
      <LeadTable leadList={leadList} />
    </div>
  );
}
