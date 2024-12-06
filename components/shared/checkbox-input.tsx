import React from 'react'
import { Checkbox } from '../ui/checkbox'
import { FormMakerInterface } from './form-maker';

export default function CheckboxInput({
  form,
  item,
}: {
  form: any;
  item: FormMakerInterface["fields"][0];
}) {
  return (
    <div className="flex flex-col space-x-2 gap-2">
      {
        item.options?.map(optItem => (
          <div className="flex flex-row gap-2 items-center" key={optItem.label}>
            <Checkbox
              checked={form.values[item.key]?.includes(optItem.value)}
              onCheckedChange={(checked) => {
                const previousList = form.values[item.key]
                if (checked) {
                  form.setFieldValue(item.key, [...previousList, optItem.value])
                }
                else {
                  const newList = previousList.filter((filteredItem: string) => filteredItem != optItem.value)
                  form.setFieldValue(item.key, newList)
                }
              }}
              onChange={(e: any) => form.setFieldValue(item.key, e.target.value)}
              id={optItem.value} />
            <label
              htmlFor={optItem.value}
              className="text-sm font-medium peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
            >
              {optItem.label}
            </label>
          </div>
        ))
      }
    </div>
  )
}
