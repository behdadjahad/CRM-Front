import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Fragment } from "react";
import { Checkbox } from "../ui/checkbox";

export interface LeadTableInterface {
  leadList: {
    id: number;
    list: {
      label: string;
      value: string;
    }[];
  }[];
}

export default function LeadTable({ leadList }: LeadTableInterface) {
  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead className="text-center bg-white border-none">
            <Checkbox
              onCheckedChange={(checked: boolean) => {
                if (checked) {
                  // const updatedCheckItems = checkedItems?.filter(
                  //   (item: any) => !list?.some((l) => l.id === item.id)
                  // );
                  // dispatch(
                  //   config.setCheckedItems([...updatedCheckItems, ...list])
                  // );
                } else {
                  // const updatedItems = checkedItems?.filter(
                  //   (item: any) => !list?.some((l) => l.id === item.id)
                  // );
                  // dispatch(config.setCheckedItems(updatedItems));
                }
              }}
              checked={false}
            />
          </TableHead>
          {leadList?.[0]?.list.map((col, idx) => (
            <TableHead
              key={idx}
              className="text-center text-xs bg-card border-l font-bold"
            >
              {col.label}
            </TableHead>
          ))}

          <TableHead className="text-center text-xs bg-card border font-bold" />
        </TableRow>
      </TableHeader>
      <TableBody>
        {leadList?.map((lead, rowIndex) => (
          <Fragment key={lead.id}>
            <TableRow className="border border-gray-200 bg-card">
              <TableCell className="flex items-center justify-center">
                <Checkbox
                  onCheckedChange={(checked: boolean) => {
                    // checkItemHandler(item, checked);
                  }}
                  checked={false}
                />
              </TableCell>
              {lead.list.map((cell, cellIndex) => (
                <TableCell key={cellIndex} className="text-center text-xs">
                  {cell.value}
                </TableCell>
              ))}
              <TableCell className="text-center text-xs">
                <div className="flex items-center gap-4 w-full justify-center"></div>
              </TableCell>
            </TableRow>
          </Fragment>
        ))}
      </TableBody>
    </Table>
  );
}
