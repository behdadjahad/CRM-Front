export interface ContractListContainerInterface {
  list: any[];
}

export default function ContractListContainer({
  list,
}: ContractListContainerInterface) {
  return <div className="flex flex-col">contract list</div>;
}
