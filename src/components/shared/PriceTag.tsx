import { cn } from '@/lib/cn'
import { formatCompactNaira, formatNaira } from '@/lib/formatters'

export interface PriceTagProps {
  amount: number
  period?: 'year' | 'month' | 'total'
  compact?: boolean
  size?: 'sm' | 'md' | 'lg'
  className?: string
}

const sizeClasses = {
  sm: 'text-sm',
  md: 'text-base',
  lg: 'text-2xl',
} as const

export function PriceTag({
  amount,
  period = 'year',
  compact = false,
  size = 'md',
  className,
}: PriceTagProps) {
  const formatted = compact ? formatCompactNaira(amount) : formatNaira(amount)
  const suffix =
    period === 'year' ? ' / year' : period === 'month' ? ' / month' : ' total'

  return (
    <span className={cn('inline-flex items-baseline gap-1 text-ink-900', className)}>
      <span className={cn('font-bold tracking-tight', sizeClasses[size])}>{formatted}</span>
      <span className="text-xs font-normal text-ink-500">{suffix}</span>
    </span>
  )
}

