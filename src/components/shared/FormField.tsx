import { type ReactNode, useId } from 'react'
import { FieldError } from '@/components/ui/FieldError'
import { Label } from '@/components/ui/Label'
import { cn } from '@/lib/cn'

export interface FormFieldProps {
  label: string
  htmlFor?: string
  required?: boolean
  hint?: string
  error?: string
  children: ReactNode | ((props: { id: string; hasError: boolean; 'aria-describedby'?: string }) => ReactNode)
  className?: string
}

export function FormField({
  label,
  htmlFor,
  required = false,
  hint,
  error,
  children,
  className,
}: FormFieldProps) {
  const generatedId = useId()
  const fieldId = htmlFor ?? generatedId
  const errorId = `${fieldId}-error`
  const hintId = `${fieldId}-hint`
  const describedBy = error ? errorId : hint ? hintId : undefined

  return (
    <div className={cn('space-y-1.5', className)}>
      <Label htmlFor={fieldId} required={required}>
        {label}
      </Label>
      {typeof children === 'function'
        ? children({
            id: fieldId,
            hasError: Boolean(error),
            'aria-describedby': describedBy,
          })
        : children}
      {hint && !error ? (
        <p id={hintId} className="text-xs text-ink-500">
          {hint}
        </p>
      ) : null}
      <FieldError id={errorId} message={error} />
    </div>
  )
}

