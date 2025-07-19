import { PageFeatureInterface } from "@/app/(admin-layout)/admin/page/page";
import { cn } from "@/lib/utils";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Fragment } from "react";
interface FeatureSelectionTableInterface {
    featureList: PageFeatureInterface[];
    onToggleFeature: (featureId: number, field: "show" | "enabled") => void;
     featureStatus: {
    [featureId: number]: { show: boolean; enabled: boolean };
  };
}

export default function FeatureSelectionTable({
    featureList,
    onToggleFeature,
    featureStatus
}: FeatureSelectionTableInterface) {
  console.log(featureList);
  return (
    <Table>
      <TableHeader>
        <TableRow>
          {featureList?.[0]?.list?.map((col: any, idx: number) => (
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
        </TableRow>
      </TableHeader>
      <TableBody>
        {featureList?.map((feature: any, rowIndex) => (
          <Fragment key={feature?.id}>
            <TableRow
              className="border border-gray-200 bg-card"
              key={feature.id}
            >
              {feature?.list?.map((cell: any, cellIndex: number) => (
                <TableCell
                  key={cellIndex}
                  className="text-center text-xs border"
                >
                  {cell.value}
                </TableCell>
              ))}
              <TableCell className="text-center text-xs border">
                <div className="flex flex-row gap-2 items-center justify-center">
                  {" "}
                  <Button
                    variant={"transparent"}
                    className={cn(
                      "cursor-pointer text-sm font-semibold border h-9 rounded-md flex items-center justify-center text-subtitle/80 py-4 px-8 bg-gray-50",
                        {
                          "border-aqua-mute text-aqua-active":
                            featureStatus?.[feature?.data?.id]?.show,
                        }
                    )}
                    onClick={() => onToggleFeature(feature.data.id, "show")}
                  >
                    show
                  </Button>
                  <Button
                    variant={"transparent"}
                    className={cn(
                      "cursor-pointer text-sm font-semibold border h-9 rounded-md flex items-center justify-center text-subtitle/80 py-4 px-8 bg-gray-50",
                        {
                          "border-aqua-mute text-aqua-active":
                             featureStatus?.[feature?.data?.id]?.enabled,
                        }
                    )}
                    onClick={() => onToggleFeature(feature.data.id, "enabled")}
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
