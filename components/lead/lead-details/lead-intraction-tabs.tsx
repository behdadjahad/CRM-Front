
import FormMaker from '@/components/shared/form-maker'
import { Badge } from '@/components/ui/badge'
import { buildRowOptions, cn } from '@/lib/utils'
import { Tabs, TabsContent, TabsTrigger, TabsList } from '@/components/ui/tabs'
import React, { useState } from 'react'
import TextEditorInput from '@/components/shared/input/TextEditorInput - Copy'
import { PlusIcon } from 'lucide-react'
import { Button } from '@/components/ui/button'
import EventTabContent from './event-tab-content'
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
                                    <div className='w-full h-full flex flex-col gap-4'>
                                        <TextEditorInput item={{ ...item, component: "text-editor", key: "note", className: 'w-full h-22', }} form={{ values: { note: '' }, setFieldValue: () => { } }} />
                                        <Button variant="info" className='w-fit px-12 py-2'>

                                            ثبت
                                        </Button>
                                    </div>
                                )
                            }
                            {/* {pages > 1 && (
                  <ReactPaginate
                    breakLabel="..."
                    nextLabel="صفحه بعد"
                    previousLabel="صفحه قبل"
                    onPageChange={handlePageChange}
                    pageRangeDisplayed={2}
                    marginPagesDisplayed={3}
                    forcePage={currentPage - 1}
                    pageCount={pages}
                    renderOnZeroPageCount={null}
                    containerClassName="w-full relative flex justify-center items-center flex-row-reverse"
                    pageClassName="mx-3 rounded-md"
                    pageLinkClassName="rounded-md text-sm hover:bg-gray-100 w-10 h-10 flex items-center justify-center"
                    activeClassName="bg-gray-100 rounded-md"
                    previousClassName="absolute right-8"
                    previousLinkClassName="rounded-md text-sm"
                    nextClassName="absolute left-8"
                    nextLinkClassName="rounded-md text-sm"
                    disabledClassName="opacity-50 cursor-not-allowed"
                  />
                )} */}
              </div>

              {/* <div className="flex items-center justify-start w-1/2"> */}
                {/* <FormMaker
                  form={limitFormik}
                  fields={[
                    {
                      key: "limit",
                      component: "Select",
                      placeholder: "تعدادردیف",
                      type: "text",
                      floating: true,
                      className: "w-auto text-sm placeholder:text-foreground",
                    //   options: buildRowOptions(total, Math.ceil(total / 10)),
                      menuPlacement: "top",
                      onChange: (data: any) => {
                        // limitHandler(Number(data?.value));
                      },
                    },
                  ]}
                  className="flex flex-row justify-start items-start"
                /> */}
              {/* </div> */}
            {/* </div> */}
          </TabsContent>
        ))}
      </Tabs>
          </>
       
  )
}