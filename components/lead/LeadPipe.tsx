"use client";

import AddLeadToPipe from "./AddLeadToPipe";
import LeadCard from "./LeadCard";
import { Droppable, Draggable } from "react-beautiful-dnd";
export interface LeadPipeInterface {
  id: string;
  title: string;
  leadList: any[];
  overal: {
    label: string;
    value: string;
  }[];
}

export default function LeadPipe({
  id,
  title,
  leadList,
  overal,
}: LeadPipeInterface) {
  return (
    <div className="flex flex-col w-full bg-card rounded-2xl overflow-hidden shadow-[0px_12px_24px_-4px_#919EAB1F] border">
      <div className="bg-[linear-gradient(180deg,#0475B5_-65.62%,#253159_100%)] py-2.5 px-3.5 flex items-center justify-center w-full text-primary-foreground border">
        {title}
      </div>
      <Droppable droppableId={id}>
        {(provided) => (
          <div className="p-3 flex flex-col gap-4">
            {" "}
            <div
              ref={provided.innerRef}
              {...provided.droppableProps}
              className="px-2 h-[546px] overflow-y-auto flex flex-col gap-4"
            >
              {leadList?.map((lead, index) => (
                <Draggable
                  key={lead.id} // or `lead-${index}`
                  draggableId={lead.id} // must be unique
                  index={index}
                >
                  {(provided) => (
                    <div
                      ref={provided.innerRef}
                      {...provided.draggableProps}
                      {...provided.dragHandleProps}
                    >
                      <LeadCard {...lead} />
                    </div>
                  )}
                </Draggable>
              ))}
              {provided.placeholder}
            </div>
            <AddLeadToPipe />
          </div>
        )}
      </Droppable>
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
