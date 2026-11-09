import type { ReactNode } from 'react'
import { Icon } from './Icon'
import type { IconName } from './icons'
import { cn } from '@/lib/cn'

export interface TabItem {
  id: string
  label: string
  icon?: IconName
  badge?: number | string
}

export interface TabsProps {
  items: readonly TabItem[]
  activeId: string
  onChange: (id: string) => void
  variant?: 'underline' | 'pills'
  children?: ReactNode
  className?: string
}

export function Tabs({
  items,
  activeId,
  onChange,
  variant = 'underline',
  children,
  className,
}: TabsProps) {
  return (
    <div className={cn('w-full', className)}>
      <div
        role="tablist"
        className={cn(
          'flex items-center gap-2 overflow-x-auto no-scrollbar',
          variant === 'underline'
            ? 'border-b border-line'
            : 'inline-flex rounded-full bg-surface-muted p-1 border border-line',
        )}
      >
        {items.map((item) => {
          const isActive = item.id === activeId
          return (
            <button
              key={item.id}
              type="button"
              role="tab"
              aria-selected={isActive}
              onClick={() => onChange(item.id)}
              className={cn(
                'inline-flex shrink-0 items-center gap-2 text-sm font-semibold transition-all duration-150 cursor-pointer',
                variant === 'underline'
                  ? cn(
                      'border-b-2 px-3 py-3',
                      isActive
                        ? 'border-ink-900 text-ink-900'
                        : 'border-transparent text-ink-500 hover:border-line hover:text-ink-900',
                    )
                  : cn(
                      'rounded-full px-4 py-1.5',
                      isActive
                        ? 'bg-surface text-ink-900 shadow-[var(--shadow-card)]'
                        : 'text-ink-500 hover:text-ink-900',
                    ),
              )}
            >
              {item.icon ? <Icon name={item.icon} size={18} /> : null}
              <span>{item.label}</span>
              {item.badge !== undefined ? (
                <span
                  className={cn(
                    'rounded-full px-1.5 py-0.2 text-xs',
                    isActive ? 'bg-brand-500 text-surface' : 'bg-line text-ink-700',
                  )}
                >
                  {item.badge}
                </span>
              ) : null}
            </button>
          )
        })}
      </div>
      {children ? <div className="pt-4">{children}</div> : null}
    </div>
  )
}

