import LeadContactTypeCard from "./lead/LeadContactTypeCard";

export interface GridDailyCalendarInterface {
  events: any[];
  followUpTypeList: any[];
}

export default function GridDailyCalendar({
  events,
  followUpTypeList,
}: GridDailyCalendarInterface) {
  function getEventListHandler(id?: number) {
    console.log(id);
  }
  return (
    <div className="grid grid-cols-3 md:grid-cols-6 lg:grid-cols-8">
      {Array.from({ length: 24 }).map((_, i) => (
        <div
          key={i}
          className="flex items-center justify-between  border border-[#E9EAEB] bg-card text-[#535862] h-64 flex-col p-4"
        >
          <div>{i + 1}</div>
          {followUpTypeList.map((contactType: any) => (
            <LeadContactTypeCard
              {...contactType}
              key={contactType.value}
              onActiveItem={(label, value, id) => {
                getEventListHandler(id);
              }}
            />
          ))}
        </div>
      ))}
    </div>
  );
}
