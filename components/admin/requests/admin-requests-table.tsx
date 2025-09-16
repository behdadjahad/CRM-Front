"use client";

import React, { memo, Fragment } from 'react';
import { Request, RequestStatus } from '@/types/requests';
import RequestStatusBadge from './request-status-badge';
import RequestActions from './request-actions';
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow
} from '@/components/ui/table';
import { formatDate, formatPrice } from '@/lib/invoice-utils';

interface AdminRequestsTableProps {
    requests: Request[];
    onStatusChange: (requestId: string, newStatus: RequestStatus) => void;
    onViewDetails: (invoiceId: string) => void;
}

// Transform requests to follow existing admin table pattern
const transformRequestsToTableData = (requests: Request[]) => {
    return requests.map(request => ({
        id: request.id,
        list: [
            { label: 'شماره فاکتور', value: request.invoiceId },
            {
                label: 'کاربر',
                value: (
                    <div>
                        <div className="font-medium">{request.userName}</div>
                        <div className="text-gray-500 text-xs">{request.userEmail}</div>
                    </div>
                )
            },
            { label: 'پکیج', value: request.packageName },
            {
                label: 'یادداشت',
                value: (
                    <div className="max-w-xs truncate" title={request.notes}>
                        {request.notes || '—'}
                    </div>
                )
            },
            { label: 'مبلغ', value: formatPrice(request.packagePrice, request.currency) },
            {
                label: 'وضعیت',
                value: <RequestStatusBadge status={request.status} />
            },
            { label: 'تاریخ ایجاد', value: formatDate(request.createdAt) }
        ],
        data: request
    }));
};

const AdminRequestsTable: React.FC<AdminRequestsTableProps> = memo(({
    requests,
    onStatusChange,
    onViewDetails
}) => {
    const requestList = transformRequestsToTableData(requests);

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
                    <TableHead className="text-center text-xs bg-card border font-bold" />
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
                                <RequestActions
                                    request={request.data}
                                    onStatusChange={onStatusChange}
                                    onViewDetails={onViewDetails}
                                />
                            </TableCell>
                            <TableCell className="text-center text-xs border" />
                        </TableRow>
                    </Fragment>
                ))}
            </TableBody>
        </Table>
    );
});

AdminRequestsTable.displayName = 'AdminRequestsTable';

export default AdminRequestsTable;
