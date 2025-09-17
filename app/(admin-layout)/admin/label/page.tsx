"use client";

import { getLabel } from "@/api/admin";
import LabelContainer from "@/components/admin/label/label-container";
import Breadcrumb from "@/components/shared/breadcrumb";
import Title from "@/components/shared/title";
import { useQuery } from "@tanstack/react-query";
import { PackageUnitInterface } from "../package-unit/page";
import { formatPrice } from "@/lib/utils";
export interface LabelInterface {
  id: number;
  list: {
    label: string;
    value: string;
  }[];
  data: LabelDataInterface;
  packageUnitList: PackageUnitInterface[];
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

    packageUnitList: label?.packageUnits?.map((unit: any) => ({
      id: unit.id,
      list: [
        { label: "نام", value: unit.name },
        {
          label: "قیمت",
          value:
            formatPrice(unit.price) +
            " " +
            (unit?.currency?.name ? unit?.currency?.name : ""),
        },
        { label: "توضیحات", value: unit.description },
        { label: "نوع فروش واحد", value: unit.unitType },
        { label: "مدل فروش واحد", value: unit.unitModel },
        {
          label: "مدت زمان امکان تعامل (روز)",
          value: unit.enabledDurationInDays,
        },
        {
          label: "مدت زمان امکان نمایش (روز)",
          value: unit.showDurationInDays,
        },
        { label: "تعداد", value: unit.countUnit },
      ],
      data: {
        id: unit.id,
        name: unit.name,
        price: formatPrice(unit.price),
        unitType: unit.unitType,
        unitModel: unit.unitModel,
        enabledDurationInDays: unit.enabledDurationInDays,
        showDurationInDays: unit.showDurationInDays,
        countUnit: unit.countUnit,
        description: unit.description,
        currency: unit?.currency?.id,
        categories: unit?.packageCategories.map((ctgry: any) => ({
          label: ctgry?.name,
          value: ctgry?.id,
        })),
      },
      pageList: unit?.accessesJson?.pages?.map((page: any) => ({
        id: page.pageId,
        list: [
          { label: "عنوان", value: page?.title },
          { label: "کد", value: page?.code },
          { label: "آدرس", value: page?.url },
        ],
        data: {
          id: page?.pageId,
          title: page?.title,
          code: page?.code,
          url: page?.url,
          enabled: page?.enabled,
          show: page?.show,
        },
        featureList: page?.features?.map((feature: any) => ({
          id: feature.featureId,
          list: [
            { label: "نام", value: feature.name },
            { label: "کد", value: feature.code },
            // { label: "الگو آدرس", value: feature?.urlPattern?.join(", ") },
            { label: "توضیحات", value: feature.description },
          ],
          data: {
            id: feature.featureId,
            name: feature.name,
            code: feature.code,
            urlPattern: feature.urlPattern,
            description: feature.description,
            show: feature.show,
            enabled: feature.enabled,
          },
        })),
      })),
      permissionList: unit?.permissions?.map((permission: any) => ({
        id: permission.id,
        list: [
          { label: "نام", value: permission.name },
          { label: "توضیحات", value: permission.description },
        ],
        data: {
          id: permission.id,
          name: permission.name,
          description: permission.description,
          packageUnits: permission?.packageUnits?.map((pkg: any) => ({
            label: pkg?.name,
            value: pkg?.id,
          })),
          roles: permission?.roles?.map((role: any) => ({
            label: role?.name,
            value: role?.id,
          })),
        },
        pageList: permission?.accessesJson?.pages?.map((page: any) => ({
          id: page.pageId,
          list: [
            { label: "عنوان", value: page?.title },
            { label: "کد", value: page?.code },
            { label: "آدرس", value: page?.url },
          ],
          data: {
            id: page?.pageId,
            title: page?.title,
            code: page?.code,
            url: page?.url,
            enabled: page?.enabled,
            show: page?.show,
          },
          featureList: page?.features?.map((feature: any) => ({
            id: feature.featureId,
            list: [
              { label: "نام", value: feature.name },
              { label: "کد", value: feature.code },
              { label: "الگو آدرس", value: feature?.urlPattern?.join?.(", ") },
              { label: "توضیحات", value: feature.description },
            ],
            data: {
              id: feature.featureId,
              name: feature.name,
              code: feature.code,
              urlPattern: feature.urlPattern,
              description: feature.description,
              show: feature.show,
              enabled: feature.enabled,
            },
          })),
        })),
      })),
    })),
  }));

  return { labelList };
}
