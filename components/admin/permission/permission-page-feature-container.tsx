import { Button } from "@/components/ui/button";


import {  useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { editPermission } from "@/api/admin";

import PermissionPageSubTable from "../tables/permission-page-sub-table";
interface PermissionPageFeatureContainerInterface {
  pageList: any[];
  permissionId: number;
}
export default function PermissionPageFeatureContainer({
  pageList,
  permissionId,
}: PermissionPageFeatureContainerInterface) {
  const queryClient = useQueryClient();
  const [permissionData, setPermissionData] = useState({});
  const { mutate: editPermissionData } = useMutation({
    mutationFn: ({ id, data }: { id: number; data: any }) => {
      return editPermission(id, data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["permissionData"],
      });
    },
  });
  function editPermissionDataHandler(permissionData: any) {
    const data = {
      accessesJson: permissionData,
    };
    editPermissionData({ id: permissionId, data: data });
  }
  console.log(pageList);


  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center justify-between">
        <div>لیست صفحات</div>
        <Button
          className="border-none flex justify-end w-fit"
          variant={"info"}
          onClick={() => {
            editPermissionDataHandler(permissionData);
          }}
        >
          اعمال تغییرات
        </Button>
      </div>

      <PermissionPageSubTable
        pageList={pageList}
        onDataGenerated={(data) => {
          setPermissionData(data);
        }}
      />
    </div>
  );
}
