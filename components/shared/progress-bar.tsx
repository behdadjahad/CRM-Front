import { cn } from '@/lib/utils';
import React from 'react';

export interface ProgressBarProps {
  label: string;
  value: number;
  total: number;
  color: string;
  backgroundColor: string;
  className?: string;
}

export default function ProgressBar({
  label,
  value,
  total,
  color,
  backgroundColor,
  className
}: ProgressBarProps) {
  const percentage = Math.min((value / total) * 100, 100);

  return (
    <div className={cn('flex flex-col gap-1', className)}>
      <div className='flex flex-row justify-between text-sm'>
        <span >{label}</span>

        <span>({percentage.toFixed(1)}%) {value.toLocaleString()}</span>
      </div>

      <div className='h-2 rounded-sm overflow-hidden mt-1'
        style={{
          backgroundColor: backgroundColor,
        }}
      >
        <div className='h-full rounded-sm'
          style={{
            width: `${percentage}%`,
            backgroundColor: color,
          }}
        />
      </div>
    </div>
  );
}
