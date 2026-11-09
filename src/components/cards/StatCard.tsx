import type { ReactNode } from 'react'
import { Card } from './Card'
import { Icon } from '@/components/ui/Icon'
import type { IconName } from '@/components/ui/icons'
import { Skeleton } from '@/components/ui/Skeleton'
import { cn } from '@/lib/cn'

export interface StatCardProps {
  icon: IconName
  label: string
  value: string | number
  delta?: string
  deltaTone?: 'positive' | 'negative' | 'neutral'
  sparklineSlot?: ReactNode
  className?: string
}

export function StatCard({
  icon,
  label,
  value,
  delta,
  deltaTone = 'positive',
  sparklineSlot,
  className,
}: StatCardProps) {
  const toneClass =
    deltaTone === 'positive'
      ? 'text-success bg-success/10'
      : deltaTone === 'negative'
        ? 'text-danger bg-danger/10'
        : 'text-ink-700 bg-surface-muted'

  return (
    <Card variant="elevated" padding="md" className={cn('flex flex-col justify-between gap-3', className)}>
      <div className="flex items-center justify-between">
        <span className="text-xs font-semibold uppercase tracking-wide text-ink-500">{label}</span>
        <span className="flex h-9 w-9 items-center justify-center rounded-full bg-brand-50 text-brand-600">
          <Icon name={icon} size={18} />
        </span>
      </div>
      <div className="flex items-end justify-between gap-2">
        <div>
          <p className="text-2xl font-bold tracking-tight text-ink-900">{value}</p>
          {delta ? (
            <span className={cn('mt-1 inline-block rounded-full px-2 py-0.5 text-xs font-semibold', toneClass)}>
              {delta}
            </span>
          ) : null}
        </div>
        {sparklineSlot ? <div className="shrink-0">{sparklineSlot}</div> : null}
      </div>
    </Card>
  )
}

export function StatCardSkeleton() {
  return (
    <Card variant="outlined" padding="md" className="space-y-3">
      <div className="flex items-center justify-between">
        <Skeleton className="h-3.5 w-24" rounded="sm" />
        <Skeleton className="h-9 w-9" rounded="pill" />
      </div>
      <Skeleton className="h-7 w-28" rounded="sm" />
      <Skeleton className="h-4 w-20" rounded="pill" />
    </Card>
  )
}

