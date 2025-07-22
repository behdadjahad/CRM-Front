"use client";
import { getPackageUnit } from "@/api/admin";
import PackageUnitContainer from "@/components/admin/package-unit/package-unit-container";
import Breadcrumb from "@/components/shared/breadcrumb";
import Title from "@/components/shared/title";
import { formatPrice } from "@/lib/utils";
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
  currency: number;
  unitType: string;
  unitModel: string;
  enabledDurationInDays: number;
  showDurationInDays: number;
  countUnit: number;
}
export interface PackageUnitInterface {
  id: number;
  list: {
    label: string;
    value: string;
  }[];
  data: PackageUnitDataInterface;

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
        {
          label: "قیمت",
          value: formatPrice(item.price) + " " + item?.currency?.name,
        },
        { label: "توضیحات", value: item?.description },

        { label: "نوع فروش واحد", value: item?.unitType },
        { label: "مدل فروش واحد", value: item?.unitModel },
        {
          label: "مدت زمان امکان تعامل (روز)",
          value: item?.enabledDurationInDays,
        },
        {
          label: "مدت زمان امکان نمایش (روز)",
          value: item?.showDurationInDays,
        },
        { label: "تعداد", value: item?.countUnit },
      ],
      data: {
        id: item.id,
        name: item.name,
        price: formatPrice(item.price),
        description: item.description,
        currency: item?.currency?.id,
      },
    })
  );

  return { packageUnitList };
}
