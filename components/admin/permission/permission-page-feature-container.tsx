
import { Button } from "@/components/ui/button";

import { useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { editPackageUnit, editPermission } from "@/api/admin";

import PermissionPageSubTable from "../tables/permission-page-sub-table";
interface PermissionPageFeatureContainerInterface {
  pageList: any[];
  permissionId: number;
  subTable: "permission" | "unit";
}
export default function PermissionPageFeatureContainer({
  pageList,
  permissionId,
  subTable,
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
      queryClient.invalidateQueries({
        queryKey: ["roleData"],
      });
      queryClient.invalidateQueries({
        queryKey: ["packageUnitData"],
      });
    },
  });
  const { mutate: editUnitData } = useMutation({
    mutationFn: ({ id, data }: { id: number; data: any }) => {
      return editPackageUnit(id, data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["packageUnitData"],
      });
    },
  });
  function editDataHandler(permissionData: any) {
    const data = {
      accessesJson: permissionData,
    };
    switch (subTable) {
      case "permission":
        editPermissionData({ id: permissionId, data: data });
        break;
      case "unit":
        editUnitData({ id: permissionId, data: data });
        break;
      default:
        return;
    }
  }

  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center justify-between">
        <div>لیست صفحات</div>
        <Button
          className="border-none flex justify-end w-fit"
          variant={"info"}
          onClick={() => {
            editDataHandler(permissionData);
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
