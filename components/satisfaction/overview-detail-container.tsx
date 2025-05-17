"use client";

import { cn } from "@/lib/utils";
import { Button } from "../ui/button";
import { useState } from "react";

import FormMaker from "../shared/form-maker";

export interface OverviewDetailInterface {
  // list: {
  //   label: string;
  //   labelClassName?: string;
  //   isPositive: boolean;
  //   detailList: { title: string }[];
  // }[];
  scoreRange: {
    label: string;
    value: number;
    className?: string;
  }[];
  labels: any[];
  className?: string;
  form: any;
}

export default function OverviewDetailContainer({
  // list,
  className,
  scoreRange,
  labels,
  form,
}: OverviewDetailInterface) {
  const [selectedItems, setSelectedItems] = useState<number[]>([]);
  const [activeScore, setActiveScore] = useState<number>();

  function activeHandler(item: number) {
    setSelectedItems((prevSelected) =>
      prevSelected.includes(item)
        ? prevSelected.filter((i) => i !== item)
        : [...prevSelected, item]
    );
  }

  // useEffect(() => {
  //   setSelectedItems([]);
  // }, [activeItem]);

  return (
    <div
      className={cn(
        "flex flex-col gap-4 items-end bg-card p-6 rounded-xl",
        className
      )}
       onClick={(e) => {
        e.stopPropagation(); // ✅ Stops bubbling
      }}
    >
      <span className="text-xs text-foreground w-full">
        لطفامیزان رضایت خودرا از 1تا10ارزیابی کنید.
      </span>
      <div className="flex flex-row w-full justify-between items-end">
        {scoreRange.map((item, index) => (
          <div
            key={index}
            className="flex flex-col justify-between"
            onClick={() => {
              form.setFieldValue("score", item.value);
              setActiveScore(item.value);
            }}
          >
            <span>{item.label}</span>
            <div
              className={cn(
                "rounded-full w-8 h-8 bg-background flex justify-center items-center cursor-pointer",
                activeScore === item.value ? item.className : ""
              )}
            >
              {item.value}
            </div>
          </div>
        ))}
      </div>

      <span className="text-xs text-foreground w-full">
        از کدام مورد رضایت داشتید؟
      </span>

      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 w-full">
        {labels.map(
          (item) =>
            item.type === "Satisfy" && (
              <Button
                key={item.id}
                className={cn(
                  "col-span-1 border border-border/20 p-0 text-xs text-foreground px-4 py-2 rounded-md",
                  {
                    "text-success-active bg-background": selectedItems.includes(
                      item.id
                    ),
                  }
                )}
                onClick={() => {
                  activeHandler(item.id);
                  form.setFieldValue("satisfactionLableId", item.id);
                }}
              >
                {item.label}
              </Button>
            )
        )}
      </div>
      <span className="text-xs text-foreground w-full">
        از کدام مورد ناراضی بودید؟
      </span>

      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 w-full">
        {labels.map(
          (item) =>
            item.type === "Unsatisfy" && (
              <Button
                key={item.id}
                className={cn(
                  "col-span-1 border border-border/20 p-0 text-xs text-foreground px-4 py-2 rounded-md",
                  {
                    "text-negative bg-background": selectedItems.includes(
                      item.id
                    ),
                  }
                )}
                onClick={() => {
                  activeHandler(item.id);
                  form.setFieldValue("satisfactionLableId", item.id);
                }}
              >
                {item.label}
              </Button>
            )
        )}
      </div>

      <FormMaker
        form={form}
        fields={[
          {
            key: "explanation",
            component: "textarea",
            placeholder: "توضیحات",
            type: "text",
            floating: true,
            className: "w-full p-0 text-xs",
            labelClassName: "text-xs",
          },
        ]}
        className="flex flex-row w-full"
      />
    </div>
  );
}
