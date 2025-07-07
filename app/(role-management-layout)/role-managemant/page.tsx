"use client";

import PackageContainer from "@/components/role-management/package-container";
import PackageUnitContainer from "@/components/role-management/package-unit-container";
import {
  packageUnitData,
  roleManagementData,
} from "@/constants/role-management";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import { DndProvider } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";
import { DndContext, DragEndEvent } from "@dnd-kit/core";
import { addCategorytoPackage } from "@/api/role-management";
export default function RoleManagemant() {
  const queryClient = useQueryClient();
  const [selectedItems, setSelectedItems] = useState<number[]>([]);
  function checkItemsHandler(checked: boolean, item: number) {
    if (checked) {
      setSelectedItems([...selectedItems, item]);
    } else {
      const updatedSelectedItems = selectedItems.filter(
        (id: number) => id !== item
      );
      setSelectedItems(updatedSelectedItems);
    }
  }
  const { mutate: assignCategoryHandler} = useMutation({
    mutationFn: ({ items, packageId }: { items: any; packageId: number }) => {
      console.log(items,packageId)
      return addCategorytoPackage(items, packageId);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["package"],
      })
      setSelectedItems([])
    }
  });
  function handleDragEnd(event: any) {
    const { active, over } = event;
    if (!over) return;
    const { ids: draggedIds, fromPackageKey } = active.data.current();

    if (fromPackageKey === "packageCategory") {
      assignCategoryHandler({ items: { ids:draggedIds }, packageId: over.id });;
      console.log(over.id);
    }
  }
  return (
    <DndContext onDragEnd={handleDragEnd}>
      <main className="flex bg-background-active h-screen flex-col lg:flex-row justify-center lg:justify-between">
        {" "}
        <div className="w-full flex flex-col gap-4">
          {roleManagementData.map((item) => {
            const { data } = useQuery({
              queryKey: [item.key],
              queryFn: item.getData,
            });
            const result =
              data?.data?.length > 0 ? item.mapData(data?.data) : [];
            const editResult =
              data?.data?.length > 0 ? item.mapEditData(data?.data) : [];
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
                onDelete={(value: number) => {
                  deleteDataHandler(value);
                }}
                initialValues={item.initialValues}
                createSubmitionData={item.createSubmitionData}
                editFields={item.editFields}
                onEdit={(value: number, data: any) => {
                  editDataHandler({ value: value, data: data });
                }}
                packageKey={item.key}
                onCheckedChange={checkItemsHandler}
                selectedItems={selectedItems}
              />
            );
          })}
          {packageUnitData.map((item) => {
            const { data } = useQuery({
              queryKey: [item.key],
              queryFn: item.getData,
            });
            const result =
              data?.data?.length > 0 ? item.mapData(data?.data) : [];
            const editResult =
              data?.data?.length > 0 ? item.mapEditData(data?.data) : [];
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
              <PackageUnitContainer
                key={item.key}
                title={item.title}
                data={result}
                editData={editResult}
                fields={item.fields}
                onSubmit={(data: any, reset: any) => {
                  addDataHandler(data);
                  reset();
                }}
                onDelete={(value: number) => {
                  deleteDataHandler(value);
                }}
                initialValues={item.initialValues}
                createSubmitionData={item.createSubmitionData}
                editFields={item.editFields}
                onEdit={(value: number, data: any) => {
                  editDataHandler({ value: value, data: data });
                }}
                packageKey={item.key}
                onCheckedChange={checkItemsHandler}
                selectedItems={selectedItems}
                subFields={item?.subFields ? item?.subFields : []}
                subInitialValues={
                  item.subInitialValues ? item.subInitialValues : {}
                }
              />
            );
          })}
        </div>
      </main>
    </DndContext>
  );
}
