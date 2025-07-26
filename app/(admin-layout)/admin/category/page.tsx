"use client";
import { getPackageCategory } from "@/api/admin";
import CategoryContainer from "@/components/admin/category/category-container";

import Breadcrumb from "@/components/shared/breadcrumb";
import Title from "@/components/shared/title";
import { useQuery } from "@tanstack/react-query";
import { PackageUnitDataInterface } from "../package-unit/page";
import { fetchCurrencies } from "@/store/currency-slice";
import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { formatPrice } from "@/lib/utils";

export interface CategoryDataInterface {
  id: number;
  name: string;
  price: string;
  description: string;
  currency: number;
  packages: {
    label: string;
    value: number;
  }[];
}

export interface CategoryInterface {
  id: number;
  list: {
    label: string;
    value: string;
  }[];
  data: CategoryDataInterface;

  packageUnitList: {
    id: number;
    list: {
      label: string;
      value: string;
    }[];
    data: PackageUnitDataInterface;
  }[];
}

export default function PackageCategory() {
  const { data: categoryData } = useQuery({
    queryKey: ["categoryData"],
    queryFn: async () => await getPackageCategory(),
  });
  const { categoryList } = getData(categoryData);
  const dispatch = useDispatch<any>();
  useEffect(() => {
    dispatch(fetchCurrencies());
  }, [dispatch]);
  return (
    <main>
      <Title label="دسته بندی پکیج" />

      <Breadcrumb
        list={[
          {
            label: "ادمین",
            link: "/",
          },
          {
            label: "دسته بندی پکیج",
          },
        ]}
      />
      <CategoryContainer categoryList={categoryList} />
    </main>
  );
}
function getData(categoryData: any) {
  const categoryList: CategoryInterface[] = categoryData?.data?.map(
    (item: any) => ({
      id: item.id,
      list: [
        { label: "نام", value: item.name },
        { label: "قیمت", value: formatPrice(item.price) },
        { label: "توضیحات", value: item.description },
      ],
      data: {
        id: item.id,
        name: item.name,
        price: formatPrice(item.price),
        description: item.description,
        currency: item.currencyId,
        packages: item.packages.map((pkg: any) => ({
          label: pkg.title,
          value: pkg.id,
        })),
      },

      packageUnitList: item?.units?.map((unit: any) => ({
        id: unit.id,
        list: [
          { label: "نام", value: unit.name },
          { label: "قیمت", value: formatPrice(unit.price) },
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
          id: item.id,
          name: item.name,
          price: formatPrice(item.price),
          unitType: unit.unitType,
          unitModel: unit.unitModel,
          enabledDurationInDays: unit.enabledDurationInDays,
          showDurationInDays: unit.showDurationInDays,
          countUnit: unit.countUnit,
          description: unit.description,
          currency: unit?.currency?.id,
          categories: unit?.packageCategories.map((item: any) => ({
            label: item?.name,
            value: item?.id,
          })),
        },
      })),
    })
  );

  return { categoryList };
}
