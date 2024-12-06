import React from 'react'
import { FormMakerInterface } from './form-maker';
import { RadioGroup, RadioGroupItem } from '../ui/radio-group';

export default function RadioInput({
  form,
  item,
}: {
  form: any;
  item: FormMakerInterface["fields"][0];
}) {
  return (
    <div className="flex flex-col space-x-2 gap-2">
      <label className="">
        {item.placeholder}
      </label>

      <RadioGroup
        onValueChange={(e) => form.setFieldValue(item.key, e)}
        defaultValue={item.defaultValue || undefined}
        className='flex gap-7 items-center'
      >
        {
          item.options?.map(item => (
            <div className="flex items-center space-x-2" key={item.value}>
              <label htmlFor={item.value}>{item.label}</label>
              <RadioGroupItem value={item.value} id={item.value} />
            </div>
          ))
        }
      </RadioGroup>
    </div>
  )
}
