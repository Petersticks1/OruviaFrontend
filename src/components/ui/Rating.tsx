import { Icon } from './Icon'
import { cn } from '@/lib/cn'

export interface RatingProps {
  value: number
  max?: number
  onChange?: (value: number) => void
  size?: number
  showValue?: boolean
  reviewCount?: number
  className?: string
}

export function Rating({
  value,
  max = 5,
  onChange,
  size = 15,
  showValue = true,
  reviewCount,
  className,
}: RatingProps) {
  const isInteractive = typeof onChange === 'function'

  if (!isInteractive) {
    return (
      <span className={cn('inline-flex items-center gap-1 text-sm', className)}>
        <Icon name="star" size={size} className="text-ink-900" />
        {showValue ? (
          <span className="font-semibold text-ink-900">{value.toFixed(2).replace(/\.00$/, '.0')}</span>
        ) : null}
        {reviewCount !== undefined ? (
          <span className="text-ink-500">({reviewCount})</span>
        ) : null}
      </span>
    )
  }

  return (
    <div className={cn('inline-flex items-center gap-1', className)} role="radiogroup" aria-label="Rating">
      {Array.from({ length: max }, (_, i) => {
        const starVal = i + 1
        const filled = starVal <= Math.round(value)
        return (
          <button
            key={starVal}
            type="button"
            role="radio"
            aria-checked={filled}
            aria-label={`Rate ${starVal} out of ${max} stars`}
            onClick={() => onChange(starVal)}
            className="cursor-pointer rounded p-0.5 text-star transition-transform hover:scale-110"
          >
            <Icon name={filled ? 'star' : 'starOutline'} size={size + 4} />
          </button>
        )
      })}
    </div>
  )
}

