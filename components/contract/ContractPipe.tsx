export interface ContractPipeInterface {
  title: string;
}

export default function ContractPipe({ title }: ContractPipeInterface) {
  return (
    <div className="bg-green-400 flex flex-col gap-4">
      <div className="">{title}</div>
    </div>
  );
}
