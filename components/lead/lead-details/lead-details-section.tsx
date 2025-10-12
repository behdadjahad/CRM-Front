import { ChevronDown } from 'lucide-react'
import Tag from '@/components/shared/Tag';
import React, { useState } from 'react'
export default function LeadDetailsSection() {
  const [isDetailsOpen, setIsDetailsOpen] = useState(false)
  const toggleDetails = () => {
    setIsDetailsOpen(!isDetailsOpen)
  }
  const tags = [
    {
      label: 'داغ',
      value: 'hot'
    },
    {
      label: 'پولدار',
      value: 'success'
    },
    {
      label: 'پیگیر',
      value: 'info'
    }
  ]
  return (
    <div className=''>
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
        <div className={`overflow-hidden px-4  transition-all duration-300 ${isDetailsOpen ? 'max-h-96 opacity-100 mt-3' : 'max-h-0 opacity-0'
          }`}>
          <div className="space-y-3 text-right ">

            <div className="flex items-center justify-between">


              <span className="text-sm text-gray-600">مسئول پیگیری</span>

              <span className="text-sm  font-medium text-gray-900">سیما احدی</span>
            </div>

            {/* Request Source */}
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600">منبع ثبت در خواست</span>
              <span className="text-sm font-medium text-gray-900">ایمیل</span>
            </div>

            {/* Interest */}
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600">علاقه مندی</span>
              {tags && tags.length > 0 && (
                <div className="flex flex-wrap gap-1">
                  {tags.map((tag, index) => (
                    <Tag
                      key={index}
                      text={tag.label}
                      variant={tag.value === 'hot' ? 'hot' : tag.value === 'success' ? 'success' : tag.value === 'info' ? 'info' : 'default'}
                      size="sm"
                    />
                  ))}
                </div>
              )}
            </div>
            <div className="flex items-start gap-5 justify-between">
              <span className="text-sm text-gray-600">توضیحات</span>
              <span className="text-sm font-medium whitespace-normal text-gray-900">داده نمونه: احتمال خرید بلیط و تور پاریس یکطرفه</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}