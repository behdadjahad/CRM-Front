import React, { useState } from 'react'
import { Button } from '@/components/ui/button'
import { ChevronDown } from 'lucide-react'

export default function LeadOrganizationSection() {
  const [isOrganizationOpen, setIsOrganizationOpen] = useState(false);

  const toggleOrganization = () => {
    setIsOrganizationOpen(!isOrganizationOpen);
  }

  return (
    <div className="">
      {/* Person Section - Dropdown */}
      <div className="mb-6">
        {/* Dropdown Header */}
        <button
          onClick={toggleOrganization}
          className="w-full flex items-center justify-between p-3 rounded-lg hover:bg-gray-100 transition-colors"
        >
          <h2 className="text-lg font-semibold text-gray-900">سازمان</h2>
          <ChevronDown
            className={`w-4 h-4 text-gray-600 transition-transform duration-200 ${isOrganizationOpen ? 'rotate-180' : ''
              }`}
          />
        </button>
        {/* Dropdown Content */}
        <div className={`overflow-hidden px-4 transition-all duration-300 ${isOrganizationOpen ? 'max-h-96 opacity-100 mt-3' : 'max-h-0 opacity-0'
          }`}>
          <div className="space-y-3 text-right">
            {/* Name */}
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600"> نام   </span>
              <span className="text-sm font-medium text-gray-900"> شرکت تست </span>
            </div>

            {/* Email */}
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600">ایمیل</span>
              <span className="text-sm font-medium text-gray-900">MinaFarjad@Gmail.Com</span>
            </div>

            {/* Phone */}
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600">شماره تلفن</span>
              <span className="text-sm font-medium text-gray-900">۰۹۱۷۷۸۹۵۲۳۶</span>
            </div>
            
          </div>
        </div>
      </div>
    </div>
  )
}