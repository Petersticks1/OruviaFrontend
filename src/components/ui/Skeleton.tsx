import type { HTMLAttributes } from 'react'
import { cn } from '@/lib/cn'

export interface SkeletonProps extends HTMLAttributes<HTMLDivElement> {
  rounded?: 'sm' | 'md' | 'lg' | 'pill'
}

const radiusClasses = {
  sm: 'rounded-[var(--radius-sm)]',
  md: 'rounded-[var(--radius-md)]',
  lg: 'rounded-[var(--radius-lg)]',
  pill: 'rounded-full',
} as const

export function Skeleton({ className, rounded = 'md', ...props }: SkeletonProps) {
  return (
    <div
      aria-hidden="true"
      className={cn('animate-pulse bg-line/60', radiusClasses[rounded], className)}
      {...props}
    />
  )
}

