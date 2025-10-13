import FormMaker from '@/components/shared/form-maker'
import { useFormik } from 'formik'
import { ChevronDown } from 'lucide-react'
import React from 'react'

// TypeScript interfaces for API integration
export interface LeadInfoHeaderProps {
  title: string
  date: string
  userName: string
  userAvatarColor?: string
  userAvatarUrl?: string
  className?: string
}

// Default props for fallback values
const defaultProps: Partial<LeadInfoHeaderProps> = {
  userAvatarColor: 'bg-blue-500',
  className: ''
}

export default function LeadInfoHeader({
  title,
  date,
  userName,
  userAvatarColor = defaultProps.userAvatarColor,
  userAvatarUrl,
  className = defaultProps.className
}: LeadInfoHeaderProps) {

  const getUserInitials = (name: string): string => {
    return name.split(' ').map(word => word.charAt(0)).join('').toUpperCase()
  }

  const formik = useFormik({
    initialValues: {
      status: "INPROGRESS"
    },
    onSubmit: (values) => {
      console.log('Status changed:', values)
    }
  })

  return (
    <div className={`flex flex-col gap-3 p-3 mb-6 ${className}`}>
      {/* Main Title */}
      <h1 className="text-2xl flex flex-col gap-1 font-bold text-gray-900 mb-2">
        {title}
        <span className="text-xs font-normal text-gray-600">{date}</span>
      </h1>



 

      <FormMaker
        form={formik}
        fields={[
          {
            key: "status",
            component: "Select",
            placeholder: "وضعیت",
            options: [
              { label: "در جریان", value: "INPROGRESS" },
              { label: "تکمیل شده", value: "COMPLETED" }
            ],
            className: "w-full "
          }
        ]}
        className="w-full"
      />

    </div>
  )
}