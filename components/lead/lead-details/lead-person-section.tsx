import React from 'react'

export default function LeadPersonSection() {
  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 w-full max-w-[429px]">
      {/* Header */}
      <h2 className="text-lg font-semibold text-gray-900 text-center mb-4">شخص</h2>

      {/* Person Details */}
      <div className="space-y-3 text-right">
        {/* Name */}
        <div className="flex items-center justify-between">
          <span className="text-sm text-gray-600">نام و نام خانوادگی</span>
          <span className="text-sm font-medium text-gray-900">مینا فرجاد</span>
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
          <div className="flex gap-2">
            <span className="bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded-full">خوش اخلاق</span>
            <span className="bg-green-100 text-green-800 text-xs px-2 py-1 rounded-full">پولدار</span>
            <span className="bg-purple-100 text-purple-800 text-xs px-2 py-1 rounded-full">پیگیر</span>
          </div>
        </div>
      </div>
    </div>
  )
}   