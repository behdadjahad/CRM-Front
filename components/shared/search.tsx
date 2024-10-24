import React from 'react'
import { useFormik } from "formik";
import FormMaker from './form-maker';
import { cn } from '@/lib/utils';

export interface SearchInterface {
  className?: string;
}

export default function Search({ className }: SearchInterface) {
  const formik = useFormik({
    initialValues: {
      search: '',
    },
    onSubmit: async () => { }
  })

  return (
    <FormMaker
      form={formik}
      fields={[
        {
          key: 'search',
          component: 'input',
          placeholder: 'جستجو',
          icon: '/icons/search.png',
          type: 'text',
          floating: false,
          labelClassName: 'bg-badge'
        }
      ]}
      className={cn('flex flex-row w-full', className)} />
  )
}
