import React, { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../ui/tabs";
import { cn } from "@/lib/utils";
import { Button } from "../ui/button";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "../ui/accordion";
import FormMaker, { FormMakerInterface } from "./form-maker";
import { AccessDenied } from "./AccessDenied";
import Image from "next/image";

export interface FormTabContainerInterface {
  tabs: {
    title: string;
    forms?: {
      title: string;
      formInfo: FormMakerInterface;
      submitForm: (data: any) => any;
    }[];
    children?: React.ReactNode;
  }[];
  defaultValue: string;
  className?: string;
  hasAccess?: boolean
}

export default function FormTabContainer({
  tabs,
  defaultValue,
  className,
  hasAccess
}: FormTabContainerInterface) {
  const [activeTab, setActiveTab] = useState(defaultValue);

  return (
    <>
      <Tabs
        defaultValue={defaultValue}
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
            className="w-full gap-8 p-0 flex flex-col bg-card"
          >
            {item.forms ? (
              item.forms.map(({ formInfo, submitForm, title }) => (
                <div
                  key={title}
                  className="flex flex-col mt-8 items-end p-8 border py-4 px-2 rounded-lg gap-6 w-full bg-card"
                >
                  <h2 className="px-2">{title}</h2>
                  <FormMaker 
                   hasAccess={hasAccess}
                   //disable is true when user dont have access => has acess must be false
                    form={formInfo.form}
                    fields={formInfo.fields}
                    className={formInfo.className}
                  />
                  {
                    hasAccess ? (<div className="w-full  flex items-end">
                      <Button
                        variant={"info"}
                        className="w-24 mx-2"
                        onClick={submitForm}
                      >
                        ثبت
                      </Button>
                    </div>) : (<div className="w-full  flex items-end">
                      <AccessDenied
                                      variant={""}
                                      title=" ثبت "
                                      message="شما به این بخش دسترسی ندارید"
                                     
                                    /></div>)
                  }

                </div>
              ))
            ) : (
              <></>
            )}
            {item.children}

            {/* <div className="flex flex-row gap-4">
              <Button variant={"foreground"}>لغو</Button>
              <Button
                variant={"info"}
                onClick={() => {
                  // setFetchFormValues(true);
                  // contractClientHandler(item.forms?.values
                  // )
                }}
              >
                ثبت و تکمیل
              </Button>
              <Button variant={"info"}>ثبت و جدید</Button>
            </div> */}
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
                item.forms.map(({ formInfo, submitForm, title }) => (
                  <div
                    key={title}
                    className="flex flex-col  mt-8 items-end p-8 border py-4 px-2 rounded-lg gap-6 w-full bg-card"
                  >
                    <h2 className="px-2">{title}</h2>
                    <FormMaker
                      form={formInfo.form}
                      fields={formInfo.fields}
                      className={formInfo.className}
                    />
                    <Button
                      variant={"info"}
                      className="w-24 mx-2"
                      onClick={submitForm}
                    >
                      ثبت
                    </Button>
                  </div>
                ))
              ) : (
                <></>
              )}
              {item.children}
            </AccordionContent>
          </AccordionItem>
        ))}

        {/* <div className="flex flex-row-reverse gap-4">
          <Button variant={"foreground"}>لغو</Button>
          <Button variant={"info"}>ثبت و تکمیل</Button>
          <Button variant={"info"}>ثبت و جدید</Button>
        </div> */}
      </Accordion>
    </>
  );
}
