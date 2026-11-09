import type { ReactNode } from 'react'
import { Card } from './Card'
import { Button } from '@/components/ui/Button'
import { Icon } from '@/components/ui/Icon'
import type { IconName } from '@/components/ui/icons'
import { Skeleton } from '@/components/ui/Skeleton'
import { cn } from '@/lib/cn'

export interface EmptyStateCardProps {
  icon?: IconName
  title: string
  description: string
  actionLabel?: string
  onAction?: () => void
  secondaryAction?: ReactNode
  className?: string
}

export function EmptyStateCard({
  icon = 'search',
  title,
  description,
  actionLabel,
  onAction,
  secondaryAction,
  className,
}: EmptyStateCardProps) {
  return (
    <Card
      variant="outlined"
      padding="lg"
      className={cn(
        'flex flex-col items-center justify-center py-12 text-center',
        className,
      )}
    >
      <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-brand-50 text-brand-600">
        <Icon name={icon} size={26} />
      </div>
      <h3 className="text-lg font-bold text-ink-900">{title}</h3>
      <p className="mt-1.5 max-w-md text-sm text-ink-500">{description}</p>
      {actionLabel && onAction ? (
        <div className="mt-5 flex flex-wrap items-center justify-center gap-3">
          <Button variant="primary" size="md" onClick={onAction}>
            {actionLabel}
          </Button>
          {secondaryAction}
        </div>
      ) : secondaryAction ? (
        <div className="mt-5">{secondaryAction}</div>
      ) : null}
    </Card>
  )
}

export function EmptyStateCardSkeleton() {
  return (
    <Card variant="outlined" padding="lg" className="flex flex-col items-center py-12 space-y-3">
      <Skeleton className="h-14 w-14" rounded="pill" />
      <Skeleton className="h-5 w-48" rounded="sm" />
      <Skeleton className="h-4 w-72" rounded="sm" />
      <Skeleton className="h-10 w-36 mt-2" rounded="sm" />
    </Card>
  )
}

