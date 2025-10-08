
import FormMaker from '@/components/shared/form-maker'
import { Badge } from '@/components/ui/badge'
import { buildRowOptions, cn } from '@/lib/utils'
import { Tabs, TabsContent, TabsTrigger, TabsList } from '@/components/ui/tabs'
import React, { useState } from 'react'
import TextEditorInput from '@/components/shared/input/TextEditorInput - Copy'
import { PlusIcon } from 'lucide-react'
import { Button } from '@/components/ui/button'
import EventTabContent from './event-tab-content'
import NoteTabContent from './note-tab-content'
export default function LeadInteractionTabs() {




  const tabs = [
    {
      label: "رویدادها",
      value: "events"
    },
    {
      label: " یادداشت ها  ",
      value: "notes"
    }
  ]
  const [activeTab, setActiveTab] = useState<("events" | "notes")>("events")


  return (
    <>
      {/* Tabs */}
      <Tabs
        defaultValue={tabs[0].value}
        value={activeTab}
        onValueChange={(value) => setActiveTab(value as "events" | "notes")}
        className={cn("w-full hidden md:block")}
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

            <div className="w-full">
              {
                item.value === "events" ? (
                  <EventTabContent />
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