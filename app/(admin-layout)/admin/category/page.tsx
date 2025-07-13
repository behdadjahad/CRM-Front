"use client";
import { getPackageCategory } from "@/api/admin";
import CategoryContainer from "@/components/admin/category/category-container";
import CategoryTable from "@/components/admin/tables/category-table";
import Breadcrumb from "@/components/shared/breadcrumb";
import Title from "@/components/shared/title";
import { useQuery } from "@tanstack/react-query";
import { PackageUnitInterface } from "../package-unit/page";

export interface CategoryDataInterface {
  id: number;
  name: string;
  price: string;
  description: string;
}

export interface CategoryInterface {
  id: number;
  list: {
    label: string;
    value: string;
  }[];
  data: CategoryDataInterface;
  // You can add unitList here later for next nested level
  packageUnitList: PackageUnitInterface[];
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
        { label: "قیمت", value: item.price },
        { label: "توضیحات", value: item.description },
      ],
      data: {
        id: item.id,
        name: item.name,
        price: item.price,
      },
      packageUnitList: item?.packageCategories?.units?.map((unit: any) => ({
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
