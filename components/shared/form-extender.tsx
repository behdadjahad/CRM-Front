import React, { useState, useCallback, useEffect } from "react";
import FormMaker, { FormMakerInterface } from "./form-maker";
import { useFormik } from "formik";
import { cn } from "@/lib/utils";
import Image from "next/image";
import { Button } from "../ui/button";
import { FaPlus } from "react-icons/fa";
import { debounce } from "lodash";

export interface FormExtenderInterface {
  fields: FormMakerInterface["fields"];
  initialValues: any;
  validationSchema: any;
  title: string;
  className?: string;
  wrapperClassName?: string;
  fetchFormValues: boolean;
  callbackSubmit: (key: string, data: any[]) => void;
  children?: any;
  childrenClassName?: string;
}

export default function FormExtender({
  title,
  fields,
  initialValues,
  validationSchema,
  className,
  wrapperClassName,
  fetchFormValues,
  children,
  callbackSubmit,
  childrenClassName,
}: FormExtenderInterface) {
  const [forms, setForms] = useState<{ id: string; values: any }[]>([
    { id: `${title}-0`, values: { ...initialValues } },
  ]);
  const [formCount, setFormCount] = useState(1);

  const extendForm = useCallback(() => {
    setForms((prevForms) => [
      ...prevForms,
      { id: `${title}-${formCount}`, values: { ...initialValues } },
    ]);
    setFormCount((prevCount) => prevCount + 1);
  }, [formCount, initialValues, title]);

  const removeForm = useCallback((id: string) => {
    setForms((prevForms) => prevForms.filter((form) => form.id !== id));
  }, []);

  const debouncedUpdate = useCallback(
    debounce((id: string, newValues: any) => {
      setForms((prevForms) =>
        prevForms.map((form) =>
          form.id === id ? { ...form, values: newValues } : form
        )
      );
    }, 300),
    []
  );

  useEffect(() => {
    if (fetchFormValues) {
      callbackSubmit(title, forms);
    }
  }, [fetchFormValues]);

  return (
    <div>
      <div className="flex flex-row justify-between p-4">
        {title && <h2 className="px-2">{title}</h2>}
        <Button
          variant={"transparent"}
          onClick={extendForm}
          className="mr-auto"
        >
          <FaPlus /> {title}
        </Button>
      </div>
      <div
        className={cn(
          "bg-primary-foreground p-4 rounded-xl gap-5 flex flex-col justify-between items-end",
          className
        )}
      >
        {forms.map((form, index) => (
          <div className="w-full flex flex-col gap-5" key={form.id}>
            <FormikWrapper
              id={form.id}
              values={form.values}
              validationSchema={validationSchema}
              fields={fields}
              updateValues={(newValues) => debouncedUpdate(form.id, newValues)}
              removeForm={
                forms.length > 1 ? () => removeForm(form.id) : undefined
              }
              title={forms[0].id === form.id ? title : undefined}
              className={wrapperClassName}
            />
            <div className="flex flex-col">
              <Button
                variant={"info"}
                className={cn("w-24 mx-2 flex", {
                  "order-first": childrenClassName == "order-last",
                  "order-last": childrenClassName != "order-last",
                })}
                onClick={() => {
                  console.log("hi");
                }}
              >
                ثبت
              </Button>
              <div className={childrenClassName}> {children && children}</div>
            </div>
            {index != forms.length - 1 ? (
              <div className="w-full h-[0.5px] bg-border/20"></div>
            ) : (
              <></>
            )}
          </div>
        ))}

        {/* <Button variant={"transparent"} onClick={extendForm} className="mr-auto">
        <FaPlus /> {title}
      </Button> */}
      </div>
    </div>
  );
}

interface FormikWrapperInterface {
  id: string;
  values: any;
  validationSchema: any;
  fields: FormMakerInterface["fields"];
  updateValues: (values: any) => void;
  removeForm?: () => void;
  title?: string;
  className?: string;
}

function FormikWrapper({
  id,
  values,
  validationSchema,
  fields,
  updateValues,
  removeForm,
  //title,
  className,
}: FormikWrapperInterface) {
  const formik = useFormik({
    initialValues: values,
    validationSchema,
    onSubmit: () => {},
  });

  useEffect(() => {
    updateValues(formik.values);
  }, [formik.values, updateValues]);

  return (
    <div key={id} className="w-full">
      <div className="border py-4 px-2 rounded-lg gap-6 flex flex-col w-full">
        {/* {title && <h2 className="px-2">{title}</h2>}  */}

        <FormMaker
          form={formik}
          fields={
            removeForm
              ? [
                  ...fields,
                  {
                    component: "non-field",
                    key: "delete",
                    children: (
                      <Button variant={"transparent"} onClick={removeForm}>
                        <Image
                          src={"/icons/trash.png"}
                          alt="delete the item"
                          width={28}
                          height={28}
                        />
                      </Button>
                    ),
                    className: "w-full md:w-1/2 lg:w-1/4",
                  },
                ]
              : [...fields]
          }
          className={cn("w-full p-0 flex flex-row-reverse", className)}
        />
      </div>
    </div>
  );
}
