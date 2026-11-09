import { Icon } from './Icon'
import { cn } from '@/lib/cn'

export interface FieldErrorProps {
  message?: string
  id?: string
  className?: string
}

export function FieldError({ message, id, className }: FieldErrorProps) {
  if (!message) return null

  return (
    <p
      id={id}
      role="alert"
      className={cn('mt-1.5 flex items-center gap-1.5 text-xs font-medium text-danger', className)}
    >
      <Icon name="info" size={14} />
      <span>{message}</span>
    </p>
  )
}

