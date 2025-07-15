"use client";
import { getPage } from "@/api/admin";

import Breadcrumb from "@/components/shared/breadcrumb";
import Title from "@/components/shared/title";
import { useQuery } from "@tanstack/react-query";

import PageContainer from "@/components/admin/page/page-container";
import { features } from "process";
export interface pageFeatureInterface {
  id: number;
  list: {
    label: string;
    value: string;
  }[];
  data: PageFeatureDataInterface;
}
export interface PageFeatureDataInterface {
  id: number;
  name: string;
  code: string;
urlPattern: string[];
description: string;
}
export interface PageDataInterface {
  id: number;
  title: string;
  code: string;
  url: string;
}
export interface PageInterface {
  id: number;
  list: {
    label: string;
    value: string;
  }[];
  features: pageFeatureInterface[];
  data: PageDataInterface;
}

export default function Page() {
  const { data: pageData } = useQuery({
    queryKey: ["pageData"],
    queryFn: async () => await getPage(),
  });
  const { pageList } = getData(pageData);

  return (
    <main>
      <Title label="صفحه" />

      <Breadcrumb
        list={[
          {
            label: "ادمین",
            link: "/",
          },
          {
            label: "صفحه",
          },
        ]}
      />

      <PageContainer pageList={pageList} />
    </main>
  );
}

function getData(pageData: any) {
  const pageList: PageInterface[] = pageData?.data?.map((item: any) => ({
    id: item.id,
    list: [
      { label: "عنوان", value: item.title },
      { label: "کد", value: item.code },
      { label: "آدرس", value: item.url },
    ],
    features: item?.features?.map((feature: any) => ({
      id: feature.id,
      list: [
        { label: "نام", value: feature.name },
        { label: "کد", value: feature.code },
        { label: "الگو آدرس", value: feature.urlPattern.join(", ") },
        { label: "توضیحات", value: feature.description },
      ],
      data: {
        id: feature.id,
        name: feature.name,
        code: feature.code,
        urlPattern: feature.urlPattern,
        description: feature.description,
      },

    })),
    data: {
      id: item.id,
      title: item.title,
      code: item.code,
      url: item.url,
    },
  }));

  return { pageList };
}
