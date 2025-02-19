import { useFormik } from "formik";
import FormMaker from "../shared/form-maker";
import { Button } from "../ui/button";
import { Check, ChevronDown, ChevronUp } from "lucide-react";
import { useMutation } from "@tanstack/react-query";
import { sendSingleExchageRate } from "@/api/currency";
import { useParams } from "next/navigation";

export default function ExpenseDetail({
  isOpen,
  currency,
  buyPrice,
  convertedBuyPrice,
  onToggle,
  currencies,
  contractCurrency
}: any) {
  const { id } = useParams();
  const formik = useFormik({
    initialValues: {
      exchangeRate: "",
      exchangeRateLabel: "",
    },
    onSubmit: () => {},
  });
  
  const { mutate: singleExchangeRateHandler } = useMutation({
    mutationFn: (data: any) => {
      return sendSingleExchageRate(data, Number(id));
    },
    onSuccess: (data:any) => {
     console.log(data)
    },
  });
  return (
    <div className="flex flex-col">
      <div className="flex flex-row w-full items-center justify-between gap-1">
        <div className="flex items-center justify-between w-full">
          <div className="flex gap-1">
            <div>{buyPrice}</div>
            <div>{currency.name}</div>
          </div>
          <div className="flex gap-1">
            <div>{convertedBuyPrice }</div>
            <div>{contractCurrency.name}</div>
          </div>
        </div>
        <Button className="outline-none border-none p-0" onClick={onToggle}>
          {" "}
          {isOpen ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
        </Button>
      </div>
      {isOpen && (
        <FormMaker
          form={formik}
          fields={[
            {
              key: "action",
              component: "non-field",
              children: (
                <Button className="border-none p-1 bg-quartiery-background rounded-full flex items-center justify-center "
                  onClick={() => {
                    singleExchangeRateHandler({
                   
                        currencyId:formik.values.exchangeRateLabel,
                        currencyExchangeRate: Number(formik.values.exchangeRate),
                        service: "Accommodation"
                   
                    })
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
              key: "exchangeRate",
              component: "input",
              placeholder: "نرخ تبدیل",
              type: "text",
              floating: true,
              className: "text-right flex-1 p-0 h-6 text-xs rounded-md",
              labelClassName: "text-right flex-1 p-0 h-6 text-xs rounded-md",
            },
            {
              key: "exchangeRateLabel",
              component: "Select",
              placeholder: "تومان",
              type: "text",
              floating: true,
              options: currencies,
              className: "text-right w-1/3",
              controlClassName: "text-xs h-6",
            },
          ]}
          className="flex flex-row items-center gap-2"
        />
      )}
    </div>
  );
}
{
  /* <Button className="border-none p-0 rounded-full bg-quartiery-background w-4 h-4" onClick={onToggle}>
          <Check />
          </Button> */
}
