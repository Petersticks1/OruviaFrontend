import type { ReactNode } from 'react'
import { Card } from './Card'
import { Skeleton } from '@/components/ui/Skeleton'
import { cn } from '@/lib/cn'

export interface SectionCardProps {
  title: string
  subtitle?: string
  action?: ReactNode
  children: ReactNode
  footer?: ReactNode
  className?: string
}

export function SectionCard({
  title,
  subtitle,
  action,
  children,
  footer,
  className,
}: SectionCardProps) {
  return (
    <Card variant="outlined" padding="lg" className={cn('space-y-4', className)}>
      <Card.Header className="border-b border-line pb-4">
        <div>
          <h2 className="text-base font-bold text-ink-900">{title}</h2>
          {subtitle ? <p className="mt-0.5 text-xs text-ink-500">{subtitle}</p> : null}
        </div>
        {action ? <div>{action}</div> : null}
      </Card.Header>
      <Card.Body>{children}</Card.Body>
      {footer ? <Card.Footer className="border-t border-line pt-4">{footer}</Card.Footer> : null}
    </Card>
  )
}

export function SectionCardSkeleton() {
  return (
    <Card variant="outlined" padding="lg" className="space-y-4">
      <div className="border-b border-line pb-4 space-y-1.5">
        <Skeleton className="h-5 w-40" rounded="sm" />
        <Skeleton className="h-3 w-64" rounded="sm" />
      </div>
      <div className="space-y-2.5">
        <Skeleton className="h-4 w-full" rounded="sm" />
        <Skeleton className="h-4 w-5/6" rounded="sm" />
        <Skeleton className="h-4 w-2/3" rounded="sm" />
      </div>
    </Card>
  )
}

