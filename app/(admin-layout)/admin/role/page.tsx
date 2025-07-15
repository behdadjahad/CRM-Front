"use client";
import { getRole } from "@/api/admin";
import RoleContainer from "@/components/admin/role/role-container";
import Breadcrumb from "@/components/shared/breadcrumb";
import Title from "@/components/shared/title";
import { useQuery } from "@tanstack/react-query";
export interface RoleInterface {
  id: number;
  list: {
    label: string;
    value: string;
  }[];
  data: RoleDataInterface;
}
export interface RoleDataInterface {
  id: number;
  name: string;
  description: string;
}
export default function Role() {
  const { data: roleData } = useQuery({
    queryKey: ["roleData"],
    queryFn: async () => await getRole(),
  });
  const { roleList } = getData(roleData);
  return (
    <main>
      <Title label="نقش" />

      <Breadcrumb
        list={[
          {
            label: "ادمین",
            link: "/",
          },
          {
            label: "نقش",
          },
        ]}
      />
      <RoleContainer roleList={roleList} />
    </main>
  );
}
function getData(roleData: any) {
  const roleList: RoleInterface[] = roleData?.data?.map((item: any) => ({
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
  }));
  return { roleList };
}
