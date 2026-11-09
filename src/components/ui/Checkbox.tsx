import { type InputHTMLAttributes, forwardRef, useId } from 'react'
import { cn } from '@/lib/cn'

export interface CheckboxProps extends Omit<InputHTMLAttributes<HTMLInputElement>, 'type'> {
  label?: string
  description?: string
}

export const Checkbox = forwardRef<HTMLInputElement, CheckboxProps>(
  ({ className, label, description, id, ...props }, ref) => {
    const generatedId = useId()
    const inputId = id ?? generatedId

    return (
      <label
        htmlFor={inputId}
        className={cn('inline-flex cursor-pointer items-start gap-3 select-none', className)}
      >
        <input
          ref={ref}
          id={inputId}
          type="checkbox"
          className="mt-0.5 h-5 w-5 rounded border-line accent-brand-500 cursor-pointer"
          {...props}
        />
        {label || description ? (
          <span className="flex flex-col text-sm">
            {label ? <span className="font-medium text-ink-900">{label}</span> : null}
            {description ? <span className="text-xs text-ink-500">{description}</span> : null}
          </span>
        ) : null}
      </label>
    )
  },
)

Checkbox.displayName = 'Checkbox'

