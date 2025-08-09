import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Fragment, useState } from "react";
import { Checkbox } from "../ui/checkbox";
import { useDispatch, useSelector } from "react-redux";
import { setCheckedItems } from "@/store/lead-slice";
import { Button } from "../ui/button";
import { FaChevronDown, FaChevronUp } from "react-icons/fa";
import LeadEditionContainer from "./LeadEditionContainer";

export interface LeadTableInterface {
  leadList: {
    id: number;
    list: {
      label: string;
      value: string;
    }[];
    data: any;
  }[];
}

export default function LeadTable({ leadList }: LeadTableInterface) {
  const [expandedRows, setExpandedRows] = useState<number[]>([]);

  const toggleRow = (index: number) => {
    setExpandedRows((prev) =>
      prev.includes(index) ? prev.filter((i) => i !== index) : [...prev, index]
    );
  };
  const dispatch = useDispatch<any>();
  const checkedItems = useSelector((state: any) => state.lead.checkedItems);

  const checkItemHandler = (listItem: any, checked: boolean) => {
    let updatedItems;

    if (checked) {
      updatedItems = [...checkedItems, listItem];
    } else {
      updatedItems = checkedItems?.filter((obj: any) => obj.id !== listItem.id);
    }

    dispatch(setCheckedItems(updatedItems));
  };
  console.log(40, checkedItems);
  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead className="text-center bg-white border-none">
            <Checkbox
              onCheckedChange={(checked: boolean) => {
                if (checked) {
                  const updatedCheckItems = checkedItems?.filter(
                    (item: any) => !leadList?.some((l) => l.id === item.id)
                  );
                  const dataArray = leadList.map((item: any) => item.data);
                  dispatch(
                    setCheckedItems([...updatedCheckItems, ...dataArray])
                  );
                } else {
                  const updatedItems = checkedItems?.filter(
                    (item: any) => !leadList?.some((l) => l.id === item.id)
                  );
                  dispatch(setCheckedItems(updatedItems));
                }
              }}
              checked={leadList?.every((item) =>
                checkedItems.some((obj: any) => obj.id === item.id)
              )}
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
                    checkItemHandler(lead.data, checked);
                  }}
                  checked={checkedItems.some((obj: any) => obj.id === lead.id)}
                />
              </TableCell>
              {lead.list.map((cell, cellIndex) => (
                <TableCell key={cellIndex} className="text-center text-xs">
                  {cell.value}
                </TableCell>
              ))}
              <TableCell className="text-center text-xs">
                <div className="flex items-center gap-4 w-full justify-center">
                  {" "}
                  <LeadEditionContainer />
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
                </div>
              </TableCell>
            </TableRow>
            {expandedRows.includes(rowIndex) && (
              <TableRow className="bg-gray-100">
                <TableCell
                  colSpan={lead.list.length + 2}
                  className="text-sm text-gray-700"
                >
                      
                </TableCell>
              </TableRow>
            )}
          </Fragment>
        ))}
      </TableBody>
    </Table>
  );
}
