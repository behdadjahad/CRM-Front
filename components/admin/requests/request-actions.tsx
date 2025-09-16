import React, { useState, useCallback } from 'react';
import { Request, RequestStatus } from '@/types/requests';
import { Button } from '@/components/ui/button';
import Image from 'next/image';
import { cn } from '@/lib/utils';
import { getStatusActions } from '@/lib/invoice-utils';

interface RequestActionsProps {
    request: Request;
    onStatusChange: (requestId: string, newStatus: RequestStatus) => void;
    onViewDetails: (invoiceId: string) => void;
    loading?: boolean;
    className?: string;
}

const RequestActions: React.FC<RequestActionsProps> = ({
    request,
    onStatusChange,
    onViewDetails,
    loading = false,
    className
}) => {
    const [actionLoading, setActionLoading] = useState<string | null>(null);

    const handleStatusChange = useCallback(async (newStatus: RequestStatus) => {
        setActionLoading(newStatus);
        try {
            await onStatusChange(request.id, newStatus);
        } finally {
            setActionLoading(null);
        }
    }, [request.id, onStatusChange]);

    const handleViewDetails = useCallback(() => {
        onViewDetails(request.invoiceId);
    }, [request.invoiceId, onViewDetails]);

    const statusActions = getStatusActions(request.status);

    return (
        <div className={cn("flex items-center gap-4 w-full justify-center", className)}>
            {/* View Details Button */}
            <Button
                className="border-none p-0 text-[#212B36]"
                onClick={handleViewDetails}
                title="مشاهده جزئیات"
            >
                <Image
                    src="/icons/search.png"
                    alt="مشاهده"
                    width={1024}
                    height={1024}
                    className="w-5 h-5"
                />
            </Button>

            {/* Status Action Buttons */}
            {statusActions.map((action, index) => (
                <Button
                    key={index}
                    className={cn("border-none p-0", action.className)}
                    onClick={() => handleStatusChange(action.status)}
                    disabled={actionLoading === action.status || loading}
                    title={action.label}
                >
                    {actionLoading === action.status ? (
                        <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-current" />
                    ) : (
                        <Image
                            src={action.icon}
                            alt={action.label}
                            width={1024}
                            height={1024}
                            className="w-5 h-5"
                        />
                    )}
                </Button>
            ))}

            {/* More Actions Button */}
            <Button
                className="border-none p-0 text-[#212B36]"
                title="عملیات بیشتر"
            >
                <Image
                    src="/icons/document.png"
                    alt="عملیات بیشتر"
                    width={1024}
                    height={1024}
                    className="w-5 h-5"
                />
            </Button>
        </div>
    );
};

export default RequestActions;
