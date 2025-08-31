export interface EventDetailCardInterface {
  weekLabel: string;
  day: number;
  monthName: string;
  timeLabel: string;
  time: string;
  title: string;
}

export default function EventDetailCard({
  weekLabel,
  day,
  monthName,
  timeLabel,
  time,
  title,
}: EventDetailCardInterface) {
  return (
    <div className="flex flex-col gap-1">
      <div className="flex items-center gap-1">
        <div className="flex gap-1 text-xs text-[#A1A1AA]  border-l px-1">
          <span>{weekLabel}</span>
          <span>{day}</span>
          <span>{monthName}</span>
        </div>
        <div className="flex gap-1 text-xs text-[#A1A1AA]">
          <span>{timeLabel}</span>
          <span>{time}</span>
        </div>
      </div>
      <div className="text-[#637381] text-sm">{title}</div>
    </div>
  );
}
