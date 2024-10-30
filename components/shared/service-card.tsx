import Image from 'next/image';
import React from 'react'

export interface ServiceCardInterface {
  image: string;
  title: string;
}

export default function ServiceCard({ image, title }: ServiceCardInterface) {
  return (
    <div className='flex flex-col items-center justify-between p-2 gap-2 border rounded-lg flex-1'>
      <Image src={image} alt={title} width={1080} height={1080} className='w-21 h-21' />

      <span className='flex flex-row justify-end w-full text-xs text-right'>
        {title}
      </span>
    </div>
  )
}
