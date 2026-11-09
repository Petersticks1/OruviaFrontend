import { Card } from './Card'
import { Avatar } from '@/components/ui/Avatar'
import { Rating } from '@/components/ui/Rating'
import { Skeleton } from '@/components/ui/Skeleton'
import { formatRelativeDate } from '@/lib/formatters'
import type { Review } from '@/types/domain'

export interface ReviewCardProps {
  review: Review
  className?: string
}

export function ReviewCard({ review, className }: ReviewCardProps) {
  return (
    <Card variant="outlined" padding="md" className={className}>
      <Card.Header>
        <div className="flex items-center gap-3">
          <Avatar name={review.reviewerName} src={review.reviewerAvatar} size="sm" />
          <div>
            <h3 className="text-sm font-semibold text-ink-900">{review.reviewerName}</h3>
            <p className="text-xs capitalize text-ink-500">
              {review.reviewerRole} · {formatRelativeDate(review.createdAt)}
            </p>
          </div>
        </div>
        <Rating value={review.rating} size={14} />
      </Card.Header>
      <Card.Body className="mt-3">
        <p className="text-sm leading-relaxed text-ink-700">{review.comment}</p>
        {review.listingTitle ? (
          <p className="pt-1 text-xs font-medium text-ink-500">
            Inspected: {review.listingTitle}
          </p>
        ) : null}
      </Card.Body>
    </Card>
  )
}

export function ReviewCardSkeleton() {
  return (
    <Card variant="outlined" padding="md" className="space-y-3">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Skeleton className="h-9 w-9" rounded="pill" />
          <div className="space-y-1.5">
            <Skeleton className="h-3.5 w-28" rounded="sm" />
            <Skeleton className="h-3 w-20" rounded="sm" />
          </div>
        </div>
        <Skeleton className="h-4 w-12" rounded="sm" />
      </div>
      <Skeleton className="h-4 w-full" rounded="sm" />
      <Skeleton className="h-4 w-4/5" rounded="sm" />
    </Card>
  )
}

