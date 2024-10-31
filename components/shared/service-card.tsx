"use client"

import { cn } from '@/lib/utils';
import Image from 'next/image';
import React from 'react'

export interface ServiceCardInterface {
  image: string;
  title: string;
  isActive?: boolean;
  clickFunction?: any
}

export default function ServiceCard({ image, title, isActive, clickFunction }: ServiceCardInterface) {
  return (
    <div
      className='flex flex-col items-center justify-between p-2 gap-2 border rounded-lg flex-1 min-w-24 h-32'
      onClick={clickFunction}
    >
      <Image
        src={image}
        alt={title}
        width={1080}
        height={1080}
        className={cn('min-w-21 rounded-lg h-21 border border-border/20 object-contain', { 'border-secondary': isActive })}
      />

      <span className='flex flex-row justify-end w-full text-xs text-right'>
        {title}
      </span>
    </div>
  )
}
