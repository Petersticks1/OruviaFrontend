import { cva, type VariantProps } from 'class-variance-authority'
import { type ButtonHTMLAttributes, forwardRef } from 'react'
import { Icon } from './Icon'
import type { IconName } from './icons'
import { cn } from '@/lib/cn'

const iconButtonVariants = cva(
  'inline-flex items-center justify-center rounded-full transition-all duration-150 ease-out active:scale-[0.95] disabled:pointer-events-none disabled:opacity-50 cursor-pointer shrink-0',
  {
    variants: {
      variant: {
        surface:
          'bg-surface/90 text-ink-900 shadow-[var(--shadow-card)] hover:bg-surface hover:scale-105 backdrop-blur-sm',
        outline:
          'border border-line bg-surface text-ink-900 hover:border-ink-900 hover:bg-surface-muted',
        ghost: 'bg-transparent text-ink-700 hover:bg-surface-muted hover:text-ink-900',
        brand: 'bg-brand-500 text-surface hover:bg-brand-600 shadow-[var(--shadow-card)]',
      },
      size: {
        sm: 'h-8 w-8',
        md: 'h-10 w-10',
        lg: 'h-12 w-12',
      },
    },
    defaultVariants: {
      variant: 'surface',
      size: 'md',
    },
  },
)

export interface IconButtonProps
  extends Omit<ButtonHTMLAttributes<HTMLButtonElement>, 'aria-label'>,
    VariantProps<typeof iconButtonVariants> {
  icon: IconName
  'aria-label': string
  iconClassName?: string
}

export const IconButton = forwardRef<HTMLButtonElement, IconButtonProps>(
  ({ className, variant, size, icon, iconClassName, type = 'button', ...props }, ref) => {
    const iconSize = size === 'sm' ? 16 : size === 'lg' ? 22 : 18
    return (
      <button
        ref={ref}
        type={type}
        className={cn(iconButtonVariants({ variant, size }), className)}
        {...props}
      >
        <Icon name={icon} size={iconSize} className={iconClassName} />
      </button>
    )
  },
)

IconButton.displayName = 'IconButton'

