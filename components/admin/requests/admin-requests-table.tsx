"use client";

import React, { Fragment } from "react";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { requestInterface } from "@/app/(admin-layout)/admin/invoices/page";

interface AdminRequestsTableInterface {
  requestList: requestInterface[];
}

// Transform requests to follow existing admin table pattern

export default function AdminRequestsTable({
  requestList,
}: AdminRequestsTableInterface) {
  return (
    <Table>
      <TableHeader>
        <TableRow>
          {requestList?.[0]?.list.map((col, idx) => (
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
