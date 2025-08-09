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
import { fetchLeads, setCheckedItems } from "@/store/lead-slice";
import { Button } from "../ui/button";
import { FaChevronDown, FaChevronUp } from "react-icons/fa";
import LeadEditionContainer from "./LeadEditionContainer";
import { getSortFieldFromLabel } from "@/lib/utils";

export interface LeadTableInterface {
  leadList: {
    id: number;
    list: {
      label: string;
      value: string;
    }[];
    exportData: any;
  }[];
}

export default function LeadTable({ leadList }: LeadTableInterface) {
  const [expandedRows, setExpandedRows] = useState<number[]>([]);
  type SortType = "asc" | "desc";
  const [sortStates, setSortStates] = useState<Record<string, SortType>>({});

  const limit = useSelector((state: any) => state.lead.limit);

  const filters = useSelector((state: any) => state.lead.filters);
  const toggleSort = (label: string) => {
    console.log(label)
    console.log(getSortFieldFromLabel(label));
    // dispatch(config.setCheckedItems([]));
    setSortStates((prev) => {
      const newSort = prev[label] === "desc" ? "asc" : "desc";
     
      dispatch(
        fetchLeads({
          page: 1,
          limit: limit,
          filters: {
            ...filters,
            sortBy: getSortFieldFromLabel(label),
            order: newSort,
          },
        })
      );

      return {
        ...prev,
        [label]: newSort,
      };
    });
  };
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
                  const dataArray = leadList.map((item: any) => item.exportData);
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
              <div className="flex items-center gap-2 w-full justify-center">
                <span>{col.label}</span>

                <Button
                  variant={"transparent"}
                  onClick={() => toggleSort(col.label)}
                >
                  {sortStates[col.label] === "desc" ? (
                    <FaChevronDown />
                  ) : (
                    <FaChevronUp />
                  )}
                </Button>
              </div>
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
                    checkItemHandler(lead.exportData, checked);
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
                ></TableCell>
              </TableRow>
            )}
          </Fragment>
        ))}
      </TableBody>
    </Table>
  );
}
