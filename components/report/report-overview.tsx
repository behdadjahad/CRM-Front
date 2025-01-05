import React from 'react'
import OverviewCard, { OverviewCardInterface } from './overview-card'
import { cn } from '@/lib/utils';

export interface ReportOverviewInterface {
  overviews: OverviewCardInterface[];
  className?: string;
}

export default function ReportOverview({ overviews, className }: ReportOverviewInterface) {
  return (
    <div className={cn("flex flex-col md:flex-row gap-x-6 gap-y-5", className)}>
      {overviews.map((item, index) => (
        <OverviewCard {...item} key={item.price + index} className="flex-1" />
      ))}
    </div>
  );
}
