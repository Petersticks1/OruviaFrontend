import { Button } from './Button'
import { cn } from '@/lib/cn'

export interface LoadMoreProps {
  hasMore: boolean
  loading?: boolean
  shownCount: number
  totalCount: number
  onLoadMore: () => void
  className?: string
}

export function LoadMore({
  hasMore,
  loading = false,
  shownCount,
  totalCount,
  onLoadMore,
  className,
}: LoadMoreProps) {
  return (
    <div className={cn('flex flex-col items-center gap-3 py-8 text-center', className)}>
      <p className="text-sm font-medium text-ink-700">
        Showing <span className="font-semibold text-ink-900">{shownCount}</span> of{' '}
        <span className="font-semibold text-ink-900">{totalCount}</span> verified properties
      </p>
      {hasMore ? (
        <Button variant="secondary" size="md" loading={loading} onClick={onLoadMore}>
          Show more homes
        </Button>
      ) : null}
    </div>
  )
}

