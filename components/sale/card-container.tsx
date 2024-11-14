import React from 'react'
import { cn } from '@/lib/utils';
import VisaCard, { VisaCardInterface } from './visa-card';

export interface CardContainerInterface {
  list: VisaCardInterface[];
  className?: string;
}

export default function CardContainer({ list, className }: CardContainerInterface) {
  return (
    <div className={cn("grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5", className)}>
      {
        list.map((item, index) => (
          <VisaCard
            {...item}
            key={item.header.submitDate + item.user.name + index}
          />
        ))
      }
    </div>
  )
}
