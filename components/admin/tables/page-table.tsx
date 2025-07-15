import {
  PageDataInterface,
  PageInterface,
} from "@/app/(admin-layout)/admin/page/page";
import { Button } from "@/components/ui/button";
import Image from "next/image";
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
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { deletePage, editPage } from "@/api/admin";
import {
  createFormFields,
  formDataInterface,
} from "@/constants/admin-creation-form-fields";
import EditableForm from "../forms/editable-form";
import AddPageFeatureToPage from "../page/add-page-feature-to-page";
import PageFeatureTable from "./page-feature-table";
export interface PageTableInterface {
  pageList: PageInterface[];
}

export default function PageTable({ pageList }: PageTableInterface) {
  const { pageEditFormData } = getData("page");
  const [expandedRows, setExpandedRows] = useState<number[]>([]);
  const queryClient = useQueryClient();
  const toggleRow = (index: number) => {
    setExpandedRows((prev) =>
      prev.includes(index) ? prev.filter((i) => i !== index) : [...prev, index]
    );
  };
  const { mutate: deletePageHandler } = useMutation({
    mutationFn: (id: number) => {
      return deletePage(id);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["pageData"],
      });
    },
  });
  function deleteHandler(id: number) {
    deletePageHandler(id);
  }
  const { mutate: editPageHandler } = useMutation({
    mutationFn: ({ id, data }: { id: number; data: any }) => {
      return editPage(id, data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["pageData"],
      });
    },
  });
  function editHandler(values: PageDataInterface) {
    const data = {
      title: values.title,
      code: values.code,
      url: values.url,
    };
    editPageHandler({
      id: values.id,
      data: data,
    });
  }
  return (
    <Table>
      <TableHeader>
        <TableRow>
          {pageList?.[0]?.list.map((col, idx) => (
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
        {pageList?.map((page, rowIndex) => (
          <Fragment key={page.id}>
            <TableRow className="border border-gray-200 bg-card">
              {page.list.map((cell, cellIndex) => (
                <TableCell
                  key={cellIndex}
                  className="text-center text-xs border"
                >
                  {cell.value}
                </TableCell>
              ))}
              <TableCell className="text-center text-xs border">
                <div className="flex items-center gap-4 w-full justify-center">
                  <Button
                    className="border-none p-0 text-[##212B36]"
                    onClick={() => {
                      deleteHandler(page.id);
                    }}
                  >
                    <Image
                      src="/icons/trash.png"
                      alt=""
                      width={1024}
                      height={1024}
                      className="w-5 h-5"
                    />
                  </Button>
                  <EditableForm
                    fields={pageEditFormData.fields}
                    initialValues={page.data}
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
                  colSpan={page.list.length + 2}
                  className="text-sm text-gray-700 p-4"
                >
                  <div className="flex flex-col gap-2">
                    <div className="flex items-center justify-between">
                      <div>لیست ویژگی ها</div>
                      <AddPageFeatureToPage pageId={page.id} />
                       
                    </div>
                    <PageFeatureTable pageFeatureList={page.features} />
                  </div>
                </TableCell>
              </TableRow>
            )}
          </Fragment>
        ))}
      </TableBody>
    </Table>
  );
}
function getData(formType: string) {
  const editFormData: formDataInterface = createFormFields(formType);
  const pageEditFormData = {
    fields: editFormData.fields,
  };

  return { pageEditFormData };
}
