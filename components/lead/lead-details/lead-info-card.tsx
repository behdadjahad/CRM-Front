import React, { useState } from 'react'
import { ChevronDown, Hand, RotateCcw } from 'lucide-react'
import { Button } from '@/components/ui/button'
import LeadInfoHeader, { LeadInfoHeaderProps } from './lead-info-header'
import LeadDetailsSection from './lead-details-section'

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
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 w-full max-w-[429px]">
      {/* Header Section */}
      <LeadInfoHeader {...headerData} />

   

      {/* Activity/History Section */}
      <div className="bg-[#FFEEE3] flex flex-col gap-3 rounded-lg p-3  mb-6">
        <div className="flex justify-between items-start ">
          <span className="text-sm font-medium text[#181D27]">۲۱ روز گذشته</span>
        </div>
        <div className="items-center justify-between flex gap-3">
          <div className="text-xs font-normal text[#181D27]">
            آخرین پیگیری: ۱۴۰۴/۲/۱۷ ۱۶:۲۳ PM
          </div>
          <div className="text-xs font-normal text[#181D27]">
            رویداد بعدی: ۱۴۰۴/۲/۲۱ ۰۹:۰۰ AM
          </div>
        </div>
      </div>

    <LeadDetailsSection />

  
    </div>
  )
}