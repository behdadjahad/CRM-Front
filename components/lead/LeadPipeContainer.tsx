"use client";
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
    console.log(source, destination);

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
      {/* <div className="flex items-center w-full justify-center fixed bottom-24 gap-4">
        <Droppable droppableId="success-box">
          {(provided, snapshot) => (
            <div
              ref={provided.innerRef}
              {...provided.droppableProps}
              className={`flex items-center justify-center bg-card w-[312px] h-[76px] custom-shadow rounded-lg overflow-hidden transition-all ${
                snapshot.isDraggingOver
                  ? "border-2 border-dashed border-green-500"
                  : ""
              }`}
            >
              موفق
              {provided.placeholder}
            </div>
          )}
        </Droppable>

        <Droppable droppableId="failure-box">
          {(provided, snapshot) => (
            <div
              ref={provided.innerRef}
              {...provided.droppableProps}
              className={`flex items-center justify-center bg-card w-[312px] h-[76px] custom-shadow rounded-lg overflow-hidden transition-all ${
                snapshot.isDraggingOver
                  ? "border-2 border-dashed border-red-500"
                  : ""
              }`}
            >
              ناموفق
              {provided.placeholder}
            </div>
          )}
        </Droppable>
      </div>  */}
    </DragDropContext>
  );
}
