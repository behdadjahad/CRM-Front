import React from 'react'
import { cn } from '@/lib/utils';
import { PieChartInterface } from "../shared/pie-chart";
import dynamic from "next/dynamic";

export interface PieChartReportInterface {
  title: string;
  barData: PieChartInterface;
  className?: string;
}

export default function PieChartReport({
  barData,
  title,
  className,
}: PieChartReportInterface) {
  const PieChart = dynamic(() => import("@/components/shared/pie-chart"), {
    ssr: false,
  });

  return (
    <div
      className={cn(
        "bg-card flex flex-col border rounded-lg w-full",
        className
      )}
    >
      <span className="text-lg font-bold p-6">{title}</span>

      <PieChart {...barData} />
    </div>
  );
}
