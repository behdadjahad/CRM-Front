import { useState } from "react";
import { RadioGroup, RadioGroupItem } from "../ui/radio-group";
import FormExtender, { FormExtenderInterface } from "../shared/form-extender";
import FormMaker, { FormMakerInterface } from "./form-maker";
import { Button } from "../ui/button";

export interface ServiceFormInterface {
  radioButton?: {
    label: string;
    value: string;
  }[];
  formExtender?: FormExtenderInterface[];
  purchaseForm?: { title: string; formDetail: FormMakerInterface };
  recordForm?: { title: string; formDetail: FormMakerInterface };
}

export default function ServiceForm({
  radioButton,
  formExtender,
  purchaseForm,
  recordForm,
}: ServiceFormInterface) {
  const [category, setCategory] = useState(radioButton && radioButton[0].value);
  let formValues = {};
  const [fetchFormValues, setFetchFormValues] = useState(false);

  function submitForm(key: string, data: any) {
    formValues = {
      ...formValues,
      [key]: data,
    };
    setFetchFormValues(false);
  }

  return (
    <div className="w-full bg-card rounded-lg">
      <div className="w-full p-4">
        {radioButton && (
          <div className="flex flex-row text-xs md:text-sm md:p-4 md:gap-4 font-foreground">
            <RadioGroup
              defaultValue={radioButton[0].value}
              className="flex flex-row-reverse w-full"
            >
              {radioButton?.map((item) => (
                <div key={item.label} className="flex items-center space-x-2">
                  <label htmlFor={item.value}>{item.label}</label>
                  <RadioGroupItem
                    value={item.value}
                    id={item.value}
                    onClick={() => setCategory(item.value)}
                  />
                </div>
              ))}
            </RadioGroup>
          </div>
        )}

        {formExtender?.map((item) => (
          <FormExtender
            key={item.title}
            title={item.title}
            fields={item.fields}
            initialValues={item.initialValues}
            validationSchema={item.validationSchema}
            callbackSubmit={submitForm}
            fetchFormValues={fetchFormValues}
            wrapperClassName="flex-row flex-wrap"
          />
        ))}
        <div className="flex flex-col gap-4">
          {purchaseForm && (
            <div className="border py-4 px-2 rounded-lg gap-6 flex flex-col w-full">
              <div className="px-2 font-foreground font-semibold">
                {purchaseForm.title}
              </div>
              <FormMaker {...purchaseForm.formDetail} />
            </div>
          )}
          {recordForm && (
            <div className="border py-4 px-2 rounded-lg gap-6 flex flex-col w-full">
              <div className="px-2 font-foreground font-semibold">
                {recordForm.title}
              </div>
              <FormMaker {...recordForm.formDetail} />
            </div>
          )}

          <div className="flex flex-row gap-4">
            <Button variant={"foreground"}>لغو</Button>
            <Button variant={"info"} onClick={() => setFetchFormValues(true)}>
              ثبت و تکمیل
            </Button>
            <Button variant={"info"}>ثبت و جدید</Button>
          </div>
        </div>
      </div>
    </div>
  );
}
