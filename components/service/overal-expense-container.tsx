import { formatPrice } from "@/lib/utils";
import ExpenseFormGenerator from "./expense-form-generator";
import { Button } from "../ui/button";
import { FaChevronDown, FaChevronUp } from "react-icons/fa";
import { useState } from "react";

export default function OveralExpenseContainer({
  data,
  contractCurrency,
}: any) {

    const [view, setView] = useState(false);
   
  return (
    <div className="flex flex-col w-full bg-primary rounded-lg p-4 gap-4">
      {/* <div className="text-xs text-card font-bold">{overalExpense.title}</div>  */}
      {data.map((item: any) => (
        <div
          className="flex items-center justify-between flex-wrap"
          key={item.label}
        >
          <span className="text-card text-xs ">{item.label}</span>
          <div className="flex items-center justify-between gap-4  bg-card-mute  p-2 rounded-lg w-2/3">
            {item.hasForm && (
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
            <div className="text-xs text-card text-left flex flex-1 gap-1">
              <span>{formatPrice(item.value)}</span>
              <span>{contractCurrency?.name ?? ""}</span>
            </div>
          </div>
          <div className="w-full">
            {view && item.hasForm && <ExpenseFormGenerator />}
          </div>
        </div>
      ))}
    </div>
  );
}
