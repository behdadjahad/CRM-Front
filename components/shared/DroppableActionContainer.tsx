import { cn } from "@/lib/utils";
import DroppableActionCard from "./DroppableActionCard ";

export interface DroppableActionContainerInterface {
  list: any[];
  className?: string;
}

export default function DroppableActionContainer({
  list,
  className,
}: DroppableActionContainerInterface) {
  return (
    <div className={cn("flex items-center w-full justify-center fixed bottom-24 gap-4", className)}>
      {list?.map((actionCard, index) => (
        <DroppableActionCard {...actionCard} key={`action-card-${index}`} />
      ))}
    </div>
  );
}
