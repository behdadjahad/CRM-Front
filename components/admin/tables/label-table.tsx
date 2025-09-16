import {
  LabelDataInterface,
  LabelInterface,
} from "@/app/(admin-layout)/admin/label/page";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Fragment, useState } from "react";
import { FaChevronDown, FaChevronUp } from "react-icons/fa";
import DeleteConfirmation from "../delete-confirmation";
import EditableForm from "../forms/editable-form";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { deleteLabel, editLabel } from "@/api/admin";
import {
  createFormFields,
  formDataInterface,
} from "@/constants/admin-creation-form-fields";
import AddPackageUnitToLabel from "../package-unit/add-package-unit-to-label";
export interface LabelTableInterface {
  labelList: LabelInterface[];
}

export default function LabelTable({ labelList }: LabelTableInterface) {
  const { labelEditFormData } = getData("label");
  const [expandedRows, setExpandedRows] = useState<number[]>([]);
  const queryClient = useQueryClient();
  const toggleRow = (index: number) => {
    setExpandedRows((prev) =>
      prev.includes(index) ? prev.filter((i) => i !== index) : [...prev, index]
    );
  };
  const { mutate: deleteLabelHandler } = useMutation({
    mutationFn: (id: number) => {
      return deleteLabel(id);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["labelData"],
      });
    },
  });
  const { mutate: editLabelHandler } = useMutation({
    mutationFn: ({ id, data }: { id: number; data: any }) => {
      return editLabel(id, data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["labelData"],
      });
    },
  });
  function editHandler(values: LabelDataInterface) {
    const data = {
      name: values.name,
      description: values.description,
    };
    editLabelHandler({
      id: values.id,
      data: data,
    });
  }
  return (
    <Table>
      <TableHeader>
        <TableRow>
          {labelList?.[0]?.list.map((col, idx) => (
            <TableHead
              key={idx}
              className="text-center text-xs bg-card border font-bold"
            >
              {col.label}
            </TableHead>
          ))}
          <TableHead className="text-center text-xs bg-card border font-bold">
            عملیات
          </TableHead>
          <TableHead className="text-center text-xs bg-card border font-bold" />
        </TableRow>
      </TableHeader>

      <TableBody>
        {labelList?.map((label, rowIndex) => (
          <Fragment key={label.id}>
            <TableRow className="border border-gray-200 bg-card">
              {label.list.map((cell, cellIndex) => (
                <TableCell
                  key={cellIndex}
                  className="text-center text-xs border"
                >
                  {cell.value}
                </TableCell>
              ))}
              <TableCell className="text-center text-xs border">
                <div className="flex items-center gap-4 w-full justify-center">
                  <DeleteConfirmation
                    onDelete={() => {
                      deleteLabelHandler(label.id);
                    }}
                  />
                  <EditableForm
                    fields={labelEditFormData.fields}
                    initialValues={label.data}
                    onEditForm={editHandler}
                  />
                </div>
              </TableCell>
              <TableCell className="text-center border">
                <Button
                  className="border-none p-0"
                  onClick={() => toggleRow(rowIndex)}
                >
                  {expandedRows.includes(rowIndex) ? (
                    <FaChevronUp />
                  ) : (
                    <FaChevronDown />
                  )}
                </Button>
              </TableCell>
            </TableRow>

            {expandedRows.includes(rowIndex) && (
              <TableRow className="bg-gray-100">
                <TableCell
                  colSpan={label.list.length + 2}
                  className="text-sm text-gray-700 p-4"
                >
                  <div className="flex flex-col gap-2">
                    <div className="flex items-center justify-between">
                      <div>لیست واحد پکیج</div>

                      <AddPackageUnitToLabel labelId={label?.id} />
                    </div>

                    {/* {pkg.categoryList.length > 0 ? (
                      <CategoryTable
                        categoryList={pkg?.categoryList}
                        isPackageSubTable={true}
                        packageId={pkg?.id}
                      />
                    ) : (
                      <NoData />
                    )} */}
                  </div>
                </TableCell>
              </TableRow>
            )}
          </Fragment>
        ))}
      </TableBody>
    </Table>
  );
  function getData(formType: string) {
    const editFormData: formDataInterface = createFormFields(formType);
    const labelEditFormData = {
      fields: editFormData.fields,
    };

    return { labelEditFormData };
  }
}
