import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Fragment } from "react";

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
          {leadList?.[0]?.list.map((col, idx) => (
            <TableHead
              key={idx}
              className="text-center text-xs bg-card border font-bold"
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
