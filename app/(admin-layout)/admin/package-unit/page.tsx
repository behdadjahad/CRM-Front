"use client";
import { getPackageUnit } from "@/api/admin";
import PackageUnitContainer from "@/components/admin/package-unit/package-unit-container";
import Breadcrumb from "@/components/shared/breadcrumb";
import Title from "@/components/shared/title";
import { fetchCurrencies } from "@/store/currency-slice";
import { useQuery } from "@tanstack/react-query";
import { useEffect } from "react";
import { useDispatch } from "react-redux";
export interface UnitCostInterface {
  id: number;
  list: {
    label: string;
    value: string;
  }[];
  data: UnitCostDataInterface;
}
export interface UnitCostDataInterface {
  id: number;
  title: string;
  description: string;
  unitType: string;
  unitModel: string;
  enabledDurationInDays: number;
  showDurationInDays: number;
  countUnit: number;
  currency: number;
  price: number;
}
export interface PackageUnitDataInterface {
  id: number;
  name: string;
  description: string;
  price: string;
}
export interface PackageUnitInterface {
  id: number;
  list: {
    label: string;
    value: string;
  }[];
  data: PackageUnitDataInterface;
  unitCosts: UnitCostInterface[];
}

export default function PackageUnit() {
  const dispatch = useDispatch<any>();
  useEffect(() => {
    dispatch(fetchCurrencies());
  }, [dispatch]);

  const { data: packageUnitData } = useQuery({
    queryKey: ["packageUnitData"],
    queryFn: async () => await getPackageUnit(),
  });
  const { packageUnitList } = getData(packageUnitData);
  return (
    <main>
      <Title label="واحد پکیج" />

      <Breadcrumb
        list={[
          {
            label: "ادمین",
            link: "/",
          },
          {
            label: "واحد پکیج",
          },
        ]}
      />
      <PackageUnitContainer packageUnitList={packageUnitList} />
    </main>
  );
}
function getData(packageUnitData: any) {
  const packageUnitList: PackageUnitInterface[] = packageUnitData?.data?.map(
    (item: any) => ({
      id: item.id,
      list: [
        { label: "نام", value: item.name },
        { label: "قیمت", value: item.price },
        { label: "توضیحات", value: item.description },
      ],
      data: {
        id: item.id,
        name: item.name,
        price: item.price,
        description: item.description,
      },
      unitCosts: item?.unitCosts?.map((cost: any) => ({
        id: cost.id,
        list: [
          { label: "عنوان", value: cost.title },
          { label: "توضیحات", value: cost.description },
          { label: "هزینه", value: cost.price },
          { label: "نوع فروش واحد", value: cost.unitType },
          { label: "مدل فروش واحد", value: cost.unitModel },
          {
            label: "مدت زمان امکان تعامل (روز)",
            value: cost.enabledDurationInDays,
          },
          {
            label: "مدت زمان امکان نمایش (روز)",
            value: cost.showDurationInDays,
          },
          { label: "تعداد", value: cost.countUnit },
        ],
        data: {
          id: cost.id,
          title: cost.title,
          description: cost.description,
          unitType: cost.unitType,
          unitModel: cost.unitModel,
          enabledDurationInDays: cost.enabledDurationInDays,
          showDurationInDays: cost.showDurationInDays,
          countUnit: cost.countUnit,
          price: cost.price,
          currency: cost.currencyId,
        },
      })),
    })
  );

  return { packageUnitList };
}
