"use client";

import PackageContainer from "@/components/role-management/package-container";
import { roleManagementData } from "@/constants/role-management";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

export default function RoleManagemant() {
  const queryClient = useQueryClient();

  return (
    <main className="flex bg-background-active h-screen flex-col lg:flex-row justify-center lg:justify-between">
      {" "}
      {roleManagementData.map((item) => {
        const { data } = useQuery({
          queryKey: [item.key],
          queryFn: item.getData,
        });
        const result = data?.data?.length > 0 ? item.mapData(data?.data) : [];
        const editResult=data?.data?.length > 0 ? item.mapEditData(data?.data) : [];
        const { mutate: addDataHandler } = useMutation({
          mutationFn: item.addData,
          onSuccess: () =>
            queryClient.invalidateQueries({ queryKey: [item.key] }),
        });
        const { mutate: deleteDataHandler } = useMutation({
          mutationFn: item.deleteData,
          onSuccess: () =>
            queryClient.invalidateQueries({ queryKey: [item.key] }),
        });
        const { mutate: editDataHandler } = useMutation({
          mutationFn: item.editData,
          onSuccess: () =>
            queryClient.invalidateQueries({ queryKey: [item.key] }),
        });

        return (
          <PackageContainer
            key={item.key}
            title={item.title}
            data={result}
            editData={editResult}
            fields={item.fields}
            onSubmit={(data: any, reset: any) => {
              addDataHandler(data);
              reset();
            }}
            onDelete={(value:number)=>{deleteDataHandler(value)}}
            initialValues={item.initialValues}
            createSubmitionData={item.createSubmitionData}
            editFields={item.editFields}
            onEdit={(value: number, data: any) => { editDataHandler({ value:value, data:data})}}
          />
        );
      })}
    </main>
  );
}
