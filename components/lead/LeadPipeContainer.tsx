'use client'
import { PipeInterface } from "./LeadContainer";
import LeadPipe from "./LeadPipe";
import LeadPipeCreation from "./LeadPipeCreation";
// import { DragDropContext, DropResult } from "react-beautiful-dnd";
import { DragDropContext, DropResult } from "@hello-pangea/dnd";
export interface LeadPipeContainerInterface {
  pipeList: PipeInterface[];
}

export default function LeadPipeContainer({
  pipeList,
}: LeadPipeContainerInterface) {
  const onDragEnd = (result: DropResult) => {
    const { source, destination } = result;

  };
  return (
    <DragDropContext onDragEnd={onDragEnd}>
      <div className="grid grid-cols-10 gap-2">
        <div className="grid col-span-9">
          <div className="flex items-center gap-2">
            {pipeList?.map((pipe, index) => (
              <LeadPipe key={`lead-pipe-${index}`} {...pipe} />
            ))}
          </div>
        </div>{" "}
        <div className="grid col-span-1">
          <LeadPipeCreation />
        </div>
      </div>
    </DragDropContext>
  );
}
