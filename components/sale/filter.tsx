import Image from 'next/image'
import React from 'react'
import { Button } from '../ui/button'

export default function Filter() {
  return (
    <div className='flex items-center gap-4 text-sm'>
      <Button variant={"ghost"} className='flex items-center gap-2'>
        <Image src={'/icons/filter.png'} alt='Filter' width={24} height={24} />

        <span>
          فیلتر
        </span>
      </Button>

      <Button variant={"ghost"} className='flex items-center gap-2'>
        <Image src={'/icons/sort-ascending.png'} alt='Sort' width={24} height={24} />

        <span>
          مرتب سازی بر اساس
        </span>
      </Button>
    </div>
  )
}
