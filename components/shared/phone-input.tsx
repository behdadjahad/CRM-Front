import React from 'react';
import PhoneInput from 'react-phone-input-2';
import 'react-phone-input-2/lib/style.css';
import { FormMakerInterface } from './form-maker';
import { cn } from '@/lib/utils';

export default function PhoneNumberInput({
  form,
  item,
}: {
  form: any;
  item: FormMakerInterface["fields"][0];
}) {
  return (
    <div className={cn('relative w-full h-full', { 'input-container': item.floating })}>
      <PhoneInput
        country={'ir'}
        value={form.values[item.key]}
        onChange={(phone) => form.setFieldValue(item.key, phone)}
        placeholder={item.floating ? " " : item.placeholder}
        containerClass={cn("", {
          "phone-floating-input h-11 bg-primary-foreground": item.floating,
        })}
        inputClass={cn(
          "text-subtitle/80 max-w-full text-sm min-h-full placeholder:text-xs placeholder:text-subtitle/80 outline-none p-3 rounded-lg text-right",
          item.labelClassName,
          { "pr-9": item.icon }
        )}
        buttonClass="rtl bg-transparent"
      />

      {item.floating && (
        <label className="phone-floating-label">
          {item.placeholder}
        </label>
      )}
    </div>
  );
}
