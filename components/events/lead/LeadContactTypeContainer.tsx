import LeadContactTypeCard from "./LeadContactTypeCard";

export interface LeadContactTypeContainerInterface {
  list: {
    id?: number;
    label: string;
    value: string;
    icon: string;
    className?: string;
    activeClassName?: string;
  }[];
  // activeItem?: { value: string; label: string
  activeItem: {
    label: string;
    value: string;
  };
  onActiveItem: (label: string, value: string) => void;
}

export default function LeadContactTypeContainer({
  list,
  onActiveItem,
  activeItem,
}: LeadContactTypeContainerInterface) {
  return (
    <div className="flex flex-row gap-2">
      {list.map((contactType) => (
        <LeadContactTypeCard
          {...contactType}
          key={contactType.value}
          onActiveItem={onActiveItem}
          activeItem={activeItem}
        />
      ))}
    </div>
  );
}
