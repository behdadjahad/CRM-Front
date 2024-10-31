import { services } from '@/constants/services'
import React, { useState } from 'react'
import ServiceCard from './service-card'
import FormMaker from './form-maker'
import { useFormik } from 'formik'

export default function ServiceContainer() {
  const [activeItem, setActiveItem] = useState<any>(null)

  const formik = useFormik({
    initialValues: {
      admitter: '',
      accountant: '',
      description: ''
    },
    onSubmit: async () => { }
  })

  return (
    <div className='flex flex-col items-end p-6 rounded-xl justify-between gap-8 bg-background-active'>
      <h2>
        سرویس ها
      </h2>

      <div className="flex flex-row-reverse flex-wrap items-center justify-start gap-3 w-full">
        {
          services.map(item => (
            <ServiceCard
              key={item.title}
              {...item}
              clickFunction={() => activeItem && activeItem.title === item.title ? setActiveItem(null) : setActiveItem(item)}
              isActive={activeItem && activeItem.title == item.title}
            />
          ))
        }
      </div>

      {
        activeItem ?
          <div className="w-full flex flex-col items-end">
            <FormMaker
              form={formik}
              fields={[
                {
                  key: 'admitter',
                  component: 'input',
                  placeholder: 'ثبت کننده',
                  type: 'text',
                  floating: true,
                  className: "w-full md:w-1/2 lg:w-1/4",
                },
                {
                  key: 'accountant',
                  component: 'input',
                  placeholder: 'مسئول قرارداد',
                  type: 'text',
                  floating: true,
                  className: "w-full md:w-1/2 lg:w-1/4",
                },
                {
                  key: 'description',
                  component: 'input',
                  placeholder: 'توضیحات',
                  type: 'text',
                  floating: true,
                  className: "w-full md:w-1/2",
                }
              ]}
              className='w-full flex-row-reverse' />
          </div> :
          <></>
      }
    </div>
  )
}
