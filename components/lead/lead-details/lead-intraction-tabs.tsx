
import { cn } from '@/lib/utils'
import { Tabs, TabsContent, TabsTrigger, TabsList } from '@/components/ui/tabs'
import React, { useState } from 'react'

import EventTabContent from './event-tab-content'
import NoteTabContent from './note-tab-content'
import EmailTabContent from './email-tab-content'
export default function LeadInteractionTabs() {




  const tabs = [
    {
      label: "رویدادها",
      value: "events"
    },
    {
      label: " ایمیل   ",
      value: "email"
    },
    {
      label: " یادداشت ها  ",
      value: "notes"
    }
  ]
  const [activeTab, setActiveTab] = useState<("events" | "notes" | "email")>("events")


  return (
    <>
      {/* Tabs */}
      <Tabs
    
        defaultValue={tabs[0].value}
        value={activeTab}
        onValueChange={(value) =>setActiveTab(value as "events" | "notes" | "email")}
        className={cn("w-full block")}
        activationMode="automatic"
      >
        <TabsList className="w-full flex flex-row-reverse">
          {tabs.map((item) => (
            <TabsTrigger
              key={`trigger-${item.label}`}
              value={item.value}
              className="w-full"
            >
              {item.label}
            </TabsTrigger>
          ))}
        </TabsList>
        {tabs.map((item) => (
          <TabsContent
            key={`content-${item.label}`}
            value={item.value}
            className="w-full gap-8 p-0 flex flex-col bg-card"
          >
            {/* <InvoiceList data={listItems} /> */}

            <div className="w-full p-2 sm:p-3 lg:p-4" >
              {
                item.value === "events" ? (
                  <EventTabContent />
                ) : item.value === "email" ? (
                  <EmailTabContent />
                ) : (
                  <NoteTabContent />
                )
              }
            </div>
          </TabsContent>
        ))}
      </Tabs>
    </>

  )
}