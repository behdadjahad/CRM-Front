import { useEffect, useState } from "react";
import ExpenseForm from "./expense-form";
import { OptionType } from "../shared/form-maker";
import { useMutation, useQuery } from "@tanstack/react-query";
import { deleteIncomeData, getCurrencies, getSubmittedIncome } from "@/api/currency";
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
    console.log(submittedIncomeList);
    if (submittedIncomeList?.data?.length) {
      setAddedExpenseForm(
        submittedIncomeList.data.map((item: any) => ({
          income: item.incomeAmount,
          currency: item.incomeCurrencyId,
          incomeExchangeRate: item.incomeCurrencyExchangeRate,
          id: item.id,
          isSubmitted: true,
        }))
      );
    } else {
      setAddedExpenseForm([
        {
          id: `expense-form-1`,
          income: null,
          currency: null,
          incomeExchangeRate: null,
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
  const { mutate: removeIncome } = useMutation({
    mutationFn: (id: number) => {
      return deleteIncomeData(id);
    },
    onSuccess: () => {},
  });
  function removeHandler(formId: string | number) {
    const selectedExpenseForm = addedExpenseForm.find((item:any) => item.id == formId);
    if (selectedExpenseForm.isSubmitted) {
      removeIncome(selectedExpenseForm.id);
      const updatedAddedExpenseForm = addedExpenseForm.filter(
        (item:any) => item.id != formId
      );
      setAddedExpenseForm(updatedAddedExpenseForm);
    } else if (addedExpenseForm.length > 1) {
      const updatedAddedExpenseForm = addedExpenseForm.filter(
        (item:any) => item.id != formId
      );
      setAddedExpenseForm(updatedAddedExpenseForm);
    } else return;
  }
  return (
    <>
      {addedExpenseForm.map((item: any, index: number) => (
        <ExpenseForm
          key={item.id}
          formId={item.id}
          onAddHandler={addExpenseForm}
          currencies={currencies}
          expenseFormData={addedExpenseForm[index]}
          onRemoveHandler={removeHandler}
        />
      ))}
    </>
  );
}
