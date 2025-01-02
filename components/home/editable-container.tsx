"use client"

import React, { useState } from 'react'
import { Button } from '@/components/ui/button';
import CustomModal from '@/components/shared/custom-modal';
import { MdClose } from 'react-icons/md';
import FormMaker from '@/components/shared/form-maker';
import { useFormik } from 'formik';
import { cn } from "@/lib/utils";

export interface EditableContainerInterface {
  list: {
    label: string;
    value: string;
  }[];
  action: {
    label: string;
    icon: React.ReactNode;
    click: () => any;
  };
}

export default function EditableContainer({
  action,
  list,
}: EditableContainerInterface) {
  const [openModal, setOpenModal] = useState(false);

  const formik = useFormik({
    initialValues: {
      number: "",
      date: "",
      subject: "",
      accountant: "",
      description: "",
    },
    onSubmit: async () => {},
  });

  return (
    <div className="bg-city bg-full rounded-xl overflow-hidden min-h-fit w-full">
      <div className="bg-banner w-full opacity-90 p-6 md:p-8 text-primary-foreground flex flex-col lg:flex-row justify-between items-center">
        <div className="flex flex-col lg:flex-row gap-8 w-full">
          {list.map((item, index) => (
            <div
              key={item.label}
              className="flex flex-row gap-4 md:gap-8 items-start"
            >
              <div
                className={cn(
                  "flex flex-row md:flex-col items-center justify-between md:items-start w-full gap-2.5",
                  {
                    "border-b pb-2 -mb-2 border-dashed border-primary-foreground flex md:hidden":
                      index == 0,
                  }
                )}
              >
                <span className="text-base font-normal">{item.label}</span>

                <span className="font-bold">{item.value}</span>
              </div>

              {index == 0 && (
                <span
                  key={index + item.label}
                  className="h-full border-l border-dashed border-primary-foreground hidden md:flex"
                />
              )}
            </div>
          ))}
        </div>

        <Button
          variant={"transparent"}
          onClick={() => {
            setOpenModal(true);
            action.click();
          }}
          className="gap-2"
        >
          {action.icon}
          {action.label}
        </Button>
      </div>

      <CustomModal
        isOpen={openModal}
        onRequestClose={() => setOpenModal(false)}
        contentLabel="ویرایش"
      >
        <div className="flex flex-row reverse w-full items-center justify-between p-2 pb-5">
          <span>ویرایش</span>

          <MdClose
            size={20}
            onClick={() => setOpenModal(false)}
            className="cursor-pointer"
          />
        </div>

        <div className="w-full flex flex-col items-end">
          <FormMaker
            form={formik}
            fields={[
              {
                key: "number",
                component: "input",
                placeholder: "شماره قرارداد",
                type: "text",
                floating: true,
                className: "w-full md:w-1/2",
              },
              {
                key: "date",
                component: "date",
                placeholder: "تاریخ قرارداد",
                type: "text",
                floating: true,
                className: "w-full md:w-1/2",
              },
              {
                key: "subject",
                component: "input",
                placeholder: "موضوع قرارداد",
                type: "text",
                floating: true,
                className: "w-full md:w-1/2",
              },
              {
                key: "accountant",
                component: "input",
                placeholder: "مسئول قرارداد",
                type: "text",
                floating: true,
                className: "w-full md:w-1/2",
              },
              {
                key: "description",
                component: "textarea",
                placeholder: "توضیحات",
                type: "text",
                floating: true,
                className: "w-full",
              },
            ]}
            className="flex flex-row w-full"
          />

          <div className="flex flex-row gap-4">
            <Button variant={"info"}>ثبت</Button>
            <Button variant={"foreground"} onClick={() => setOpenModal(false)}>
              لغو
            </Button>
          </div>
        </div>
      </CustomModal>
    </div>
  );
}
