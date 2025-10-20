
import Image from "next/image";
import EventCreationContainer from "./EventCreationContainer";
export interface AddEventInterface {
  list: {
    label: string;
    value: string;
    icon: string;
    className?: string;
  }[];
  onSubmit: () => void;
}

export function AddEvent({ list, onSubmit }: AddEventInterface) {
  return (
    <>
      <div className="flex items-center w-full justify-center gap-2">
        {list.map((item, index) => (
          <EventCreationContainer
            key={`lead-followup-type-event${index}`}
            trigger={
              <div className="w-11 h-11 bg-card rounded-lg flex items-center justify-center cursor-pointer">
                <Image
                  src={item.icon}
                  alt="edit"
                  width={24}
                  height={24}
                  className="w-5 h-5"
                />
              </div>
            }
            onSubmit={() => {}}
          />
        ))}
      </div>
    </>
  );
}
