import { type ReactNode, useEffect, useId, useRef } from 'react'
import { IconButton } from './IconButton'
import { cn } from '@/lib/cn'

export interface ModalProps {
  open: boolean
  onClose: () => void
  title: string
  description?: string
  children: ReactNode
  footer?: ReactNode
  size?: 'sm' | 'md' | 'lg' | 'xl'
  className?: string
}

const sizeClasses = {
  sm: 'max-w-md',
  md: 'max-w-lg',
  lg: 'max-w-2xl',
  xl: 'max-w-4xl',
} as const

export function Modal({
  open,
  onClose,
  title,
  description,
  children,
  footer,
  size = 'md',
  className,
}: ModalProps) {
  const dialogRef = useRef<HTMLDialogElement>(null)
  const pressedOutsideRef = useRef(false)
  const titleId = useId()
  const descId = useId()

  useEffect(() => {
    const dialog = dialogRef.current
    if (!dialog) return

    if (open && !dialog.open) {
      if (typeof dialog.showModal === 'function') {
        dialog.showModal()
      } else {
        dialog.setAttribute('open', '')
      }
    } else if (!open && dialog.open) {
      if (typeof dialog.close === 'function') {
        dialog.close()
      } else {
        dialog.removeAttribute('open')
      }
    }
  }, [open])

  const isPointerOutside = (e: React.PointerEvent<HTMLDialogElement>): boolean => {
    const dialog = dialogRef.current
    if (!dialog) return false
    const rect = dialog.getBoundingClientRect()
    return (
      e.clientX < rect.left ||
      e.clientX > rect.right ||
      e.clientY < rect.top ||
      e.clientY > rect.bottom
    )
  }

  const closedByAttr: Record<string, string> = { closedby: 'any' }

  return (
    <dialog
      ref={dialogRef}
      aria-labelledby={titleId}
      aria-describedby={description ? descId : undefined}
      onClose={() => {
        if (dialogRef.current) {
          dialogRef.current.returnValue = ''
        }
        onClose()
      }}
      onPointerDown={(e) => {
        pressedOutsideRef.current = isPointerOutside(e)
      }}
      onPointerUp={(e) => {
        if (pressedOutsideRef.current && isPointerOutside(e)) {
          onClose()
        }
      }}
      className={cn(
        'm-auto w-[calc(100%-2rem)] rounded-[var(--radius-lg)] border border-line bg-surface p-0 text-ink-900 shadow-[var(--shadow-sheet)] transition-all duration-200 open:flex open:flex-col max-h-[90dvh]',
        sizeClasses[size],
        className,
      )}
      {...closedByAttr}
    >
      <header className="flex items-center justify-between border-b border-line px-6 py-4">
        <div className="pr-4">
          <h2 id={titleId} className="text-base font-semibold text-ink-900">
            {title}
          </h2>
          {description ? (
            <p id={descId} className="mt-0.5 text-xs text-ink-500">
              {description}
            </p>
          ) : null}
        </div>
        <IconButton
          icon="close"
          variant="ghost"
          size="sm"
          aria-label="Close dialog"
          onClick={onClose}
        />
      </header>
      <div className="flex-1 overflow-y-auto px-6 py-5">{children}</div>
      {footer ? (
        <footer className="flex items-center justify-end gap-3 border-t border-line bg-surface px-6 py-4">
          {footer}
        </footer>
      ) : null}
    </dialog>
  )
}

