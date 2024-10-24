import { cn } from '@/lib/utils';
import React from 'react'
import { NavLink } from './nav-link';

export interface BreadcrumbInterface {
  list: {
    label: string;
    link?: string;
  }[];
  className?: string;
}

export default function Breadcrumb({ list, className }: BreadcrumbInterface) {
  return (
    <div className={cn('flex flex-row', className)}>
      {list.map((item, index) => (
        (index == list.length - 1) ? (
          <span key={item.label + index} className='text-xs'>
            {item.label}
          </span>
        ) : (
          <NavLink
            key={item.label + index}
            link={item.link || ''}
            label={item.label}
            className='text-xs text-foreground-mute'
          >
            <span className='mx-1'>/</span>
          </NavLink>
        )
      ))}
    </div>
  )
}
