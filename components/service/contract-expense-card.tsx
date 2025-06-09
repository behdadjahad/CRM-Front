//import { formatPrice } from "@/lib/utils";

import ExpenseDetail from "./expense-detail";
import { useEffect, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { getCurrencies } from "@/api/currency";
import { OptionType } from "../shared/form-maker";
import Image from "next/image";
import { avServices, formatPrice } from "@/lib/utils";
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
  totalExpenseInCurrency,
  icon,
  onChangeTotalAmount
}: any) {
  const [openForms, setOpenForms] = useState<string[]>([]);
  const [currencies, setCurrencies] = useState<OptionType[]>([]);
  const [priceInCurrency, setPriceInCurrency] = useState<number>(0);

  const { data: currency } = useQuery({
    queryKey: ["Currency"],
    queryFn: () => getCurrencies(),
  });
  useEffect(() => {
    if (currency) {
      const currencyOptions = currency?.data?.map((item: any) => ({
        value: item.id.toString(),
        label: item.name,
      }));
      setCurrencies(currencyOptions);
    }
  }, [currency]);
  const toggleForm = (key: string) => {
    setOpenForms((prev) => {
      if (prev.includes(key)) {
        return prev.filter((itemKey) => itemKey !== key);
      } else {
        return [...prev, key];
      }
    });
  };
 
  const handlePriceChange = (price:any) => {
    setPriceInCurrency((prevTotal) => prevTotal + price);
  };
  return (
    <div className="flex flex-col p-4 border-t border-dashed border-boredr/20 gap-4 mt-2">
      <div className="flex items-center gap-2 justify-between">
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
        <div className="flex gap-2">
        <span>{formatPrice(totalExpenseInCurrency)}</span>
          {/* <span>{priceInCurrency && formatPrice(priceInCurrency)}</span> */}
          <span>{contractCurrency?.name}</span>
        </div>
      </div>
      <div className="flex justify-between flex-col gap-2">
        {groupPrices.map((item: any, index: any) => {
          const uniqueKey = `${title}-${index}`;
          return (
            <ExpenseDetail
              key={uniqueKey}
              // serviceName={title}
              serviceName={(Object.keys(avServices)).find((key:any) => avServices[key as keyof typeof avServices] === title)}
              {...item}
              isOpen={openForms.includes(uniqueKey)}
              onToggle={() => toggleForm(uniqueKey)}
              currencies={currencies}
              contractCurrency={contractCurrency}
              onChangeTotalPrice={handlePriceChange}
              onChangeTotalAmount={onChangeTotalAmount}

            />
          );
        })}
      </div>
    </div>
  );
}
