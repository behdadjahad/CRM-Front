import { cn } from '@/lib/utils';
import Image from 'next/image';
import React from 'react'

export interface OverviewCardInterface {
  imageSrc: string;
  isProfit: boolean;
  price: string;
  className?: string;
}

export default function OverviewCard({ imageSrc, isProfit, price, className }: OverviewCardInterface) {
  return (
    <div
      className={cn(
        "flex items-center justify-between p-6 bg-secondary-hover/10 rounded-lg",
        className
      )}
    >
      <div className="flex flex-col items-start gap-4">
        <span className="font-medium text-xl">{isProfit ? "سود" : "زیان"}</span>

        <span className="font-bold text-[28px] !text-left">{price} $</span>
      </div>

      <Image
        src={imageSrc}
        alt={isProfit ? "سود" : "زیان"}
        width={52}
        height={62}
      />
    </div>
  );
}
