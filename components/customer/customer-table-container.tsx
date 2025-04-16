import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "../ui/button";

export default function CustomerTableContainer({
  tableHeaderLabels,
  customers,
  subCustomerInfoLabels
}: {
 tableHeaderLabels: string[];
 subCustomerInfoLabels: string[];
 customers: any;
}) {
  return (
    <Table>
      <TableHeader>
        <TableRow>
          {tableHeaderLabels.map((label: string, index: number) => (
            <TableHead key={index} className="text-center">
              {label}
            </TableHead>
          ))}
        </TableRow>
      </TableHeader>
      <TableBody>
        {customers.map((customer: any, index: number) => (
          <>
            <TableRow key={index}>
              {tableHeaderLabels.map((label: any, idx: number) => (
                <TableCell key={idx} className="text-center">
                  {customer.Info[label]}
                </TableCell>
              ))}
              <TableCell className="text-center">
                <Button className="bg-blue-500 text-white px-4 py-2 rounded-lg">
                  مشاهده
                </Button>
              </TableCell>
            </TableRow>
            <TableRow className="bg-gray-500">
              {subCustomerInfoLabels.map((lbl, ix) => (
                <TableCell key={ix} className="text-center">
                  <div>{lbl}</div>
                  <div>
                  {customer.subInfo[lbl]}
                  </div>
               
                </TableCell>
              ))}
            </TableRow>
          </>
        ))}
      </TableBody>
    </Table>
  );
}
