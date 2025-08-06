import { cn } from "@/lib/utils";
export interface SelectableTagCardInterface {
  className?: string;
  activeClassName?: string;
  label: string;
  value: string;
  onActiveHandler: (value: string) => void;
  isActive: boolean;
}
export default function SelectableTagCard({
  className,
  label,
  value,
  onActiveHandler,
  isActive,
  activeClassName,
}: SelectableTagCardInterface) {
  return (
    <div
      className={cn(
        `min-w-11 text-center rounded-full h-6 flex items-center justify-center text-xs cursor-pointer font-semi-bold ${
          isActive ? activeClassName : ""
        }`,
        className
      )}
      onClick={() => {
        if (isActive) {
          onActiveHandler("");
        } else onActiveHandler(value);
      }}
    >
      {label}
    </div>
  );
}
