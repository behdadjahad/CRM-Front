import ContractInfiniteContainer from "./ContractInfiniteContainer";

export interface ContractPipeInterface {
  label: string;
  value: string;
}

export default function ContractPipe({ label, value }: ContractPipeInterface) {
  return (
    <div className="flex flex-col  rounded-2xl overflow-hidden border border-[#E9EAEB]">
      <div className="text-center bg-[#5786EB] p-3 text-card">{label}</div>
      <div className="flex flex-col gap-4">
        {" "}
        <ContractInfiniteContainer status={value} />
        <div className="w-full bg-red-300">add contract to pipe</div>
        <div className="bg-[#DEEBFB] p-3 ">footer</div>
      </div>
    </div>
  );
}
