import React from 'react'
import { FormMakerInterface } from './form-maker';
import { Slider } from '../ui/slider';

export default function SliderInput({
  form,
  item,
}: {
  form: any;
  item: FormMakerInterface["fields"][0];
}) {

  return (
    <div className="flex flex-col space-x-2 gap-2 w-full">
      <label className="">
        {item.placeholder}
      </label>

      <div className="flex flex-col gap-4 w-full">
        <div className="flex justify-between items-center">
          <span>{form.values[item.key]?.[1]}</span>
          <span className='text-muted'>بیشترین</span>
          <span>{form.values[item.key]?.[0]}</span>
          <span className='text-muted'>کمترین</span>
        </div>

        <Slider
          value={form.values[item.key]}
          onValueChange={(e) => form.setFieldValue(item.key, e)}
          min={item.range?.min}
          max={item.range?.max}
          step={item.range?.step}
          className="w-full"
        />
      </div>
    </div>
  )
}
