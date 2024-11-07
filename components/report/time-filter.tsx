import React from 'react'
import { Button } from '../ui/button';
import { cn } from '@/lib/utils';
import DateInput from '../shared/date-input';
import Image from 'next/image';

export interface TimeFilterInterface {
  activeTime: string;
  setActiveTime: (data: any) => any
  isActivePeriodTime?: boolean
  className?: string
}

export default function TimeFilter({ activeTime, setActiveTime, className, isActivePeriodTime }: TimeFilterInterface) {
  const filters = [
    {
      label: "امروز",
      value: "today"
    },
    {
      label: "1 ماه",
      value: "1-months"
    },
    {
      label: "3 ماه",
      value: "3-months"
    },
    {
      label: "6 ماه",
      value: "6-months"
    },
    {
      label: "9 ماه",
      value: "9-months"
    },
    {
      label: "12 ماه",
      value: "12-months"
    },
  ]
  return (
    <div className={cn('w-full flex flex-row flex-nowrap overflow-auto gap-3', className)}>
      {
        filters.map(item => (
          <Button key={item.label}
            variant={activeTime == item.value ? "info" : "foreground"}
            onClick={() => setActiveTime(item.value)}
            className='flex-1'>
            {item.label}
          </Button>
        ))
      }

      <DateInput idKey={"startDate"} className='flex-1'>
        <Button
          variant={isActivePeriodTime ? "info" : "foreground"}
          onClick={() => setActiveTime(null)}
          className='flex flex-row gap-2.5 w-full'>
          <span>
            از تاریخ
          </span>

          <Image src={'/icons/calendar.png'} alt="edit" width={24} height={24} />
        </Button>
      </DateInput>

      <DateInput idKey={"endDate"} className='flex-1'>
        <Button
          variant={isActivePeriodTime ? "info" : "foreground"}
          onClick={() => setActiveTime(null)}
          className='flex flex-row gap-2.5 w-full'>
          <span>
            تا تاریخ
          </span>

          <Image src={'/icons/calendar.png'} alt="edit" width={24} height={24} />
        </Button>
      </DateInput>

    </div>
  )
}
