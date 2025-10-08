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
            className={cn("h-0 w-0 overflow-hidden  bg-black/50 top-0 left-0 z-50 fixed", {
                "w-screen h-screen": true,
            })}
        >
            <button
                onClick={onClose}
                className="absolute top-4 left-4 z-10 p-2 hover:bg-gray-100 rounded-full"
            >
                <X className="w-6 text-black h-6" />
            </button>
            <div
                onClick={handleContentClick}
                className={cn(
                    "h-screen rounded-r-2xl fixed top-0 z-50 left-0 w-0 bg-card text-foreground overflow-x-hidden duration-200 transition-all",
                    "w-10/12"
                )}
            >
                <div className="p-4 flex gap-4 w-full h-full overflow-x-auto">
                    {/* Lead Info Card */}
                    <div className="flex-shrink-0">
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
                    <div className="col-span-8 border border-gray-200 rounded-lg p-4">
                        <LeadWorkflowStepper currentStatus={"INPROGRESS"} />
                        <LeadInteractionTabs />
                    </div>
                </div>

            </div>
        </div>
    );
}