import { cn } from "@/lib/utils";
import Image from "next/image";
export interface LeadContactTypeCardInterface {
  id?: number;
  label: string;
  value: string;
  className?: string;
  activeClassName?: string;
  onActiveItem: (label: string, value: string, id?: number) => void;
  icon?: string;
  activeItem?: { value: string; label: string };
  eventOrder?: number;
}

export default function LeadContactTypeCard({
  id,
  label,
  value,
  onActiveItem,
  className,
  icon,
  activeItem,
  activeClassName,
  eventOrder,
}: LeadContactTypeCardInterface) {
  return (
    <div
      className={cn(
        "cursor-pointer rounded-lg  h-7 min-w-14 text-xs flex items-center justify-center gap-2 px-2",
        className,
        activeItem?.value === value ? activeClassName : ""
      )}
      onClick={() => {
        onActiveItem(label, value, id);
      }}
    >
      <div className="flex gap-1 items-center">
        {eventOrder && <span>{eventOrder}</span>}
        <div className="flex gap-1 items-center">
          {" "}
          {icon && (
            <Image
              src={icon}
              alt={"تصویر"}
              width={1024}
              height={1024}
              className="h-3 w-3"
            />
          )}
          <span>{label}</span>
        </div>
      </div>
    </div>
  );
}
