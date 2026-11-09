import { Icon } from '@/components/ui/Icon'
import type { IconName } from '@/components/ui/icons'
import { cn } from '@/lib/cn'

export interface FilterChipProps {
  label: string
  icon?: IconName
  active?: boolean
  count?: number
  onClick?: () => void
  onRemove?: () => void
  className?: string
}

export function FilterChip({
  label,
  icon,
  active = false,
  count,
  onClick,
  onRemove,
  className,
}: FilterChipProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-pressed={active}
      className={cn(
        'inline-flex shrink-0 items-center gap-2 rounded-full border px-4 py-2 text-xs font-semibold transition-all duration-150 cursor-pointer select-none active:scale-[0.98]',
        active
          ? 'border-ink-900 bg-ink-900 text-surface shadow-[var(--shadow-card)]'
          : 'border-line bg-surface text-ink-700 hover:border-ink-900 hover:text-ink-900',
        className,
      )}
    >
      {icon ? <Icon name={icon} size={16} /> : null}
      <span>{label}</span>
      {count !== undefined && count > 0 ? (
        <span
          className={cn(
            'flex h-4 min-w-4 items-center justify-center rounded-full px-1 text-[11px] font-bold',
            active ? 'bg-surface text-ink-900' : 'bg-brand-500 text-surface',
          )}
        >
          {count}
        </span>
      ) : null}
      {onRemove ? (
        <span
          role="button"
          tabIndex={0}
          aria-label={`Remove ${label} filter`}
          onClick={(e) => {
            e.stopPropagation()
            onRemove()
          }}
          onKeyDown={(e) => {
            if (e.key === 'Enter' || e.key === ' ') {
              e.stopPropagation()
              onRemove()
            }
          }}
          className="ml-0.5 rounded-full p-0.5 hover:bg-surface/20"
        >
          <Icon name="close" size={14} />
        </span>
      ) : null}
    </button>
  )
}

