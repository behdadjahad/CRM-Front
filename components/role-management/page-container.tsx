"use client";
import { useFormik } from "formik";
import FormMaker, { FieldType } from "../shared/form-maker";

import { Button } from "../ui/button";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { addPage, getPage } from "@/api/role-management";
import { useEffect, useState } from "react";
import PageCard from "./page-card";
export interface PageContainerInterface {
  title: string;
  fields: any[];
  initialValues: {
    title: string;
    code: string;
    url: string;
  };
  editFields: any[];
}
export default function PageContainer({
  title,
  initialValues,
  fields,
  editFields,
}: PageContainerInterface) {
  const queryClient = useQueryClient();
  const [pageList, setPageList] = useState<any[]>([]);
  const [checkedPages, setCheckedPages] = useState<number[]>([]);
  const { data: page } = useQuery({
    queryKey: ["page"],
    queryFn: async () => await getPage(),
  });

  useEffect(() => {
    if (page && page?.data?.length > 0) {
      const pages = page?.data?.map((item: any) => ({
        id: item.id,
        list: [
          { label: "عنوان", value: item.title },
          { label: "کد", value: item.code },
          { label: "آدرس", value: item.url },
        ],
        editData: {
          title: item.title,
          code: item.code,
          url: item.url,
        },
      }));
      setPageList(pages);
    }
  }, [page]);
  const formik = useFormik({
    initialValues: initialValues,
    onSubmit: () => {},
  });
  const { mutate: submitPageData } = useMutation({
    mutationFn: (data: any) => {
      return addPage(data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["page"],
      });
    },
  });

  function submit(values: any) {
    console.log(values);
    const data = {
      title: values.title,
      code: values.code,
      url: values.url,
    };
    submitPageData(data);
  }
  return (
    <div className="w-full flex flex-col gap-4 p-3 rounded-md">
      <h2>{title}</h2>
      <div className="w-full">
        <FormMaker
          form={formik}
          fields={[
            ...fields,
            {
              component: "non-field",
              key: "actions",
              children: (
                <Button
                  variant="info"
                  onClick={() => {
                    submit(formik.values);
                  }}
                >
                  ثبت
                </Button>
              ),
              className: "w-full md:w-1/6 flex items-start",
            },
          ]}
          className="w-full flex flex-row"
        />
      </div>
      <div className="w-full flex flex-col md:grid md:grid-cols-2  gap-4">
        {pageList.map((page: any, index: number) => (
          <PageCard key={page.id} {...page} editFields={editFields} />
        ))}
      </div>
    </div>
  );
}
