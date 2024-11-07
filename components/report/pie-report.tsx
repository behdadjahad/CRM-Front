import React from 'react'
import { cn } from '@/lib/utils';
import PieChart, { PieChartInterface } from '../shared/pie-chart';

export interface PieChartReportInterface {
  title: string;
  barData: PieChartInterface;
  className?: string;
}

export default function PieChartReport({ barData, title, className }: PieChartReportInterface) {
  return (
    <div className={cn("flex flex-col border rounded-lg w-full", className)}>
      <span className="text-lg font-bold p-6">
        {title}
      </span>

      <PieChart {...barData} />
    </div>
  )
}
