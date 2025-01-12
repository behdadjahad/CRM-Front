import React, { useEffect, useState } from 'react'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../ui/tabs'
import FormExtender, { FormExtenderInterface } from './form-extender';
import { cn } from '@/lib/utils';
import { Button } from '../ui/button';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "../ui/accordion";

export interface ExtendableFormTabContainerInterface {
  tabs: {
    title: string;
    forms?: FormExtenderInterface[];
    children?: React.ReactNode;
  }[];
  defaultValue: string;
  className?: string;
}

export default function ExtendableFormTabContainer({
  tabs,
  defaultValue,
  className,
}: ExtendableFormTabContainerInterface) {
  const [activeTab, setActiveTab] = useState(defaultValue || tabs?.[0]?.title);
  let formValues = {};
  const [fetchFormValues, setFetchFormValues] = useState(false);

  function submitForm(key: string, data: any) {
    formValues = {
      ...formValues,
      [key]: data,
    };
    console.log({ formValues });
    setFetchFormValues(false);
  }

  useEffect(() => {
    setActiveTab(defaultValue || tabs?.[0]?.title);
  }, [tabs, defaultValue]);

  return (
    <>
      <Tabs
        defaultValue={defaultValue || tabs?.[0]?.title}
        value={activeTab}
        onValueChange={setActiveTab}
        className={cn("w-full hidden md:block", className)}
        activationMode="automatic"
      >
        <TabsList className="w-full flex flex-row-reverse">
          {tabs.map((item) => (
            <TabsTrigger
              key={`trigger-${item.title}`}
              value={item.title}
              className="w-full"
            >
              {item.title}
            </TabsTrigger>
          ))}
        </TabsList>

        {tabs.map((item) => (
          <TabsContent
            key={`content-${item.title}`}
            value={item.title}
            className="w-full gap-8 p-0 flex flex-col"
          >
            {item.forms ? (
              item.forms.map((form, formIndex) => (
                <FormExtender
                  key={`form-${item.title}-${form.title}`}
                  {...form}
                  callbackSubmit={submitForm}
                  fetchFormValues={fetchFormValues}
                  className={formIndex == 0 ? "rounded-t-none" : ""}
                />
              ))
            ) : (
              <></>
            )}
            {item.children}

            <div className="flex flex-row gap-4">
              <Button variant={"foreground"}>لغو</Button>
              <Button variant={"info"} onClick={() => setFetchFormValues(true)}>
                ثبت و تکمیل
              </Button>
              <Button variant={"info"}>ثبت و جدید</Button>
            </div>
          </TabsContent>
        ))}
      </Tabs>

      <Accordion
        defaultValue={tabs.map((item) => item.title)}
        type="multiple"
        className="flex flex-col w-full gap-4 md:hidden"
      >
        {tabs.map((item) => (
          <AccordionItem
            key={item.title}
            value={item.title}
            className="overflow-hidden rounded-xl"
          >
            <AccordionTrigger className="bg-[linear-gradient(360deg,_#1C284F_0.67%,_#2949A4_163.41%)] px-6 text-primary-foreground">
              {item.title}
            </AccordionTrigger>
            <AccordionContent className="w-full gap-4 p-0 flex flex-col">
              {item.forms ? (
                item.forms.map((form, formIndex) => (
                  <FormExtender
                    key={`form-${item.title}-${form.title}`}
                    {...form}
                    callbackSubmit={submitForm}
                    fetchFormValues={fetchFormValues}
                    className={formIndex == 0 ? "rounded-t-none" : ""}
                  />
                ))
              ) : (
                <></>
              )}
              {item.children}
            </AccordionContent>
          </AccordionItem>
        ))}
        <div className="flex flex-row-reverse gap-4">
          <Button variant={"foreground"}>لغو</Button>
          <Button variant={"info"}>ثبت و تکمیل</Button>
          <Button variant={"info"}>ثبت و جدید</Button>
        </div>
      </Accordion>
    </>
  );
}
