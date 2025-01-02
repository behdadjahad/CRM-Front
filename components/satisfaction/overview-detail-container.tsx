"use client";

import { cn } from "@/lib/utils";
import { Button } from "../ui/button";
import { useState } from "react";
import Image from "next/image";
import FormMaker from "../shared/form-maker";
import { useFormik } from "formik";

export interface OverviewDetailInterface {
  list: {
    label: string;
    activeLabelClassName?: string;
    action: {
      icon: string;
      activeIcon: string;
    };
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

  const [activeItem, setActiveItem] = useState<any>(null);
  const [selectedItems, setSelectedItems] = useState<{ title: string }[]>([]);

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
  return (
    <div
      className={cn(
        "bg-background-active p-6 rounded-xl overflow-hidden",
        className
      )}
    >
      <div className="flex flex-col gap-4">
        <div className="flex flex-row items-center gap-4">
          <p className="text-xs text-foreground">
            آیا این تماس برای شما مفید بود؟
          </p>

          <div className="flex flex-row gap-4">
            {list.map((item) => (
              <div key={item.label} className="flex items-center gap-2">
                <Image
                  src={item.action.icon}
                  alt=""
                  width={1024}
                  height={1024}
                  className="w-4 h-4"
                />
                <Button
                  className={`border-none p-0 text-foreground-mute text-xs ${
                    activeItem && activeItem.label === item.label
                      ? item.activeLabelClassName
                      : ""
                  }`}
                  onClick={() =>
                    activeItem && activeItem.label === item.label
                      ? setActiveItem(null)
                      : setActiveItem(item)
                  }
                >
                  {item.label}
                </Button>
              </div>
            ))}
          </div>
        </div>
        {activeItem && (
          <p className="text-xs text-foreground">ازکدام مورد رضایت داشتید؟</p>
        )}
        <div className="flex flex-row gap-4">
          {activeItem &&
            activeItem.detailList.map((item) => (
              <Button
                key={item.title}
                className={`border border-border/20 p-0 text-xs text-foreground px-4 py-2 rounded-md ${
                  selectedItems.findIndex(
                    (selected) => selected.title === item.title
                  ) !== -1
                    ? "text-primary-active bg-background"
                    : ""
                }`}
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
      </div>
    </div>
  );
}
