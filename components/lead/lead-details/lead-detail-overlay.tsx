import { cn } from '@/lib/utils';
import { X } from 'lucide-react';
import React, { useRef } from 'react'
import LeadInfoCard from './lead-info-card';
import LeadPersonSection from './lead-person-section';
import LeadOrganizationSection from './lead-organization-section';
import LeadDetailsSection from './lead-details-section';
import LeadWorkflowStepper from './lead-workflow-stepper';
import LeadInteractionTabs from './lead-intraction-tabs';



interface LeadDetailsOverlayProps {
    leadId: string;
    onClose: () => void;

}


export default function LeadDetailsOverlay({ leadId, onClose }: LeadDetailsOverlayProps) {
    const overlayRef = useRef<HTMLDivElement>(null);
    const handleBackdropClick = (e: React.MouseEvent<HTMLDivElement>) => {
        // Only close if clicking on the backdrop, not on the content
        if (e.target === overlayRef.current) {
            onClose();
        }
    };
    const handleContentClick = (e: React.MouseEvent<HTMLDivElement>) => {
        e.stopPropagation();
    };
    return (
        <div
            ref={overlayRef}
            onClick={handleBackdropClick}
            className={cn("h-0 w-0 bg-black/50 top-0 left-0 z-50 fixed", {
                "w-screen h-screen": true,
            })}
        >
            {/* Desktop Close Button */}
            <button
                onClick={onClose}
                className="absolute top-4 left-4 z-[9999] p-2 hover:bg-gray-100 rounded-full hidden sm:block"
            >
                <X className="w-6 text-black h-6" />
            </button>

            {/* Mobile Back Button */}
            <button
                onClick={onClose}
                className="absolute top-0 right-4 z-[9999] p-2 hover:bg-gray-100 rounded-full sm:hidden"
            >
                <X className="w-6 text-danger h-6" />
            </button>
            <div
                onClick={handleContentClick}
                className={cn(
                    "h-screen rounded-r-2xl xl:rounded-r-2xl rounded-none fixed top-0 z-50 left-0 w-0 bg-card text-foreground overflow-x-hidden duration-200 transition-all",
                    "w-full sm:w-11/12 lg:w-10/12 xl:w-10/12" // Responsive width
                )}
            >
                <div className="p-2 sm:p-3 lg:p-4 grid grid-cols-1 xl:grid-cols-12 gap-2 sm:gap-3 lg:gap-4 w-full h-full overflow-x-auto">
                    {/* Lead Info Card */}
                    <div className="flex-shrink-0 col-span-1 xl:col-span-4 overflow-auto max-h-full scrollbar-hidden order-2 xl:order-1">
                        <LeadInfoCard
                            headerData={{
                                title: "تور داخلی",
                                date: "۱۴۰۴/۱/۱۶",
                                userName: "امیر",
                                userAvatarColor: "bg-blue-500"
                            }}
                            status="در جریان"
                        />
                    </div>
                    {/* Main Content Area */}
                    <div className="col-span-1 z-50 xl:col-span-8 border border-gray-200 rounded-lg p-2 sm:p-3 lg:p-4 order-1 xl:order-2">
                        <LeadWorkflowStepper currentStatus={"INPROGRESS"} />
                        <LeadInteractionTabs />
                    </div>
                </div>

            </div>
        </div>
    );
}