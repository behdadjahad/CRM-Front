import React from 'react'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../ui/tabs'
import FormExtender, { FormExtenderInterface } from './form-extender';
import { cn } from '@/lib/utils';

export interface ExtendableFormTabContainerInterface {
  tabs: {
    title: string;
    forms?: FormExtenderInterface[]
    children?: React.ReactNode
  }[]
  className?: string
}

export default function ExtendableFormTabContainer({ tabs, className }: ExtendableFormTabContainerInterface) {
  return (
    <Tabs defaultValue={tabs?.[0]?.title} className={cn("w-full", className)}>
      <TabsList className='w-full flex flex-row-reverse'>
        {
          tabs.map(item => (
            <TabsTrigger
              key={`trigger-${item.title}`}
              value={item.title}
              className='w-full'>
              {item.title}
            </TabsTrigger>
          ))
        }
      </TabsList>

      {
        tabs.map(item => (
          <TabsContent
            key={`content-${item.title}`}
            value={item.title}
            aria-live='assertive'
            className='w-full gap-8 p-0 flex flex-col'
          >
            {
              item.forms ?
                item.forms.map((form, formIndex) => (
                  <FormExtender
                    key={`form-${item.title}-${form.title}`}
                    {...form}
                    className={formIndex == 0 ? "rounded-t-none" : ""}
                  />
                )) :
                item.children
            }
          </TabsContent>
        ))
      }
    </Tabs>
  )
}
