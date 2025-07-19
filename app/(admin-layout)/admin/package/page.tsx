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
    <main>
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
        { label: "قیمت", value: formatPrice(item.price) + " " + item?.currency?.name },
      ],
      data: {
        id: item.id,
        title: item.title,
        description: item.description,
        price: formatPrice(item.price),
        currency:item?.currency?.id
      },
      categoryList: item?.packageCategories?.map((category: any) => ({
        id: category.id,
        list: [
          { label: "نام", value: category.name },
          { label: "قیمت", value: formatPrice(category.price) + " " + category?.currency?.name },
          { label: "توضیحات", value: category.description },
        ],
        data: {
          id: category.id,
          name: category.name,
          price: category.price,
          description: category.description,
          currency: category?.currency?.id,
        },
        packageUnitList: category?.units?.map((unit: any) => ({
          id: unit.unit.id,
          list: [
            { label: "نام", value: unit.unit.name },
            { label: "قیمت", value: unit.unit.price },
            { label: "توضیحات", value: unit.unit.description },
          ],
          unitCostData: {
            id: unit.unitCost.id,
            list: [
              { label: "عنوان", value: unit.unitCost.title },
              { label: "نوع فروش واحد", value: unit.unitCost.unitType },
              { label: "مدل فروش واحد", value: unit.unitCost.unitModel },
              { label: "تعداد", value: unit.unitCost.countUnit },
              { label: "قیمت", value: unit.unitCost.price },
              {
                label: "مدت زمان امکان تعامل (روز)",
                value: unit.unitCost.enabledDurationInDays,
              },
              {
                label: "مدت زمان امکان نمایش (روز)",
                value: unit.unitCost.showDurationInDays,
              },
              { label: "توضیحات", value: unit.unitCost.description },
            ],
          },
        })),
      })),
    })
  );

  return { packageList };
}
