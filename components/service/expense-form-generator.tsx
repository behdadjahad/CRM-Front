import { useEffect, useState } from "react";
import ExpenseForm from "./expense-form";
import { OptionType } from "../shared/form-maker";
import { useQuery } from "@tanstack/react-query";
import { getCurrencies, getSubmittedIncome } from "@/api/currency";
import { useParams } from "next/navigation";
export default function ExpenseFormGenerator() {
  const { id } = useParams();
  const [currencies, setCurrencies] = useState<OptionType[]>([]);
  const [addedExpenseForm, setAddedExpenseForm] = useState<any>([
    {
      id: "expense-form-1",
      isSubmitted: false,
    },
  ]);
  const { data: submittedIncomeList, isLoading: isIncomeLoading } = useQuery({
    queryKey: ["submittedIncomeList"],
    queryFn: () => getSubmittedIncome(Number(id)),
  });

  useEffect(() => {
    if (isIncomeLoading) return;
    if (submittedIncomeList?.data?.length) {
      setAddedExpenseForm(
        submittedIncomeList.data.map((item: any) => ({
      
          id: item.id,
          isSubmitted: true,

        }))
      );
    } else {
      setAddedExpenseForm([
        {
          id: `expense-form-1`,
          isSubmitted: false,
        
        },
      ]);
    }
  }, [submittedIncomeList, isIncomeLoading]);

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

  function addExpenseForm() {
    setAddedExpenseForm([
      ...addedExpenseForm,
      {
        id: `expense-form-${addedExpenseForm.length + 1}`,
        isSubmitted: false,
      },
    ]);
  }
  return (
    <>
      {addedExpenseForm.map((item: any) => (
        <ExpenseForm
          key={item.id}
          formId={item.id}
          onAddHandler={addExpenseForm}
          currencies={currencies}
        />
      ))}
    </>
  );
}
