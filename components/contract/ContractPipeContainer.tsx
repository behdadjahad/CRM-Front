import PipeCreation from "../pipe/PipeCreation";
import ContractPipe from "./ContractPipe";
export interface ContractPipeContainerInterface {
  pipeList: {
    label: string;
    value: string;
  }[];
}
export default function ContractPipeContainer({
  pipeList,
}: ContractPipeContainerInterface) {
  return (
    <div className="grid grid-cols-10 gap-4">
      <div className="grid col-span-9 overflow-x-auto">
        <div className="w-full flex flex-row flex-nowrap gap-4 items-center">
          {pipeList.map((pipe, index) => (
            <div key={`contract-pipe-${index}`} className="w-1/3 min-w-[323px]">
              {" "}
              <ContractPipe {...pipe} />
            </div>
          ))}
        </div>
      </div>
      <div className="grid col-span-1">
        <PipeCreation />
      </div>
    </div>
  );
}
