"use client";
import { getPackageCategory } from "@/api/admin";
import CategoryTable from "@/components/admin/tables/category-table";
import Breadcrumb from "@/components/shared/breadcrumb";
import Title from "@/components/shared/title";
import { useQuery } from "@tanstack/react-query";

export interface CategoryDataInterface {
  id: number;
  list: {
    label: string;
    value: string;
  }[];
  // You can add unitList here later for next nested level
  unitList?: any[];
}

export default function PackageCategory() {
  const { data: categoryData } = useQuery({
    queryKey: ["categoryData"],
    queryFn: async () => await getPackageCategory(),
  });
  const { categoryList } = getData(categoryData);
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
      <div className="bg-card flex flex-col justify-between p-6 rounded-md custom-shadow">
        <div className="bg-[linear-gradient(180deg,#0475B5_-65.62%,#1C284F_100%)] rounded-sm p-3 flex items-center justify-between px-6 text-card">
          دسته بندی پکیج
        </div>
        <CategoryTable categoryList={categoryList} />
      </div>
    </main>
  );
}
function getData(categoryData: any) {
  const categoryList: CategoryDataInterface[] = categoryData?.data?.map(
    (item: any) => ({
      id: item.id,
      list: [
        { label: "نام", value: item.name },
        { label: "توضیحات", value: item.description },

      ],
      unitList: item?.packageCategories?.map((unit: any) => ({
        id: unit.id,
        list: [
          { label: "نام", value: unit.name },
          { label: "توضیحات", value: unit.description },
        ],
      })),
    })
  );

  return { categoryList };
}
