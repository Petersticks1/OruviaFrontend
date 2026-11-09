import { type InputHTMLAttributes, forwardRef, useId } from 'react'
import { cn } from '@/lib/cn'

export interface SwitchProps
  extends Omit<InputHTMLAttributes<HTMLInputElement>, 'type' | 'onChange'> {
  checked?: boolean
  onCheckedChange?: (checked: boolean) => void
  label?: string
  description?: string
}

export const Switch = forwardRef<HTMLInputElement, SwitchProps>(
  ({ className, checked, onCheckedChange, label, description, id, disabled, ...props }, ref) => {
    const generatedId = useId()
    const inputId = id ?? generatedId
    const switchAttr: Record<string, string> = { switch: '' }

    return (
      <label
        htmlFor={inputId}
        className={cn(
          'flex cursor-pointer items-center justify-between gap-4 select-none',
          disabled && 'cursor-not-allowed opacity-50',
          className,
        )}
      >
        {label || description ? (
          <span className="flex flex-col">
            {label ? <span className="text-sm font-medium text-ink-900">{label}</span> : null}
            {description ? <span className="text-xs text-ink-500">{description}</span> : null}
          </span>
        ) : null}
        <span className="relative inline-flex items-center">
          <input
            ref={ref}
            id={inputId}
            type="checkbox"
            role="switch"
            aria-checked={checked}
            checked={checked}
            disabled={disabled}
            onChange={(e) => onCheckedChange?.(e.target.checked)}
            className="peer sr-only"
            {...switchAttr}
            {...props}
          />
          <span
            aria-hidden="true"
            className={cn(
              'h-6 w-11 rounded-full transition-colors duration-150',
              checked ? 'bg-ink-900' : 'bg-ink-300',
              'peer-focus-visible:outline peer-focus-visible:outline-2 peer-focus-visible:outline-offset-2 peer-focus-visible:outline-brand-500',
            )}
          />
          <span
            aria-hidden="true"
            className={cn(
              'pointer-events-none absolute left-0.5 top-0.5 h-5 w-5 rounded-full bg-surface shadow-[var(--shadow-card)] transition-transform duration-150',
              checked ? 'translate-x-5' : 'translate-x-0',
            )}
          />
        </span>
      </label>
    )
  },
)

Switch.displayName = 'Switch'

