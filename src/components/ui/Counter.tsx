import { IconButton } from './IconButton'
import { cn } from '@/lib/cn'

export interface CounterProps {
  label: string
  subtitle?: string
  value: number
  min?: number
  max?: number
  onChange: (value: number) => void
  className?: string
}

export function Counter({
  label,
  subtitle,
  value,
  min = 0,
  max = 20,
  onChange,
  className,
}: CounterProps) {
  return (
    <div className={cn('flex items-center justify-between gap-4 py-2', className)}>
      <div>
        <p className="text-sm font-medium text-ink-900">{label}</p>
        {subtitle ? <p className="text-xs text-ink-500">{subtitle}</p> : null}
      </div>
      <div className="flex items-center gap-3">
        <IconButton
          icon="minus"
          size="sm"
          variant="outline"
          aria-label={`Decrease ${label}`}
          disabled={value <= min}
          onClick={() => onChange(Math.max(min, value - 1))}
        />
        <span
          aria-live="polite"
          className="w-6 text-center text-sm font-semibold tabular-nums text-ink-900"
        >
          {value === 0 ? 'Any' : value}
        </span>
        <IconButton
          icon="plus"
          size="sm"
          variant="outline"
          aria-label={`Increase ${label}`}
          disabled={value >= max}
          onClick={() => onChange(Math.min(max, value + 1))}
        />
      </div>
    </div>
  )
}

