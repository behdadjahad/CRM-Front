import React from 'react'
import { FormMakerInterface } from './form-maker';
import { RadioGroup, RadioGroupItem } from '../ui/radio-group';
import { cn } from '@/lib/utils';

export default function RadioInput({
  form,
  item,
}: {
  form: any;
  item: FormMakerInterface["fields"][0];
}) {
  return (
    <div className="flex flex-col  gap-2">
      <label className="">
        {item.placeholder}
      </label>

      <RadioGroup
        onValueChange={(e) => form.setFieldValue(item.key, e)}
        defaultValue={item.defaultValue || undefined}
        className={cn('flex gap-7 items-center',item.className)}
      >
        {
          item.options?.map(item => (
            <div className="w-full flex items-center justify-end space-x-2" key={item.value}>
              <label htmlFor={item.value}>{item.label}</label>
              <RadioGroupItem value={item.value} id={item.value} />
            </div>
          ))
        }
      </RadioGroup>
    </div>
  )
}
