"use client";
import { cn } from "@/lib/utils";
import { Checkbox } from "../ui/checkbox";
import { Button } from "../ui/button";
import Image from "next/image";
import FormMaker from "../shared/form-maker";
import { useFormik } from "formik";
import { useState } from "react";

import { FaPlus } from "react-icons/fa";
import { contractStateOptions } from "@/constants/customer-filter-fields";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { deletePage, editPage } from "@/api/role-management";

export interface PageCardInterface {
  list: { label: string; value: string }[];
  id: number;
  editData: {
    title: string;
    code: string;
    url: string;
  };
  editFields: any[];
}

export default function PageCard({
  id,
  list,
  editData,
  editFields,
}: PageCardInterface) {
  const [addedFroms, setAddedForms] = useState<any[]>([]);
  const [openEditForm, setOpenEditForm] = useState<boolean>(false);
  const queryClient = useQueryClient();
  const formik = useFormik({
    initialValues: { pageAccess: "", ...editData },
    enableReinitialize: true,
    onSubmit: () => {},
  });
  console.log(editData);
  function addFormHandler() {
    setAddedForms([
      ...addedFroms,
      {
        id: `form-${addedFroms.length + 1}`,
        isSubmitted: false,
      },
    ]);
  }

  const { mutate: removeHandler } = useMutation({
    mutationFn: (item: number) => {
      return deletePage(item);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["page"],
      });
    },
  });
  const { mutate: editDataHandler } = useMutation({
    mutationFn: ({ id, data }: { id: number; data: any }) => {
      return editPage(id, data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["page"] });
    },
  });
  function editHandler(id: number, values: any) {
    const data = {
      title: values.title,
      url: values.url,
      code: values.code,
    };
    editDataHandler({
      id: id,
      data: data,
    });
  }
  return (
    <div
      className={cn(
        "flex flex-col w-full bg-card rounded-lg overflow-hidden shadow border p-3 transition-all duration-200"
      )}
    >
      <div className="bg-[linear-gradient(180deg,#0475B5_-65.62%,#253159_100%)] py-2.5 px-3.5 flex items-center justify-between w-full text-primary-foreground border">
        <div className="w-full flex  gap-2 justify-between">
          <span className="text-lg font-bold"></span>
          <FormMaker
            form={formik}
            fields={[
              {
                key: "pageAccess",
                component: "checkbox",
                type: "text",
                className: "flex flex-row p-0",
                options: [
                  { label: "امکان نمایش", value: "show" },
                  { label: "امکان تعامل", value: "enable" },
                ],
              },
            ]}
            className="w-fit"
          />
        </div>
      </div>

      <div className="p-3.5 flex flex-col gap-4">
        <div className="flex items-center gap-4">
          <div>
            {" "}
            <Checkbox
            // onCheckedChange={(checked: boolean) => {}}
            //   checked={}
            />
          </div>

          <div className="flex items-start justify-between">
            <div className="flex flex-col gap-1">
              {list &&
                list?.map((item) => (
                  <div
                    key={item?.label + item?.value}
                    className="flex text-xs w-full items-center gap-1"
                  >
                    <span className="text-sm col-span-4 w-24">
                      {item?.label}
                    </span>

                    <span className="col-span-5 font-bold">{item?.value}</span>
                  </div>
                ))}
            </div>
          </div>
        </div>
        <div className="w-full flex items-center justify-end gap-2">
          <Button variant={"transparent"} className="p-0">
            <Image
              src="/icons/trash.png"
              alt=""
              width={1024}
              height={1024}
              className="w-5 h-5"
              onClick={() => {
                removeHandler(id);
              }}
            />
          </Button>
          <Button variant={"transparent"} className="p-0">
            <Image
              src="/icons/edit-primary.png"
              alt=""
              width={1024}
              height={1024}
              className="w-4 h-4"
              onClick={() => {
                setOpenEditForm(true);
              }}
            />
          </Button>
        </div>
        {openEditForm && (
          <div>
            {" "}
            <FormMaker
              form={formik}
              fields={[
                ...editFields,
                {
                  component: "non-field",
                  key: "actions",
                  children: (
                    <div className="flex gap-2">
                      <Button
                        variant="info"
                        onClick={() => {
                          const values = formik.values;
                          editHandler(id, values);
                          setOpenEditForm(false);
                        }}
                      >
                        ویرایش
                      </Button>
                      <Button
                        variant="foreground"
                        onClick={() => {
                          setOpenEditForm(false);
                        }}
                      >
                        لغو
                      </Button>
                    </div>
                  ),
                  className: "w-full flex items-end",
                },
              ]}
              className="w-full flex flex-row"
            />
          </div>
        )}
      </div>
      <Button
        variant={"transparent"}
        onClick={() => {
          addFormHandler();
        }}
        className={cn("text-aqua-foreground flex justify-end w-full")}
      >
        <FaPlus />
        افزودن
      </Button>
      <div className="flex flex-col gap-4">
        {/* {addedFroms.map((item) => (
          <UnitCostForm
            subFields={subFields}
            subInitialValues={[]}
            key={item.id}
            data={item}
            onRemove={removeHandler}
          />
        ))} */}
      </div>
    </div>
  );
}
