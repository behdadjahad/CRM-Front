import { cn } from '@/lib/utils';
import React from 'react'

export interface OverviewInterface {
  list: {
    icon: React.ReactNode;
    label: string;
    value: string;
  }[]
  className?: string
}

export default function Overview({ list, className }: OverviewInterface) {
  return (
    <div
      className={cn(
        "rounded-xl p-6 bg-background-active shadow-[0px_12px_24px_-4px_#919EAB1F] w-full grid grid-cols-1 gap-y-5 md:grid-cols-2 items-center",
        className
      )}
    >
      {list.map((item, index) => (
        <div
          key={item.label}
          className={cn(
            "flex flex-col gap-3 md:gap-5 items-center justify-center text-foreground",
            { "md:border-l border-dashed": index == 0 }
          )}
        >
          <div className="flex gap-2 items-center justify-center">
            {item.icon}

            <span className="text-sm font-normal">{item.label}:</span>
          </div>

          <span className="font-bold text-base">{item.value}</span>
        </div>
      ))}
    </div>
  );
}
