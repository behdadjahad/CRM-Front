import React from "react";
import { BarChartInterface } from "../shared/bar-chart";
import { cn } from "@/lib/utils";
import dynamic from "next/dynamic";

export interface BarChartReportInterface {
  title: string;
  subtitle: string;
  barData: BarChartInterface;
  className?: string;
}

export default function BarChartReport({
  barData,
  subtitle,
  title,
  className,
}: BarChartReportInterface) {
  const BarChart = dynamic(() => import("@/components/shared/bar-chart"), {
    ssr: false,
  });

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
