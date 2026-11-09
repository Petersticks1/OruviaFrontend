import { type TextareaHTMLAttributes, forwardRef } from 'react'
import { cn } from '@/lib/cn'

export interface TextareaProps extends TextareaHTMLAttributes<HTMLTextAreaElement> {
  hasError?: boolean
}

export const Textarea = forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({ className, hasError = false, rows = 4, ...props }, ref) => {
    return (
      <textarea
        ref={ref}
        rows={rows}
        aria-invalid={hasError || undefined}
        className={cn(
          'w-full rounded-[var(--radius-sm)] border bg-surface px-3.5 py-3 text-sm text-ink-900 placeholder:text-ink-500 transition-colors duration-150',
          'focus:border-ink-900 focus:outline-none disabled:cursor-not-allowed disabled:bg-surface-muted disabled:text-ink-300',
          hasError ? 'border-danger focus:border-danger' : 'border-line hover:border-ink-500',
          className,
        )}
        {...props}
      />
    )
  },
)

Textarea.displayName = 'Textarea'

