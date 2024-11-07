import { cn } from '@/lib/utils';
import React from 'react'

export interface CallContractsInterface {
  contracts: {
    label: string;
    count: number;
    percentage: number;
  }[];
  className?: string
}

export default function CallContracts({ contracts, className }: CallContractsInterface) {
  return (
    <div className={cn('flex flex-col items-start gap-7 p-6 border rounded-lg w-full', className)}>
      <span className='font-bold text-lg'>
        درصد قرارداد ها بر اساس تماس
      </span>
      <div className='flex flex-col gap-6 w-full'>
        {
          contracts.map((item, index) => (
            <div key={item.label + index} className='flex flex-row items-center justify-between w-full'>
              <div className="flex flex-col">
                <span className='text-sm'>
                  {item.label}
                </span>
                <span className='text-xs text-subtitle'>
                  {item.count}
                </span>
              </div>

              <span className='text-xs font-bold'>
                {item.percentage}%
              </span>
            </div>
          ))
        }
      </div>
    </div>
  )
}
