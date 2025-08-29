import { cn } from "@/lib/utils";
import Image from "next/image";
export interface LeadContactTypeCardInterface {
id?:number ;
  label: string;
  value: string;
  className?: string;
  activeClassName?: string;
  onActiveItem: (label: string, value: string ,id?:number) => void;
  icon?: string;
  activeItem: { value: string; label: string };
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
}: LeadContactTypeCardInterface) {
  return (
    <div
      className={cn(
        "cursor-pointer rounded-lg  h-7 min-w-14 text-xs flex items-center justify-center gap-2 px-2",
        className,
        activeItem?.value === value ? activeClassName : ""
      )}
      onClick={() => {
        onActiveItem(label, value ,id);
      }}
    >
    {icon && <Image
        src={icon}
        alt={"تصویر"}
        width={1024}
        height={1024}
        className="h-3 w-3"
      />}
      <div>{label}</div>
    </div>
  );
}
