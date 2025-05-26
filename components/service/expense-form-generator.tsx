import { useEffect, useState } from "react";
import ExpenseForm from "./expense-form";
import { OptionType } from "../shared/form-maker";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  addIncomeData,
  deleteIncomeData,
  getCurrencies,
  getSubmittedIncome,
} from "@/api/currency";
import { useParams } from "next/navigation";
import { Button } from "../ui/button";
import { cleanFormatPrice } from "@/lib/utils";
export default function ExpenseFormGenerator() {
  const queryClient = useQueryClient();
  const { id } = useParams();
  const [currencies, setCurrencies] = useState<OptionType[]>([]);
  const [addedExpenseForm, setAddedExpenseForm] = useState<any>([
    {
      id: "expense-form-1",
      isSubmitted: false,
    },
  ]);
  const [formValues, setFormValues] = useState<any[]>([]);
  const { data: submittedIncomeList, isLoading: isIncomeLoading } = useQuery({
    queryKey: ["submittedIncomeList"],
    queryFn: () => getSubmittedIncome(Number(id)),
  });

  const { mutate: addExchangeRateHandler } = useMutation({
    mutationFn: (data: any) => {
      return addIncomeData(data, Number(id));
    },
    onSuccess: () => {
  queryClient.invalidateQueries({ queryKey: ["allExpenses"] });
    },
  });
  useEffect(() => {
    if (isIncomeLoading) return;
   
    if (submittedIncomeList?.data?.length) {
      setAddedExpenseForm([
        ...submittedIncomeList.data.map((item: any) => ({
          income: item.incomeAmount,
          currency: item.incomeCurrencyId,
          incomeExchangeRate: item.incomeCurrencyExchangeRate,
          id: item.id,
          isSubmitted: true,
        })),
        {
          id: `expense-form-1`,
          income: null,
          currency: null,
          incomeExchangeRate: null,
          isSubmitted: false,
        },
      ]);
    }
    else {
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
    onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: ["allExpenses"] });
    },
  });
  function removeHandler(formId: string | number) {
    const selectedExpenseForm = addedExpenseForm.find(
      (item: any) => item.id == formId
    );
    if (selectedExpenseForm.isSubmitted) {
      removeIncome(selectedExpenseForm.id);
      const updatedAddedExpenseForm = addedExpenseForm.filter(
        (item: any) => item.id != formId
      );
      setAddedExpenseForm(updatedAddedExpenseForm);
    } else if (addedExpenseForm.length > 1) {
      const updatedAddedExpenseForm = addedExpenseForm.filter(
        (item: any) => item.id != formId
      );
      setAddedExpenseForm(updatedAddedExpenseForm);
    } else return;
  }

  const handleFormChange = (formId: any, updatedData: any) => {
    setFormValues((prev) => [
      ...prev.filter((item) => item.id !== formId),
      updatedData,
    ]);
  };

  function handleSubmit() {
    
    addExchangeRateHandler(
      formValues.map((item) => ({
        incomeAmount: cleanFormatPrice(item.income),
        incomeCurrencyExchangeRate: cleanFormatPrice(item.exchangeRate),
        incomeCurrencyId: item.exchangeRateLabel,
      })).filter(
        (item) =>
          item.incomeAmount && item.incomeCurrencyExchangeRate && item.incomeCurrencyId
      )
    );
  }

  return (
    <div className="flex flex-col gap-2">
      <div className="flex flex-col bg-card-mute rounded-lg gap-1">
        {addedExpenseForm.map((item: any, index: number) => (
          <ExpenseForm
            key={item.id}
            formId={item.id}
            onAddHandler={addExpenseForm}
            currencies={currencies}
            expenseFormData={item}
            onRemoveHandler={removeHandler}
            isFirstItem={index === addedExpenseForm.length - 1}
            index={index}
            onFormChange={handleFormChange}
          />
        ))}
      </div>
      <Button
        variant={"info"}
        className="p-4 border-none w-14 h-6 self-end"
        onClick={() => {
          handleSubmit();
        }}
      >
        ثبت
      </Button>
    </div>
  );
}
