"use client";
import { getPackageCategory } from "@/api/admin";
import CategoryContainer from "@/components/admin/category/category-container";

import Breadcrumb from "@/components/shared/breadcrumb";
import Title from "@/components/shared/title";
import { useQuery } from "@tanstack/react-query";
import { PackageUnitDataInterface} from "../package-unit/page";
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
      },

      packageUnitList: item?.units?.map((unit: any) => ({
        id: unit.unit.id,
        list: [
          { label: "نام", value: unit.unit.name },
          { label: "قیمت", value: unit.unit.price },
          { label: "توضیحات", value: unit.unit.description },
          { label: "نوع فروش واحد", value: unit.unit.unitType },
          { label: "مدل فروش واحد", value: unit.unit.unitModel },
          {
            label: "مدت زمان امکان تعامل (روز)",
            value: unit.unit.enabledDurationInDays,
          },
          {
            label: "مدت زمان امکان نمایش (روز)",
            value: unit.unit.showDurationInDays,
          },
          { label: "تعداد", value: unit.unit.countUnit },
        ],
        data: {
          id: item.id,
          name: item.name,
          price: formatPrice(item.price),
          unitType:unit.unit.unitType,
          unitModel:unit.unit.unitModel,
          enabledDurationInDays:unit.unit.enabledDurationInDays,
          showDurationInDays:unit.unit.showDurationInDays,
          countUnit:unit.unit.countUnit,
          description: item.description,
          currency: item?.currency?.id,
        },
      })),
    })
  );

  return { categoryList };
}
