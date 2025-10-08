import React from 'react'
import { Button } from '@/components/ui/button'

export default function LeadOrganizationSection() {
  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 w-full max-w-[429px]">
      {/* Header */}
      <h2 className="text-lg font-semibold text-gray-900 text-center mb-4">سازمان</h2>

      {/* Organization Details */}
      <div className="space-y-3 text-right mb-6">
        {/* Organization Name */}
        <div className="flex items-center justify-between">
          <span className="text-sm text-gray-600">نام</span>
          <span className="text-sm font-medium text-gray-900">پارس ایر</span>
        </div>

        {/* Email */}
        <div className="flex items-center justify-between">
          <span className="text-sm text-gray-600">ایمیل</span>
          <span className="text-sm font-medium text-gray-900">ParsAir@Gmail.Com</span>
        </div>

        {/* Phone */}
        <div className="flex items-center justify-between">
          <span className="text-sm text-gray-600">شماره تلفن</span>
          <span className="text-sm font-medium text-gray-900">۰۹۱۷۷۸۹۵۲۳۶</span>
        </div>
      </div>

      {/* Bottom Buttons */}
      <div className="flex gap-3 pt-4 border-t border-gray-200">
        <Button variant="outline" className="flex-1 text-sm">
          بستن درخواست
        </Button>
        <Button className="flex-1 bg-orange-500 hover:bg-orange-600 text-white text-sm">
          تبدیل به قرارداد
        </Button>
      </div>
    </div>
  )
}