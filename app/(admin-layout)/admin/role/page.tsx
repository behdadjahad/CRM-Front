"use client";
import { getRole } from "@/api/admin";
import RoleContainer from "@/components/admin/role/role-container";
import Breadcrumb from "@/components/shared/breadcrumb";
import Title from "@/components/shared/title";
import { useQuery } from "@tanstack/react-query";
import { PermissionInterface } from "../permission/page";
export interface RoleInterface {
  id: number;
  list: {
    label: string;
    value: string;
  }[];
  data: RoleDataInterface;
  permissionList: PermissionInterface[];
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
    permissionList: item?.permissions?.map((permission: any) => ({
      id: permission.id,
      list: [
        { label: "نام", value: permission.name },
        { label: "توضیحات", value: permission.description },
      ],
      data: {
        id: permission.id,
        name: permission.name,
        description: permission.description,
      },
    })),
  }));
  return { roleList };
}
