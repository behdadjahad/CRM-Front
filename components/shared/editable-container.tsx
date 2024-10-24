"use client"

import React from 'react'
import { Button } from '../ui/button';

export interface EditableContainerInterface {
  list: {
    label: string;
    value: string;
  }[]
  action: {
    label: string;
    icon: React.ReactNode;
    click: () => any
  }
}

export default function EditableContainer({ action, list }: EditableContainerInterface) {
  return (
    <div className='bg-city bg-full rounded-xl overflow-hidden'>
      <div className="bg-banner opacity-90 p-8 text-primary-foreground flex flex-row justify-between items-center">
        <div className="flex flex-row gap-8">
          {
            list.map((item, index) => (
              <>
                <div key={item.label} className='flex flex-col items-start gap-2.5'>
                  <span className='text-base font-normal'>
                    {item.label}
                  </span>

                  <span className='font-bold'>
                    {item.value}
                  </span>
                </div>

                {
                  index == 0 &&
                  (<span
                    key={index + item.label}
                    className='h-full border-l border-dashed border-primary-foreground'
                  />)
                }
              </>
            ))
          }
        </div>

        <Button variant={"transparent"} onClick={action.click} className='gap-2'>
          {action.icon}
          {action.label}
        </Button>
      </div>
    </div>
  )
}
