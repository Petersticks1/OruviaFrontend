import { type SelectHTMLAttributes, forwardRef } from 'react'
import { Icon } from './Icon'
import { cn } from '@/lib/cn'

export interface SelectOption {
  value: string
  label: string
}

export interface SelectProps extends SelectHTMLAttributes<HTMLSelectElement> {
  options: readonly SelectOption[]
  placeholder?: string
  hasError?: boolean
}

export const Select = forwardRef<HTMLSelectElement, SelectProps>(
  ({ className, options, placeholder, hasError = false, ...props }, ref) => {
    return (
      <div className="relative flex w-full items-center">
        <select
          ref={ref}
          aria-invalid={hasError || undefined}
          className={cn(
            'h-11 w-full appearance-none rounded-[var(--radius-sm)] border bg-surface pl-3.5 pr-10 text-sm text-ink-900 transition-colors duration-150 cursor-pointer',
            'focus:border-ink-900 focus:outline-none disabled:cursor-not-allowed disabled:bg-surface-muted disabled:text-ink-300',
            hasError ? 'border-danger focus:border-danger' : 'border-line hover:border-ink-500',
            className,
          )}
          {...props}
        >
          {placeholder ? (
            <option value="" disabled>
              {placeholder}
            </option>
          ) : null}
          {options.map((opt) => (
            <option key={opt.value} value={opt.value}>
              {opt.label}
            </option>
          ))}
        </select>
        <span className="pointer-events-none absolute right-3.5 text-ink-500">
          <Icon name="chevronDown" size={18} />
        </span>
      </div>
    )
  },
)

Select.displayName = 'Select'

