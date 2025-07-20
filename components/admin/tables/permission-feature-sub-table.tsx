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
import { Fragment } from "react";
interface PermissionFeatureSubTableInterface {
  featureList: any[];
}
export default function PermissionFeatureSubTable({
  featureList,
}: PermissionFeatureSubTableInterface) {
  return (
    <Table>
      <TableHeader>
        <TableRow>
          {featureList?.[0]?.list.map((col: any, idx: number) => (
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
        </TableRow>
      </TableHeader>

      <TableBody>
        {featureList?.map((page, rowIndex) => (
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
            </TableRow>
          </Fragment>
        ))}
      </TableBody>
    </Table>
  );
}
