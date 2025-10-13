import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button';
import { leadFollowUpTypeList } from '@/constants/lead';
import { Check, CheckCircle, ChevronLeft, ChevronRight, Clock, Edit3, Pencil, Trash, Trash2, X } from 'lucide-react'
import React from 'react'

const iconsList = [
    {
        name: "done",
        icon: <div className='bg-[#1C68DA] rounded-full w-5 h-5 flex items-center justify-center text-primary-active'>
            <ChevronRight className="w-4 text-white h-4" />
        </div>
    },
    {
        name: "pending",
        icon: <div className='bg-[#F8AC3F] rounded-full w-5 h-5 flex items-center justify-center text-white'>
            <ChevronRight className="w-4 h-4 text-white" />
        </div>
    },
    {
        name: "cancel",
        icon: <div className='bg-[#B42318] rounded-full w-5 h-5 flex items-center justify-center text-white'>
            <ChevronLeft className="w-4 h-4 text-white" />
        </div>
    },
    {
        name: "success",
        icon: <div className='bg-[#039855] rounded-full w-5 h-5 flex items-center justify-center text-white'>
            <Check className="w-4 h-4 text-white" />
        </div>
    },
]

interface EventStatusCardInterface {
    status: string;
    personName: string;
    date: string;
    time: "today" | "past" | "future";
    type: "voice" | "sms" | "email" | "meeting" | "voip";
    // Call, SMS, Email, Meeting, VOIP
}

// Function to determine the appropriate icon based on status and time
const getEventIcon = (status: string, time: "today" | "past" | "future") => {
    // Green: Completed/done events
    if (status === "success" || (time === "past" && status === "done")) {
        return iconsList.find((item) => item.name === "success")?.icon;
    }

    // Red: Past events that are undone (not completed)
    if (time === "past" && status !== "done") {
        return iconsList.find((item) => item.name === "cancel")?.icon;
    }

    // Yellow: Today or future events that are pending
    if ((time === "today" || time === "future") && status === "pending") {
        return iconsList.find((item) => item.name === "pending")?.icon;
    }

    // Blue: Today or future events that are scheduled/in progress
    if ((time === "today" || time === "future") && status === "done") {
        return iconsList.find((item) => item.name === "done")?.icon;
    }

    // Default: fallback to status-based icon
    return iconsList.find((item) => item.name === status)?.icon;
};

export default function EventStatusCard({ status, personName, date, time, type }: EventStatusCardInterface) {
    return (
        // each bitem must be selectable as rDIO BUTTON
        <div className="w-full bg-[#F8FAFF] rounded-[8px] p-4 flex items-center justify-end gap-2">

            {/* delete and edit buttons */}
            <div className="flex w-11/12  self-baseline items-center gap-2">
                <Button variant="ghost" >
                    <Trash2 size={18} color='#535862' />
                </Button>
                <Button variant="ghost">
                    <Edit3 size={18} color='#535862' />
                </Button>
            </div>

            <div className="flex items-end flex-col justify-between mr-2">
                <div className="flex items-center gap-2">
                    <div className="text-sm font-bold text-[#181D27]">
                        {leadFollowUpTypeList?.find((item) => item.value === type)?.label}
                    </div>
                    <span className="font-bold text-sm whitespace-nowrap">
                        {getEventIcon(status, time)}
                    </span>
                </div>


                <div className="text-sm whitespace-nowrap font-normal text-[#535862]">
                    {personName},
                    {date}
                </div>
            </div>
            {/* probably it should be check circle for selection */}
            <div className="w-4 h-4 border-[#1C68DA] border-2 rounded-full  "></div>

        </div>
    )
}   