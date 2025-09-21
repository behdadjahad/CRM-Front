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
import ActionDropDown from "@/components/shared/ActionDropDown";
import { useMutation } from "@tanstack/react-query";
import { acceptInvoice, discountInvoice, rejectInvoice } from "@/api/invoices";
import { adminInvoiceActionList } from "@/constants/admin-invoice-actions";

interface AdminRequestsTableInterface {
  requestList: requestInterface[];
}
export type ActionType = "Accept" | "Reject" | "Discount";

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
  const { mutate: acceptInvoiceHandler } = useMutation({
    mutationFn: (invoiceId: number) => {
      return acceptInvoice(invoiceId);
    },
    onSuccess: () => {
      // dispatch(
      //   fetchDrawerNotifications({
      //     page: 1,
      //     limit: limitForDrawerNotifications,
      //     filters: filters,
      //   })
      // );
    },
  });
  const { mutate: rejectInvoiceHandler } = useMutation({
    mutationFn: (invoiceId: number) => {
      return rejectInvoice(invoiceId);
    },
    onSuccess: () => {
      // dispatch(
      //   fetchDrawerNotifications({
      //     page: 1,
      //     limit: limitForDrawerNotifications,
      //     filters: filters,
      //   })
      // );
    },
  });
  const { mutate: discountInvoiceHandler } = useMutation({
    mutationFn: ({ invoiceId, data }: { invoiceId: number; data: any }) => {
      return discountInvoice(invoiceId, data);
    },
    onSuccess: () => {
      // dispatch(
      //   fetchDrawerNotifications({
      //     page: 1,
      //     limit: limitForDrawerNotifications,
      //     filters: filters,
      //   })
      // );
    },
  });
  function actionHandler(
    actionType: ActionType,
    requestId: number,
    discount?: number
  ) {
    console.log(actionType, requestId, discount);
    switch (actionType) {
      case "Accept":
        console.log("accept");
        acceptInvoiceHandler(requestId);
        break;
      case "Reject":
        console.log("reject");
        rejectInvoiceHandler(requestId);
        break;
      case "Discount":
        if (discount)
          discountInvoiceHandler({
            invoiceId: requestId,
            data: { discountPercent: Number(discount) },
          });
        break;
      default:
        return;
    }
  }
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
                <div className="flex justify-center items-center">
                  {" "}
                  <ActionDropDown
                    list={adminInvoiceActionList}
                    onActionHandler={(
                      actionType: ActionType,
                      discount?: number
                    ) => {
                      actionHandler(actionType, request.id, discount);
                    }}
                    requestData={request.data}
                  />
                </div>{" "}
              </TableCell>
            </TableRow>
          </Fragment>
        ))}
      </TableBody>
    </Table>
  );
}
