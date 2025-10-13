import React, { forwardRef } from "react";

export interface ContractInfiniteCardInterface {
  list: {
    label: string;
    value: string;
  }[];
  footerData?: {
    label: string;
    value: string;
  }[];
  headerData: {
    contractType: string;
  };
}

const ContractInfiniteCard = forwardRef<
  HTMLElement,
  ContractInfiniteCardInterface
>(({ list, footerData, headerData }, ref) => {
  const customerInfiniteCardContent = (
    <div className="rounded-lg border border-[#E9EAEB] bg-[#F8FAFF] flex flex-col gap-2">
      <div className="flex flex-col gap-4 p-3">
        <div className="flex justify-between items-center">
          <div>1</div>
          <div className="text-[#2949A4] py-1 px-4 rounded-full border border-[#1C68DA]">{headerData.contractType}</div>
        </div>
        <div className="flex flex-col gap-2">
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
      <div className="flex border-t px-6 py-3 bg-[#DEEBFB] justify-between items-center">
        {footerData?.map((item, index) => (
          <div
            key={`footer-data-${index}`}
            className="flex gap-1 text-[#1C284F]"
          >
            <span>{item.label}</span>
            <span>{item.value}</span>
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
