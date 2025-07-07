"use client";
import { useFormik } from "formik";
import FormMaker from "../shared/form-maker";

import PackageCard from "./package-card";
import { Button } from "../ui/button";

export default function PackageContainer({
  title,
  data,
  fields,
  onSubmit,
  initialValues,
  createSubmitionData,
  onDelete,
  editFields,
  onEdit,
  editData,
  packageKey,
  onCheckedChange,
  selectedItems,
}: {
  data: any[];
  title: string;
  fields: any[];
  onSubmit: any;
  initialValues: any;
  createSubmitionData: any;
  onDelete: any;
  editFields: any[];
  onEdit: any;
  editData: any[];
  packageKey: string;
  onCheckedChange: any;
  selectedItems: number[];
}) {
  const formik = useFormik({
    initialValues: initialValues,
    onSubmit: () => {},
  });
  // Track checked items in the container

  const isDropTarget = packageKey === "package";

  return (
    <div className="w-full flex flex-col gap-4">
      <h2>{title}</h2>
      <div className="w-full">
        <FormMaker
          form={formik}
          fields={[
            ...fields,
            {
              component: "non-field",
              key: "actions",
              children: (
                <Button
                  variant="info"
                  onClick={() => {
                    const data = createSubmitionData(formik.values);
                    const reset = () => formik.resetForm();
                    onSubmit(data, reset);
                  }}
                >
                  ثبت
                </Button>
              ),
              className: "w-full md:w-1/6 flex items-start",
            },
          ]}
          className="w-full flex flex-row"
        />
      </div>
      <div className="flex flex-col md:grid md:grid-cols-2 lg:grid-cols-4 gap-4">
        {data &&
          data.map((item, index) => (
            <PackageCard
              key={index}
              data={item}
              title={title}
              onDelete={onDelete}
              editFields={editFields}
              createSubmitionData={createSubmitionData}
              onEdit={onEdit}
              editData={editData[index]}
              packageKey={packageKey}
              selectedItems={selectedItems}
              checked={selectedItems.includes(item.id)}
              isDropTarget={isDropTarget}
              onCheckedChange={(id: number, checked: boolean) => {
                onCheckedChange(checked, id);
              }}
            />
          ))}
      </div>
    </div>
  );
}
