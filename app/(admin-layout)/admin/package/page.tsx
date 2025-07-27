"use client";
import { getPackage } from "@/api/admin";

import PackageContainer from "@/components/admin/package-container";

import Breadcrumb from "@/components/shared/breadcrumb";
import Title from "@/components/shared/title";
import { useQuery } from "@tanstack/react-query";
import { CategoryDataInterface, CategoryInterface } from "../category/page";
import { formatPrice } from "@/lib/utils";
import { fetchCurrencies } from "@/store/currency-slice";
import { useEffect } from "react";
import { useDispatch } from "react-redux";
export interface PackageDataInterface {
  id: number;
  title: string;
  description: string;
  price: string;
  currency: number;
}
export interface PackageInterface {
  id: number;
  list: {
    label: string;
    value: string;
  }[];
  data: PackageDataInterface;
  categoryList: CategoryInterface[];
}

export default function Package() {
  const { data: packageData } = useQuery({
    queryKey: ["packageData"],
    queryFn: async () => await getPackage(),
  });
  const { packageList } = getData(packageData);
  const dispatch = useDispatch<any>();
  useEffect(() => {
    dispatch(fetchCurrencies());
  }, [dispatch]);
  return (
    <main className="flex flex-col">
      <Title label="پکیج" />

      <Breadcrumb
        list={[
          {
            label: "ادمین",
            link: "/",
          },
          {
            label: "پکیج",
          },
        ]}
      />

      <PackageContainer packageList={packageList} />
    </main>
  );
}

function getData(packageData: any) {
  const packageList: PackageInterface[] = packageData?.data?.map(
    (item: any) => ({
      id: item.id,
      list: [
        { label: "نام", value: item.title },
        { label: "توضیحات", value: item.description },
        {
          label: "قیمت",
          value: formatPrice(item.price) + " " + item?.currency?.name,
        },
      ],
      data: {
        id: item.id,
        title: item.title,
        description: item.description,
        price: formatPrice(item.price),
        currency: item?.currency?.id,
      },
      categoryList: item?.packageCategories?.map((category: any) => ({
        id: category.id,
        list: [
          { label: "نام", value: category.name },
          {
            label: "قیمت",
            value: formatPrice(category.price) + " " + category?.currency?.name,
          },
          { label: "توضیحات", value: category.description },
        ],
        data: {
          id: category.id,
          name: category.name,
          price: category.price,
          description: category.description,
          currency: category?.currency?.id,
          packages: category?.packages?.map((pkg: any) => ({
            label: pkg.title,
            value: pkg.id,
          })),
        },
        packageUnitList: category?.units?.map((unit: any) => ({
          id: unit.id,
          list: [
            { label: "نام", value: unit.name },
            { label: "قیمت", value: unit.price },
            { label: "توضیحات", value: unit.description },
            { label: "نوع فروش واحد", value: unit?.unitType },
            { label: "مدل فروش واحد", value: unit?.unitModel },
            {
              label: "مدت زمان امکان تعامل (روز)",
              value: unit?.enabledDurationInDays,
            },
            {
              label: "مدت زمان امکان نمایش (روز)",
              value: unit?.showDurationInDays,
            },
            { label: "تعداد", value: unit?.countUnit },
            ,
          ],
          data: {
            id: unit.id,
            name: unit.name,
            price: formatPrice(unit.price),
            description: unit?.description,
            countUnit: unit?.countUnit,
            currency: unit?.currency?.id,
            showDurationInDays: unit?.showDurationInDays,
            enabledDurationInDays: unit?.enabledDurationInDays,
            unitModel: unit?.unitModel,
            unitType: unit?.unitType,
            categories: unit?.packageCategories.map((pkg: any) => ({
              label: pkg?.name,
              value: pkg?.id,
            })),
          },
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
                  {
                    label: "الگو آدرس",
                    value: feature?.urlPattern?.join(", "),
                  },
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
      })),
    })
  );

  return { packageList };
}
