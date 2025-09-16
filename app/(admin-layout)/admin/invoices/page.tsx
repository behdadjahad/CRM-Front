"use client";

import React, { useState, useMemo, useCallback } from 'react';
import { Request, RequestStatus } from '@/types/requests';
import { mockRequests } from '@/data/requests-mock-data';
import AdminRequestsContainer from '@/components/admin/requests/admin-requests-container';
import Breadcrumb from '@/components/shared/breadcrumb';
import Title from '@/components/shared/title';
import { useRouter } from 'next/navigation';
import { filterRequests, getStatusCounts } from '@/lib/invoice-utils';
import { STATS_CARDS } from '@/constants/invoice-constants';

const AdminInvoicesPage: React.FC = () => {
    const router = useRouter();
    const [requests, setRequests] = useState<Request[]>(mockRequests);

    const handleStatusChange = useCallback(async (requestId: string, newStatus: RequestStatus) => {
        // Simulate API call
        await new Promise(resolve => setTimeout(resolve, 1000));

        setRequests(prev =>
            prev.map(request =>
                request.id === requestId
                    ? { ...request, status: newStatus, updatedAt: new Date().toISOString() }
                    : request
            )
        );
    }, []);

    const handleViewDetails = useCallback((invoiceId: string) => {
        router.push(`/admin/invoices/${invoiceId}`);
    }, [router]);

    const statusCounts = useMemo(() => getStatusCounts(requests), [requests]);

    return (
        <main className="flex flex-col">
            <Title label="مدیریت درخواست‌ها" />

            <Breadcrumb
                list={[
                    {
                        label: "ادمین",
                        link: "/",
                    },
                    {
                        label: "درخواست‌ها",
                    },
                ]}
            />

            {/* Statistics Cards */}
            {/* <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4 mb-8 p-6">
                {STATS_CARDS.map((card) => (
                    <div key={card.key} className="bg-white rounded-lg border border-gray-200 p-6">
                        <div className="flex items-center">
                            <div className="flex-shrink-0">
                                <div className={`w-8 h-8 ${card.className} rounded-full flex items-center justify-center`}>
                                    <span className="text-sm font-medium">{card.icon}</span>
                                </div>
                            </div>
                            <div className="mr-4">
                                <p className="text-sm font-medium text-gray-500">{card.label}</p>
                                <p className="text-2xl font-bold text-gray-900">
                                    {statusCounts[card.key as keyof typeof statusCounts]}
                                </p>
                            </div>
                        </div>
                    </div>
                ))}
            </div> */}

            {/* Requests Container */}
            <AdminRequestsContainer
                requests={requests}
                onStatusChange={handleStatusChange}
                onViewDetails={handleViewDetails}
            />
        </main>
    );
};

export default AdminInvoicesPage;