import { useEffect } from 'react'
import { Icon } from './Icon'
import { IconButton } from './IconButton'
import { cn } from '@/lib/cn'
import { useAppDispatch, useAppSelector } from '@/store/hooks'
import { removeToast, type ToastMessage } from '@/store/slices/uiSlice'

export interface ToastProps {
  toast: ToastMessage
  onDismiss: (id: string) => void
}

export function Toast({ toast, onDismiss }: ToastProps) {
  useEffect(() => {
    const timer = setTimeout(() => {
      onDismiss(toast.id)
    }, 4500)
    return () => clearTimeout(timer)
  }, [toast.id, onDismiss])

  const toneStyles = {
    default: 'border-line bg-ink-900 text-surface',
    success: 'border-success/30 bg-ink-900 text-surface',
    danger: 'border-danger/30 bg-danger text-surface',
    info: 'border-info/30 bg-ink-900 text-surface',
  } as const

  const toneIcon = {
    default: 'sparkles',
    success: 'check',
    danger: 'info',
    info: 'info',
  } as const

  const tone = toast.tone ?? 'default'

  return (
    <div
      role="status"
      aria-live="polite"
      className={cn(
        'flex w-full max-w-sm items-start justify-between gap-3 rounded-[var(--radius-md)] border px-4 py-3 shadow-[var(--shadow-hover)] transition-all duration-200',
        toneStyles[tone],
      )}
    >
      <div className="flex items-start gap-2.5">
        <span className="mt-0.5 shrink-0">
          <Icon name={toneIcon[tone]} size={18} />
        </span>
        <div>
          <p className="text-sm font-semibold">{toast.title}</p>
          {toast.description ? (
            <p className="mt-0.5 text-xs opacity-85">{toast.description}</p>
          ) : null}
        </div>
      </div>
      <IconButton
        icon="close"
        size="sm"
        variant="ghost"
        aria-label="Dismiss notification"
        onClick={() => onDismiss(toast.id)}
        className="text-current hover:bg-surface/15"
      />
    </div>
  )
}

export function Toaster() {
  const toasts = useAppSelector((state) => state.ui.toasts)
  const dispatch = useAppDispatch()

  if (toasts.length === 0) return null

  return (
    <div
      aria-label="Notifications"
      className="fixed bottom-20 right-4 z-50 flex flex-col gap-2.5 md:bottom-6 md:right-6"
    >
      {toasts.map((t) => (
        <Toast key={t.id} toast={t} onDismiss={(id) => dispatch(removeToast(id))} />
      ))}
    </div>
  )
}

