import { Button } from '@/components/ui/button'
import { Checkbox } from '@/components/ui/checkbox'
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu'
import { cn } from '@/lib/utils'
import { SettingsIcon } from 'lucide-react'
import React, { useState } from 'react'
import { MdAdd, MdExpandMore, MdFilterList } from 'react-icons/md'
interface LeadActionButtonsInterface {
    onSubmit: () => void
    onCancel: () => void
    isCompleted: boolean
    setIsCompleted: (isCompleted: boolean) => void
}

export default function EventHeaderActionButtons({
    onSubmit,
    onCancel,
    isCompleted,
    setIsCompleted,
}: LeadActionButtonsInterface) {
    const [eventStatus, setEventStatus] = useState<"done" | "pending" | "all">("all");
    const [eventTime, setEventTime] = useState<"" | "today" | "past" | "future" | "custom">("today");
    const statusList = [
        {
            label: "همه",
            value: "all"
        },
        {
            label: "انجام شده",
            value: "done"
        },
        {
            label: "انجام نشده",
            value: "pending"
        },
    ]
    const timeList = [
        {
            label: "امروز",
            value: "today"
        },
        {
            label: "گذشته",
            value: "past"
        },
        {
            label: "آینده",
            value: "future"
        },
        {
            label: "شخصی سازی",
            value: "custom"
        },
    ]



    return (
        <>
            {/* Action Buttons and Checkbox */}
            <div className="flex items-center justify-center gap-2 sm:gap-3 w-full sm:w-auto">
                {/* Action Buttons */}
                <Button variant="info"
                    onClick={onSubmit}
                    className="px-3 py-2 text-xs sm:text-sm flex-1 sm:flex-none"
                >
                    <span className="inline">رویداد جدید</span>

                    <MdAdd size={14} className="sm:mr-1" />
                </Button>
                <div className=''>
                    {/* show drpdown to sort event status */}
                    <DropdownMenu
                    >
                        <DropdownMenuTrigger>
                            <Button variant="outline"
                                onClick={onSubmit}
                                className="py-1 px-2 sm:px-3 text-static-text-secondary border-static-border-secondary text-xs sm:text-sm font-medium flex-1 sm:flex-none"
                            >
                                <MdExpandMore size={16} className="sm:w-6 sm:h-6" />
                                <span className="hidden sm:inline">
                                    {eventStatus === "all" ? "همه" : eventStatus === "done" ? "انجام شده" : "انجام نشده"}
                                </span>
                                <span className="sm:hidden">
                                    {eventStatus === "all" ? "همه" : eventStatus === "done" ? "انجام" : "انجام نشده"}
                                </span>
                            </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent>
                            {
                                statusList?.map((item) => (
                                    <DropdownMenuItem className={cn("hover:bg-static-border-neutral hover:text-static-text-secondary", eventStatus === item.value ? "bg-primary-foreground text-primary-active" : "")} onClick={() => setEventStatus(item.value as "done" | "pending" | "all")}>
                                        {item.label}
                                    </DropdownMenuItem>
                                ))}
                        </DropdownMenuContent>
                    </DropdownMenu>
                </div>
                <div>
                    <DropdownMenu>
                        <DropdownMenuTrigger>
                            <Button variant="outline"
                                onClick={onSubmit}
                                className=" py-1 px-3 text-static-text-secondary border-static-border-secondary  text-base font-medium"
                            >
                                <MdExpandMore size={25} />
                                {eventTime === "today" ? "امروز" : eventTime === "past" ? "گذشته" : eventTime === "future" ? "آینده" : "شخصی سازی"}
                            </Button>
                        </DropdownMenuTrigger>


                        <DropdownMenuContent>
                            {
                                timeList?.map((item) => (
                                    <DropdownMenuItem className={cn("hover:bg-static-border-neutral hover:text-static-text-secondary", eventTime === item.value ? "bg-primary-foreground text-primary-active" : "")} onClick={() => setEventTime(item.value as "today" | "past" | "future" | "custom")}>
                                        {item.label}
                                    </DropdownMenuItem>
                                ))}
                        </DropdownMenuContent>
                    </DropdownMenu>

                </div>
            </div>
        </>

    )
}