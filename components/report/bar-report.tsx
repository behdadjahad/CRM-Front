import React from 'react'
import BarChart, { BarChartInterface } from '../shared/bar-chart';
import { cn } from '@/lib/utils';

export interface BarChartReportInterface {
  title: string;
  subtitle: string;
  barData: BarChartInterface;
  className?: string;
}

export default function BarChartReport({ barData, subtitle, title, className }: BarChartReportInterface) {
  return (
    <div
      className={cn(
        "bg-card flex flex-col border rounded-lg w-full",
        className
      )}
    >
      <div className="flex flex-col gap-2 p-6">
        <span className="text-lg font-bold">{title}</span>

        <span className="text-sm text-subtitle">{subtitle}</span>
      </div>

      <BarChart {...barData} />
    </div>
  );
}
