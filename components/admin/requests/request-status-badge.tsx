import React, { useMemo } from 'react';
import { Badge } from '@/components/ui/badge';
import { RequestStatus } from '@/types/requests';
import { cn } from '@/lib/utils';
import { STATUS_CONFIG } from '@/lib/invoice-utils';

interface RequestStatusBadgeProps {
    status: RequestStatus;
    className?: string;
}

const RequestStatusBadge: React.FC<RequestStatusBadgeProps> = ({ status, className }) => {
    const config = useMemo(() => {
        const statusConfig = STATUS_CONFIG[status];
        if (!statusConfig) {
            return {
                label: 'نامشخص',
                variant: 'secondary' as const,
                className: 'bg-gray-100 text-gray-800 border-gray-200'
            };
        }

        const variantMap = {
            warning: 'warning' as const,
            info: 'info' as const,
            destructive: 'destructive' as const,
            success: 'success' as const,
            secondary: 'secondary' as const
        };

        return {
            label: statusConfig.label,
            variant: variantMap[statusConfig.color as keyof typeof variantMap] || 'secondary',
            className: statusConfig.className
        };
    }, [status]);

    return (
        <Badge
            variant={config.variant}
            className={cn(
                'text-xs font-medium px-2.5 py-1 rounded-full border',
                config.className,
                className
            )}
        >
            {config.label}
        </Badge>
    );
};

export default RequestStatusBadge;
