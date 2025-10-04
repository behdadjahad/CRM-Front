import LeadCard from "./LeadCard";

export interface LeadPipeInterface {
  title: string;
  leadList: any[];
  overal: {
    label: string;
    value: string;
  }[];
}

export default function LeadPipe({
  title,
  leadList,
  overal,
}: LeadPipeInterface) {
  return (
    <div className="flex flex-col w-full bg-card rounded-2xl overflow-hidden shadow-[0px_12px_24px_-4px_#919EAB1F] border h-full">
      <div className="bg-[linear-gradient(180deg,#0475B5_-65.62%,#253159_100%)] py-2.5 px-3.5 flex items-center text-center w-full text-primary-foreground border">
        {title}
      </div>
      <div className="p-3 flex flex-col">
        {" "}
        {leadList?.map((lead, index) => (
          <LeadCard key={`lead-${index}`} {...lead} />
        ))}
      </div>
      <div className="border border-t bg-[#F8FAFF] p-3">
        <div className="flex flex-col gap-2">
          {overal?.map((item, index) => (
            <div
              className="flex items-center justify-between text-sm"
              key={`overal-${index}`}
            >
              <span>{item.label}</span>
              <span>{item.value}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
