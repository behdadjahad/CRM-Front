import React, { useState, useCallback, useEffect } from "react";
import FormMaker, { FormMakerInterface } from "./form-maker";
import { useFormik } from "formik";
import { cn } from "@/lib/utils";

import { Button } from "../ui/button";
import { FaPlus } from "react-icons/fa";
// import { debounce } from "lodash";

export interface FormExtenderInterface {
  fields: FormMakerInterface["fields"];
  name: "accommodation" | "room";
  initialValues: any;
  validationSchema: any;
  title: string;
  className?: string;
  wrapperClassName?: string;
  fetchFormValues: boolean;
  //callbackSubmit: (key: string, data: any[]) => void;
  callbackSubmit: (data: any[], name: string) => void;
  children?: any;
  childrenClassName?: string;
  extenderBtnClassName?: string;
  childrenData?: any;
}

export default function FormExtender({
  title,
  fields,
  initialValues,
  validationSchema,
  className,
  wrapperClassName,
  //fetchFormValues,
  //children,
  callbackSubmit,
  //childrenClassName,
  extenderBtnClassName,
  childrenData,
  name,
}: FormExtenderInterface) {
  const [forms, setForms] = useState<
    { id: string; values: any; children: any[]; name: string }[]
  >([
    {
      id: `${title}-0`,
      values: { ...initialValues },
      name: name,
      children: [],
    },
  ]);

  const [formCount, setFormCount] = useState(1);

  const extendForm = useCallback(() => {
    setForms((prevForms) => [
      ...prevForms,
      {
        id: `${title}-${formCount}`,
        values: { ...initialValues },
        children: [],
        name: name,
      },
    ]);
    setFormCount((prevCount) => prevCount + 1);
  }, [formCount, initialValues, title, name]);

  const removeForm = useCallback((id: string) => {
    setForms((prevForms) => prevForms.filter((form) => form.id !== id));
  }, []);

  // const debouncedUpdate = useCallback(
  //   debounce((id: string, newValues: any) => {
  //     setForms((prevForms) =>
  //       prevForms.map((form) =>
  //         form.id === id ? { ...form, values: newValues } : form
  //       )
  //     );
  //   }, 300),
  //   []
  // );

  // useEffect(() => {
  //   if (fetchFormValues) {
  //     callbackSubmit(title, forms);
  //   }
  // }, [fetchFormValues]);
  function submitFormHandler(data: any, name: string) {
    callbackSubmit(data, name);
  }
  const extendChildren = useCallback(
    (formId: string) => {
      setForms((prevForms) =>
        prevForms.map((form) =>
          form.id === formId
            ? {
                ...form,
                children: [
                  ...form.children,
                  {
                    id: `${formId}-child-${form.children.length}`,
                    values: { ...childrenData.initialValues },
                    name: childrenData.name,
                  },
                ],
              }
            : form
        )
      );
    },
    [forms, childrenData]
  );
  const removeChildrenForm = useCallback((formId: string, childId: string) => {
    setForms((prevForms) =>
      prevForms.map((form) =>
        form.id === formId
          ? {
              ...form,
              children: form.children.filter((child) => child.id !== childId),
            }
          : form
      )
    );
  }, []);
  return (
    <div className="flex flex-col">
      <Button
        variant={"transparent"}
        onClick={extendForm}
        className={cn("mr-auto text-quartiery-active", extenderBtnClassName)}
      >
        <FaPlus /> {"اضافه کردن" + " " + title}
      </Button>

      <div
        className={cn(
          "bg-primary-foreground p-4 rounded-xl gap-5 flex flex-col justify-between",
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
              // updateValues={(newValues) => debouncedUpdate(form.id, newValues)}
              submitForm={(data) => {
                submitFormHandler(data, form.name);
              }}
              removeForm={
                forms.length > 1 ? () => removeForm(form.id) : undefined
              }
              title={title}
              className={wrapperClassName}
              extendChildren={() => {
                extendChildren(form.id);
              }}
              name={form.name}
            />
            <div className="flex">
              {form.children.map((item) => (
                <div key={item.id}>
                  <FormikWrapper
                    id={item.id}
                    values={item.values}
                    fields={childrenData.fields}
                    validationSchema={childrenData.validationSchema}
                    // updateValues={(newValues) =>
                    //   debouncedUpdate(item.id, newValues)
                    // }
                    submitForm={(data) => submitFormHandler(data, item.name)}
                    removeChildrenForm={
                      form.children.length > 0
                        ? () => removeChildrenForm(form.id, item.id)
                        : undefined
                    }
                    title={childrenData.title}
                    className={wrapperClassName}
                    extendChildrenBtnClassName="hidden"
                    name={item.name}
                  />
                </div>
              ))}
            </div>
            {index != forms.length - 1 ? (
              <div className="w-full h-[0.5px] bg-border/20"></div>
            ) : (
              <></>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

interface FormikWrapperInterface {
  id: string;
  name: string;
  values: any;
  validationSchema: any;
  fields: FormMakerInterface["fields"];
  // updateValues: (values: any) => void;
  removeForm?: () => void;
  title?: string;
  className?: string;
  extendChildren?: (id: string) => any;
  extendChildrenBtnClassName?: string;
  removeChildrenForm?: () => void;
  submitForm: (values: any, name: string) => void;
}

function FormikWrapper({
  id,
  values,
  validationSchema,
  fields,
  // updateValues,
  removeForm,
  title,
  className,
  extendChildren,
  extendChildrenBtnClassName,
  removeChildrenForm,
  submitForm,
  name,
}: FormikWrapperInterface) {
  const formik = useFormik({
    initialValues: values,
    validationSchema,
    onSubmit: () => {},
  });
  const [formFields, setFormFields] = useState<
    FormikWrapperInterface["fields"]
  >([]);

  // useEffect(() => {
  //   updateValues(formik.values);
  // }, [formik.values, updateValues]);
  useEffect(() => {
    if (!formik.values.country) return;
    const selectedCountry = formFields.find((field) => field.key === "country");
    const selectedOption = selectedCountry?.options?.find(
      (item) => item.value == formik.values.country
    );

    const updatedFields = fields.map((field) => {
      if (field.key === "city") {
        return {
          ...field,
          options: selectedOption?.cities || [],
        };
      }
      return field;
    });

    setFormFields(updatedFields);
  }, [formik.values.country]);

  useEffect(() => {
    if (!formik.values.city) return;

    const selectedCity = formFields.find((field) => field.key === "city");

    const selectedOption = selectedCity?.options?.find(
      (item) => item.value == formik.values.city
    );

    const updatedFields = fields.map((field) => {
      if (field.key === "hotelName") {
        return {
          ...field,
          options: selectedOption?.hotels || [],
        };
      }
      return field;
    });

    setFormFields(updatedFields);
  }, [formik.values.city]);

  useEffect(() => {
    const findItemWithOptions = fields.find(
      (item) => item.options && item.options.length
    );
    if (findItemWithOptions) setFormFields(fields);
    setFormFields(fields)
  }, [fields]);

  return (
    <div key={id} className="w-full">
      <div className="border py-4 px-2 rounded-lg gap-6 flex flex-col w-full">
        <div className="flex flex-row gap-4 items-center">
          {title && <h2 className="px-2">{title}</h2>}
          <div>
            <Button
              variant={"transparent"}
              onClick={() => {
                extendChildren?.(id);
              }}
              className={cn("mr-auto w-7 h-7 bg-red-400 rounded-full flex items-center justify-center p-0", extendChildrenBtnClassName)}
            >
              <FaPlus className="text-white"/>
            </Button>
          </div>
        </div>

        <FormMaker
          form={formik}
          fields={[
            ...formFields,
            {
              component: "non-field",
              key: "actions",
              children: (
                <div className="flex flex-row items-center gap-2 justify-end w-full">
                  <Button
                    variant="info"
                    onClick={() => {
                      submitForm(formik.values, name);
                    }}
                  >
                    {"ثبت" + " " + title}
                  </Button>
                  {removeForm && (
                    <Button variant="transparent" onClick={removeForm}>
                      {"حذف" + " " + title}
                    </Button>
                  )}
                  {removeChildrenForm && (
                    <Button variant="transparent" onClick={removeChildrenForm}>
                      {"حذف" + " " + title}
                    </Button>
                  )}
                </div>
              ),
              className: "w-full", // Ensures full width for proper alignment
            },
          ]}
          className={cn("w-full p-0", className)}
        />
      </div>
    </div>
  );
}
