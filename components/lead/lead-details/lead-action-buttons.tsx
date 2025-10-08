import { Button } from '@/components/ui/button'
import { Checkbox } from '@/components/ui/checkbox'
import { SettingsIcon } from 'lucide-react'
import React from 'react'
interface LeadActionButtonsInterface {
  onSubmit: () => void
  onCancel: () => void
  isCompleted: boolean
  setIsCompleted: (isCompleted: boolean) => void
}

export default function LeadActionButtons({
  onSubmit,
  onCancel,
  isCompleted,
  setIsCompleted,
}: LeadActionButtonsInterface) {
  return (
  <>
   {/* Action Buttons and Checkbox */}
   <div className="flex items-center justify-between ">
                {/* Action Buttons */}
                <div className="flex gap-2.5">
                    <Button variant="info"
                        onClick={onSubmit}
                        className="px-8 py-2"
                    >
                        ثبت تغییرات
                    </Button>
                    <Button variant="foreground" className="px-16 py-2">
                        لغو
                    </Button>

                {/* Status Toggle */}
                <div className="flex items-center gap-2">
                    <label htmlFor="completed" className="text-sm font-medium">
                        انجام شده
                    </label>
                    <Checkbox
                        id="completed"
                        checked={isCompleted}
                        onCheckedChange={(checked) => setIsCompleted(checked === true)}
                    />
                </div>
                </div>
                {/* setting icon */}
                <div className='cursor-not-allowed hover:bg-static-border-neutral border p-3 border-[#E0E0E0] rounded-lg'>
                    <SettingsIcon className="w-5 h-5 text-[#717680]" />
                </div>

            </div>
  </>

  )
}