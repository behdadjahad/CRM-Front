import React from 'react'
import { FormMakerInterface } from './form-maker';
import { cn } from '@/lib/utils';
import Image from 'next/image';

export default function TextInput({
  form,
  item,
}: {
  form: any;
    item: FormMakerInterface["fields"][0];
}) {
  return (
    <div className={cn('relative w-full', { 'input-container': item.floating })}>
      <input
        key={item.key}
        placeholder={item.floating ? " " : item.placeholder}
        value={form.values[item.key]}
        type={item.type}
        onChange={(e: any) => form.setFieldValue(item.key, e.target.value)}
        className={cn(
          "text-subtitle/80 text-sm h-11 w-full placeholder:text-xs placeholder:text-subtitle/80 outline-none p-3 rounded-lg text-right",
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
          <label className="floating-label">
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
