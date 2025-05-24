"use client";
import { useState } from "react";
import { Button } from "../ui/button";
import { cn } from "@/lib/utils";
import FormMaker from "../shared/form-maker";
import { useFormik } from "formik";

const data = [
  {
    label: "ماهانه",
    value: "month",
  },
  {
    label: "3ماه",
    value: "3 month",
  },
  {
    label: "6ماه",
    value: "6 month",
  },
  {
    label: "9ماه",
    value: "9 month",
  },
  {
    label: "12 ماه",
    value: "12 month",
  },
];

export function TimeFilterContainer() {
  const [activeTime, setActiveTime] = useState<any>();
  const formik = useFormik({
    initialValues: {
      startTime: "",
      endTime: "",
    },
    onSubmit: async () => {},
  });
  return (
    <div className={cn("flex flex-row p-0 h-fit")}>
      {data?.map((item: any, index: number) => (
        <Button
          key={`time-filter-${index}`}
          onClick={() => {
            if (item.value === activeTime) {
              setActiveTime(null);
            } else {
              setActiveTime(item.value);
            }
          }}
          variant={
            item.value === activeTime
              ? "activeForeground"
              : "deactiveForeground"
          }
          className={`rounded-none h-10 w-18 ${
            index === 0 ? "rounded-tr-lg rounded-br-lg" : ""
          }`}
        >
          {item.label}
        </Button>
      ))}
      <FormMaker
        form={formik}
        fields={[
          {
            key: "startTimeFilter",
            component: "date",
            placeholder: "ازتاریخ",
            type: "text",
            floating: true,
            className: "w-36 mr-0  rounded-none px-0",
            labelClassName: "rounded-none h-10",
          },
          {
            key: "endTimeFilter",
            component: "date",
            placeholder: "تاتاریخ",
            type: "text",
            floating: true,
            className: "w-36 rounded-none px-0",
            labelClassName: "rounded-none h-10 rounded-tl-lg rounded-bl-lg",
          },
        ]}
        className="flex flex-row items-center"
      />
    </div>
  );
}
