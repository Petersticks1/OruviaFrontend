import { Icon } from '@/components/ui/Icon'
import { cn } from '@/lib/cn'

export interface RatingSummaryProps {
  rating: number
  reviewCount: number
  size?: 'sm' | 'md' | 'lg'
  className?: string
}

export function RatingSummary({
  rating,
  reviewCount,
  size = 'md',
  className,
}: RatingSummaryProps) {
  const iconSize = size === 'sm' ? 14 : size === 'lg' ? 20 : 16
  const textSize = size === 'sm' ? 'text-xs' : size === 'lg' ? 'text-lg' : 'text-sm'

  return (
    <div className={cn('inline-flex items-center gap-1.5', textSize, className)}>
      <Icon name="star" size={iconSize} className="text-star" />
      <span className="font-bold text-ink-900">{rating.toFixed(2).replace(/\.00$/, '.0')}</span>
      <span className="text-ink-300" aria-hidden="true">
        ·
      </span>
      <span className="font-medium text-ink-500 underline decoration-line underline-offset-2">
        {reviewCount} {reviewCount === 1 ? 'review' : 'reviews'}
      </span>
    </div>
  )
}

