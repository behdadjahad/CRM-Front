import React, { useState } from 'react'
import { ChevronDown, Hand, RotateCcw } from 'lucide-react'
import { Button } from '@/components/ui/button'
import Tooltip from '@/components/ui/tooltip'
import LeadInfoHeader, { LeadInfoHeaderProps } from './lead-info-header'
import LeadDetailsSection from './lead-details-section'
import LeadPersonSection from './lead-person-section'
import LeadOrganizationSection from './lead-organization-section'

// Props interface for the entire card
export interface LeadInfoCardProps {
  headerData: LeadInfoHeaderProps
  status?: string
  onStatusChange?: (status: string) => void
  onEdit?: () => void
}

export default function LeadInfoCard({
  headerData,
  status = "در جریان",
  onStatusChange,
  onEdit
}: LeadInfoCardProps) {
  const [isDetailsOpen, setIsDetailsOpen] = useState(false)

  const toggleDetails = () => {
    setIsDetailsOpen(!isDetailsOpen)
  }

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 w-full max-w-full xl:max-w-[429px]">
      {/* Header Section */}
      <LeadInfoHeader {...headerData} />

      {/* Activity/History Section */}
      <div className="bg-[#FFEEE3] flex flex-col gap-3 m-3 rounded-lg p-3 mb-6">
        <div className="flex justify-between items-start">
          <p className="text-sm font-medium text-[#181D27]">۲۱ روز گذشته</p>
        </div>
        <div className="xl:items-center xl:justify-center justify-start xl:flex-row flex-col flex gap-2">
          <Tooltip
            content="آخرین پیگیری: ۱۴۰۴/۲/۱۷ ۱۶:۲۳ PM"
            className="flex-1 min-w-0"
          >
            <div className="text-xs font-normal text-[#181D27] truncate w-full">
              آخرین پیگیری: ۱۴۰۴/۲/۱۷ ۱۶:۲۳ PM
            </div>
          </Tooltip>
          <Tooltip
            content="رویداد بعدی: ۱۴۰۴/۲/۲۱ ۰۹:۰۰ AM"
            className="flex-1 min-w-0"
          >
            <div className="text-xs font-normal text-[#181D27] truncate w-full">
              رویداد بعدی: ۱۴۰۴/۲/۲۱ ۰۹:۰۰ AM
            </div>
          </Tooltip>
        </div>
      </div>

      <LeadDetailsSection />
      <div className='border border-gray-200 border-dashed w-full' />
      <LeadPersonSection />
      <div className='border border-gray-200 border-dashed w-full' />
      {/* create rganization section */}
      <LeadOrganizationSection />

      {/*  sub section */}

      <div className='flex justify-start align-center gap-2 m-4'>
        <Button variant={"info"}>
          تبدیل به قرارداد
        </Button>
        <Button variant={"transparent"} className='border border-gray-400'>بستن درخواست</Button>

      </div>
    </div>
  )
}