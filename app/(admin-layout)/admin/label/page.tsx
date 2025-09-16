"use client";

import { getLabel } from "@/api/admin";
import LabelContainer from "@/components/admin/label/label-container";
import Breadcrumb from "@/components/shared/breadcrumb";
import Title from "@/components/shared/title";
import { useQuery } from "@tanstack/react-query";
export interface LabelInterface {
  id: number;
  list: {
    label: string;
    value: string;
  }[];
  data: LabelDataInterface;
}
export interface LabelDataInterface {
  id: number;
  name: string;
  description: string;
}
export default function Label() {
  const { data: labelData } = useQuery({
    queryKey: ["labelData"],
    queryFn: async () => await getLabel(),
  });
  const { labelList } = getData(labelData);

  return (
    <main className="flex flex-col">
      <Title label="لیبل" />

      <Breadcrumb
        list={[
          {
            label: "ادمین",
            link: "/",
          },
          {
            label: "لیبل",
          },
        ]}
      />

      <LabelContainer labelList={labelList} />
    </main>
  );
}
function getData(labelData: any) {
  const labelList: LabelInterface[] = labelData?.data?.map((label: any) => ({
    id: label.id,
    list: [
      { label: "نام", value: label.name },
      { label: "توضیحات", value: label.description },
    ],
    data: {
      id: label.id,
      name: label.name,
      description: label.description,
    },
  }));
  return { labelList };
}
