import { services } from '@/constants/services'
import React from 'react'
import ServiceCard from './service-card'

export default function ServiceContainer() {
  return (
    <div className='flex flex-col items-end p-6 rounded-xl justify-between gap-8 bg-background-active'>
      <h2>
        سرویس ها
      </h2>

      <div className="flex flex-row-reverse flex-wrap items-center justify-start gap-3 w-full">
        {
          services.map(item => (
            <ServiceCard key={item.title} {...item} />
          ))
        }
      </div>
    </div>
  )
}
