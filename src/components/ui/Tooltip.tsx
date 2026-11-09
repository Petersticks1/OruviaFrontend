import { type ReactNode, useId } from 'react'
import { cn } from '@/lib/cn'

export interface TooltipProps {
  content: string
  children: ReactNode
  className?: string
}

export function Tooltip({ content, children, className }: TooltipProps) {
  const tooltipId = useId()

  return (
    <span className={cn('group relative inline-flex items-center', className)}>
      <span aria-describedby={tooltipId} className="inline-flex items-center">
        {children}
      </span>
      <span
        id={tooltipId}
        role="tooltip"
        className="pointer-events-none invisible absolute bottom-[calc(100%+0.4rem)] left-1/2 z-50 -translate-x-1/2 whitespace-nowrap rounded-[var(--radius-sm)] bg-ink-900 px-2.5 py-1 text-xs font-medium text-surface opacity-0 shadow-[var(--shadow-card)] transition-opacity duration-150 group-hover:visible group-hover:opacity-100 group-focus-within:visible group-focus-within:opacity-100"
      >
        {content}
      </span>
    </span>
  )
}

