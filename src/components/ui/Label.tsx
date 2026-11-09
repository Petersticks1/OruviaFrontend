import { type LabelHTMLAttributes, forwardRef } from 'react'
import { cn } from '@/lib/cn'

export interface LabelProps extends LabelHTMLAttributes<HTMLLabelElement> {
  required?: boolean
}

export const Label = forwardRef<HTMLLabelElement, LabelProps>(
  ({ className, required, children, ...props }, ref) => (
    <label
      ref={ref}
      className={cn('block text-xs font-semibold uppercase tracking-wide text-ink-700', className)}
      {...props}
    >
      {children}
      {required ? <span className="ml-0.5 text-brand-500">*</span> : null}
    </label>
  ),
)

Label.displayName = 'Label'

