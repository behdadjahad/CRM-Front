"use client";

import { cn } from "@/lib/utils";
import { Button } from "../ui/button";
import { useEffect, useState } from "react";
import { BiSolidLike, BiSolidDislike } from "react-icons/bi";
import FormMaker from "../shared/form-maker";
import { useFormik } from "formik";

export interface OverviewDetailInterface {
  list: {
    label: string;
    labelClassName?: string;
    isPositive: boolean;
    detailList: { title: string }[];
  }[];
  className?: string;
}

export default function OverviewDetailContainer({
  list,
  className,
}: OverviewDetailInterface) {
  const formik = useFormik({
    initialValues: {
      explanation: "",
    },
    onSubmit: async () => {},
  });

  const [activeItem, setActiveItem] =
    useState<OverviewDetailInterface["list"][0]>();
  const [selectedItems, setSelectedItems] = useState<
    OverviewDetailInterface["list"][0]["detailList"]
  >([]);

  function activeHandler(item: { title: string }) {
    setSelectedItems((prevSelectedItems) => {
      const index = prevSelectedItems.findIndex(
        (selected) => selected.title === item.title
      );

      if (index === -1) {
        return [...prevSelectedItems, item];
      } else {
        return prevSelectedItems.filter(
          (selected) => selected.title !== item.title
        );
      }
    });
  }

  useEffect(() => {
    setSelectedItems([]);
  }, [activeItem]);

  return (
    <div
      className={cn(
        "flex flex-col gap-4 items-end bg-background-active p-6 rounded-xl",
        className
      )}
    >
      <div className="flex flex-row items-center gap-4 w-full">
        <p className="text-xs text-foreground">
          آیا این تماس برای شما مفید بود؟
        </p>

        <div className="flex flex-row gap-4">
          {list.map(({ detailList, isPositive, label, labelClassName }) => (
            <Button
              key={label}
              className={cn(
                "border-none p-0 text-xs flex items-center gap-2 text-foreground-mute font-normal",
                {
                  "text-success-active":
                    activeItem?.label === label && isPositive,
                  "text-negative": activeItem?.label === label && !isPositive,
                },
                labelClassName
              )}
              onClick={() => {
                if (activeItem && activeItem.label === label) {
                  setActiveItem(undefined);
                } else {
                  setActiveItem({
                    detailList,
                    isPositive,
                    label,
                    labelClassName,
                  });
                }
              }}
            >
              {isPositive ? (
                <BiSolidLike size={20} />
              ) : (
                <BiSolidDislike size={20} />
              )}
              {label}
            </Button>
          ))}
        </div>
      </div>

      {activeItem && (
        <span className="text-xs text-foreground w-full">
          {activeItem && activeItem.isPositive
            ? "از کدام مورد رضایت داشتید؟"
            : "ازکدام مورد ناراضی بودید؟"}
        </span>
      )}

      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 w-full">
        {activeItem?.detailList.map((item) => (
          <Button
            key={`${item.title}-${activeItem?.label}`}
            className={cn(
              "col-span-1 border border-border/20 p-0 text-xs text-foreground px-4 py-2 rounded-md",
              {
                "text-primary-active bg-background":
                  selectedItems.findIndex(
                    (selected) => selected.title === item.title
                  ) !== -1,
              }
            )}
            onClick={() => {
              activeHandler(item);
            }}
          >
            {item.title}
          </Button>
        ))}
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

      <Button variant={"info"}>ثبت بازخورد</Button>
    </div>
  );
}
