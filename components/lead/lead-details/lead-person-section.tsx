import { ChevronDown } from 'lucide-react'
import Tag from '@/components/shared/Tag'
import React, { useState } from 'react'

export default function LeadPersonSection() {
  const [isPersonOpen, setIsPersonOpen] = useState(false)
  const togglePerson = () => {
    setIsPersonOpen(!isPersonOpen)
  }

  const tags = [
    {
      label: 'خوش اخلاق',
      value: 'info'
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
    <div className="">
      {/* Person Section - Dropdown */}
      <div className="mb-6">
        {/* Dropdown Header */}
        <button
          onClick={togglePerson}
          className="w-full flex items-center justify-between p-3 rounded-lg hover:bg-gray-100 transition-colors"
        >
          <h2 className="text-lg font-semibold text-gray-900">شخص</h2>
          <ChevronDown
            className={`w-4 h-4 text-gray-600 transition-transform duration-200 ${isPersonOpen ? 'rotate-180' : ''
              }`}
          />
        </button>
        {/* Dropdown Content */}
        <div className={`overflow-hidden px-4 transition-all duration-300 ${isPersonOpen ? 'max-h-96 opacity-100 mt-3' : 'max-h-0 opacity-0'
          }`}>
          <div className="space-y-3 text-right">
            {/* Name */}
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600"> نام و نام خانوادگی  </span>
              <span className="text-sm font-medium text-gray-900"> مینا فرجاد </span>
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

            {/* Tags */}
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600">برچسب ها</span>
              {tags && tags.length > 0 && (
                <div className="flex flex-wrap gap-1">
                  {tags.map((tag, index) => (
                    <Tag
                      className='border-[#717680]'
                      onClose={() => console.log('close')}
                      closable
                      key={index}
                      text={tag.label}
                      variant={'default'}
                      size="sm"
                    />
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}   