import { FaMinus, FaPlus } from "react-icons/fa";
import { Button } from "../ui/button";
import FormMaker from "../shared/form-maker";
import { useFormik } from "formik";


import { useEffect } from "react";

export default function ExpenseForm({
  formId,
  onAddHandler,
  currencies,
  expenseFormData,
  onRemoveHandler,
  isFirstItem,
  //index,
  onFormChange,
}: any) {
  const formik = useFormik({
    initialValues: {
      income: expenseFormData?.income ? expenseFormData?.income: "",
      exchangeRate: expenseFormData?.incomeExchangeRate ? expenseFormData?.incomeExchangeRate:"",
      exchangeRateLabel: expenseFormData.currency,
      id: expenseFormData.id,
      isSubmitted: expenseFormData.isSubmitted,
    },

    onSubmit: () => {},
  });
  useEffect(() => {
    onFormChange(formId, formik.values);
  }, [formik.values]);
  return (
    <div
      className="flex items-center
            justify-between
            rounded-lg flex-row p-0"
    >
      <FormMaker
        form={formik}
        fields={[
          isFirstItem
            ? {
                key: "action",
                component: "non-field",
                children: (
                  <Button className="p-1 bg-card-mute rounded-full flex items-center justify-center border border-slate-mute">
                    <FaPlus size={16} color="white" onClick={onAddHandler} />
                  </Button>
                ),

              //className: "w-5 h-5",
                className:"w-1/6 flex items-center justify-center"
              }
            : {
                key: "action",
                component: "non-field",
                children: (
                  <Button
                    className="p-1 bg-card-mute rounded-full flex items-center justify-center border border-slate-mute"
                    onClick={() => {
                      onRemoveHandler(formId);
                    }}
                  >
                    {" "}
                    <FaMinus className="text-white text-sm" />
                  </Button>
                ),

              //className: "w-5 h-5",
                className:"w-1/6 flex items-center justify-center"
              },

          {
            key: "income",
            component: "input",
            placeholder: "درآمد",
            type: "text",
            floating: false,
            className: "text-right p-0 h-6 text-xs rounded-md border border-slate-mute w-1/4",
            labelClassName:
              "text-right flex-1 p-1 h-6 text-xs rounded-md text-xs text-foreground-mute border border-1 border-border-mute bg-card-mute",
            formatted:true
        
          },
          {
            key: "exchangeRate",
            component: "input",
            placeholder: "نرخ تبدیل",
            type: "text",
            floating: false,
            className: "text-right p-0 h-6 text-xs rounded-md border border-slate-mute w-1/4",
            labelClassName:
              "text-right p-1 h-6 text-xs rounded-md text-xs text-foreground-mute border border-1 border-border-mute bg-card-mute",
            formatted:true
          },
          {
            key: "exchangeRateLabel",
            component: "Select",
            placeholder: "ارز",
            type: "text",
            floating: true,
            options: currencies,
            className: "text-right !flex-row !w-1/4 !rounded-md",
            containerClassName:"!h-6",
            controlClassName:
              "!bg-card-mute !text-xs !h-6 !min-h-6 !rounded-md",
            inputClassName: "!text-xs !text-foreground-mute !min-h-6 !h-6 !m-0 !p-0",
            valueContainerClassName: "!p-0 h-6 !text-foreground-mute",
            dropdownIndicatorClassName: "text-foreground-mute !p-0 !h-4 !min-h-4 cursor-pointer hidden",
            clearIndicatorClassName: "!p-0 !text-xs",
            menuClassName: "!text-xs",
          },
        ]}
        className="flex flex-row items-center justify-between p-2"
      />
    </div>
  );
}
