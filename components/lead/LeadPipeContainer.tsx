import { PipeInterface } from "./LeadContainer";
import LeadPipe from "./LeadPipe";

export interface LeadPipeContainerInterface {
  pipeList: PipeInterface[];
}

export default function LeadPipeContainer({
  pipeList,
}: LeadPipeContainerInterface) {
  return (
    <div className="">
      {" "}
      <div className="flex items-center gap-2">
        {pipeList?.map((pipe, index) => (
          <LeadPipe key={`lead-pipe-${index}`} {...pipe} />
        ))}
      </div>
    </div>
  );
}
