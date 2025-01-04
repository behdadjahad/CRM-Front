import { cn } from '@/lib/utils';
import React from 'react'

export interface TitleInterface {
  label: string;
  className?: string
}

export default function Title({ label, className }: TitleInterface) {
  return (
    <h1 className={cn("leading-9 md:leading-loose", className)}>{label}</h1>
  );
}
