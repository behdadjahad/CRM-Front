import { cn } from '@/lib/utils';
import React from 'react'

export interface ContractOverviewInterface {
  list: {
    label: string;
    value: string;
  }[]
  className?: string
}

export default function ContractOverview({ list, className }: ContractOverviewInterface) {
  return (
    <div
      className={cn(
        "bg-card grid grid-cols-1 md:grid-cols-3 shadow-[0px_12px_24px_-4px_#919EAB1F] gap-y-2 rounded-2xl p-4",
        className
      )}
    >
      {list.map((item, index) => (
        <div
          key={item.label}
          className={cn(
            "flex flex-col gap-1 items-center md:px-4",
            {
              "pb-2 md:pb-0 border-b border-dashed md:border-b-0":
                index < list.length - 1,
            },
            {
              "md:border-r md:border-l border-dashed": index == 1,
            }
          )}
        >
          <span className="text-lg font-bold">{item.label}</span>

          <div className="flex text-sm gap-1">
            <span className="font-bold">{item.value}</span>
            <span>قرارداد</span>
          </div>
        </div>
      ))}
    </div>
  );
}
