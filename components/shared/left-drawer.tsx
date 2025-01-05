import React from "react";
import { cn } from "@/lib/utils";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "../ui/accordion";
import { useFormik } from "formik";
import FormMaker from "./form-maker";
import { Button } from "../ui/button";

export interface LeftDrawerInterface {
  state: boolean;
  setState: (prev: any) => any;
}

export default function LeftDrawer({ state, setState }: LeftDrawerInterface) {
  const formik = useFormik({
    initialValues: {
      searchBy: [],
      contractStatus: [],
      name: "",
      gender: "",
      birthdate: "",
      socialNumber: "",
      career: "",
      location: "",
      contractNumber: "",
      contractDate: "",
      startDate: "",
      endDate: "",
      sellRange: [0, 10000],
      buyRange: [0, 10000],
    },
    onSubmit: async () => {},
  });

  const filterItems = [
    {
      title: "جستجو بر اساس",
      component: (
        <FormMaker
          form={formik}
          fields={[
            {
              key: "searchBy",
              component: "checkbox",
              placeholder: "جست‌وجو بر اساس",
              type: "text",
              className: "w-full items-start p-0",
              options: [
                { label: "درخواست", value: "request" },
                { label: "قرارداد", value: "contract" },
              ],
            },
          ]}
          className="flex flex-row w-full"
        />
      ),
    },
    {
      title: "وضعیت قرارداد",
      component: (
        <FormMaker
          form={formik}
          fields={[
            {
              key: "contractStatus",
              component: "checkbox",
              placeholder: "وضعیت قرارداد",
              type: "text",
              className: "w-full items-start p-0",
              options: [
                { label: "باز", value: "open" },
                { label: "بسته", value: "close" },
              ],
            },
          ]}
          className="flex flex-row w-full"
        />
      ),
    },
    {
      title: "اطلاعات مشتری",
      component: (
        <FormMaker
          form={formik}
          fields={[
            {
              key: "gender",
              component: "radio",
              placeholder: "جنسیت",
              type: "text",
              className: "w-full items-start p-0",
              options: [
                { label: "مرد", value: "female" },
                { label: "زن", value: "male" },
              ],
            },
            {
              key: "name",
              component: "input",
              placeholder: "نام و نام خانوادگی",
              type: "text",
              floating: true,
              labelClassName: "w-full",
              className: "w-full px-0",
            },
            {
              key: "birthdate",
              component: "date",
              placeholder: "تاریخ تولد",
              type: "text",
              floating: true,
              labelClassName: "w-full",
              className: "w-full px-0",
            },
            {
              key: "socialNumber",
              component: "input",
              placeholder: "کد ملی",
              type: "text",
              floating: true,
              labelClassName: "w-full",
              className: "w-full px-0",
            },
            {
              key: "career",
              component: "input",
              placeholder: "شغل",
              type: "text",
              floating: true,
              labelClassName: "w-full",
              className: "w-full px-0",
            },
            {
              key: "location",
              component: "input",
              placeholder: "محل سکونت",
              type: "text",
              floating: true,
              labelClassName: "w-full",
              className: "w-full px-0",
            },
            {
              key: "contractNumber",
              component: "input",
              placeholder: "شماره قرارداد",
              type: "text",
              floating: true,
              className: "w-full px-0",
            },
            {
              key: "contractDate",
              component: "date",
              placeholder: "تاریخ قرارداد",
              type: "text",
              floating: true,
              className: "w-full px-0",
            },
          ]}
          className="flex flex-row w-full gap-y-2"
        />
      ),
    },
  ];

  const rangeItems = [
    {
      title: "محدوده تاریخ ثبت",
      component: <FormMaker
        form={formik}
        fields={[
          {
            key: 'startDate',
            component: 'date',
            placeholder: 'از تاریخ',
            type: 'text',
            floating: true,
            className: 'w-full px-0'
          },
          {
            key: 'endDate',
            component: 'date',
            placeholder: 'تا تاریخ',
            type: 'text',
            floating: true,
            className: "w-full items-start p-0",
          },
        ]}
        className='flex flex-row w-full' />
    },
    {
      title: "محدوده مبلغ فروش",
      component: <FormMaker
        form={formik}
        fields={[
          {
            key: 'sellRange',
            component: 'slider',
            placeholder: '',
            type: 'text',
            className: "w-full items-start p-0",
            range: { max: 10000, min: 0, step: 200 }
          },
        ]}
        className='flex flex-row w-full' />
    },
    {
      title: "محدوده مبلغ خرید",
      component: <FormMaker
        form={formik}
        fields={[
          {
            key: 'buyRange',
            component: 'slider',
            placeholder: '',
            type: 'text',
            className: "w-full items-start p-0",
            range: { max: 10000, min: 0, step: 200 }
          },
        ]}
        className='flex flex-row w-full' />
    },
  ]
  return (
    <div
      className={cn("h-0 w-0 overflow-hidden top-0 left-0 z-50 fixed", {
        "w-screen h-screen": state,
      })}
    >
      <div
        className="bg-foreground/80 h-screen w-screen z-20"
        onClick={() => setState(false)}
      />
      <div
        className={cn(
          "h-screen rounded-r-2xl fixed top-0 z-50 left-0 w-0 bg-card text-foreground overflow-x-hidden duration-200 transition-all",
          {
            "w-72": state,
          }
        )}
      >
        <div className="flex flex-col w-full">
          <span className="p-5 border-b font-bold text-base">فیلتر ها</span>
          <Accordion type="multiple" className="w-full px-5 overflow-visible">
            {filterItems.map((item) => (
              <AccordionItem
                className="py-3"
                value={item.title}
                key={item.title}
              >
                <AccordionTrigger className="font-bold text-sm">
                  {item.title}
                </AccordionTrigger>
                <AccordionContent>{item.component}</AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </div>

        <div className="flex flex-col w-full">
          <span className="p-5 font-bold text-base">محدوده ها</span>
          <Accordion type="multiple" className="w-full px-5 overflow-visible">
            {rangeItems.map((item) => (
              <AccordionItem
                className="py-3"
                value={item.title}
                key={item.title}
              >
                <AccordionTrigger className="font-bold text-sm">
                  {item.title}
                </AccordionTrigger>
                <AccordionContent>{item.component}</AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </div>

        <div className="p-7 w-full">
          <Button
            variant={"info"}
            className="w-full"
            onClick={() => console.log(formik.values)}
          >
            اعمال اطلاعات
          </Button>
        </div>
      </div>
    </div>
  );
}
