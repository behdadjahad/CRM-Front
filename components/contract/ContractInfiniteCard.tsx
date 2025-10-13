import React, { forwardRef } from "react";

export interface ContractInfiniteCardInterface {
  list: {
    label: string;
    value: string;
  }[];
}

const ContractInfiniteCard = forwardRef<
  HTMLElement,
  ContractInfiniteCardInterface
>(({ list }, ref) => {
  const customerInfiniteCardContent = (
    <div className="rounded-lg border border-[#E9EAEB] p-3 bg-[#F8FAFF]">
      <div className="flex flex-col">
        {list.map((item, index) => (
          <div
            className="flex flex-row items-center justify-between text-[#212B36] text-xs"
            key={`contract-${index}`}
          >
            <div>{item.label}</div>
            <div>{item.value}</div>
          </div>
        ))}
      </div>
    </div>
  );

  const content = ref ? (
    <article ref={ref}>{customerInfiniteCardContent}</article>
  ) : (
    <article>{customerInfiniteCardContent}</article>
  );

  return content;
});

ContractInfiniteCard.displayName = "CustomerInfinite";

export default ContractInfiniteCard;
