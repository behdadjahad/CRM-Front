"use client";
import { getPackage } from "@/api/admin";
import PackageTable from "@/components/admin/tables/package-table";

import Breadcrumb from "@/components/shared/breadcrumb";
import Title from "@/components/shared/title";
import { useQuery } from "@tanstack/react-query";
export interface PackageDataInterface {
  id: number;
  list: {
    label: string;
    value: string;
  }[];
  categoryList: {
    id: number;
    list: {
      label: string;
      value: string;
    }[];
  }[];
}
export default function Package() {
  const { data: packageData } = useQuery({
    queryKey: ["packageData"],
    queryFn: async () => await getPackage(),
  });
  const { packageList } = getData(packageData);
 
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
      <div className="bg-card flex flex-col justify-between p-6 rounded-md custom-shadow">
        <div className="bg-[linear-gradient(180deg,#0475B5_-65.62%,#1C284F_100%)] rounded-sm p-3 flex items-center justify-between px-6 text-card">
          پکیج
        </div>
        <PackageTable packageList={packageList} />
      </div>
    </main>
  );
}

function getData(packageData: any) {
  const packageList: PackageDataInterface[] = packageData?.data?.map(
    (item: any) => ({
      id: item.id,
      list: [
        { label: "نام", value: item.title },
        { label: "توضیحات", value: item.description },
        { label: "قیمت", value: item.price },
      ],
      categoryList: item?.packageCategories?.map((category:any) => ({
        id: category.id,
        list: [
          { label: "نام", value: category.name },
          { label: "توضیحات", value: category.description },
        ],
      })),
    })
  );

  return { packageList };
}
