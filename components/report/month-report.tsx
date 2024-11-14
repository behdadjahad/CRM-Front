import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { cn } from "@/lib/utils"

export interface MonthReportInterface {
  headers: React.ReactNode[];
  rows:
  {
    contract: string;
    members: string;
    profit: string;
    total: string;
  }[];
  title: string;
  className?: string
}

export function MonthReport({ title, rows, headers, className }: MonthReportInterface) {
  return (
    <div className={cn('flex flex-col items-start gap-7 p-6 border rounded-lg w-full', className)}>
      <span className="text-lg font-bold">
        {title}
      </span>

      <Table className="">
        <TableHeader className="w-full bg-badge">
          <TableRow className="bg-transparent overflow-hidden rounded-md">
            {
              headers.map((item, index) => (
                <TableHead key={`header-${title}-${index}-${item}`} className={cn("text-center flex-1", { "rounded-r-md": index == 0, "rounded-l-md": index == headers.length - 1 })}>
                  {item}
                </TableHead>
              ))
            }
          </TableRow>
        </TableHeader>
        <TableBody>
          {rows.map((row, index) => (
            <TableRow key={`row-${title}-${index}-${row}`}>
              <TableCell className="font-medium text-right">{row.contract}</TableCell>
              <TableCell className="font-medium text-right">{row.members}</TableCell>
              <TableCell className="font-medium text-right">{row.profit}</TableCell>
              <TableCell className="font-medium text-right">{row.total}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div >
  )
}
