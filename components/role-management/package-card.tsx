"use client";
import { cn } from "@/lib/utils";
import { Checkbox } from "../ui/checkbox";
import { Button } from "../ui/button";
import Image from "next/image";
import FormMaker from "../shared/form-maker";
import { useFormik } from "formik";
import { useState } from "react";

import {
  useDraggable,
  useDroppable,
  DndContext,
  DragOverlay,
  defaultDropAnimationSideEffects,
} from "@dnd-kit/core";
export interface PackageCardInterface {
  data: {
    list: { label: string; value: string }[];
    id: number;
    packageCategories?: any[];
  };
  title: string;
  onDelete: any;
  editFields: any[];
  createSubmitionData: any;
  onEdit: any;
  editData: any;
  packageKey: string;
  onCheckedChange: any;
  selectedItems: number[];

  checked: boolean;
  isDropTarget: boolean;
}

export default function PackageCard({
  data,
  title,
  onDelete,
  editFields,
  createSubmitionData,
  onEdit,
  editData,
  packageKey,
  onCheckedChange,
  selectedItems,

  checked,
  isDropTarget,
}: PackageCardInterface) {
  const [openEditForm, setOpenEditForm] = useState<boolean>(false);
  const formik = useFormik({
    initialValues: editData,
    onSubmit: () => {},
  });

  const id = data.id.toString();
  const {
    attributes,
    listeners,
    setNodeRef: setDragRef,
    transform,
    isDragging,
  } = useDraggable({
    id,
    disabled: !checked,
    data: () => ({
      ids: selectedItems.length ? selectedItems : [data.id], // fallback if somehow not selected
      fromPackageKey: packageKey,
    }),
  });

  // Use dnd-kit droppable hook
  const { isOver, setNodeRef: setDropRef } = useDroppable({
    id: id,
    data: { acceptFrom: "packageCategory" }, // example
  });

  const setRefs = (node: HTMLElement | null) => {
    setDragRef(node);
    setDropRef(node);
  };

  return (
    <div
      ref={setRefs}
      style={{
        transform: transform
          ? `translate3d(${transform.x}px, ${transform.y}px, 0)`
          : undefined,
        opacity: isDragging ? 0.5 : 1,
        cursor: checked ? "grab" : "default",
        border: isOver ? "2px solid blue" : undefined,
      }}
      {...attributes}
      {...listeners}
      className={cn(
        "flex flex-col w-full bg-card rounded-lg overflow-hidden shadow border p-3 transition-all duration-200"
      )}
    >
      <div className="bg-[linear-gradient(180deg,#0475B5_-65.62%,#253159_100%)] py-2.5 px-3.5 flex items-center justify-between w-full text-primary-foreground border">
        <div className="flex items-center gap-2">
          <span className="text-lg font-bold">{title}</span>
        </div>
      </div>

      <div className="p-3.5 flex flex-col gap-4">
        <div className="flex items-center gap-4">
          {packageKey === "packageCategory" && (
            <div>
              {" "}
              <Checkbox
                checked={checked}
                onCheckedChange={(value: boolean) => {
                  onCheckedChange(data.id, value);
                }}
                onClick={(e) => e.stopPropagation()}
                onPointerDown={(e) => e.stopPropagation()}
              />
            </div>
          )}

          <div className="flex items-start justify-between">
            <div className="flex flex-col gap-1">
              {data &&
                data?.list?.map((item) => (
                  <div
                    key={item?.label + item?.value}
                    className="flex text-xs w-full items-center gap-1"
                  >
                    <span className="text-sm col-span-4 w-24">
                      {item?.label}
                    </span>

                    <span className="col-span-5 font-bold">{item?.value}</span>
                  </div>
                ))}
            </div>
          </div>
        </div>
        <div className="w-full flex items-center justify-end gap-2">
          <Button variant={"transparent"} className="p-0">
            <Image
              src="/icons/trash.png"
              alt=""
              width={1024}
              height={1024}
              className="w-5 h-5"
              onClick={() => {
                onDelete(data?.id);
              }}
            />
          </Button>
          <Button variant={"transparent"} className="p-0">
            <Image
              src="/icons/edit-primary.png"
              alt=""
              width={1024}
              height={1024}
              className="w-4 h-4"
              onClick={() => {
                setOpenEditForm(true);
              }}
            />
          </Button>
        </div>
        {data?.packageCategories &&
          data?.packageCategories.length > 0 &&
          data?.packageCategories.map((category) => (
            <div key={category.id} className="border rounded-lg p-3 flex text-xs gap-2">
              <div>{category.name}</div>
              <div>{category.description}</div>
            </div>
          ))}
        {openEditForm && (
          <div>
            {" "}
            <FormMaker
              form={formik}
              fields={[
                ...editFields,
                {
                  component: "non-field",
                  key: "actions",
                  children: (
                    <div className="flex gap-2">
                      <Button
                        variant="info"
                        onClick={() => {
                          const values = createSubmitionData(formik.values);

                          onEdit(data?.id, values);
                          setOpenEditForm(false);
                        }}
                      >
                        ویرایش
                      </Button>
                      <Button
                        variant="foreground"
                        onClick={() => {
                          setOpenEditForm(false);
                        }}
                      >
                        لغو
                      </Button>
                    </div>
                  ),
                  className: "w-full flex items-end",
                },
              ]}
              className="w-full flex flex-col"
            />
          </div>
        )}
      </div>
    </div>
  );
}
