import React, { useEffect, useState } from 'react'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../ui/tabs'
import FormExtender, { FormExtenderInterface } from './form-extender';
import { cn } from '@/lib/utils';
import { Button } from '../ui/button';

export interface ExtendableFormTabContainerInterface {
  tabs: {
    title: string;
    forms?: FormExtenderInterface[]
    children?: React.ReactNode
  }[]
  defaultValue: string;
  className?: string
}

export default function ExtendableFormTabContainer({ tabs, defaultValue, className }: ExtendableFormTabContainerInterface) {
  const [activeTab, setActiveTab] = useState(defaultValue || tabs?.[0]?.title)

  useEffect(() => {
    setActiveTab(defaultValue || tabs?.[0]?.title)
  }, [tabs, defaultValue])
  return (
    <Tabs defaultValue={defaultValue || tabs?.[0]?.title} value={activeTab} onValueChange={setActiveTab} className={cn("w-full", className)} activationMode='automatic' >
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
            className='w-full gap-8 p-0 flex flex-col'
          >
            {
              <>
                {item.forms ?
                  item.forms.map((form, formIndex) => (
                    <FormExtender
                      key={`form-${item.title}-${form.title}`}
                      {...form}
                      className={formIndex == 0 ? "rounded-t-none" : ""}
                    />
                  )) : 
                  <></>
                }
                {item.children}

                <div className="flex flex-row gap-4">
                  <Button variant={"foreground"}>
                    لغو
                  </Button>
                  <Button variant={"info"}>
                    ثبت و تکمیل
                  </Button>
                  <Button variant={"info"}>
                    ثبت و جدید
                  </Button>
                </div>

              </>
            }
          </TabsContent>
        ))
      }
    </Tabs>
  )
}
