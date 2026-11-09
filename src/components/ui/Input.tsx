import { type InputHTMLAttributes, forwardRef } from 'react'
import { Icon } from './Icon'
import type { IconName } from './icons'
import { cn } from '@/lib/cn'

export interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  leftIcon?: IconName
  rightIcon?: IconName
  hasError?: boolean
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ className, leftIcon, rightIcon, hasError = false, ...props }, ref) => {
    return (
      <div className="relative flex w-full items-center">
        {leftIcon ? (
          <span className="pointer-events-none absolute left-3.5 text-ink-500">
            <Icon name={leftIcon} size={18} />
          </span>
        ) : null}
        <input
          ref={ref}
          aria-invalid={hasError || undefined}
          className={cn(
            'h-11 w-full rounded-[var(--radius-sm)] border bg-surface px-3.5 text-sm text-ink-900 placeholder:text-ink-500 transition-colors duration-150',
            'focus:border-ink-900 focus:outline-none disabled:cursor-not-allowed disabled:bg-surface-muted disabled:text-ink-300',
            hasError ? 'border-danger focus:border-danger' : 'border-line hover:border-ink-500',
            leftIcon && 'pl-10',
            rightIcon && 'pr-10',
            className,
          )}
          {...props}
        />
        {rightIcon ? (
          <span className="pointer-events-none absolute right-3.5 text-ink-500">
            <Icon name={rightIcon} size={18} />
          </span>
        ) : null}
      </div>
    )
  },
)

Input.displayName = 'Input'

