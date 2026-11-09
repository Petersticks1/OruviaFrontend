import { cn } from '@/lib/cn'

export interface DividerProps {
  label?: string
  className?: string
}

export function Divider({ label, className }: DividerProps) {
  if (!label) {
    return <hr className={cn('border-0 border-t border-line', className)} />
  }

  return (
    <div className={cn('relative flex items-center py-2', className)}>
      <div className="flex-grow border-t border-line" />
      <span className="mx-3 shrink-0 text-xs font-medium uppercase tracking-wider text-ink-500">
        {label}
      </span>
      <div className="flex-grow border-t border-line" />
    </div>
  )
}

