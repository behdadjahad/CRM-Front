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
>(({}, ref) => {
  const customerInfiniteCardContent = <div></div>;

  const content = ref ? (
    <article ref={ref}>{customerInfiniteCardContent}</article>
  ) : (
    <article>{customerInfiniteCardContent}</article>
  );

  return content;
});

ContractInfiniteCard.displayName = "CustomerInfinite";

export default ContractInfiniteCard;
