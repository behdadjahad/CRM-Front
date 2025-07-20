import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { cn } from "@/lib/utils";
import { useQueryClient } from "@tanstack/react-query";
import { Fragment, useState } from "react";
import { FaChevronDown, FaChevronUp } from "react-icons/fa";
import PermissionFeatureSubTable from "./permission-feature-sub-table";
interface PagePermissionSubTableInterface {
  pageList: any[];
}
export default function PermissionPageSubTable({
  pageList,
}: PagePermissionSubTableInterface) {
  const [expandedRows, setExpandedRows] = useState<number[]>([]);
  const queryClient = useQueryClient();
  const toggleRow = (index: number) => {
    setExpandedRows((prev) =>
      prev.includes(index) ? prev.filter((i) => i !== index) : [...prev, index]
    );
  };
  console.log("pageList", pageList);
  return (
    <Table>
      <TableHeader>
        <TableRow>
          {pageList?.[0]?.list.map((col: any, idx: number) => (
            <TableHead
              key={idx}
              className="text-center text-xs bg-card border font-bold"
            >
              {col.label}
            </TableHead>
          ))}
          <TableHead className="text-center text-xs bg-card border font-bold">
            وضعیت
          </TableHead>
          <TableHead className="text-center text-xs bg-card border font-bold">
            لیست ویژگی ها
          </TableHead>
        </TableRow>
      </TableHeader>

      <TableBody>
        {pageList?.map((page, rowIndex) => (
          <Fragment key={page.id}>
            <TableRow className="border border-gray-200 bg-card">
              {page.list.map((cell: any, cellIndex: number) => (
                <TableCell
                  key={cellIndex}
                  className="text-center text-xs border"
                >
                  {cell.value}
                </TableCell>
              ))}
              <TableCell className="text-center text-xs border">
                <div className="flex items-center justify-center gap-2">
                  {" "}
                  <Button
                    variant={"transparent"}
                    className={cn(
                      "text-sm font-semibold border h-9 rounded-md flex items-center justify-center text-subtitle/80 py-4 px-8 bg-gray-50",
                      {
                        "border-aqua-mute text-aqua-active": page.data.show,
                      }
                    )}
                  >
                    show
                  </Button>
                  <Button
                    variant={"transparent"}
                    className={cn(
                      "text-sm font-semibold border h-9 rounded-md flex items-center justify-center text-subtitle/80 py-4 px-8 bg-gray-50",
                      {
                        "border-aqua-mute text-aqua-active": page.data.enabled,
                      }
                    )}
                  >
                    enable
                  </Button>
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
                      <div>لیست ویژگی ها </div>
                    </div>
                    <PermissionFeatureSubTable featureList={page.featureList} />
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
