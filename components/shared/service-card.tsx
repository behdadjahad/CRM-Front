"use client"

import { cn } from '@/lib/utils';
import Image from 'next/image';
import React from 'react'

export interface ServiceCardInterface {
  image: string;
  title: string;
  isActive?: boolean;
  clickFunction?: any;
  className?: string
  imageClassName?: string;
}

export default function ServiceCard({ image, title, isActive, clickFunction, className, imageClassName }: ServiceCardInterface) {
  return (
    <div
      className={cn('flex flex-col items-center justify-between text-xs text-right p-2 gap-2 border rounded-lg flex-1 min-w-24 h-32', className)}
      onClick={clickFunction}
    >
      <Image
        src={image}
        alt={title}
        width={1080}
        height={1080}
        id='service-image'
        className={cn('min-w-21 rounded-lg h-21 border border-border/20 object-contain', { 'border-secondary': isActive }, imageClassName)}
      />

      <span className=''>
        {title}
      </span>
    </div>
  )
}
