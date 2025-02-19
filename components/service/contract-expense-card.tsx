//import { formatPrice } from "@/lib/utils";

import ExpenseDetail from "./expense-detail";
import { useEffect, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { getCurrencies } from "@/api/currency";
import { OptionType } from "../shared/form-maker";
import Image from "next/image";
export interface ExpenseCardInterface {
  expenseInfo: {
    price: string;
    pricePostFix: string;
    convertedPrice: string;
    convertedPricePostFix: string;
  }[];
  title: string;
  icon: string;
}

export default function ContractExpenseCard({
  groupPrices,
  title,
  contractCurrency,
  icon,
}: any) {
  const [openForms, setOpenForms] = useState<string[]>([]);
  const [currencies, setCurrencies] = useState<OptionType[]>([]);
  const { data: currency } = useQuery({
    queryKey: ["Currency"],
    queryFn: () => getCurrencies(),
  });
  useEffect(() => {
    if (currency) {
      const currencyOptions = currency.data.map((item: any) => ({
        value: item.id.toString(),
        label: item.name,
      }));
      setCurrencies(currencyOptions);
    }
  }, [currency]);

  const toggleForm = (title: string) => {
    setOpenForms((prev) => {
      if (prev.includes(title)) {
        return prev.filter((itemTitle) => itemTitle !== title);
      } else {
        return [...prev, title];
      }
    });
  };
  return (
    <div className="flex flex-col p-4 border-t border-dashed border-boredr/20 gap-4 mt-2">
      <div className="flex items-center gap-2">
        <div className="w-6 h-6 flex items-center justify-center rounded-full overflow-hidden bg-background">
          <Image
            src={icon}
            alt={title}
            width={1024}
            height={1024}
            className="w-3.5 h-3"
          />
        </div>
        <div className="text-primary text-sm">
          <span className="font-bold ">{title}</span>
        </div>
      </div>
      <div className="flex justify-between flex-col gap-2">
        {groupPrices.map((item: any) => (
          <ExpenseDetail
            key={title}
            {...item}
            isOpen={openForms.includes(title)}
            onToggle={() => toggleForm(title)}
            currencies={currencies}
            contractCurrency={contractCurrency}
          />
        ))}
      </div>
    </div>
  );
}
