import { Droppable } from "@hello-pangea/dnd";
export interface DroppableActionCardInterface {
    status: {
        label: string;
        value: string;
  };
}
export default function DroppableActionCard({
  status,
}: DroppableActionCardInterface) {
  return (
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
          {status.label}
          {provided.placeholder}
        </div>
      )}
    </Droppable>
  );
}
