"use client";

import { getPermission } from "@/api/admin";
import PermissionContainer from "@/components/admin/permission/permission-container";
import Breadcrumb from "@/components/shared/breadcrumb";
import Title from "@/components/shared/title";

import { useQuery } from "@tanstack/react-query";
import { features } from "process";
import { useEffect } from "react";
import { useDispatch } from "react-redux";
export interface PermissionInterface {
  id: number;
  list: {
    label: string;
    value: string;
  }[];
  data: PermissionDataInterface;
  pageList: {
    list: {
      label: string;
      value: string;
    }[];
    data: {
      id: number;
      title: string;
      code: string;
      url: string;
      enabled?: boolean;
      show?: boolean;
    };
  }[];
}
export interface PermissionDataInterface {
  id: number;
  name: string;
  description: string;
  packageUnits: { label: string; value:number}[];
  roles: { label: string; value:number}[]
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
        packageUnits: item?.packageUnits?.map((pkg: any) => ({
          label: pkg?.name,
          value: pkg?.id,
        })),
        roles: item?.roles?.map((role: any) => ({
          label: role?.name,
          value: role?.id,
        })),
      },
      pageList: item?.accessesJson?.pages?.map((page: any) => ({
        id: page.pageId,
        list: [
          { label: "عنوان", value: page?.title },
          { label: "کد", value: page?.code },
          { label: "آدرس", value: page?.url },
        ],
        data: {
          id: page?.pageId,
          title: page?.title,
          code: page?.code,
          url: page?.url,
          enabled: page?.enabled,
          show: page?.show,
        },
        featureList: page?.features?.map((feature: any) => ({
          id: feature.featureId,
          list: [
            { label: "نام", value: feature.name },
            { label: "کد", value: feature.code },
            // { label: "الگو آدرس", value: feature?.urlPattern?.join(", ") },
            { label: "توضیحات", value: feature.description },
          ],
          data: {
            id: feature.featureId,
            name: feature.name,
            code: feature.code,
            urlPattern: feature.urlPattern,
            description: feature.description,
            show: feature.show,
            enabled: feature.enabled,
          },
        })),
      })),
    })
  );

  return { permissionList };
}
