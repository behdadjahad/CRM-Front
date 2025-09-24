import DeleteConfirmation from "../admin/delete-confirmation";
import { Button } from "../ui/button";
import Image from "next/image";
export interface EventDetailCardInterface {
  weekLabel: string;
  day: number;
  monthName: string;
  timeLabel: string;
  time: string;
  title: string;
  onViewEditForm: (viewEditForm:boolean) => void;
}

export default function EventDetailCard({
  weekLabel,
  day,
  monthName,
  timeLabel,
  time,
  title,
  onViewEditForm
}: EventDetailCardInterface) {
  return (
    <div className="flex flex-col gap-1">
      <div className="flex items-center justify-between">
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
        <div className="flex items-center gap-1
        ">
          {" "}
          <Button
            className="border-none p-0 text-[#212B36]"
            onClick={() => {
              onViewEditForm(true);
            }}
          >
            <Image
              src="/icons/edit-primary.png"
              alt=""
              width={1024}
              height={1024}
              className="w-4 h-4"
              onClick={() => {}}
            />
          </Button>
          <DeleteConfirmation
            onDelete={() => {
              // onDeleteEvent(eventList?.[0]?.id);
            }}
          />
        </div>
      </div>

      <div className="text-[#637381] text-sm">{title}</div>
    </div>
  );
}
