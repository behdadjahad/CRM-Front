import { leadFollowUpTypeList } from "@/constants/lead";
import { AddEventToLead } from "./AddEventToLead";
import LeadStatus from "./LeadStatus";

export interface LeadCardInterface {
  list: {
    label: string;
    value: string;
    status?: string;
  }[];
  main: {
    owner: string;
    date: string;
  };
}

export default function LeadCard({ list, main }: LeadCardInterface) {
  return (
    <div className="bg-[#F8FAFF] border border-[#E9EAEB] p-3 rounded-xl flex flex-col gap-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div>icon</div>
          <div className="flex flex-col gap-1">
            <span className="font-semibold">{main.owner}</span>
            <span className="text-xs">{main.date}</span>
          </div>
        </div>
        <div>more</div>
      </div>
      <div className="flex flex-col gap-2">
        {" "}
        {list?.map((item, index) => (
          <div
            className="flex items-center justify-between text-xs"
            key={`lead-info-${index}`}
          >
            <div>{item.label}:</div>
            <div className="flex items-center gap-1">
              {item?.status && (<LeadStatus />)}
              <span>{item.value}</span>
            </div>
          </div>
        ))}
      </div>
      <AddEventToLead list={leadFollowUpTypeList} />
    </div>
  );
}
