export interface ContractInfoInterface {
  list: {
    label: string;
    value: string;
  }[];
}

export default function ContractInfoContainer({ list }: ContractInfoInterface) {
  return (
    <div className="bg-background-active min-h-fit overflow-hidden">
      <div className=" opacity-90 p-8 text-primary-foreground flex flex-row justify-between items-center">
        <div className="flex flex-col md:flex-row gap-8 flex-wrap justify-between w-full md:w-fit">
          {list.map((item, index) => (
            <div
              key={item.label}
              className={`flex flex-row  gap-2.5 md:flex-col justify-between  ${
                index === list.length - 1 ? "w-full" : "w-full md:w-fit"
              }`}
            >
              <span className="text-sm font-normal  text-foreground">
                {item.label}
              </span>

              <span className="font-bold text-sm text-foreground">
                {item.value}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
