import { ChevronDown } from 'lucide-react'
import React, { useState } from 'react'
export default function LeadDetailsSection() {
  const [isDetailsOpen, setIsDetailsOpen] = useState(false)
  const toggleDetails = () => {
    setIsDetailsOpen(!isDetailsOpen)
  }
  return (
    <div>
      {/* Details Section - Dropdown */}
      <div className="mb-6">
        {/* Dropdown Header */}
        <button
          onClick={toggleDetails}
          className="w-full flex items-center justify-between p-3  rounded-lg hover:bg-gray-100 transition-colors"
        >
          <h2 className="text-lg font-semibold text-gray-900">جزئیات</h2>
          <ChevronDown
            className={`w-4 h-4 text-gray-600 transition-transform duration-200 ${isDetailsOpen ? 'rotate-180' : ''
              }`}
          />
        </button>

        {/* Dropdown Content */}
        <div className={`overflow-hidden transition-all duration-300 ${isDetailsOpen ? 'max-h-96 opacity-100 mt-3' : 'max-h-0 opacity-0'
          }`}>
          <div className="space-y-3 text-right">
            {/* Follow-up Responsible */}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
              
                <span className="text-sm text-gray-600">مسئول پیگیری</span>
              </div>
              <span className="text-sm font-medium text-gray-900">سیما احدی</span>
            </div>

            {/* Request Source */}
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600">منبع ثبت در خواست</span>
              <span className="text-sm font-medium text-gray-900">ایمیل</span>
            </div>

            {/* Interest */}
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600">علاقه مندی</span>
              <span className="bg-red-500 text-white text-xs px-2 py-1 rounded-full">داغ</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}