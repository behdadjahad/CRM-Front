import { LeadViewType } from "../lead/LeadContainer";
import { Button } from "../ui/button";
import Image from "next/image";
export interface ViewToggleGroupInterface {
  onActive: (item: LeadViewType) => void;
  defaultValue: string;
  options: { label: LeadViewType; icon: string }[];
  activeItem: string;
}

export default function ViewToggleGroup({
  onActive,
  defaultValue,
  options,
  activeItem,
}: ViewToggleGroupInterface) {
  function activeHandler(item: LeadViewType) {
    onActive(item);
  }

  return (
    <div className="border rounded-lg">
      {options.map((item, index) => (
        <Button
          key={`view-option-${index}`}
          variant={"foreground"}
          className={`border-none rounded-none ${
            activeItem === item.label ? "bg-[#F5F5F5]" : ""
          } ${index === 0 ? "rounded-tr-lg rounded-br-lg" : ""} ${
            index === options.length - 1 ? "rounded-tl-lg rounded-bl-lg" : ""
          }`}
          onClick={() => {
            activeHandler(item.label);
            console.log(item.label);
          }}
        >
          <Image
            src={item?.icon}
            alt="option"
            width={1024}
            height={1024}
            className="w-5 h-5"
          />
        </Button>
      ))}
    </div>
  );
}
