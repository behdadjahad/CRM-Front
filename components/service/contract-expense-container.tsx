import { useEffect, useRef, useState } from "react";

import ContractExpenseCard, {
  ExpenseCardInterface,
} from "./contract-expense-card";
import Image from "next/image";
import CurrencyDropDown from "../shared/currency-drop-down";

import { useMutation, useQuery } from "@tanstack/react-query";
import { getAllExpenses, sendExchageRate } from "@/api/currency";
import { useParams } from "next/navigation";
import OveralExpenseContainer from "./overal-expense-container";
import { useQueryClient } from "@tanstack/react-query";
import { formatPrice } from "@/lib/utils";
import { FaChevronDown, FaChevronUp } from "react-icons/fa";
import { generateFeatureAccess } from "@/lib/generatePageData";
import { usePageData } from "@/hooks/usePageData";
import { AccessDenied } from "../shared/AccessDenied";

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
  const pageFeatures = usePageData();
  const [overalExpense, setOveralExpense] = useState<any[]>([]);
  const [contractCurrency, setContractCurrency] = useState<any>({});
  const [serviceExpenses, setServiceExpenses] = useState<any>([]);
  const [totalExpenses, setTotalExpenses] = useState<any>([]);
  const queryClient = useQueryClient();
  const { id } = useParams();
  const { mutate: exchangeRateHandler } = useMutation({
    mutationFn: (data: any) => {
      return sendExchageRate(data, Number(id));
    },
    onSuccess: (data) => {
      setContractCurrency(data.contractCurrency);
      queryClient.invalidateQueries({ queryKey: ["allExpenses"] });
    },
  });
  const { data: allExpenses } = useQuery({
    queryKey: ["allExpenses"],
    queryFn: async () => await getAllExpenses(Number(id)),
  });
  useEffect(() => {
    if (allExpenses) {
      const overalExpenseData = [
        { label: "هزینه", value: allExpenses?.data?.buyPrice },
        {
          label: "درآمد",
          value: allExpenses?.data?.sellPrice,
          hasForm: true,
        },
        {
          label:
            allExpenses?.data?.profit > 0
              ? "سود"
              : allExpenses?.data?.profit < 0
              ? "زیان"
              : "سود/زیان",
          value: Math.abs(allExpenses?.data?.profit),
          className:
            allExpenses?.data?.profit > 0
              ? "text-[#47E9A0]"
              : allExpenses?.data?.profit < 0
              ? "text-[#FF6C86]"
              : "",
          children:
            allExpenses?.data?.profit > 0 ? (
              <FaChevronUp className="text-[#47E9A0]" size={10} />
            ) : allExpenses?.data?.profit < 0 ? (
              <FaChevronDown className="text-[#FF6C86]" size={10} />
            ) : (
              ""
            ),
        },
      ];
      const contractExchangeRate = allExpenses?.data?.contractCurrency;
      //  const servicePrices = Object.values(allExpenses.servicePrices).map((item) => {
      //     return {},
      //   });
      const servicePrices = allExpenses?.data?.servicePrices
        ? Object?.entries(allExpenses?.data?.servicePrices).map(
            ([key, value]) => ({ key, ...(value as any) })
          )
        : [];
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
              ? "سایر"
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
            // .filter(
            //   (price: any) =>
            //     price.currency.id === allExpenses?.data?.contractCurrency?.id
            // )
            .reduce(
              (sum: number, price: any) =>
                sum + price.totalBuyPriceInContractCurrency,
              0
            ),
        }));
      const resultMap = new Map();

      totalServiceExpenses.forEach((item) => {
        item.groupPrices.forEach(
          ({
            buyPrice,
            currency,
          }: {
            buyPrice: number;
            currency: { id: number; name: string };
          }) => {
            if (resultMap.has(currency.id)) {
              resultMap.get(currency.id).total += buyPrice;
            } else {
              resultMap.set(currency.id, {
                id: currency.id,
                name: currency.name,
                total: buyPrice,
              });
            }
          }
        );
      });

      const totalAmountArray = Array.from(resultMap.values());
      setTotalExpenses(totalAmountArray);

      setContractCurrency(contractExchangeRate);
      setOveralExpense(overalExpenseData);
      setServiceExpenses(totalServiceExpenses);
    }
  }, [allExpenses]);

  // const prevExchangeRate = useRef<number>(0);

  // const totalAmountHandler = (totalAmount: any) => {
  //   if (totalAmount.currencyId === contractCurrency.id) {
  //     return;
  //   }
  //   setTotalExpenses((prevExpenses:any) =>
  //     prevExpenses.map((expense:any) =>
  //       expense.id === contractCurrency.id
  //         ? {
  //             ...expense,
  //             total:
  //               expense.total -
  //               prevExchangeRate.current * totalAmount.buyPrice + // Remove old exchange rate effect
  //               totalAmount.exchangeRate * totalAmount.buyPrice // Apply new exchange rate
  //           }
  //         : expense
  //     )
  //   );

  //   // Update previous exchange rate AFTER updating the state
  //   prevExchangeRate.current = totalAmount.exchangeRate;
  // };
  const prevExchangeRate = useRef<number>(0);
  const prevTotalAmount = useRef<any>(null); // Track last totalAmount object

  const totalAmountHandler = (totalAmount: any) => {
    if (totalAmount.currencyId === contractCurrency?.id) {
      return;
    }

    setTotalExpenses((prevExpenses: any) =>
      prevExpenses.map((expense: any) => {
        // Check if this is the target expense
        if (expense.id === contractCurrency?.id) {
          let updatedTotal = expense.total;

          // If only the exchange rate has changed (totalAmount itself has NOT changed), remove old effect
          if (
            prevTotalAmount.current &&
            prevTotalAmount.current.currencyId === totalAmount.currencyId &&
            prevTotalAmount.current.buyPrice === totalAmount.buyPrice
          ) {
            updatedTotal -= prevExchangeRate.current * totalAmount.buyPrice; // Remove old exchange rate effect
          }

          // Always apply the new exchange rate effect
          updatedTotal += totalAmount.exchangeRate * totalAmount.buyPrice;

          return {
            ...expense,
            total: updatedTotal,
          };
        }

        return expense;
      })
    );

    // Update previous values AFTER updating the state
    prevExchangeRate.current = totalAmount.exchangeRate;
    prevTotalAmount.current = { ...totalAmount }; // Store a copy to track changes
  };

  // const totalAmountHandler = (totalAmount: any) => {
  //   // If totalAmount.currencyId is the same as contractCurrency, do nothing
  //   if (totalAmount.currencyId === contractCurrency.id) {
  //     return;
  //   }

  //   setTotalExpenses((prevExpenses: any) =>
  //     prevExpenses.map((expense: any) => {
  //       if (expense.id === contractCurrency.id) {
  //         // Update contract currency total with the exchange rate change
  //         return {
  //           ...expense,
  //           total:
  //             expense.total -
  //             prevExchangeRate.current * totalAmount.buyPrice + // Remove old exchange rate effect
  //             totalAmount.exchangeRate * totalAmount.buyPrice // Apply new exchange rate
  //         };
  //       } else if (expense.id === totalAmount.currencyId) {
  //         // Subtract buyPrice only the first time when exchangeRate is not 0
  //         if (!hasSubtracted.current && totalAmount.exchangeRate !== 0) {
  //           hasSubtracted.current = true; // Mark as subtracted once
  //           return { ...expense, total: expense.total - totalAmount.buyPrice };
  //         }
  //       }
  //       return expense; // No change for other currencies
  //     })
  //   );

  //   // Update previous exchange rate after state update
  //   prevExchangeRate.current = totalAmount.exchangeRate || 0;
  // };

  return (
    <div className="rounded-lg bg-white p-4">
      <div className="flex flex-col gap-2">
        <div className="flex items-center justify-between">
          <h2 className="text-lg text-gray-900 font-bold">
            واحد ارزی کل قرارداد
          </h2>
          {generateFeatureAccess(pageFeatures, "change-exchange-rates")?.show &&
            generateFeatureAccess(pageFeatures, "change-exchange-rates")
              ?.enable && (
              <CurrencyDropDown
                contractCurrency={contractCurrency}
                onCurrencyHandler={exchangeRateHandler}
              />
            )}
          {generateFeatureAccess(pageFeatures, "change-exchange-rates")
            ?.show &&
            !generateFeatureAccess(pageFeatures, "change-exchange-rates")
              ?.enable && (
              <AccessDenied
                featureCode="change-exchange-rates"
                title={contractCurrency?.name}
                icon={
                  <Image
                    src={"/icons/disable-edit.png"}
                    alt="ادیت"
                    width={1024}
                    height={1024}
                    className="w-6 h-6"
                  />
                }
              />
            )}
        </div>
        <div className="flex items-center justify-between">
          <div>هزینه های قرارداد</div>
        </div>
        <div className="border-b-2 border-gray-600 border-dashed p-2">
          {totalExpenses &&
            totalExpenses?.map((item: any) => (
              <div key={item.id} className="flex items-center justify-between">
                <span>{item?.total ? formatPrice(item.total) : ""}</span>

                <span>{item.name}</span>
              </div>
            ))}
        </div>
      </div>
      {serviceExpenses?.map((item: any) => (
        <ContractExpenseCard
          key={item.title}
          {...item}
          contractCurrency={contractCurrency}
          onChangeTotalAmount={totalAmountHandler}
        />
      ))}
      <OveralExpenseContainer
        data={overalExpense}
        contractCurrency={contractCurrency}
      />
    </div>
  );
}
