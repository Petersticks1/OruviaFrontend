import type { ReactNode } from 'react'
import { cn } from '@/lib/cn'

export interface SectionHeaderProps {
  title: string
  subtitle?: string
  eyebrow?: string
  action?: ReactNode
  className?: string
}

export function SectionHeader({
  title,
  subtitle,
  eyebrow,
  action,
  className,
}: SectionHeaderProps) {
  return (
    <div className={cn('flex flex-wrap items-end justify-between gap-4', className)}>
      <div>
        {eyebrow ? (
          <p className="mb-1 text-xs font-semibold uppercase tracking-wider text-brand-600">
            {eyebrow}
          </p>
        ) : null}
        <h2 className="text-xl font-bold tracking-tight text-ink-900 sm:text-2xl">{title}</h2>
        {subtitle ? <p className="mt-1 text-sm text-ink-500">{subtitle}</p> : null}
      </div>
      {action ? <div className="shrink-0">{action}</div> : null}
    </div>
  )
}

