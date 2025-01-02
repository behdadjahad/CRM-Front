import { useState } from "react";
import { RadioGroup, RadioGroupItem } from "../ui/radio-group";
import FormExtender from "../shared/form-extender";

export interface ServiceFormInterface {
  radioButton?: {
    label: string;
    value: string;
  }[];
  formExtender: {
    title: string;
    fields: {
      key: string;
      component: string;
      placeholder: string;
      type: string;
      floating?: boolean;
      labelClassName?: string;
      className?: string;
      icon?: string;
    }[];
  }[];
}

export default function ServiceForm({
  radioButton,
  formExtender,
}: ServiceFormInterface) {
  const [category, setCategory] = useState(radioButton && radioButton[0].value);
  return (
    <div className="w-full bg-background-active rounded-lg py-6 px-4">
      {radioButton && (
        <div className="flex">
          <RadioGroup
            defaultValue={radioButton[0].value}
            className="flex flex-row-reverse gap-4"
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
      {formExtender.map((item) => (
        <FormExtender
          key={item.title}
          title={item.title}
          fields={item.fields}
          initialValues={undefined}
          validationSchema={undefined}
        />
      ))}
    </div>
  );
}
