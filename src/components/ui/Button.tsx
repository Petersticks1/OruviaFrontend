import { cva, type VariantProps } from 'class-variance-authority'
import { type ButtonHTMLAttributes, forwardRef } from 'react'
import { Icon } from './Icon'
import type { IconName } from './icons'
import { cn } from '@/lib/cn'

const buttonVariants = cva(
  'inline-flex items-center justify-center gap-2 rounded-[var(--radius-sm)] font-semibold transition-all duration-150 ease-out active:scale-[0.98] disabled:pointer-events-none disabled:opacity-50 cursor-pointer select-none',
  {
    variants: {
      variant: {
        primary: 'bg-gradient-brand text-surface shadow-[var(--shadow-card)] hover:shadow-[var(--shadow-hover)]',
        secondary:
          'border border-ink-900 bg-surface text-ink-900 hover:bg-surface-muted',
        outline:
          'border border-line bg-surface text-ink-900 hover:border-ink-900 hover:bg-surface-muted',
        ghost: 'bg-transparent text-ink-900 hover:bg-surface-muted',
        link: 'bg-transparent text-ink-900 underline underline-offset-4 hover:text-brand-600 p-0 h-auto',
        destructive: 'bg-danger text-surface hover:opacity-95 shadow-[var(--shadow-card)]',
      },
      size: {
        sm: 'h-9 px-3.5 text-xs',
        md: 'h-11 px-5 text-sm',
        lg: 'h-12 px-6 text-base',
      },
      fullWidth: {
        true: 'w-full',
        false: '',
      },
    },
    defaultVariants: {
      variant: 'primary',
      size: 'md',
      fullWidth: false,
    },
  },
)

export interface ButtonProps
  extends ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  loading?: boolean
  leftIcon?: IconName
  rightIcon?: IconName
}

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      className,
      variant,
      size,
      fullWidth,
      loading = false,
      leftIcon,
      rightIcon,
      disabled,
      children,
      type = 'button',
      ...props
    },
    ref,
  ) => {
    const iconSize = size === 'sm' ? 16 : size === 'lg' ? 20 : 18

    return (
      <button
        ref={ref}
        type={type}
        disabled={disabled || loading}
        aria-busy={loading || undefined}
        className={cn(buttonVariants({ variant, size, fullWidth }), className)}
        {...props}
      >
        {loading ? (
          <span
            className="inline-block h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent"
            aria-hidden="true"
          />
        ) : leftIcon ? (
          <Icon name={leftIcon} size={iconSize} />
        ) : null}
        <span>{children}</span>
        {!loading && rightIcon ? <Icon name={rightIcon} size={iconSize} /> : null}
      </button>
    )
  },
)

Button.displayName = 'Button'
export { buttonVariants }

