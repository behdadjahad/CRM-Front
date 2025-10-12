import ContractInfiniteContainer from "./ContractInfiniteContainer";

export interface ContractPipeInterface {
  title: string;
  value: string;
}

export default function ContractPipe({ title, value }: ContractPipeInterface) {
  return (
    <div className="bg-green-400 flex flex-col gap-4">
      <div className="">{title}</div>
      <ContractInfiniteContainer status={value} />
    </div>
  );
}
