"use client";

import AddLeadToPipe from "./AddLeadToPipe";
import LeadCard from "./LeadCard";
// import { Droppable, Draggable } from "react-beautiful-dnd";
import { Droppable, Draggable } from "@hello-pangea/dnd";
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
      {/* Column Title */}
      <div className="bg-[linear-gradient(180deg,#0475B5_-65.62%,#253159_100%)] py-2.5 px-3.5 flex items-center justify-center w-full text-primary-foreground border">
        {title}
      </div>
      <div className="px-2 py-2 h-[546px] overflow-y-auto">
        {/* Droppable Zone */}
        <Droppable droppableId={id}>
          {(provided, snapshot) => (
            <div
              className={`flex flex-col gap-4 transition-colors ${
                snapshot.isDraggingOver ? "bg-blue-50" : ""
              }`}
              ref={provided.innerRef}
              {...provided.droppableProps}
            >
              {leadList?.map((lead, index) => (
                <Draggable
                  key={lead.id}// Make sure lead.id is unique
                  draggableId={lead.id}
                  index={index}
                >
                  {(provided, snapshot) => (
                    <div
                      ref={provided.innerRef}
                      {...provided.draggableProps}
                      {...provided.dragHandleProps}
                      className={`transition-shadow ${
                        snapshot.isDragging ? "shadow-lg" : ""
                      }`}
                    >
                      <LeadCard {...lead} />
                    </div>
                  )}
                </Draggable>
              ))}
              {provided.placeholder}
            </div>
          )}
        </Droppable>
      </div>
      {/* Add New Lead */}

      <AddLeadToPipe />

      {/* Footer / Overall Section */}
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
