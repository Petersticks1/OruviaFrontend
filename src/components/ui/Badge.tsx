import { cva, type VariantProps } from 'class-variance-authority'
import type { HTMLAttributes } from 'react'
import { Icon } from './Icon'
import type { IconName } from './icons'
import { cn } from '@/lib/cn'

const badgeVariants = cva(
  'inline-flex items-center gap-1.5 rounded-full px-2.5 py-0.5 text-xs font-semibold tracking-tight transition-colors',
  {
    variants: {
      variant: {
        default: 'bg-surface-muted text-ink-900 border border-line',
        brand: 'bg-brand-50 text-brand-700',
        verified: 'bg-verified text-surface shadow-[var(--shadow-card)]',
        success: 'bg-success/12 text-success',
        danger: 'bg-danger/12 text-danger',
        warning: 'bg-star/20 text-ink-900',
        info: 'bg-info/12 text-info',
        surface: 'bg-surface/95 text-ink-900 shadow-[var(--shadow-card)] backdrop-blur-sm',
      },
    },
    defaultVariants: {
      variant: 'default',
    },
  },
)

export interface BadgeProps
  extends HTMLAttributes<HTMLSpanElement>,
    VariantProps<typeof badgeVariants> {
  icon?: IconName
}

export function Badge({ className, variant, icon, children, ...props }: BadgeProps) {
  return (
    <span className={cn(badgeVariants({ variant }), className)} {...props}>
      {icon ? <Icon name={icon} size={13} /> : null}
      <span>{children}</span>
    </span>
  )
}

