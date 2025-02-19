import { FaPlus } from "react-icons/fa";
import { Button } from "../ui/button";
import FormMaker from "../shared/form-maker";
import { useFormik } from "formik";
import { Check } from "lucide-react";
import { addIncomeData, editIncomeData } from "@/api/currency";
import { useMutation } from "@tanstack/react-query";
import { useParams } from "next/navigation";

export default function ExpenseForm({
  formId,
  onAddHandler,
  currencies,
  expenseFormData,
  onRemoveHandler
}: any) {
  const { id } = useParams();
  const { mutate: addSingleExchangeRateHandler } = useMutation({
    mutationFn: (data: any) => {
      return addIncomeData(data, Number(id));
    },
    onSuccess: (data: any) => {
      console.log(data);
    },
  });
  const { mutate: editSingleExchangeRateHandler } = useMutation({
    mutationFn: ({ data, id }: { data: any; id: number }) => {
      return editIncomeData(data, id);
    },
    onSuccess: (data: any) => {
      console.log(data);
    },
  });
  function singleExchangeRateHandler(data: any) {
    if (data.isSubmitted) {

      editSingleExchangeRateHandler({
        data: {
          incomeAmount: data.income,
          incomeCurrencyExchangeRate: data.exchangeRate,
          incomeCurrencyId: data.exchangeRateLabel,
        },
        id: data.id,
      });
    } else {
     addSingleExchangeRateHandler({
        incomeAmount: data.income,
        incomeCurrencyExchangeRate: data.exchangeRate,
        incomeCurrencyId: data.exchangeRateLabel,
      });
    }
  }

  const formik = useFormik({
    initialValues: {
      income: expenseFormData.income,
      exchangeRate: expenseFormData.incomeExchangeRate,
      exchangeRateLabel: expenseFormData.currency,
      id: expenseFormData.id,
      isSubmitted: expenseFormData.isSubmitted,
    },
    // validationSchema: Yup.object().shape({
    //   exchangeRate: Yup.string().required(REQUIRED_TEXT),
    //   exchangeRateLabel: Yup.string().required(REQUIRED_TEXT),
    // }),
    onSubmit: () => {},
  });
  return (
    <div
      className="flex items-center
            justify-between bg-card-mute
            rounded-lg p-2 flex-row mt-2"
    >
      <FormMaker
        form={formik}
        fields={[
          {
            key: "action",
            component: "non-field",
            children: (
              <Button
                className="border-none p-1 bg-quartiery-background rounded-full flex items-center justify-center "
                onClick={() => {
                  onRemoveHandler(formId);
                }}
              >
                {" "}
                <Check size={16} color="white" />
              </Button>
            ),
            //className: "text-right bg-red-400 w-5 h-5 rounded-full flex items-center justify-center",
            className: "w-5 h-5",
          },
          {
            key: "action",
            component: "non-field",
            children: (
              <Button
                className="border-none p-1 bg-quartiery-background rounded-full flex items-center justify-center "
                onClick={() => {
                  singleExchangeRateHandler(formik.values);
                }}
              >
                {" "}
                <Check size={16} color="white" />
              </Button>
            ),
            //className: "text-right bg-red-400 w-5 h-5 rounded-full flex items-center justify-center",
            className: "w-5 h-5",
          },
          {
            key: "income",
            component: "input",
            placeholder: "درآمد",
            type: "text",
            floating: false,
            className: "text-right flex-1 p-0 h-6 text-xs rounded-md",
            labelClassName:
              "text-right flex-1 p-0 h-6 text-xs rounded-md text-xs text-foreground-mute border border-1 border-border-mute p-1 bg-card-mute",
          },
          {
            key: "exchangeRate",
            component: "input",
            placeholder: "نرخ تبدیل",
            type: "text",
            floating: false,
            className: "text-right flex-1 p-0 h-6 text-xs rounded-md",
            labelClassName:
              "text-right flex-1 p-0 h-6 text-xs rounded-md text-xs text-foreground-mute border border-1 border-border-mute p-1 bg-card-mute",
          },
          {
            key: "exchangeRateLabel",
            component: "Select",
            placeholder: "تومان",
            type: "text",
            floating: true,
            options: currencies,
            className: "text-right w-1/3",
            controlClassName:
              "text-xs h-6 text-xs text-foreground-mute border border-1 border-border-mute p-1 bg-card-mute",
          },
        ]}
        className="flex flex-row items-center gap-2"
      />
      {/* <span className="text-xs text-foreground-mute border border-1 border-border-mute p-1">
                درآمد
              </span>
              <span className="text-xs text-foreground-mute border border-1 border-border-mute p-1">
                نرخ تبدیل
              </span>
              <span className="text-xs text-foreground-mute border border-1 border-border-mute p-1">
                دلار
              </span> */}
      <Button variant={"info"} className="p-1 border-none rounded-full w-4 h-4">
        <FaPlus className="text-card" onClick={onAddHandler} />
      </Button>
    </div>
  );
}
