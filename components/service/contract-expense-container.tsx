import { useEffect, useState } from "react";

import ContractExpenseCard, {
  ExpenseCardInterface,
} from "./contract-expense-card";

import CurrencyDropDown from "../shared/currency-drop-down";

import { useMutation, useQuery } from "@tanstack/react-query";
import { getAllExpenses, sendExchageRate } from "@/api/currency";
import { useParams } from "next/navigation";
import OveralExpenseContainer from "./overal-expense-container";
import { useQueryClient } from "@tanstack/react-query";

export interface ExpenseContainerInterface {
  expenseList: ExpenseCardInterface[];
  overalExpense: {
    title: string;
    overalExpenseDetail: {
      label: string;
      value: string;
      hasForm?: boolean;
    }[];
  };
}

export default function ContractExpenseContainer() {
  const [overalExpense, setOveralExpense] = useState<any[]>([]);
  const [contractCurrency, setContractCurrency] = useState<any>({});
  const [serviceExpenses, setServiceExpenses] = useState<any>([]);
  const queryClient = useQueryClient();
  const { id } = useParams();
  const { mutate: exchangeRateHandler } = useMutation({
    mutationFn: (data: any) => {
      return sendExchageRate(data, Number(id));
    },
    onSuccess: (data) => {
      setContractCurrency(data.contractCurrency);
    },
  });
  const { data: allExpenses } = useQuery({
    queryKey: ["allExpenses"],
    queryFn: async () => await getAllExpenses(Number(id)),
  });
  useEffect(() => {
    if (allExpenses) {
      const overalExpenseData = [
        { label: "هزینه", value: allExpenses.buyPrice },
        {
          label: "درآمد",
          value: allExpenses.sellPrice,
          hasForm: true,
        },
        {
          label: "سود و زیان",
          value: allExpenses.profit,
        },
      ];
      const contractExchangeRate = allExpenses.contractCurrency;
      //  const servicePrices = Object.values(allExpenses.servicePrices).map((item) => {
      //     return {},
      //   });
      const servicePrices = Object.entries(allExpenses.servicePrices).map(
        ([key, value]) => ({ key, ...(value as any) })
      );
      const totalServiceExpenses = servicePrices
        .filter((item) => item.groupedBuyPrices.length > 0)
        .map((item) => ({
          groupPrices: item.groupedBuyPrices.map((price: any) => ({
            currency: price.currency,
            buyPrice: price.totalBuyPrice,
            convertedBuyPrice: price.totalBuyPriceInContractCurrency,
          })),

          title:
            item.key === "accommodationContract"
              ? "هتل"
              : item.key === "otherContract"
              ? "دیگر"
              : item.key === "visaContract"
              ? "ویزا"
              : item.key === "ticketContract"
              ? "پرواز"
              : item.key === "pickUpContract"
              ? "پیکاپ"
              : item.key === "embassyPackageContract"
              ? "سفارت"
              : item.key === "ensuranceContract"
              ? "بیمه"
              : item.key,
          icon: "/icons/visa.png",
          totalExpenseInCurrency: item.groupedBuyPrices
            .filter(
              (price: any) =>
                price.currency.id === allExpenses.contractCurrency.id
            )
            .reduce((sum: number, price: any) => sum + price.totalBuyPrice, 0),
        }));
      console.log(99, totalServiceExpenses);
      setContractCurrency(contractExchangeRate);
      setOveralExpense(overalExpenseData);
      setServiceExpenses(totalServiceExpenses);
    }
  }, [allExpenses]);
  useEffect(() => {
    if (contractCurrency) {
      queryClient.invalidateQueries({ queryKey: ["allExpenses"] });
    }
  }, [contractCurrency, queryClient]);

  return (
    <div className="rounded-lg bg-white p-4">
      <div className="flex flex-col gap-2">
        <h2 className="text-lg text-gray-900 font-bold">
          واحد ارزی کل قرارداد
        </h2>
        <div className="flex items-center justify-between">
          <div>هزینه های قرارداد</div>
          <CurrencyDropDown
            contractCurrency={contractCurrency}
            onCurrencyHandler={exchangeRateHandler}
          />
        </div>
        <div>
          <div className="flex items-center justify-between">
            <span></span>
            <span>تومان</span>
          </div>
          <div className="flex items-center justify-between">
            <span></span>
            <span>دلار</span>
          </div>
          <div className="flex items-center justify-between">
            <span></span>
            <span>ریال</span>
          </div>
          <div className="flex items-center justify-between">
            <span></span>
            <span>یورو</span>
          </div>
        </div>
      </div>
      {serviceExpenses?.map((item: any) => (
        <ContractExpenseCard
          key={item.title}
          {...item}
          contractCurrency={contractCurrency}
        />
      ))}
      <OveralExpenseContainer
        data={overalExpense}
        contractCurrency={contractCurrency}
      />
    </div>
  );
}
