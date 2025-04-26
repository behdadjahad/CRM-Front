"use client";

import { cn } from "@/lib/utils";
import { Button } from "../ui/button";
import { useState } from "react";

import FormMaker from "../shared/form-maker";
import { useFormik } from "formik";

export interface OverviewDetailInterface {
  list: {
    label: string;
    labelClassName?: string;
    isPositive: boolean;
    detailList: { title: string }[];
  }[];
  scoreRange: {
    label: string;
    value: number;
  }[];
  labels: any[];
  className?: string;
  onSelectedHandler: (selectedItems: number[]) => void;
}

export default function OverviewDetailContainer({
  list,
  className,
  scoreRange,
  labels,
  onSelectedHandler
}: OverviewDetailInterface) {
  const formik = useFormik({
    initialValues: {
      explanation: "",
    },
    onSubmit: async () => {},
  });

  const [selectedItems, setSelectedItems] = useState<number[]>([]);

  function activeHandler(item: number) {
    setSelectedItems((prevSelected) => {
      let updatedSelected;
      
      if (prevSelected.includes(item)) {
        // If item exists, remove it
        updatedSelected = prevSelected.filter((i) => i !== item);
      } else {
        // If item doesn't exist, add it
        updatedSelected = [...prevSelected, item];
      }
  
      // Send the updated array to parent
      onSelectedHandler(updatedSelected);
  
      return updatedSelected;
    });
  }

  // useEffect(() => {
  //   setSelectedItems([]);
  // }, [activeItem]);
  console.log(labels);
  return (
    <div
      className={cn(
        "flex flex-col gap-4 items-end bg-card p-6 rounded-xl",
        className
      )}
    >
      <span className="text-xs text-foreground w-full">
        {/* {activeItem && activeItem.isPositive */}
        {/* ? "از کدام مورد رضایت داشتید؟" */}
        {/* : "ازکدام مورد ناراضی بودید؟" */}
        {/* } */}
        لطفامیزان رضایت خودرا از 1تا10ارزیابی کنید.
      </span>
      <div className="flex flex-row w-full justify-between items-end">
        {scoreRange.map((item, index) => (
          <div key={index} className="flex flex-col justify-between" onClick={() => {
            
          }}>
            <span>{item.label}</span>
            <div className="rounded-full w-8 h-8 bg-background flex justify-center items-center cursor-pointer">
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
                }}
              >
                {item.label}
              </Button>
            )
        )}
      </div>
      <span className="text-xs text-foreground w-full">
        {/* {activeItem && activeItem.isPositive */}
        {/* ? "از کدام مورد رضایت داشتید؟" */}
        {/* : "ازکدام مورد ناراضی بودید؟" */}
        {/* } */}
        از کدام مورد ناراضی بودید؟
      </span>
      {/* )} */}

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
                }}
              >
                {item.label}
              </Button>
            )
        )}
      </div>

      <FormMaker
        form={formik}
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
