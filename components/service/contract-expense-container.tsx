import { useState } from "react";
import { Button } from "../ui/button";
import ContractExpenseCard, {
  ExpenseCardInterface,
} from "./contract-expense-card";
import { FaChevronDown, FaChevronUp } from "react-icons/fa";
import { formatPrice } from "@/lib/utils";

import CurrencyDropDown from "../shared/currency-drop-down";
export interface ExpenseContainerInterface {
  expenseList: ExpenseCardInterface[];
  overalExpense: {
    title: string;
    overalExpenseDetail: {
      label: string;
      value: string;
      children?: React.ReactNode;
    }[];
  };
}

export default function ContractExpenseContainer({
  expenseList,
  overalExpense,
}: ExpenseContainerInterface) {
  const [view, setView] = useState(false);

  return (
    <div className="rounded-lg bg-white p-4">
      <div className="flex flex-col gap-2">
        <h2 className="text-lg text-gray-900 font-bold">
          واحد ارزی کل قرارداد
        </h2>
        <div className="flex items-center justify-between">
          <div>هزینه های قرارداد</div>
       <CurrencyDropDown />
        </div>
      </div>
      {expenseList.map((item) => (
        <ContractExpenseCard key={item.title} {...item} />
      ))}
      <div className="flex flex-col w-full bg-primary rounded-lg p-4 gap-4">
        <div className="text-xs text-card font-bold">{overalExpense.title}</div>
        {overalExpense.overalExpenseDetail.map((item) => (
          <div
            className="flex items-center justify-between flex-wrap"
            key={item.label}
          >
            <span className="text-card text-xs ">{item.label}</span>
            <div className="flex items-center justify-between gap-4  bg-card-mute  p-2 rounded-lg w-2/3">
              {item.children && (
                <Button
                  className="p-0 border-none bg-transparent"
                  onClick={() => setView(!view)}
                >
                  {view ? (
                    <FaChevronUp className="text-card" size={8} />
                  ) : (
                    <FaChevronDown className="text-card" size={8} />
                  )}
                </Button>
              )}
              <span className="text-xs text-card text-left flex-1">
                {formatPrice(item.value)}
              </span>
            </div>
            <div className="w-full">{view && item.children}</div>
          </div>
        ))}
      </div>
    </div>
  );
}
