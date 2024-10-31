import React from 'react'
import { FormMakerInterface } from './form-maker';
import { cn } from '@/lib/utils';
import Image from 'next/image';

export default function TextAreaInput({
  form,
  item,
}: {
  form: any;
  item: FormMakerInterface["fields"][0];
}) {
  return (
    <div className={cn('relative w-full', { 'input-container': item.floating })}>
      <textarea
        key={item.key}
        placeholder={item.floating ? " " : item.placeholder}
        value={form.values[item.key]}
        onChange={(e: any) => form.setFieldValue(item.key, e.target.value)}
        rows={5}
        className={cn(
          "text-subtitle/80 text-sm w-full placeholder:text-xs placeholder:text-subtitle/80 outline-none p-3 rounded-lg text-right",
          item.labelClassName,
          {
            'floating-input bg-primary-foreground': item.floating
          },
          {
            "pr-9": item.icon
          }
        )}
      />

      {
        item.floating ?
          <label className="floating-label top-6">
            {item.placeholder}
          </label>
          : <></>
      }

      {
        item.icon ?
          (<Image
            src={item.icon}
            alt={item.key}
            width={20}
            height={20}
            className='absolute right-3 top-3'
          />) :
          (<></>)
      }
    </div>
  )
}
