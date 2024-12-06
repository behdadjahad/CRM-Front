"use client"

import Image from 'next/image'
import React, { useState } from 'react'
import { Button } from '../ui/button'
import LeftDrawer from '../shared/left-drawer'

export default function Filter() {
  const [openFilter, setOpenFilter] = useState(false)
  return (
    <div className='flex items-center gap-4 text-sm'>
      <Button onClick={() => setOpenFilter(true)} variant={"ghost"} className='flex items-center gap-2'>
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

      <LeftDrawer setState={setOpenFilter} state={openFilter} />
    </div>
  )
}
