'use client';


import { getPermission } from "@/api/admin";
import PermissionContainer from "@/components/admin/permission/permission-container";
import Breadcrumb from "@/components/shared/breadcrumb";
import Title from "@/components/shared/title";
import { useQuery } from "@tanstack/react-query";
  export interface PermissionInterface {
    id: number;
    list: {
      label: string;
      value: string;
    }[];
    data: PermissionDataInterface;

  }
  export interface PermissionDataInterface {
    id: number;
    name: string;
    description: string;

  }
export default function Permission() {

  const { data: permissionData } = useQuery({
    queryKey: ["permissionData"],
    queryFn: async () => await getPermission(),
  });
  const { permissionList } = getData(permissionData);

  return (
    <main>
      <Title label="دسترسی" />

      <Breadcrumb
        list={[
          {
            label: "ادمین",
            link: "/",
          },
          {
            label: "دسترسی",
          },
        ]}
      />
      <PermissionContainer permissionList={permissionList} />
    </main>
  );
}
function getData(permissionData: any) {
  const permissionList: PermissionInterface[] = permissionData?.data?.map(
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
       
      }
    }))
  return{permissionList}
}