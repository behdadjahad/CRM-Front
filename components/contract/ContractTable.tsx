"use client";
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

import { Button } from "../ui/button";
import { FaChevronDown, FaChevronUp } from "react-icons/fa";
import Link from "next/link";
import { cn, getSortFieldFromLabel } from "@/lib/utils";
import { AccessDenied } from "../shared/AccessDenied";
import { generateFeatureAccess } from "@/lib/generatePageData";
import { usePageData } from "@/hooks/usePageData";
import Image from "next/image";
import { fetchContracts, setCheckedItems } from "@/store/contract-slice";
export interface ContractTableInterface {
  contractList: {
    id: number;
    list: {
      label: string;
      value: string;
      className?: string;
    }[];
    exportData: any;
    editData: any;
  }[];
  className?: string;
}

export default function ContractTable({
  contractList,
  className
}: ContractTableInterface) {
  const pageFeatures = usePageData();

  type SortType = "asc" | "desc";
  const [sortStates, setSortStates] = useState<Record<string, SortType>>({});

  const limit = useSelector((state: any) => state.contract.limit);
  const currentPage = useSelector((state: any) => state.contract.currentPage);

  const filters = useSelector((state: any) => state.contract.filters);
  const toggleSort = (label: string) => {
    setSortStates((prev) => {
      const newSort = prev[label] === "desc" ? "asc" : "desc";

      dispatch(
        fetchContracts({
          page: currentPage,
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

  const dispatch = useDispatch<any>();
  const checkedItems = useSelector((state: any) => state.contract.checkedItems);

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
        <div
          className={cn(
            " flex flex-col items-center justify-between h-full",
            className
          )}
        >
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead className="text-center bg-white border-none"></TableHead>
          {contractList?.[0]?.list.map((col, idx) => (
            <TableHead
              key={idx}
              className="text-center text-xs bg-card border-l text-[#1E1E1E]"
            >
              <div className="flex items-center w-full justify-between">
                {idx === 0 && (
                  <div>
                    {" "}
                    {generateFeatureAccess(pageFeatures, "select-lead")?.show &&
                      !generateFeatureAccess(pageFeatures, "select-lead")
                        ?.enable && (
                        <AccessDenied
                          icon={
                            <Image
                              src={"/icons/checkbox-icon.png"}
                              alt="checkbox"
                              width={1024}
                              height={1024}
                              className="w-4 h-4"
                            />
                          }
                        />
                      )}
                    {generateFeatureAccess(pageFeatures, "select-lead")?.show &&
                      generateFeatureAccess(pageFeatures, "select-lead")
                        ?.enable && (
                        <Checkbox
                          onCheckedChange={(checked: boolean) => {
                            if (checked) {
                              const updatedCheckItems = checkedItems?.filter(
                                (item: any) =>
                                  !contractList?.some((l) => l.id === item.id)
                              );
                              const dataArray = contractList.map(
                                (item: any) => item.exportData
                              );
                              dispatch(
                                setCheckedItems([
                                  ...updatedCheckItems,
                                  ...dataArray,
                                ])
                              );
                            } else {
                              const updatedItems = checkedItems?.filter(
                                (item: any) =>
                                  !contractList?.some((l) => l.id === item.id)
                              );
                              dispatch(setCheckedItems(updatedItems));
                            }
                          }}
                          checked={contractList?.every((item) =>
                            checkedItems.some((obj: any) => obj.id === item.id)
                          )}
                        />
                      )}
                  </div>
                )}
                <span>{col.label}</span>

                <Button
                  variant={"transparent"}
                  onClick={() => toggleSort(col.label)}
                >
                  {sortStates[col.label] === "desc" ? (
                    <Image
                      src={"/icons/chevron-down.svg"}
                      alt="checkbox"
                      width={1024}
                      height={1024}
                      className="w-4 h-4"
                    />
                  ) : (
                    <Image
                      src={"/icons/chevron-up.svg"}
                      alt="checkbox"
                      width={1024}
                      height={1024}
                      className="w-4 h-4"
                    />
                  )}
                </Button>
              </div>
            </TableHead>
          ))}
        </TableRow>
      </TableHeader>
      <TableBody>
        {contractList?.map((contract, rowIndex) => (
          <Fragment key={contract.id}>
            <Link
              href={`/contract/${contract.id}`}
              style={{ display: "contents" }} // ✅ Preserves layout
            >
              <TableRow className="border border-gray-200 bg-card">
                <TableCell className="flex items-center justify-center"></TableCell>
                {contract.list.map((cell, cellIndex) => {
                  return (
                    <TableCell key={cellIndex} className="text-center text-xs">
                      <div className="flex items-center justify-between">
                        {" "}
                        {cellIndex === 0 && (
                          <div>
                            {" "}
                            {generateFeatureAccess(pageFeatures, "select-lead")
                              ?.show &&
                              generateFeatureAccess(pageFeatures, "select-lead")
                                ?.enable && (
                                <Checkbox
                                  onCheckedChange={(checked: boolean) => {
                                    checkItemHandler(
                                      contract.exportData,
                                      checked
                                    );
                                  }}
                                  checked={checkedItems.some(
                                    (obj: any) => obj.id === contract.id
                                  )}
                                />
                              )}
                            {generateFeatureAccess(pageFeatures, "select-lead")
                              ?.show &&
                              !generateFeatureAccess(
                                pageFeatures,
                                "select-lead"
                              )?.enable && (
                                <AccessDenied
                                  icon={
                                    <Image
                                      src={"/icons/checkbox-icon.png"}
                                      alt="checkbox"
                                      width={1024}
                                      height={1024}
                                      className="w-4 h-4"
                                    />
                                  }
                                />
                              )}{" "}
                          </div>
                        )}{" "}
                        <span>{cell.value}</span>
                      </div>
                    </TableCell>
                  );
                })}
              </TableRow>
            </Link>
          </Fragment>
        ))}
      </TableBody>
      </Table>
      </div>
  );
}
