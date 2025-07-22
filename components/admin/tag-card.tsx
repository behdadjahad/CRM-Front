import { FaTimes } from "react-icons/fa";
import { Button } from "../ui/button";
export interface TagCardInterfece {
  onDeleteHandler: (itemId: number) => void;
    label: string;
    value: number;
}
export default function TagCard({ onDeleteHandler, label,value }: TagCardInterfece) {
  return (
    <div className="bg-gray-50 px-2 text-gray-500 border rounded-full text-right w-fit relative h-8 flex items-center justify-between text-xs min-w-18 gap-2">
      <div className="text-right">{label}</div>
      <Button
        variant={"transparent"}
        onClick={() => {
          onDeleteHandler(value);
        }}
        className="flex items-center justify-center p-1 z-20 border border-gray-300 text-gray-500 rounded-full bg-card"
      >
        <FaTimes size={8} />
      </Button>
    </div>
  );
}
