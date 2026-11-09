import type { HTMLAttributes, ReactNode } from 'react'
import { cn } from '@/lib/cn'

export interface PageContainerProps extends HTMLAttributes<HTMLDivElement> {
  children: ReactNode
  narrow?: boolean
}

export function PageContainer({
  children,
  narrow = false,
  className,
  ...props
}: PageContainerProps) {
  return (
    <div
      className={cn(
        'mx-auto w-full px-4 sm:px-6 lg:px-10',
        narrow ? 'max-w-5xl' : 'max-w-[1440px]',
        className,
      )}
      {...props}
    >
      {children}
    </div>
  )
}

