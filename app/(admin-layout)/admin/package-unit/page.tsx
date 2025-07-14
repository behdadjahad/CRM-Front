"use client";
import { getPackageUnit } from "@/api/admin";
import PackageUnitContainer from "@/components/admin/package-unit/package-unit-container";
import Breadcrumb from "@/components/shared/breadcrumb";
import Title from "@/components/shared/title";
import { fetchCurrencies } from "@/store/currency-slice";
import { useQuery } from "@tanstack/react-query";
import { useEffect } from "react";
import { useDispatch } from "react-redux";
export interface PackageUnitDataInterface {
  id: number;
  name: string;
  description: string;
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
        { label: "توضیحات", value: item.description },
      ],
      data: {
        id: item.id,
        name: item.name,
        description: item.description,
      },
    })
  );

  return { packageUnitList };
}
