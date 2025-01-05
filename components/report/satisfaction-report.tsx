import React from 'react'
import { cn } from '@/lib/utils';
import ProgressBar from '../shared/progress-bar';

export interface SatisfactionReportInterface {
  title: string;
  total: number;
  successful: number;
  className?: string;
}

export default function SatisfactionReport({ successful, total, title, className }: SatisfactionReportInterface) {
  return (
    <div
      className={cn(
        "bg-card flex flex-col border rounded-lg w-full p-6 gap-6",
        className
      )}
    >
      <span className="text-lg font-bold">{title}</span>

      <ProgressBar
        label="رضایتمندی"
        value={successful}
        total={total}
        color="#00AB55"
        backgroundColor="#00AB5533"
      />
      <ProgressBar
        label="نارضایتی"
        value={total - successful}
        total={total}
        color="#DB2E2E"
        backgroundColor="#DB2E2E33"
      />
    </div>
  );
}
