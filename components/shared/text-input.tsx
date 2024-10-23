import React from 'react'
import { FormMakerInterface } from './form-maker';
import { cn } from '@/lib/utils';
import Image from 'next/image';

export default function TextInput({
  form,
  item,
  setTextFieldValue,
}: {
  form: any;
  item: FormMakerInterface["fields"][0];
  setTextFieldValue: (key: string, value: string) => any;
}) {
  return (
    <div className={cn('relative', item.className)}>
      <input
        key={item.key}
        placeholder={item.placeholder}
        value={form.values[item.key]}
        type={item.type}
        defaultValue={item.defaultValue || ""}
        onChange={(e: any) => setTextFieldValue(item.key, e.target.value)}
        className={cn(
          "text-subtitle/80 text-xsl h-11 w-full placeholder:text-xs placeholder:text-subtitle/80 outline-none p-3 rounded-lg text-right",
          item.labelClassName,
          {
            "pr-9": item.icon
          }
        )}
      />

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
