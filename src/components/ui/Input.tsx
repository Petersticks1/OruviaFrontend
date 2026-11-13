import { type InputHTMLAttributes, type ReactNode, forwardRef, useState } from 'react'
import { Icon } from './Icon'
import type { IconName } from './icons'
import { cn } from '@/lib/cn'

export interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  leftIcon?: IconName
  rightIcon?: IconName
  onRightIconClick?: () => void
  rightAction?: ReactNode
  showPasswordToggle?: boolean
  hasError?: boolean
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
  (
    {
      className,
      type,
      leftIcon,
      rightIcon,
      onRightIconClick,
      rightAction,
      showPasswordToggle,
      hasError = false,
      ...props
    },
    ref,
  ) => {
    const isPasswordField = type === 'password'
    const shouldEnablePasswordToggle =
      isPasswordField && showPasswordToggle !== false && !rightAction && !rightIcon
    const [showPassword, setShowPassword] = useState(false)

    const resolvedType = isPasswordField
      ? showPassword
        ? 'text'
        : 'password'
      : type

    const hasRightSlot = Boolean(
      rightAction || rightIcon || shouldEnablePasswordToggle,
    )

    return (
      <div className="relative flex w-full items-center">
        {leftIcon ? (
          <span className="pointer-events-none absolute left-3.5 text-ink-500">
            <Icon name={leftIcon} size={18} />
          </span>
        ) : null}
        <input
          ref={ref}
          type={resolvedType}
          aria-invalid={hasError || undefined}
          className={cn(
            'h-11 w-full rounded-[var(--radius-sm)] border bg-surface px-3.5 text-sm text-ink-900 placeholder:text-ink-500 transition-colors duration-150',
            'focus:border-ink-900 focus:outline-none disabled:cursor-not-allowed disabled:bg-surface-muted disabled:text-ink-300',
            hasError ? 'border-danger focus:border-danger' : 'border-line hover:border-ink-500',
            leftIcon && 'pl-10',
            hasRightSlot && 'pr-10',
            className,
          )}
          {...props}
        />
        {shouldEnablePasswordToggle ? (
          <button
            type="button"
            tabIndex={-1}
            aria-label={showPassword ? 'Hide password' : 'Show password'}
            onClick={() => setShowPassword((prev) => !prev)}
            className="absolute right-3.5 flex h-6 w-6 items-center justify-center rounded text-ink-500 hover:text-ink-900 transition-colors cursor-pointer"
          >
            <Icon name={showPassword ? 'eyeClosed' : 'eye'} size={18} />
          </button>
        ) : rightAction ? (
          <span className="absolute right-3 text-ink-500">{rightAction}</span>
        ) : rightIcon ? (
          onRightIconClick ? (
            <button
              type="button"
              tabIndex={-1}
              onClick={onRightIconClick}
              className="absolute right-3.5 flex h-6 w-6 items-center justify-center rounded text-ink-500 hover:text-ink-900 transition-colors cursor-pointer"
            >
              <Icon name={rightIcon} size={18} />
            </button>
          ) : (
            <span className="pointer-events-none absolute right-3.5 text-ink-500">
              <Icon name={rightIcon} size={18} />
            </span>
          )
        ) : null}
      </div>
    )
  },
)

Input.displayName = 'Input'

