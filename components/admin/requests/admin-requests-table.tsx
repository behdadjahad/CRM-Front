"use client";

import React, { Fragment, useState } from "react";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { requestInterface } from "@/app/(admin-layout)/admin/invoices/page";
import { Button } from "@/components/ui/button";
import { FaChevronDown, FaChevronUp } from "react-icons/fa";
import { fetchInvoice } from "@/store/admin-invoice-slice";
import { RootState } from "@/store";
import { useDispatch, useSelector } from "react-redux";
import { getSortFieldFromLabel } from "@/lib/utils";

interface AdminRequestsTableInterface {
  requestList: requestInterface[];
}

// Transform requests to follow existing admin table pattern

export default function AdminRequestsTable({
  requestList,
}: AdminRequestsTableInterface) {
  const dispatch = useDispatch<any>();
  type SortType = "asc" | "desc";
  const [sortStates, setSortStates] = useState<Record<string, SortType>>({});
  const limit = useSelector((state: RootState) => state.adminInvoice.limit);
  const currentPage = useSelector(
    (state: RootState) => state.adminInvoice.currentPage
  );
  const filters = useSelector((state: RootState) => state.adminInvoice.filters);
  const toggleSort = (label: string) => {
    setSortStates((prev) => {
      const newSort = prev[label] === "desc" ? "asc" : "desc";

      dispatch(
        fetchInvoice({
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
  return (
    <Table>
      <TableHeader>
        <TableRow>
          {requestList?.[0]?.list.map((col, idx) => (
            <TableHead
              key={idx}
              className="text-center text-xs bg-card border font-bold"
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
          <TableHead className="text-center text-xs bg-card border font-bold">
            عملیات
          </TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {requestList?.map((request, rowIndex) => (
          <Fragment key={request.id}>
            <TableRow className="border border-gray-200 bg-card">
              {request.list.map((cell, cellIndex) => (
                <TableCell
                  key={cellIndex}
                  className="text-center text-xs border"
                >
                  {cell.value}
                </TableCell>
              ))}
              <TableCell className="text-center text-xs border">
                {/* <RequestActions
                                    request={request.data}
                                    onStatusChange={onStatusChange}
                                    onViewDetails={onViewDetails}
                                /> */}
              </TableCell>
            </TableRow>
          </Fragment>
        ))}
      </TableBody>
    </Table>
  );
}
