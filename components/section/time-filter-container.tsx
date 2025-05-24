"use client";
import { useEffect, useState } from "react";
import { Button } from "../ui/button";
import { cn } from "@/lib/utils";
import FormMaker from "../shared/form-maker";
import { useFormik } from "formik";
import { convertToGregorian } from "@/lib/date";

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
interface TimeFilterContainer {
  listItem: {
    label: string;
    value: number;
  }[];
  onCheckTimeFilter: (value: any) => void;
  onDateFilterSubmit: (value: any) => void;
}
export function TimeFilterContainer({
  listItem,
  onCheckTimeFilter,
  onDateFilterSubmit,
}: TimeFilterContainer) {
  const [activeTime, setActiveTime] = useState<any>();
  const formik = useFormik({
    initialValues: {
      startTimeFilter: undefined,
      startTimeFilterType: "",
      endTimeFilter: undefined,
      endTimeFilterType: "",
    },
    onSubmit: async () => {},
  });
  useEffect(() => {
    if (formik.values.startTimeFilter && formik.values.endTimeFilter) {
      onDateFilterSubmit({
        startDate: convertToGregorian(
          formik.values.startTimeFilter,
          formik.values.startTimeFilterType
        ),
        endDate: convertToGregorian(
          formik.values.endTimeFilter,
          formik.values.endTimeFilterType
        ),
      });
      setActiveTime(null)
    }
  }, [formik.values.startTimeFilter, formik.values.endTimeFilter]);
  return (
    <div className={cn("flex flex-row p-0 h-fit")}>
      {listItem?.map((item: any, index: number) => (
        <Button
          key={`time-filter-${index}`}
          onClick={() => {
            if (item.value === activeTime) {
              return;
            } else {
              setActiveTime(item.value);
              onCheckTimeFilter(item.value);
            }
            formik.resetForm();
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
            dependantKey: "startTimeFilterType",
            component: "date",
            placeholder: "ازتاریخ",
            type: "text",
            floating: true,
            className: "w-36 mr-0  rounded-none px-0",
            labelClassName: "rounded-none h-10",
          },
          {
            key: "endTimeFilter",
            dependantKey: "endTimeFilterType",
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
